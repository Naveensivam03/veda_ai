/* Queries teacher dashboard data from MongoDB. */

import { Types } from "mongoose";
import { AssignmentModel } from "../models/Assignment";
import { GenerationJobModel } from "../models/GenerationJob";
import { SchoolModel } from "../models/School";
import { UserModel } from "../models/User";

interface TeacherSummary {
  id: string;
  fullName: string;
  email: string;
  role: string;
  subject: string;
  avatarUrl: string;
  generationCredits: number;
  school: {
    id: string;
    name: string;
    city: string;
    board: string;
    logoUrl: string;
  };
}

interface DashboardStats {
  totalAssignments: number;
  generatingAssignments: number;
  completedAssignments: number;
  failedAssignments: number;
}

interface RecentAssignmentSummary {
  id: string;
  title: string;
  status: string;
  totalMarks: number;
  totalQuestions: number;
  createdAt: string;
  dueDate: string;
}

interface ActiveGenerationJobSummary {
  assignmentId: string;
  title: string;
  status: string;
  progress: number;
  currentStage: string;
  provider: string;
  modelUsed: string;
  updatedAt: string;
}

export interface DashboardResponse {
  teacher: TeacherSummary;
  stats: DashboardStats;
  recentAssignments: RecentAssignmentSummary[];
  activeGenerationJobs: ActiveGenerationJobSummary[];
}

export class DashboardService {
  static async getDashboard(teacherId: string): Promise<DashboardResponse | null> {
    if (!Types.ObjectId.isValid(teacherId)) {
      return null;
    }

    const teacher = await UserModel.findById(teacherId)
      .select("fullName email role subject schoolId avatarUrl generationCredits")
      .lean<{
        _id: Types.ObjectId;
        fullName: string;
        email: string;
        role: string;
        subject: string;
        schoolId: Types.ObjectId;
        avatarUrl?: string;
        generationCredits?: number;
      } | null>();

    if (!teacher) {
      return null;
    }

    const school = await SchoolModel.findById(teacher.schoolId)
      .select("name city board logoUrl")
      .lean<{
        _id: Types.ObjectId;
        name: string;
        city: string;
        board: string;
        logoUrl?: string;
      } | null>();

    if (!school) {
      return null;
    }

    const [
      totalAssignments,
      generatingAssignments,
      completedAssignments,
      failedAssignments,
      recentAssignments,
      activeGenerationJobs,
    ] = await Promise.all([
      AssignmentModel.countDocuments({ teacherId }),
      AssignmentModel.countDocuments({ teacherId, status: "generating" }),
      AssignmentModel.countDocuments({ teacherId, status: "completed" }),
      AssignmentModel.countDocuments({ teacherId, status: "failed" }),
      AssignmentModel.find({ teacherId })
        .sort({ createdAt: -1 })
        .limit(10)
        .select("title status totalMarks totalQuestions createdAt dueDate")
        .lean<
          Array<{
            _id: Types.ObjectId;
            title: string;
            status: string;
            totalMarks: number;
            totalQuestions: number;
            createdAt: Date;
            dueDate: Date;
          }>
        >(),
      GenerationJobModel.find({
        assignmentId: {
          $in: await AssignmentModel.find({ teacherId }).distinct("_id"),
        },
        status: { $in: ["queued", "processing"] },
      })
        .sort({ updatedAt: -1 })
        .limit(5)
        .select("assignmentId status progress currentStage provider modelUsed updatedAt")
        .lean<
          Array<{
            assignmentId: Types.ObjectId;
            status: string;
            progress: number;
            currentStage: string;
            provider: string;
            modelUsed: string;
            updatedAt: Date;
          }>
        >(),
    ]);

    const assignmentIds = activeGenerationJobs.map((job) => job.assignmentId);
    const jobAssignments =
      assignmentIds.length > 0
        ? await AssignmentModel.find({ _id: { $in: assignmentIds } })
            .select("title")
            .lean<Array<{ _id: Types.ObjectId; title: string }>>()
        : [];

    const assignmentTitleById = new Map(
      jobAssignments.map((assignment) => [String(assignment._id), assignment.title])
    );

    return {
      teacher: {
        id: String(teacher._id),
        fullName: teacher.fullName,
        email: teacher.email,
        role: teacher.role,
        subject: teacher.subject,
        avatarUrl: teacher.avatarUrl ?? "",
        generationCredits: teacher.generationCredits ?? 3,
        school: {
          id: String(school._id),
          name: school.name,
          city: school.city,
          board: school.board,
          logoUrl: school.logoUrl ?? "",
        },
      },
      stats: {
        totalAssignments,
        generatingAssignments,
        completedAssignments,
        failedAssignments,
      },
      recentAssignments: recentAssignments.map((assignment) => ({
        id: String(assignment._id),
        title: assignment.title,
        status: assignment.status,
        totalMarks: assignment.totalMarks,
        totalQuestions: assignment.totalQuestions,
        createdAt: assignment.createdAt.toISOString(),
        dueDate: assignment.dueDate.toISOString(),
      })),
      activeGenerationJobs: activeGenerationJobs.map((job) => ({
        assignmentId: String(job.assignmentId),
        title: assignmentTitleById.get(String(job.assignmentId)) ?? "Generating assignment",
        status: job.status,
        progress: job.progress,
        currentStage: job.currentStage,
        provider: job.provider,
        modelUsed: job.modelUsed,
        updatedAt: job.updatedAt.toISOString(),
      })),
    };
  }
}
