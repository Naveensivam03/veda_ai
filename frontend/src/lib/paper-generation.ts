import { Paper } from '@/types/paper';

export interface AssignmentQuestionConfig {
  id: string;
  type: string;
  count: number;
  marks: number;
}

export interface AssignmentSourceFile {
  name: string;
  size: number;
  type: string;
}

export interface AssignmentGenerationPayload {
  title: string;
  dueDate: string;
  instructions: string;
  totalQuestions: number;
  totalMarks: number;
  sourceFile: AssignmentSourceFile | null;
  questionConfig: AssignmentQuestionConfig[];
}

export interface GeneratedPaperResponse {
  message: string;
  paper: Paper;
}

const SECTION_TITLE_MAP: Record<number, string> = {
  0: 'SECTION A',
  1: 'SECTION B',
  2: 'SECTION C',
  3: 'SECTION D',
  4: 'SECTION E',
};

const DIFFICULTY_BY_MARKS: Paper['sections'][number]['questions'][number]['difficulty'][] = [
  'easy',
  'medium',
  'hard',
];

const getSectionInstruction = (type: string, marks: number) =>
  `Answer all ${type.toLowerCase()} questions (${marks} mark${marks === 1 ? '' : 's'} each).`;

const buildQuestionText = (
  type: string,
  questionNumber: number,
  title: string,
  instructions: string
) => {
  const cleanedInstructions = instructions.trim();

  return `Question ${questionNumber} for ${title}: Create a ${type.toLowerCase()} prompt${cleanedInstructions ? ` aligned with "${cleanedInstructions}"` : ''}.`;
};

const buildOptions = (type: string, title: string) => {
  if (!type.toLowerCase().includes('multiple choice')) {
    return undefined;
  }

  return [
    `A. Core concept from ${title}`,
    `B. Supporting example from ${title}`,
    `C. Common misconception from ${title}`,
    'D. None of the above',
  ];
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'generated-paper';

export function generatePaperFromAssignment(
  payload: AssignmentGenerationPayload
): GeneratedPaperResponse {
  let questionNumber = 1;

  const sections = payload.questionConfig.map((config, index) => {
    const sectionId = `section-${index + 1}`;
    const questions = Array.from({ length: config.count }, (_, questionIndex) => {
      const currentQuestionNumber = questionNumber++;
      const difficulty = DIFFICULTY_BY_MARKS[Math.min(config.marks - 1, 2)] ?? 'Challenging';

      return {
        id: `${sectionId}-q${questionIndex + 1}`,
        number: currentQuestionNumber,
        difficulty,
        text: buildQuestionText(
          config.type,
          currentQuestionNumber,
          payload.title,
          payload.instructions
        ),
        marks: config.marks,
        options: buildOptions(config.type, payload.title),
      };
    });

    return {
      id: sectionId,
      title: SECTION_TITLE_MAP[index] ?? `SECTION ${String.fromCharCode(65 + index)}`,
      instruction: getSectionInstruction(config.type, config.marks),
      questions,
    };
  });

  const paper: any = {
    id: slugify(payload.title),
    schoolInfo: {
      name: 'Velora Education',
      subject: payload.title,
      gradeClass: 'Assignment Paper',
    },
    metadata: {
      timeAllowed: '45 minutes',
      maxMarks: payload.totalMarks,
      instructions: [
        'All questions are compulsory unless stated otherwise.',
        payload.dueDate ? `Complete and review before ${payload.dueDate}.` : 'Review the paper before sharing.',
        payload.instructions || 'Questions were generated from the submitted assignment configuration.',
      ],
    },
    sections,
    answerKey: sections.flatMap((section) =>
      section.questions.map((question) => ({
        questionNumber: question.number,
        answer: `Suggested answer for ${question.text}`,
      }))
    ),
  };

  return {
    message: `Generated a draft paper for ${payload.title}${payload.sourceFile ? ` using ${payload.sourceFile.name}` : ''}.`,
    paper: paper as any,
  };
}
