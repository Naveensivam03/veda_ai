export type PaperDifficulty = 'easy' | 'medium' | 'hard';
export type PaperQuestionType = 'mcq' | 'short' | 'long' | 'true-false';

export interface PaperQuestion {
  id: string;
  number: number;
  text: string;
  type: PaperQuestionType;
  difficulty: PaperDifficulty;
  marks: number;
  options: string[] | null;
  answerKey: string;
  isEdited: boolean;
  editedAt: string | null;
}

export interface PaperSection {
  title: string;
  instruction: string;
  totalMarks: number;
  questions: PaperQuestion[];
}

export interface Paper {
  _id: string;
  assignmentId: string;
  teacherId: string;
  schoolId: string;
  schemaVersion: 1;
  paperTitle: string;
  schoolName: string;
  subject: string;
  grade: string;
  duration: number;
  totalMarks: number;
  instructions: string[];
  sections: PaperSection[];
  difficultyBreakdown: {
    easy: number;
    medium: number;
    hard: number;
  };
  answerKeyVisible: boolean;
  isEdited: boolean;
  generatedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaperResponse {
  paper: Paper;
}
