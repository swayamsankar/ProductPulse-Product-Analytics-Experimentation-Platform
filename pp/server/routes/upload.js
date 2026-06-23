import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import { parse } from 'csv-parse';
import Event from '../models/Event.js';
import Upload from '../models/Upload.js';
import { authRequired } from '../middleware/auth.js';

const upload = multer({ dest: 'uploads/' });
const router = Router();

router.post('/csv', authRequired, upload.single('file'), async (req, res, next) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });
  const ownerId = req.user._id;
  const docs = [];
  try {
    const parser = fs.createReadStream(req.file.path).pipe(parse({ columns: true, trim: true }));
    for await (const row of parser) {
      let props = {};
      try { props = row.properties ? JSON.parse(row.properties) : {}; } catch {}
      docs.push({
        userId: row.user_id,
        event: row.event,
        timestamp: row.timestamp ? new Date(row.timestamp) : new Date(),
        properties: props,
        ownerId,
      });
    }
    if (docs.length) await Event.insertMany(docs, { ordered: false });
    await Upload.create({
      ownerId,
      fileName: req.file.originalname,
      rows: docs.length,
    });
    fs.unlink(req.file.path, () => {});
    res.json({ inserted: docs.length });
  } catch (e) {
    fs.unlink(req.file.path, () => {});
    next(e);
  }
});

router.get("/history", authRequired, async (req, res) => {
  const uploads = await Upload.find({ ownerId: req.user._id }).sort({ createdAt: -1 });
  res.json(uploads);
});

export default router;
