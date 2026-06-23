import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import analyticsRoutes from './routes/analytics.js';
import experimentRoutes from './routes/experiments.js';
import uploadRoutes from './routes/upload.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

app.get('/api/health', (_, res) => res.json({ ok: true, ts: Date.now() }));

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/experiments', experimentRoutes);
app.use('/api/upload', uploadRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/productpulse';

export default app;

if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log("✓ MongoDB connected");

      app.listen(PORT, () =>
        console.log(`✓ API running on http://localhost:${PORT}`)
      );
    })
    .catch((err) => {
      console.error("Mongo connection error:", err);
      process.exit(1);
    });
}
