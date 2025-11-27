import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  reviewId: { type: Number, required: true, unique: true },
  userId: { type: Number, required: true },
  activityId: { type: Number, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String }
}, { timestamps: true });

export default mongoose.model('Review', ReviewSchema);