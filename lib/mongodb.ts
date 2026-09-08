import mongoose from "mongoose";

const uri: string = process.env.MONGODB_URI ?? "";

type MongooseCache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
const globalWithMongoose = globalThis as typeof globalThis & { mongooseCache?: MongooseCache };
const cached = globalWithMongoose.mongooseCache ?? { conn: null, promise: null };
if (!globalWithMongoose.mongooseCache) globalWithMongoose.mongooseCache = cached;

export async function connectToDatabase() {
  if (!uri) throw new Error("MONGODB_URI is not configured");
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      socketTimeoutMS: 10000,
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
