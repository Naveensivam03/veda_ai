/* Defines generated paper and queue payload types. */

import type { QuestionType } from "./assignment.types";

export type PaperDifficulty = "easy" | "medium" | "hard";

export interface PaperDraftQuestion {
  text: string;
  type: QuestionType;
  difficulty: PaperDifficulty;
  marks: number;
  options: string[] | null;
  answerKey: string;
}

export interface PaperDraftSection {
  title: string;
  instruction: string;
  questions: PaperDraftQuestion[];
}

export interface PaperDraft {
  paperTitle: string;
  duration: number;
  instructions: string[];
  sections: PaperDraftSection[];
}

export interface NormalizedPaperQuestion {
  id: string;
  number: number;
  text: string;
  type: QuestionType;
  difficulty: PaperDifficulty;
  marks: number;
  options: string[] | null;
  answerKey: string;
  isEdited: boolean;
  editedAt: Date | null;
}

export interface NormalizedPaperSection {
  title: string;
  instruction: string;
  totalMarks: number;
  questions: NormalizedPaperQuestion[];
}

export interface DifficultyBreakdown {
  easy: number;
  medium: number;
  hard: number;
}

export interface NormalizedPaperOutput {
  schemaVersion: 1;
  paperTitle: string;
  duration: number;
  totalMarks: number;
  instructions: string[];
  sections: NormalizedPaperSection[];
  difficultyBreakdown: DifficultyBreakdown;
  answerKeyVisible: boolean;
  isEdited: boolean;
  generatedAt: Date;
}

export interface PaperGenerationJob {
  assignmentId: string;
}
