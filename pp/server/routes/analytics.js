import { Router } from 'express';
import Event from '../models/Event.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();
router.use(authRequired);

// KPIs: DAU (last 24h), MAU (last 30d), conversion (signup -> purchase),
// 7d retention summary
router.get('/kpis', async (req, res, next) => {
  try {
    const ownerId = req.user._id;
    const now = new Date();
    const day = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const month = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [dauArr, mauArr, signups, purchases, totalEvents] = await Promise.all([
      Event.distinct('userId', { ownerId, timestamp: { $gte: day } }),
      Event.distinct('userId', { ownerId, timestamp: { $gte: month } }),
      Event.distinct('userId', { ownerId, event: 'signup' }),
      Event.distinct('userId', { ownerId, event: 'purchase' }),
      Event.countDocuments({ ownerId }),
    ]);

    const conversion = signups.length ? (purchases.length / signups.length) * 100 : 0;

    // daily active series last 14 days (previous implementation)
    // const since = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    // const series = await Event.aggregate([
    //   { $match: { ownerId, timestamp: { $gte: since } } },
    //   {
    //     $group: {
    //       _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
    //       users: { $addToSet: '$userId' },
    //     },
    //   },
    //   { $project: { date: '$_id', activeUsers: { $size: '$users' }, _id: 0 } },
    //   { $sort: { date: 1 } },
    // ]);

    // New: daily active series (all time per prompt, not time windowed by last 14 days)
    const series = await Event.aggregate([
      {
        $match: {
          ownerId
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$timestamp"
            }
          },
          users: {
            $addToSet: "$userId"
          }
        }
      },
      {
        $project: {
          date: "$_id",
          activeUsers: {
            $size: "$users"
          },
          _id: 0
        }
      },
      {
        $sort: {
          date: 1
        }
      }
    ]);

    res.json({
      dau: dauArr.length,
      mau: mauArr.length,
      conversionPct: Number(conversion.toFixed(2)),
      totalEvents,
      series,
    });
  } catch (e) {
    next(e);
  }
});

// Funnel: ?steps=signup,activate,purchase
router.get('/funnel', async (req, res, next) => {
  try {
    const ownerId = req.user._id;
    const steps = (req.query.steps || 'signup,activate,purchase')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const result = [];
    let prevUsers = null;
    for (const step of steps) {
      const users = await Event.distinct('userId', { ownerId, event: step });
      const set = new Set(users);
      const count = prevUsers ? users.filter((u) => prevUsers.has(u)).length : users.length;
      result.push({ step, users: count });
      prevUsers = prevUsers ? new Set(users.filter((u) => prevUsers.has(u))) : set;
    }
    const top = result[0]?.users || 1;
    result.forEach((r) => (r.conversionPct = Number(((r.users / top) * 100).toFixed(1))));
    res.json(result);
  } catch (e) {
    next(e);
  }
});

// Weekly retention cohorts (last 8 weeks)
router.get('/retention', async (req, res, next) => {
  try {
    const ownerId = req.user._id;
    const weeks = 8;
    const now = new Date();
    const start = new Date(now);
    start.setDate(start.getDate() - weeks * 7);

    // bucket each user's first event week (cohort)
    const firstEvents = await Event.aggregate([
      { $match: { ownerId, timestamp: { $gte: start } } },
      { $group: { _id: '$userId', first: { $min: '$timestamp' } } },
    ]);

    const cohortMap = new Map(); // cohortWeek -> Set of userIds
    for (const f of firstEvents) {
      const w = weekKey(f.first);
      if (!cohortMap.has(w)) cohortMap.set(w, new Set());
      cohortMap.get(w).add(f._id);
    }

    const cohortKeys = [...cohortMap.keys()].sort();
    const allEvents = await Event.find({ ownerId, timestamp: { $gte: start } }).select('userId timestamp');

    const matrix = cohortKeys.map((ck) => {
      const cohortUsers = cohortMap.get(ck);
      const row = { cohort: ck, size: cohortUsers.size, weeks: [] };
      for (let w = 0; w < weeks; w++) {
        const target = addWeeks(ck, w);
        const active = new Set();
        for (const ev of allEvents) {
          if (cohortUsers.has(ev.userId) && weekKey(ev.timestamp) === target) {
            active.add(ev.userId);
          }
        }
        row.weeks.push({
          week: w,
          active: active.size,
          pct: cohortUsers.size ? Number(((active.size / cohortUsers.size) * 100).toFixed(1)) : 0,
        });
      }
      return row;
    });

    res.json(matrix);
  } catch (e) {
    next(e);
  }
});

// Feature adoption: count distinct users per event in last 30d
router.get('/features', async (req, res, next) => {
  try {
    const ownerId = req.user._id;
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const totalUsers = (await Event.distinct('userId', { ownerId, timestamp: { $gte: since } })).length || 1;

    const rows = await Event.aggregate([
      { $match: { ownerId, timestamp: { $gte: since } } },
      { $group: { _id: { event: '$event', user: '$userId' }, count: { $sum: 1 } } },
      { $group: { _id: '$_id.event', users: { $sum: 1 }, events: { $sum: '$count' } } },
      { $project: { feature: '$_id', users: 1, events: 1, _id: 0 } },
      { $sort: { users: -1 } },
    ]);

    rows.forEach((r) => (r.adoptionPct = Number(((r.users / totalUsers) * 100).toFixed(1))));
    res.json(rows);
  } catch (e) {
    next(e);
  }
});

function weekKey(d) {
  const date = new Date(d);
  const day = date.getUTCDay();
  const diff = date.getUTCDate() - day;
  const monday = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), diff));
  return monday.toISOString().slice(0, 10);
}
function addWeeks(isoMonday, w) {
  const d = new Date(isoMonday);
  d.setUTCDate(d.getUTCDate() + w * 7);
  return d.toISOString().slice(0, 10);
}

export default router;
