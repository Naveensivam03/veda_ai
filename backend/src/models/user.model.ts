import { Schema, model, Document, Types } from 'mongoose';

export enum UserRole {
  Teacher = 'teacher',
  Admin = 'admin',
}

export interface IUser extends Document {
  fullName: string;
  email: string;
  role: UserRole;
  subject: string;
  schoolId: Types.ObjectId;
  avatarUrl: string | null;
  createdAt: Date;
}

const UserSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    role: { type: String, enum: Object.values(UserRole), required: true },
    subject: { type: String, required: true, trim: true },
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },
    avatarUrl: { type: String, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default model<IUser>('User', UserSchema);
