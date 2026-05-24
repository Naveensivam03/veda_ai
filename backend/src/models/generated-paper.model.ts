import { Schema, model, Document, Types } from 'mongoose';

export enum QuestionType {
  MCQ = 'mcq',
  Short = 'short',
  Long = 'long',
  TrueFalse = 'true-false',
}

export enum Difficulty {
  Easy = 'easy',
  Medium = 'medium',
  Hard = 'hard',
}

export interface IQuestion {
  questionId: string;
  number: number;
  text: string;
  type: QuestionType;
  difficulty: Difficulty;
  marks: number;
  options: string[] | null;
  answerKey: string;
  isEdited: boolean;
  editedAt: Date | null;
}

export interface ISection {
  sectionId: string;
  title: string;
  instruction: string;
  totalMarks: number;
  questions: IQuestion[];
}

export interface IDifficultyBreakdown {
  easy: number;
  medium: number;
  hard: number;
}

export interface IGeneratedPaper extends Document {
  assignmentId: Types.ObjectId;
  teacherId: Types.ObjectId;
  schoolId: Types.ObjectId;

  paperTitle: string;
  schoolName: string;

  subject: string;
  grade: string;

  duration: number;
  totalMarks: number;

  instructions: string[];

  sections: ISection[];

  difficultyBreakdown: IDifficultyBreakdown;

  answerKeyVisible: boolean;
  isEdited: boolean;

  generatedAt: Date;

  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    questionId: { type: String, required: true },
    number: { type: Number, required: true },
    text: { type: String, required: true },
    type: { type: String, enum: Object.values(QuestionType), required: true },
    difficulty: { type: String, enum: Object.values(Difficulty), required: true },
    marks: { type: Number, required: true },
    options: { type: [String], default: null },
    answerKey: { type: String, default: '' },
    isEdited: { type: Boolean, default: false },
    editedAt: { type: Date, default: null },
  },
  { _id: false }
);

const SectionSchema = new Schema<ISection>(
  {
    sectionId: { type: String, required: true },
    title: { type: String, required: true },
    instruction: { type: String, default: '' },
    totalMarks: { type: Number, required: true },
    questions: { type: [QuestionSchema], default: [] },
  },
  { _id: false }
);

const GeneratedPaperSchema = new Schema(
  {
    assignmentId: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true, index: true },
    teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },

    paperTitle: { type: String, required: true },
    schoolName: { type: String, required: true },

    subject: { type: String, required: true },
    grade: { type: String, required: true },

    duration: { type: Number, required: true },
    totalMarks: { type: Number, required: true },

    instructions: { type: [String], default: [] },

    sections: { type: [SectionSchema], default: [] },

    difficultyBreakdown: {
      type: {
        easy: { type: Number, default: 0 },
        medium: { type: Number, default: 0 },
        hard: { type: Number, default: 0 },
      },
      default: { easy: 0, medium: 0, hard: 0 },
    },

    answerKeyVisible: { type: Boolean, default: false },
    isEdited: { type: Boolean, default: false },

    generatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default model<IGeneratedPaper>('GeneratedPaper', GeneratedPaperSchema);
