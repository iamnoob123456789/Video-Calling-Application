import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    console.log('Attempting to connect with MONGO_URL:', process.env.MONGO_URL ? 'Exists' : 'Missing');
    
    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL is not defined in environment variables");
    }
    
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("Error in connecting to MongoDB", error.message);
    process.exit(1);
  }
};