/* Defines the user persistence model. */

import { Schema, model, type Document, type Model, type Types } from "mongoose";

export interface UserDocument extends Document {
  fullName: string;
  email: string;
  role: string;
  subject: string;
  schoolId: Types.ObjectId;
  avatarUrl: string;
  generationCredits: number;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    role: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: "School",
      required: true,
      index: true,
    },
    avatarUrl: { type: String, default: "", trim: true },
    generationCredits: {
      type: Number,
      default: 3,
      min: 0,
    },
  },
  { timestamps: true }
);

export const UserModel: Model<UserDocument> = model<UserDocument>(
  "User",
  userSchema
);
