/* Orchestrates assignment creation and background paper generation. */

import { Types } from "mongoose";
import { AssignmentModel, type AssignmentDocument } from "../models/Assignment";
import { GenerationJobModel } from "../models/GenerationJob";
import { GeneratedPaperModel } from "../models/GeneratedPaper";
import { SchoolModel } from "../models/School";
import { UserModel } from "../models/User";
import { generatePaper } from "./gemini.service";
import { PaperService } from "./paper.service";
import { QueueService } from "./queue.service";
import {
  assignmentStatuses,
  difficultyLevels,
  questionTypes,
  uploadedMaterialTypes,
  type AssignmentStatus,
  type CreateAssignmentData,
  type CreateAssignmentRequestBody,
  type QuestionConfig,
  type UploadedMaterial,
} from "../types/assignment.types";
import { logger } from "../utils/logger";

interface QueuedAssignmentResult {
  assignmentId: string;
  status: AssignmentStatus;
}

interface AssignmentListItem {
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

interface AssignmentStatusResult {
  status: AssignmentStatus;
  progress: number | null;
  currentStage: string | null;
}

const DEFAULT_ASSIGNMENT_GRADE = "Unspecified";

function ensureObject(value: unknown, message: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(message);
  }

  return value as Record<string, unknown>;
}

function readString(value: unknown, field: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${field} is required`);
  }

  return value.trim();
}

function readOptionalString(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function readPositiveNumber(value: unknown, field: string): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    throw new Error(`${field} must be a positive number`);
  }

  return value;
}

function readPositiveInteger(value: unknown, field: string): number {
  const parsed = readPositiveNumber(value, field);

  if (!Number.isInteger(parsed)) {
    throw new Error(`${field} must be an integer`);
  }

  return parsed;
}

function readObjectId(value: unknown, field: string): string {
  const normalized = readString(value, field);

  if (!Types.ObjectId.isValid(normalized)) {
    throw new Error(`${field} must be a valid ObjectId`);
  }

  return normalized;
}

function formatAssignmentTitle(subject: string, dueDate: Date): string {
  const formattedDate = dueDate.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
  });

  return `${subject} Assignment ${formattedDate}`;
}

function readUploadedMaterial(value: unknown): UploadedMaterial | null {
  if (value === undefined || value === null) {
    return null;
  }

  const record = ensureObject(value, "uploadedMaterial must be an object");
  const fileType = readString(record.fileType, "uploadedMaterial.fileType");

  if (!uploadedMaterialTypes.includes(fileType as UploadedMaterial["fileType"])) {
    throw new Error("uploadedMaterial.fileType is invalid");
  }

  return {
    fileName: readString(record.fileName, "uploadedMaterial.fileName"),
    fileUrl: readString(record.fileUrl, "uploadedMaterial.fileUrl"),
    fileType: fileType as UploadedMaterial["fileType"],
    fileContent: readOptionalString(record.fileContent),
  };
}

function readQuestionConfig(value: unknown): QuestionConfig {
  const record = ensureObject(value, "questionConfig must be an object");
  const type = readString(record.type, "questionConfig.type");
  const difficulty = readString(record.difficulty, "questionConfig.difficulty");

  if (!questionTypes.includes(type as QuestionConfig["type"])) {
    throw new Error("questionConfig.type is invalid");
  }

  if (!difficultyLevels.includes(difficulty as QuestionConfig["difficulty"])) {
    throw new Error("questionConfig.difficulty is invalid");
  }

  return {
    type: type as QuestionConfig["type"],
    count: readPositiveInteger(record.count, "questionConfig.count"),
    marksPerQuestion: readPositiveInteger(
      record.marksPerQuestion,
      "questionConfig.marksPerQuestion"
    ),
    difficulty: difficulty as QuestionConfig["difficulty"],
  };
}

function parseCreateAssignmentPayload(payload: unknown): CreateAssignmentData {
  const body = ensureObject(payload, "Request body must be an object") as unknown as CreateAssignmentRequestBody;
  const dueDateValue = readString(body.dueDate, "dueDate");
  const dueDate = new Date(dueDateValue);

  if (Number.isNaN(dueDate.getTime())) {
    throw new Error("dueDate must be a valid ISO date");
  }

  const grade = body.grade?.trim() || DEFAULT_ASSIGNMENT_GRADE;

  if (!Array.isArray(body.questionConfigs) || body.questionConfigs.length === 0) {
    throw new Error("questionConfigs must contain at least one item");
  }

  const questionConfigs = body.questionConfigs.map((config) => readQuestionConfig(config));
  const expectedTotalQuestions = questionConfigs.reduce(
    (sum, config) => sum + config.count,
    0
  );
  const expectedTotalMarks = questionConfigs.reduce(
    (sum, config) => sum + config.count * config.marksPerQuestion,
    0
  );
  const totalQuestions = readPositiveInteger(body.totalQuestions, "totalQuestions");
  const totalMarks = readPositiveInteger(body.totalMarks, "totalMarks");

  if (totalQuestions !== expectedTotalQuestions) {
    throw new Error("totalQuestions does not match questionConfigs");
  }

  if (totalMarks !== expectedTotalMarks) {
    throw new Error("totalMarks does not match questionConfigs");
  }

  return {
    teacherId: readObjectId(body.teacherId, "teacherId"),
    dueDate,
    grade,
    instructions: readOptionalString(body.instructions),
    uploadedMaterial: readUploadedMaterial(body.uploadedMaterial),
    questionConfigs,
    totalQuestions,
    totalMarks,
  };
}

function assertAssignmentStatus(value: unknown): AssignmentStatus {
  if (typeof value !== "string" || !assignmentStatuses.includes(value as AssignmentStatus)) {
    throw new Error("Assignment status is invalid");
  }

  return value as AssignmentStatus;
}

export class AssignmentService {
  static async createAssignment(payload: unknown): Promise<QueuedAssignmentResult> {
    const data = parseCreateAssignmentPayload(payload);
    const teacher = await UserModel.findById(data.teacherId)
      .select("subject schoolId generationCredits")
      .lean<{ subject: string; schoolId: Types.ObjectId; generationCredits: number } | null>();

    if (!teacher) {
      throw new Error("Teacher not found");
    }

    if (teacher.generationCredits <= 0) {
      throw new Error("AI generation limit reached");
    }

    const school = await SchoolModel.findById(teacher.schoolId)
      .select("name")
      .lean<{ name: string } | null>();

    if (!school) {
      throw new Error("School not found");
    }

    const subject = readString(teacher.subject, "teacher.subject");
    const title = formatAssignmentTitle(subject, data.dueDate);

    const assignment = await AssignmentModel.create({
      teacherId: new Types.ObjectId(data.teacherId),
      schoolId: teacher.schoolId,
      schoolName: school.name,
      title,
      subject,
      grade: data.grade,
      dueDate: data.dueDate,
      instructions: data.instructions,
      uploadedMaterial: data.uploadedMaterial,
      questionConfigs: data.questionConfigs,
      totalQuestions: data.totalQuestions,
      totalMarks: data.totalMarks,
      status: "generating",
    });

    await GenerationJobModel.findOneAndUpdate(
      { assignmentId: assignment._id },
      {
        assignmentId: assignment._id,
        status: "queued",
        progress: 10,
        currentStage: "Queued for generation",
        provider: "gemini",
        modelUsed: "gemini",
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    try {
      await QueueService.enqueuePaperGeneration(assignment.id);
    } catch (error) {
      assignment.status = "failed";
      await assignment.save();
      logger.error("Failed to enqueue paper generation", error, {
        assignmentId: assignment.id,
      });
      throw error;
    }

    return {
      assignmentId: assignment.id,
      status: assignment.status,
    };
  }

  static async getAssignmentStatus(
    assignmentId: string
  ): Promise<AssignmentStatusResult | null> {
    if (!Types.ObjectId.isValid(assignmentId)) {
      return null;
    }

    const [assignment, generationJob] = await Promise.all([
      AssignmentModel.findById(assignmentId)
        .select("status")
        .lean<{ status: AssignmentStatus } | null>(),
      GenerationJobModel.findOne({ assignmentId })
        .select("progress currentStage")
        .lean<{ progress: number; currentStage: string } | null>(),
    ]);

    if (!assignment) {
      return null;
    }

    return {
      status: assertAssignmentStatus(assignment.status),
      progress: generationJob?.progress ?? null,
      currentStage: generationJob?.currentStage ?? null,
    };
  }

  static async getAssignmentById(assignmentId: string): Promise<AssignmentDocument | null> {
    if (!Types.ObjectId.isValid(assignmentId)) {
      return null;
    }

    return await AssignmentModel.findById(assignmentId).lean<AssignmentDocument | null>();
  }

  static async deleteAssignment(assignmentId: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(assignmentId)) {
      return false;
    }

    const result = await AssignmentModel.findByIdAndDelete(assignmentId);

    if (!result) {
      return false;
    }

    // Clean up related documents
    await Promise.all([
      GeneratedPaperModel.deleteOne({ assignmentId }),
      GenerationJobModel.deleteOne({ assignmentId }),
    ]);

    return true;
  }

  static async listAssignmentsByTeacher(teacherId: string): Promise<AssignmentListItem[]> {
    if (!Types.ObjectId.isValid(teacherId)) {
      return [];
    }

    const assignments = await AssignmentModel.find({ teacherId })
      .sort({ createdAt: -1 })
      .select("title subject grade status totalMarks totalQuestions createdAt dueDate")
      .lean<
        Array<{
          _id: Types.ObjectId;
          title: string;
          subject: string;
          grade: string;
          status: AssignmentStatus;
          totalMarks: number;
          totalQuestions: number;
          createdAt: Date;
          dueDate: Date;
        }>
      >();

    const assignmentIds = assignments.map((a) => a._id);
    const papers = await GeneratedPaperModel.find({
      assignmentId: { $in: assignmentIds },
    })
      .select("assignmentId _id")
      .lean<{ assignmentId: Types.ObjectId; _id: Types.ObjectId }[]>();

    const paperMap = new Map(
      papers.map((p) => [String(p.assignmentId), String(p._id)])
    );

    return assignments.map((assignment) => ({
      id: String(assignment._id),
      paperId: paperMap.get(String(assignment._id)) ?? null,
      title: assignment.title,
      subject: assignment.subject,
      grade: assignment.grade,
      status: assignment.status,
      totalMarks: assignment.totalMarks,
      totalQuestions: assignment.totalQuestions,
      createdAt: assignment.createdAt.toISOString(),
      dueDate: assignment.dueDate.toISOString(),
    }));
  }

  static async processPaperGeneration(assignmentId: string): Promise<void> {
    if (!Types.ObjectId.isValid(assignmentId)) {
      throw new Error("assignmentId must be a valid ObjectId");
    }

    const assignment = await AssignmentModel.findById(assignmentId);

    if (!assignment) {
      throw new Error("Assignment not found");
    }

    logger.info("Job started", { assignmentId });

    try {
      await GenerationJobModel.findOneAndUpdate(
        { assignmentId: assignment._id },
        {
          status: "processing",
          progress: 35,
          currentStage: "Generating questions and answer keys",
          provider: "gemini",
          modelUsed: "gemini",
        }
      );

      const draftPaper = await generatePaper(assignment);
      const normalizedPaper = PaperService.normalizePaperOutput(draftPaper);

      await GenerationJobModel.findOneAndUpdate(
        { assignmentId: assignment._id },
        {
          status: "processing",
          progress: 80,
          currentStage: "Saving generated paper",
        }
      );

      await GeneratedPaperModel.findOneAndUpdate(
        { assignmentId: assignment._id },
        {
          assignmentId: assignment._id,
          teacherId: assignment.teacherId,
          schoolId: assignment.schoolId,
          schoolName: assignment.schoolName,
          subject: assignment.subject,
          grade: assignment.grade,
          ...normalizedPaper,
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );

      // Deduct credit ONLY after successful paper generation and GeneratedPaper saved successfully
      await UserModel.findByIdAndUpdate(
        assignment.teacherId,
        {
          $inc: {
            generationCredits: -1,
          },
        }
      );
      logger.info("Successfully deducted 1 AI generation credit", { teacherId: String(assignment.teacherId) });

      assignment.status = "completed";
      await assignment.save();
      await GenerationJobModel.findOneAndUpdate(
        { assignmentId: assignment._id },
        {
          status: "completed",
          progress: 100,
          currentStage: "Generation completed",
        }
      );

      logger.info("Paper generated", { assignmentId });
    } catch (error) {
      assignment.status = "failed";
      await assignment.save();
      await GenerationJobModel.findOneAndUpdate(
        { assignmentId: assignment._id },
        {
          status: "failed",
          currentStage: "Generation failed",
        }
      );
      logger.error("Job failed", error, { assignmentId });
      throw error;
    }
  }
}
