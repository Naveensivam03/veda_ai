export interface TeacherSchool {
  id: string;
  name: string;
  city: string;
  board: string;
  logoUrl: string;
}

export interface TeacherSummary {
  id: string;
  fullName: string;
  email: string;
  role: string;
  subject: string;
  avatarUrl: string;
  generationCredits: number;
  school: TeacherSchool;
}

export interface DashboardStats {
  totalAssignments: number;
  generatingAssignments: number;
  completedAssignments: number;
  failedAssignments: number;
}

export interface RecentAssignmentSummary {
  id: string;
  title: string;
  status: string;
  totalMarks: number;
  totalQuestions: number;
  createdAt: string;
  dueDate: string;
}

export interface ActiveGenerationJobSummary {
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
