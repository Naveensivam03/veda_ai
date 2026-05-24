import { Schema, model, Document, Types } from 'mongoose';

export enum QuestionType {
  MCQ = 'mcq',
  Short = 'short',
  Long = 'long',
  TrueFalse = 'true-false',
}

export enum DifficultyLevel {
  Easy = 'easy',
  Medium = 'medium',
  Hard = 'hard',
  Mixed = 'mixed',
}

export enum AssignmentStatus {
  Draft = 'draft',
  Queued = 'queued',
  Generating = 'generating',
  Completed = 'completed',
  Failed = 'failed',
}

export interface IQuestionConfig {
  type: QuestionType;
  count: number;
  marksPerQuestion: number;
  difficulty: DifficultyLevel;
}

export interface IUploadedMaterial {
  fileName: string;
  fileUrl: string;
  fileType: 'pdf' | 'text';
}

export interface IAssignment extends Document {
  teacherId: Types.ObjectId;
  schoolId: Types.ObjectId;

  title: string;
  subject: string;
  grade: string;
  dueDate: Date;

  instructions: string;

  uploadedMaterial: IUploadedMaterial | null;

  questionConfigs: IQuestionConfig[];

  totalQuestions: number;
  totalMarks: number;

  status: AssignmentStatus;

  isDeleted: boolean;
  deletedAt: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

const UploadedMaterialSchema = new Schema<IUploadedMaterial>(
  {
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, enum: ['pdf', 'text'], required: true },
  },
  { _id: false }
);

const QuestionConfigSchema = new Schema<IQuestionConfig>(
  {
    type: { type: String, enum: Object.values(QuestionType), required: true },
    count: { type: Number, required: true, min: 1 },
    marksPerQuestion: { type: Number, required: true, min: 0 },
    difficulty: { type: String, enum: Object.values(DifficultyLevel), required: true },
  },
  { _id: false }
);

const AssignmentSchema = new Schema(
  {
    teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },

    title: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    grade: { type: String, required: true, trim: true },
    dueDate: { type: Date, required: true },

    instructions: { type: String, default: '' },

    uploadedMaterial: { type: UploadedMaterialSchema, default: null },

    questionConfigs: {
      type: [QuestionConfigSchema],
      validate: {
        validator: function (v: IQuestionConfig[]) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'questionConfigs must have at least one entry',
      },
    },

    totalQuestions: { type: Number, required: true, min: 1 },
    totalMarks: { type: Number, required: true, min: 1 },

    status: { type: String, enum: Object.values(AssignmentStatus), default: AssignmentStatus.Draft, index: true },

    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Compound or additional indexes can be added here if needed
AssignmentSchema.index({ status: 1 });

export default model<IAssignment>('Assignment', AssignmentSchema);
