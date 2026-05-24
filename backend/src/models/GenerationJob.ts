/* Defines generation job persistence for assignment workflows. */

import { Schema, model, type Document, type Model, type Types } from "mongoose";

export const generationJobStatuses = [
  "queued",
  "processing",
  "completed",
  "failed",
] as const;

export type GenerationJobStatus = (typeof generationJobStatuses)[number];

export interface GenerationJobDocument extends Document {
  assignmentId: Types.ObjectId;
  status: GenerationJobStatus;
  progress: number;
  currentStage: string;
  provider: string;
  modelUsed: string;
  createdAt: Date;
  updatedAt: Date;
}

const generationJobSchema = new Schema<GenerationJobDocument>(
  {
    assignmentId: {
      type: Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      required: true,
      enum: [...generationJobStatuses],
      default: "queued",
      index: true,
    },
    progress: { type: Number, required: true, min: 0, max: 100, default: 0 },
    currentStage: { type: String, required: true, trim: true, default: "Queued" },
    provider: { type: String, required: true, trim: true, default: "gemini" },
    modelUsed: { type: String, required: true, trim: true, default: "gemini" },
  },
  { timestamps: true }
);

export const GenerationJobModel: Model<GenerationJobDocument> =
  model<GenerationJobDocument>("GenerationJob", generationJobSchema);
