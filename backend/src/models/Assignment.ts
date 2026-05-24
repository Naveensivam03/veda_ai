/* Defines the assignment persistence model. */

import { Schema, model, type Document, type Model, type Types } from "mongoose";
import {
  assignmentStatuses,
  difficultyLevels,
  questionTypes,
  uploadedMaterialTypes,
  type AssignmentStatus,
  type DifficultyLevel,
  type QuestionConfig,
  type QuestionType,
  type UploadedMaterial,
} from "../types/assignment.types";

export interface AssignmentDocument extends Document {
  teacherId: Types.ObjectId;
  schoolId: Types.ObjectId;
  schoolName: string;
  title: string;
  subject: string;
  grade: string;
  dueDate: Date;
  instructions: string;
  uploadedMaterial: UploadedMaterial | null;
  questionConfigs: QuestionConfig[];
  totalQuestions: number;
  totalMarks: number;
  status: AssignmentStatus;
  createdAt: Date;
  updatedAt: Date;
}

const uploadedMaterialSchema = new Schema<UploadedMaterial>(
  {
    fileName: { type: String, required: true, trim: true },
    fileUrl: { type: String, required: true, trim: true },
    fileType: {
      type: String,
      required: true,
      enum: [...uploadedMaterialTypes],
    },
    fileContent: { type: String, default: "", trim: true },
  },
  { _id: false }
);

const questionConfigSchema = new Schema<QuestionConfig>(
  {
    type: {
      type: String,
      required: true,
      enum: [...questionTypes],
    },
    count: { type: Number, required: true, min: 1 },
    marksPerQuestion: { type: Number, required: true, min: 1 },
    difficulty: {
      type: String,
      required: true,
      enum: [...difficultyLevels] satisfies DifficultyLevel[],
    },
  },
  { _id: false }
);

const assignmentSchema = new Schema<AssignmentDocument>(
  {
    teacherId: { type: Schema.Types.ObjectId, required: true, index: true },
    schoolId: { type: Schema.Types.ObjectId, required: true, index: true },
    schoolName: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    grade: { type: String, required: true, trim: true },
    dueDate: { type: Date, required: true },
    instructions: { type: String, default: "", trim: true },
    uploadedMaterial: { type: uploadedMaterialSchema, default: null },
    questionConfigs: {
      type: [questionConfigSchema],
      required: true,
      validate: {
        validator(configs: QuestionConfig[]): boolean {
          return configs.length > 0;
        },
        message: "questionConfigs must contain at least one item",
      },
    },
    totalQuestions: { type: Number, required: true, min: 1 },
    totalMarks: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      required: true,
      enum: [...assignmentStatuses],
      default: "draft",
      index: true,
    },
  },
  { timestamps: true }
);

export const AssignmentModel: Model<AssignmentDocument> = model<AssignmentDocument>(
  "Assignment",
  assignmentSchema
);
