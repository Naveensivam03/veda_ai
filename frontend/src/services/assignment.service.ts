import { apiRequest } from '@/lib/api';
import type {
  AssignmentStatusResponse,
  CreateAssignmentRequest,
  CreateAssignmentResponse,
  ListAssignmentsResponse,
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

export function listAssignments(teacherId: string) {
  return apiRequest<ListAssignmentsResponse>(`/assignments?teacherId=${teacherId}`);
}

export function deleteAssignment(assignmentId: string) {
  return apiRequest<{ success: boolean; message: string }>(`/assignments/${assignmentId}`, {
    method: 'DELETE',
  });
}
