import { apiRequest } from '@/lib/api';
import type {
  AssignmentStatusResponse,
  CreateAssignmentRequest,
  CreateAssignmentResponse,
} from '@/types/assignment';

export function createAssignment(payload: CreateAssignmentRequest) {
  return apiRequest<CreateAssignmentResponse>('/assignments', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getAssignmentStatus(assignmentId: string) {
  return apiRequest<AssignmentStatusResponse>(`/assignments/${assignmentId}/status`);
}
