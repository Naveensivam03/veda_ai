import mongoose from "mongoose";

const MONGO_HOST = process.env.MONGO_HOST || "mongo";
const MONGO_PORT = process.env.MONGO_PORT || "27017";
const MONGO_DB = process.env.MONGO_INITDB_DATABASE || "ve_db";
const MONGO_USER = process.env.MONGO_INITDB_ROOT_USERNAME;
const MONGO_PASS = process.env.MONGO_INITDB_ROOT_PASSWORD;

const MONGO_URI = process.env.MONGO_URI || (MONGO_USER && MONGO_PASS
  ? `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`
  : `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`);

export async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}
