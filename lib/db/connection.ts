import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export async function connectToDatabase(): Promise<{ isConnected: boolean; isUsingMemory: boolean }> {
  if (!MONGODB_URI) {
    // Graceful fallback to memory store
    return { isConnected: false, isUsingMemory: true };
  }

  if (cached.conn) {
    return { isConnected: true, isUsingMemory: false };
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
    return { isConnected: true, isUsingMemory: false };
  } catch (error) {
    cached.promise = null;
    console.warn("MongoDB connection failed, falling back to resilient in-memory store:", error);
    return { isConnected: false, isUsingMemory: true };
  }
}
