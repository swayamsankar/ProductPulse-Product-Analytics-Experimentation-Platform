import { Router } from 'express';
import Event from '../models/Event.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();
router.use(authRequired);

router.post('/', async (req, res, next) => {
  try {
    const { userId, event, timestamp, properties } = req.body;
    const doc = await Event.create({
      userId,
      event,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      properties: properties || {},
      ownerId: req.user._id,
    });
    res.json(doc);
  } catch (e) {
    next(e);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 100, 1000);
    const docs = await Event.find({ ownerId: req.user._id }).sort({ timestamp: -1 }).limit(limit);
    res.json(docs);
  } catch (e) {
    next(e);
  }
});

export default router;
