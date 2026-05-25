export type AssignmentStatus = 'draft' | 'generating' | 'completed' | 'failed';

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
  status: AssignmentStatus;
}

export interface AssignmentStatusResponse {
  status: AssignmentStatus;
}

export interface AssignmentListItem {
  id: string;
  paperId: string | null;
  title: string;
  subject: string;
  grade: string;
  status: AssignmentStatus;
  totalMarks: number;
  totalQuestions: number;
  createdAt: string;
  dueDate: string;
}

export interface ListAssignmentsResponse {
  assignments: AssignmentListItem[];
}

export interface AssignmentCardData {
  id: string;
  paperId: string | null;
  title: string;
  assignedDate: string;
  dueDate: string;
  status: AssignmentStatus;
  totalQuestions: number;
  totalMarks: number;
}
