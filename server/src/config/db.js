import mongoose from "mongoose";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is required. Use MongoDB Atlas or a managed MongoDB connection.");
  }

  const maxRetries = Number(process.env.MONGODB_MAX_RETRIES || 5);
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000,
        maxPoolSize: Number(process.env.MONGODB_MAX_POOL_SIZE || 10),
      });
      console.log("[MongoDB] Successfully connected");
      return mongoose.connection;
    } catch (error) {
      lastError = error;
      console.error(`[MongoDB] Connection attempt ${attempt}/${maxRetries} failed:`, error.message);
      if (attempt < maxRetries) await sleep(attempt * 1500);
    }
  }

  throw lastError;
};

export default connectDB;
