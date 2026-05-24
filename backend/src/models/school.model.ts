import { Schema, model, Document, Types } from 'mongoose';

export enum Board {
  CBSE = 'CBSE',
  ICSE = 'ICSE',
  State = 'State',
  IB = 'IB',
  Other = 'Other',
}

export interface ISchool extends Document {
  name: string;
  city: string;
  board: Board;
  logoUrl: string | null;
  createdAt: Date;
}

const SchoolSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    board: { type: String, enum: Object.values(Board), default: Board.CBSE },
    logoUrl: { type: String, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default model<ISchool>('School', SchoolSchema);
