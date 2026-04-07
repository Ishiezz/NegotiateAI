import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI environment variable is not set');

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error(`❌ MongoDB connection failed: ${msg}`);
    process.exit(1);
  }
};

export default connectDB;