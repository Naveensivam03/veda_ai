/* Defines the school persistence model. */

import { Schema, model, type Document, type Model } from "mongoose";

export interface SchoolDocument extends Document {
  name: string;
  city: string;
  board: string;
  logoUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const schoolSchema = new Schema<SchoolDocument>(
  {
    name: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    board: { type: String, required: true, trim: true },
    logoUrl: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

export const SchoolModel: Model<SchoolDocument> = model<SchoolDocument>(
  "School",
  schoolSchema
);
