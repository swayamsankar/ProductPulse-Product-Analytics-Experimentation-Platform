import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema(
  {
    name: String,
    visitors: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 },
  },
  { _id: false }
);

const experimentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    hypothesis: String,
    status: { type: String, enum: ['running', 'completed', 'paused'], default: 'running' },
    startedAt: { type: Date, default: Date.now },
    endedAt: Date,
    variants: [variantSchema],
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  },
  { timestamps: true }
);

export default mongoose.model('Experiment', experimentSchema);
