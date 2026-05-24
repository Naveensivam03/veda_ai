/* Builds the generation prompt shape for future Gemini integration. */

import type { AssignmentDocument } from "../models/Assignment";

export function buildPaperGenerationPrompt(assignment: AssignmentDocument): string {
  const configSummary = assignment.questionConfigs
    .map(
      (config, index) =>
        `${index + 1}. ${config.type} | count=${config.count} | marks=${config.marksPerQuestion} | difficulty=${config.difficulty}`
    )
    .join("\n");

  const promptParts = [
    "Generate a structured school assessment paper.",
    `School: ${assignment.schoolName}`,
    `Title: ${assignment.title}`,
    `Subject: ${assignment.subject}`,
    `Grade: ${assignment.grade}`,
    `Total Questions: ${assignment.totalQuestions}`,
    `Total Marks: ${assignment.totalMarks}`,
    `Instructions: ${assignment.instructions || "None"}`,
    "Question Configuration:",
    configSummary,
  ];

  if (assignment.uploadedMaterial?.fileContent) {
    promptParts.push("\nSource Document Content to Base Questions On:\n" + assignment.uploadedMaterial.fileContent);
  }

  return promptParts.join("\n");
}
