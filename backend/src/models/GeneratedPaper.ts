/* Defines the generated paper persistence model. */

import { Schema, model, type Document, type Model, type Types } from "mongoose";
import type {
  DifficultyBreakdown,
  NormalizedPaperSection,
  NormalizedPaperQuestion,
} from "../types/paper.types";
import { questionTypes } from "../types/assignment.types";

export interface GeneratedPaperDocument extends Document {
  assignmentId: Types.ObjectId;
  teacherId: Types.ObjectId;
  schoolId: Types.ObjectId;
  schemaVersion: 1;
  paperTitle: string;
  schoolName: string;
  subject: string;
  grade: string;
  duration: number;
  totalMarks: number;
  instructions: string[];
  sections: NormalizedPaperSection[];
  difficultyBreakdown: DifficultyBreakdown;
  answerKeyVisible: boolean;
  isEdited: boolean;
  generatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const generatedPaperQuestionSchema = new Schema<NormalizedPaperQuestion>(
  {
    id: { type: String, required: true },
    number: { type: Number, required: true },
    text: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: [...questionTypes],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    marks: { type: Number, required: true, min: 1 },
    options: { type: [String], default: null },
    answerKey: { type: String, required: true, trim: true },
    isEdited: { type: Boolean, default: false },
    editedAt: { type: Date, default: null },
  },
  { _id: false }
);

const generatedPaperSectionSchema = new Schema<NormalizedPaperSection>(
  {
    title: { type: String, required: true, trim: true },
    instruction: { type: String, default: "", trim: true },
    totalMarks: { type: Number, required: true, min: 0 },
    questions: { type: [generatedPaperQuestionSchema], required: true },
  },
  { _id: false }
);

const generatedPaperSchema = new Schema<GeneratedPaperDocument>(
  {
    assignmentId: {
      type: Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
      index: true,
    },
    teacherId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    schoolId: { type: Schema.Types.ObjectId, ref: "School", required: true },
    schemaVersion: { type: Number, required: true, enum: [1], default: 1 },
    paperTitle: { type: String, required: true, trim: true },
    schoolName: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    grade: { type: String, required: true, trim: true },
    duration: { type: Number, required: true, min: 1 },
    totalMarks: { type: Number, required: true, min: 1 },
    instructions: { type: [String], default: [] },
    sections: { type: [generatedPaperSectionSchema], default: [] },
    difficultyBreakdown: {
      type: {
        easy: { type: Number, default: 0 },
        medium: { type: Number, default: 0 },
        hard: { type: Number, default: 0 },
      },
      required: true,
      default: { easy: 0, medium: 0, hard: 0 },
    },
    answerKeyVisible: { type: Boolean, default: false },
    isEdited: { type: Boolean, default: false },
    generatedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export const GeneratedPaperModel: Model<GeneratedPaperDocument> =
  model<GeneratedPaperDocument>("GeneratedPaper", generatedPaperSchema);
