import mongoose from 'mongoose';

/**
 * Database connection manager.
 * Handles fallback to mock data if connection fails or URI is missing.
 */
export const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn('⚠️  MONGO_URI not found in .env. Switching to MOCK DATA mode.');
      return false; // false indicates using mock data
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true; // true indicates using MongoDB
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    console.warn('⚠️  Database connection failed. Switching to MOCK DATA mode.');
    return false;
  }
};