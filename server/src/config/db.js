import mongoose from "mongoose";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const connectDB = async () => {
    const uri =
    process.env.MONGODB_URI ||
    process.env.DATABASE_URL ||
    process.env.MONGO_URI ||
    process.env.MONGODB_URL ||
    process.env.MONGO_URL ||
    process.env.RAILWAY_MONGODB_URI ||
    process.env.RAILWAY_URL;

  if (!uri) {
    // In some deployment environments (e.g., health checks), MongoDB may be
    // intentionally not configured. Don't crash the whole process.
    console.warn(
      "[MongoDB] MongoDB connection string is missing. Set one of: MONGODB_URI, DATABASE_URL, MONGO_URI, MONGODB_URL, MONGO_URL, RAILWAY_MONGODB_URI, or RAILWAY_URL."
    );
    return null;
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
