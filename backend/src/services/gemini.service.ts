/* Temporary mock implementation + real Gemini integration. */

import { buildPaperGenerationPrompt } from "../prompts/generation.prompt";
import type { AssignmentDocument } from "../models/Assignment";
import type { PaperDraft, PaperDraftQuestion, PaperDraftSection } from "../types/paper.types";
import { env } from "../config/env";
import { logger } from "../utils/logger";

const MOCK_GENERATION_DELAY_MS = 1500;

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

function buildQuestionText(
  subject: string,
  grade: string,
  type: string,
  difficulty: string,
  number: number
): string {
  if (type === "mcq") {
    return `Question ${number}: Select the best ${difficulty} level answer in ${subject} for Grade ${grade}.`;
  }

  if (type === "true-false") {
    return `Question ${number}: Determine whether the ${subject} statement for Grade ${grade} is true or false.`;
  }

  if (type === "short") {
    return `Question ${number}: Provide a short ${difficulty} response about ${subject} for Grade ${grade}.`;
  }

  return `Question ${number}: Write a detailed ${difficulty} explanation for the ${subject} topic in Grade ${grade}.`;
}

function buildQuestionAnswer(type: string, subject: string, number: number): string {
  if (type === "mcq") {
    return "Option C";
  }

  if (type === "true-false") {
    return "True";
  }

  return `Model answer ${number} for ${subject}.`;
}

function buildQuestionOptions(type: string, subject: string, number: number): string[] | null {
  if (type !== "mcq") {
    return null;
  }

  return [
    `${subject} option A${number}`,
    `${subject} option B${number}`,
    "Option C",
    `${subject} option D${number}`,
  ];
}

function buildSectionTitle(index: number): string {
  return `Section ${String.fromCharCode(65 + index)}`;
}

function buildSectionInstruction(section: PaperDraftSection): string {
  return `Answer all ${section.questions.length} question(s) in this section.`;
}

async function generateMockPaper(assignment: AssignmentDocument): Promise<PaperDraft> {
  await delay(MOCK_GENERATION_DELAY_MS);

  let questionNumber = 1;

  const sections: PaperDraftSection[] = assignment.questionConfigs.map((config, index) => {
    const questions: PaperDraftQuestion[] = Array.from({ length: config.count }, () => {
      const currentNumber = questionNumber++;
      const difficulty = config.difficulty === "mixed" ? "medium" : config.difficulty;

      return {
        text: buildQuestionText(
          assignment.subject,
          assignment.grade,
          config.type,
          difficulty,
          currentNumber
        ),
        type: config.type,
        difficulty,
        marks: config.marksPerQuestion,
        options: buildQuestionOptions(config.type, assignment.subject, currentNumber),
        answerKey: buildQuestionAnswer(config.type, assignment.subject, currentNumber),
      };
    });

    return {
      title: buildSectionTitle(index),
      instruction: buildSectionInstruction({ title: "", instruction: "", questions }),
      questions,
    };
  });

  return {
    paperTitle: `${assignment.title} Question Paper`,
    duration: 90,
    instructions: [
      "Read all questions carefully before answering.",
      "Write concise and relevant answers.",
      "Attempt every question in the assigned section.",
    ],
    sections,
  };
}

export async function generatePaper(assignment: AssignmentDocument): Promise<PaperDraft> {
  const apiKey = env.GEMINI_API_KEY;

  if (apiKey && apiKey !== "mock-key") {
    logger.info("Generating paper using live Gemini API", { assignmentId: String(assignment._id) });
    try {
      const userPrompt = buildPaperGenerationPrompt(assignment);
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `${userPrompt}\n\nYou are VedaAI, an advanced educational AI that generates high-quality school exam papers and assessments.
Your task is to generate a comprehensive, structured school assessment paper based on the requested configuration.

Guidelines:
1. Ensure the questions match the subject, grade, difficulty levels, and total marks specified.
2. For multiple choice questions ('mcq'), provide exactly 4 distinct options and specify the correct option in the answerKey.
3. For true/false questions ('true-false'), provide options like ["True", "False"] or null, and specify "True" or "False" in the answerKey.
4. For short ('short') and long ('long') questions, options must be null, and provide a clear model answer or rubric in the answerKey.
5. All generated content must be academically accurate, highly professional, and suitable for the specified grade level.
6. Return a valid JSON object matching the requested schema.`
                  }
                ]
              }
            ],
            generationConfig: {
              responseMimeType: "application/json",
              responseSchema: {
                type: "OBJECT",
                properties: {
                  paperTitle: { type: "STRING" },
                  duration: { type: "INTEGER" },
                  instructions: {
                    type: "ARRAY",
                    items: { type: "STRING" }
                  },
                  sections: {
                    type: "ARRAY",
                    items: {
                      type: "OBJECT",
                      properties: {
                        title: { type: "STRING" },
                        instruction: { type: "STRING" },
                        questions: {
                          type: "ARRAY",
                          items: {
                            type: "OBJECT",
                            properties: {
                              text: { type: "STRING" },
                              type: { type: "STRING" },
                              difficulty: { type: "STRING" },
                              marks: { type: "INTEGER" },
                              options: {
                                type: "ARRAY",
                                items: { type: "STRING" },
                                nullable: true
                              },
                              answerKey: { type: "STRING" }
                            },
                            required: ["text", "type", "difficulty", "marks", "answerKey"]
                          }
                        }
                      },
                      required: ["title", "instruction", "questions"]
                    }
                  }
                },
                required: ["paperTitle", "duration", "instructions", "sections"]
              }
            }
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API returned status ${response.status}: ${errorText}`);
      }

      const responseData = await response.json() as any;
      const text = responseData.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!text) {
        throw new Error("Empty response text from Gemini API");
      }

      const parsedPaper = JSON.parse(text) as PaperDraft;
      logger.info("Successfully generated paper using Gemini API", { assignmentId: String(assignment._id) });
      return parsedPaper;
    } catch (error) {
      logger.error("Gemini API paper generation failed, falling back to mock generation", error);
    }
  }

  // Fallback to mock generation
  logger.info("Generating paper using mock generator", { assignmentId: String(assignment._id) });
  return generateMockPaper(assignment);
}
