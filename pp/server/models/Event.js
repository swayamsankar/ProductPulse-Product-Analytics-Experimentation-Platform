import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    event: { type: String, required: true, index: true },
    timestamp: { type: Date, required: true, index: true },
    properties: { type: mongoose.Schema.Types.Mixed, default: {} },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  },
  { timestamps: true }
);

eventSchema.index({ ownerId: 1, event: 1, timestamp: 1 });

export default mongoose.model('Event', eventSchema);
