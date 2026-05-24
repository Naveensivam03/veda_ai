/* Validates and normalizes generated paper output. */

import { randomUUID } from "crypto";
import { Types } from "mongoose";
import { GeneratedPaperModel, type GeneratedPaperDocument } from "../models/GeneratedPaper";
import type { PaperDraft, NormalizedPaperOutput, NormalizedPaperQuestion, NormalizedPaperSection } from "../types/paper.types";

function ensureNonEmptyString(value: string, message: string): string {
  const normalized = value.trim();

  if (!normalized) {
    throw new Error(message);
  }

  return normalized;
}

function normalizeInstructions(instructions: string[]): string[] {
  const normalized = instructions
    .map((instruction) => instruction.trim())
    .filter((instruction) => instruction.length > 0);

  if (normalized.length === 0) {
    throw new Error("Paper instructions cannot be empty");
  }

  return normalized;
}

export class PaperService {
  static normalizePaperOutput(rawPaper: PaperDraft): NormalizedPaperOutput {
    const paperTitle = ensureNonEmptyString(rawPaper.paperTitle, "Paper title is required");
    const instructions = normalizeInstructions(rawPaper.instructions);

    if (!Number.isFinite(rawPaper.duration) || rawPaper.duration <= 0) {
      throw new Error("Paper duration must be a positive number");
    }

    if (rawPaper.sections.length === 0) {
      throw new Error("Paper must include at least one section");
    }

    let questionNumber = 1;
    let totalMarks = 0;
    const difficultyBreakdown = {
      easy: 0,
      medium: 0,
      hard: 0,
    };

    const sections: NormalizedPaperSection[] = rawPaper.sections.map((section) => {
      const title = ensureNonEmptyString(section.title, "Section title is required");
      const instruction = section.instruction.trim();

      if (section.questions.length === 0) {
        throw new Error(`Section "${title}" must include at least one question`);
      }

      let sectionTotalMarks = 0;

      const questions: NormalizedPaperQuestion[] = section.questions.map((question) => {
        const text = ensureNonEmptyString(question.text, "Question text is required");
        const answerKey = ensureNonEmptyString(question.answerKey, "Answer key is required");

        if (!Number.isFinite(question.marks) || question.marks <= 0) {
          throw new Error(`Question "${text}" has invalid marks`);
        }

        const options =
          question.type === "mcq"
            ? question.options?.map((option) => option.trim()).filter((option) => option.length > 0) ?? null
            : null;

        if (question.type === "mcq" && (!options || options.length < 2)) {
          throw new Error(`Question "${text}" requires at least two options`);
        }

        totalMarks += question.marks;
        sectionTotalMarks += question.marks;
        difficultyBreakdown[question.difficulty] += 1;

        return {
          id: randomUUID(),
          number: questionNumber++,
          text,
          type: question.type,
          difficulty: question.difficulty,
          marks: question.marks,
          options,
          answerKey,
          isEdited: false,
          editedAt: null,
        };
      });

      return {
        title,
        instruction,
        totalMarks: sectionTotalMarks,
        questions,
      };
    });

    return {
      schemaVersion: 1,
      paperTitle,
      duration: rawPaper.duration,
      totalMarks,
      instructions,
      sections,
      difficultyBreakdown,
      answerKeyVisible: false,
      isEdited: false,
      generatedAt: new Date(),
    };
  }

  static async getPaperByAssignmentId(
    assignmentId: string
  ): Promise<Record<string, unknown> | null> {
    if (!Types.ObjectId.isValid(assignmentId)) {
      return null;
    }

    return await GeneratedPaperModel.findOne({ assignmentId })
      .lean<Record<string, unknown> | null>();
  }
}
