/* Defines assignment domain and API payload types. */

export const questionTypes = ["mcq", "short", "long", "true-false"] as const;
export const difficultyLevels = ["easy", "medium", "hard", "mixed"] as const;
export const assignmentStatuses = [
  "draft",
  "generating",
  "completed",
  "failed",
] as const;
export const uploadedMaterialTypes = ["pdf", "text"] as const;

export type QuestionType = (typeof questionTypes)[number];
export type DifficultyLevel = (typeof difficultyLevels)[number];
export type AssignmentStatus = (typeof assignmentStatuses)[number];
export type UploadedMaterialType = (typeof uploadedMaterialTypes)[number];

export interface QuestionConfig {
  type: QuestionType;
  count: number;
  marksPerQuestion: number;
  difficulty: DifficultyLevel;
}

export interface UploadedMaterial {
  fileName: string;
  fileUrl: string;
  fileType: UploadedMaterialType;
  fileContent?: string;
}

export interface CreateAssignmentRequestBody {
  teacherId: string;
  dueDate: string;
  instructions?: string;
  uploadedMaterial?: UploadedMaterial | null;
  questionConfigs: QuestionConfig[];
  totalQuestions: number;
  totalMarks: number;
}

export interface CreateAssignmentData {
  teacherId: string;
  dueDate: Date;
  instructions: string;
  uploadedMaterial: UploadedMaterial | null;
  questionConfigs: QuestionConfig[];
  totalQuestions: number;
  totalMarks: number;
}
