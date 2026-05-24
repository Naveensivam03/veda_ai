/* Manages MongoDB connectivity for the application. */

import mongoose from "mongoose";
import { env } from "./env";
import { logger } from "../utils/logger";
import { UserModel } from "../models/User";
import { SchoolModel } from "../models/School";

let connectionPromise: Promise<typeof mongoose> | null = null;

mongoose.set("strictQuery", true);

export async function seedDefaultData(): Promise<void> {
  const schoolId = "64b7f0c8a5f12d3e4f678902";
  const teacherId = "64b7f0c8a5f12d3e4f678901";

  try {
    // Check and seed default school
    const existingSchool = await SchoolModel.findById(schoolId);
    if (!existingSchool) {
      await SchoolModel.create({
        _id: new mongoose.Types.ObjectId(schoolId),
        name: "St. Xavier's International School",
        city: "Mumbai",
        board: "CBSE",
        logoUrl: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=150",
      });
      logger.info("Database: Seeded default school.");
    }

    // Check and seed default teacher
    const existingTeacher = await UserModel.findById(teacherId);
    if (!existingTeacher) {
      await UserModel.create({
        _id: new mongoose.Types.ObjectId(teacherId),
        fullName: "Dr. Sarah Jenkins",
        email: "sarah.jenkins@vedaai.edu",
        role: "Teacher",
        subject: "Mathematics",
        schoolId: new mongoose.Types.ObjectId(schoolId),
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
        generationCredits: 3,
      });
      logger.info("Database: Seeded default teacher.");
    }
  } catch (error) {
    logger.error("Database seeding failed", error);
  }
}

export async function connectDB(): Promise<typeof mongoose> {
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(env.MONGODB_URI);
  }

  try {
    const connection = await connectionPromise;
    logger.info("DB connected", { database: connection.connection.name });
    
    // Seed default teacher and school
    await seedDefaultData();
    
    return connection;
  } catch (error) {
    connectionPromise = null;
    logger.error("DB connection failed", error);
    throw error;
  }
}

