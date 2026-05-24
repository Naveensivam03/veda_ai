'use client';

import { MOCK_ASSIGNMENTS } from '@/constants/mock-assignments';
import { deleteGeneratedPaper } from '@/lib/generated-paper-storage';
import { AssignmentCardData } from '@/types/assignment';

const STORAGE_KEY = 'assignments';

function saveAssignments(assignments: AssignmentCardData[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
}

export function loadAssignments() {
  if (typeof window === 'undefined') {
    return MOCK_ASSIGNMENTS;
  }

  const storedValue = window.localStorage.getItem(STORAGE_KEY);

  if (!storedValue) {
    saveAssignments(MOCK_ASSIGNMENTS);
    return MOCK_ASSIGNMENTS;
  }

  try {
    return JSON.parse(storedValue) as AssignmentCardData[];
  } catch {
    saveAssignments(MOCK_ASSIGNMENTS);
    return MOCK_ASSIGNMENTS;
  }
}

export function saveGeneratedAssignment(assignment: AssignmentCardData) {
  if (typeof window === 'undefined') {
    return;
  }

  const assignments = loadAssignments();
  const existingIndex = assignments.findIndex((item) => item.id === assignment.id);

  if (existingIndex >= 0) {
    const nextAssignments = [...assignments];
    nextAssignments[existingIndex] = assignment;
    saveAssignments(nextAssignments);
    return;
  }

  saveAssignments([assignment, ...assignments]);
}

export function removeAssignment(assignmentId: string, paperId: string) {
  if (typeof window === 'undefined') {
    return MOCK_ASSIGNMENTS;
  }

  const nextAssignments = loadAssignments().filter((assignment) => assignment.id !== assignmentId);

  saveAssignments(nextAssignments);
  deleteGeneratedPaper(paperId);

  return nextAssignments;
}
