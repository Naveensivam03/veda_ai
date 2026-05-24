export type AssignmentStatus = 'Draft' | 'Published' | 'Closed';
export type AssignmentGenerationStatus = 'draft' | 'generating' | 'completed' | 'failed';

export type QuestionType = 'mcq' | 'short' | 'long' | 'true-false';
export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'mixed';
export type UploadedMaterialType = 'pdf' | 'text';

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
  fileContent?: string | null;
}

export interface CreateAssignmentRequest {
  teacherId: string;
  schoolId: string;
  schoolName: string;
  title: string;
  subject: string;
  grade: string;
  dueDate: string;
  instructions?: string;
  uploadedMaterial?: UploadedMaterial | null;
  questionConfigs: QuestionConfig[];
  totalQuestions: number;
  totalMarks: number;
}

export interface CreateAssignmentResponse {
  assignmentId: string;
  status: AssignmentGenerationStatus;
}

export interface AssignmentStatusResponse {
  status: AssignmentGenerationStatus;
}

export interface AssignmentCardData {
  id: string;
  paperId: string;
  title: string;
  assignedDate: string;
  dueDate: string;
  status: AssignmentStatus;
  totalQuestions: number;
  totalMarks: number;
}
