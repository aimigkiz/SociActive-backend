// server.js (No changes needed, verification only)
import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/database.js';
import { setUseDB } from './services/dataService.js'; // This import is now valid

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  // Initialize DB Connection and update Service Layer state
  const isConnected = await connectDB();
  setUseDB(isConnected);

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`💾 Data Source: ${isConnected ? 'MongoDB Atlas' : 'In-Memory Mock Data'}`);
  });
};

startServer();