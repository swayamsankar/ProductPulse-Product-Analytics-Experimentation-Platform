import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Event from '../models/Event.js';
import Experiment from '../models/Experiment.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/productpulse';

const EVENTS = ['signup', 'activate', 'add_to_cart', 'purchase', 'invite_friend', 'create_dashboard'];

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected. Seeding…');

  await Promise.all([User.deleteMany({}), Event.deleteMany({}), Experiment.deleteMany({})]);

  const passwordHash = await bcrypt.hash('demo1234', 10);
  const user = await User.create({
    name: 'Demo Analyst',
    email: 'demo@productpulse.io',
    passwordHash,
    role: 'admin',
  });

  // generate ~3000 events across 300 users over last 60 days
  const docs = [];
  const now = Date.now();
  for (let u = 0; u < 300; u++) {
    const userId = `u_${String(u).padStart(4, '0')}`;
    const joined = now - Math.floor(Math.random() * 60) * 86400000;
    docs.push({ ownerId: user._id, userId, event: 'signup', timestamp: new Date(joined), properties: {} });
    if (Math.random() < 0.7)
      docs.push({ ownerId: user._id, userId, event: 'activate', timestamp: new Date(joined + 3600000), properties: {} });
    const sessions = Math.floor(Math.random() * 12);
    for (let s = 0; s < sessions; s++) {
      docs.push({
        ownerId: user._id,
        userId,
        event: rand(EVENTS),
        timestamp: new Date(joined + (s + 1) * 86400000 * (1 + Math.random())),
        properties: { source: rand(['web', 'ios', 'android']) },
      });
    }
    if (Math.random() < 0.25)
      docs.push({
        ownerId: user._id,
        userId,
        event: 'purchase',
        timestamp: new Date(joined + 5 * 86400000),
        properties: { amount: 19 + Math.floor(Math.random() * 80) },
      });
  }
  await Event.insertMany(docs);

  await Experiment.insertMany([
    {
      ownerId: user._id,
      name: 'Onboarding checklist v2',
      hypothesis: 'A guided checklist increases activation.',
      status: 'running',
      variants: [
        { name: 'Control', visitors: 4820, conversions: 612 },
        { name: 'Checklist', visitors: 4790, conversions: 781 },
      ],
    },
    {
      ownerId: user._id,
      name: 'Pricing page CTA color',
      hypothesis: 'Green CTA outperforms blue.',
      status: 'completed',
      variants: [
        { name: 'Blue', visitors: 12010, conversions: 421 },
        { name: 'Green', visitors: 11980, conversions: 438 },
      ],
    },
  ]);

  console.log(`✓ Seeded user demo@productpulse.io / demo1234`);
  console.log(`✓ Inserted ${docs.length} events, 2 experiments`);
  await mongoose.disconnect();
}

run().catch((e) => { console.error(e); process.exit(1); });
