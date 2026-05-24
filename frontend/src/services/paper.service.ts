import { apiRequest } from '@/lib/api';
import type { PaperResponse } from '@/types/paper';

export function getPaperByAssignmentId(assignmentId: string) {
  return apiRequest<PaperResponse>(`/papers/${assignmentId}`);
}
