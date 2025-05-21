import mongoose from 'mongoose';
import "dotenv/config";

const connectDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_URI + process.env.DB_NAME;
    await mongoose.connect(mongoUrl);
    console.log('Connected to MongoDB:', process.env.DB_NAME);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

export default connectDB;

