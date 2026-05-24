import { Schema, model, Document, Types } from 'mongoose';

export enum JobStatus {
  Waiting = 'waiting',
  Active = 'active',
  Completed = 'completed',
  Failed = 'failed',
}

export interface IGenerationJob extends Document {
  assignmentId: Types.ObjectId;
  bullJobId: string | null;
  status: JobStatus;
  progress: number;
  currentStage: string;
  provider: string;
  modelUsed: string;
  errorMessage: string | null;
  retryCount: number;
  startedAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
}

const GenerationJobSchema = new Schema(
  {
    assignmentId: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true, index: true },
    bullJobId: { type: String, default: null },
    status: { type: String, enum: Object.values(JobStatus), default: JobStatus.Waiting, index: true },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    currentStage: { type: String, default: '' },
    provider: { type: String, default: 'gemini' },
    modelUsed: { type: String, default: 'gemini-1.5-flash' },
    errorMessage: { type: String, default: null },
    retryCount: { type: Number, default: 0, min: 0, max: 2 },
    startedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default model<IGenerationJob>('GenerationJob', GenerationJobSchema);
