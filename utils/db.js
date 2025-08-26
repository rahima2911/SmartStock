import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://rahimasarwar29:riuPrs5w1J6pkMfu@cluster0.cuye5nt.mongodb.net/smartstock?retryWrites=true&w=majority"

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}


