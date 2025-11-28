import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  userId: { type: Number, required: true, unique: true },
  username: { type: String, required: true },
  friendIds: [{ type: Number }],
  totalPoints: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('User', UserSchema);