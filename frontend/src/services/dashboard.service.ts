import { apiRequest } from '@/lib/api';
import type { DashboardResponse } from '@/types/dashboard';

/**
 * Fetches dashboard details, stats, recent assignments, and active generation jobs
 * for a simulated or logged-in teacher by ID.
 */
export function getDashboard(teacherId: string) {
  return apiRequest<DashboardResponse>(`/dashboard/${teacherId}`);
}
