import { Router } from 'express';
import Experiment from '../models/Experiment.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();
router.use(authRequired);

// Two-proportion z-test for A/B significance
function zTest(a, b) {
  const p1 = a.visitors ? a.conversions / a.visitors : 0;
  const p2 = b.visitors ? b.conversions / b.visitors : 0;
  const p = (a.conversions + b.conversions) / Math.max(a.visitors + b.visitors, 1);
  const se = Math.sqrt(p * (1 - p) * (1 / Math.max(a.visitors, 1) + 1 / Math.max(b.visitors, 1)));
  const z = se ? (p2 - p1) / se : 0;
  // approx two-tailed p-value
  const pValue = 2 * (1 - normCdf(Math.abs(z)));
  return { liftPct: p1 ? ((p2 - p1) / p1) * 100 : 0, z, pValue, significant: pValue < 0.05 };
}
function normCdf(x) {
  return 0.5 * (1 + erf(x / Math.sqrt(2)));
}
function erf(x) {
  const t = 1 / (1 + 0.3275911 * Math.abs(x));
  const y =
    1 -
    (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) *
      t *
      Math.exp(-x * x);
  return x >= 0 ? y : -y;
}

router.get('/', async (req, res, next) => {
  try {
    const docs = await Experiment.find({ ownerId: req.user._id }).sort({ createdAt: -1 });
    const enriched = docs.map((d) => {
      const obj = d.toObject();
      if (obj.variants?.length >= 2) obj.stats = zTest(obj.variants[0], obj.variants[1]);
      return obj;
    });
    res.json(enriched);
  } catch (e) {
    next(e);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const doc = await Experiment.create({ ...req.body, ownerId: req.user._id });
    res.json(doc);
  } catch (e) {
    next(e);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const doc = await Experiment.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.user._id },
      req.body,
      { new: true }
    );
    res.json(doc);
  } catch (e) {
    next(e);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await Experiment.deleteOne({ _id: req.params.id, ownerId: req.user._id });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default router;
