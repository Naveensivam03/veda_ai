'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { loadAssignments, removeAssignment } from '@/lib/assignment-storage';
import { AssignmentCardData } from '@/types/assignment';
import { AssignmentCard } from './assignment-card';

interface AssignmentGridProps {
  searchQuery: string;
}

export function AssignmentGrid({ searchQuery }: AssignmentGridProps) {
  const [assignments, setAssignments] = useState<AssignmentCardData[]>([]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setAssignments(loadAssignments());
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const filteredAssignments = useMemo(
    () =>
      assignments.filter((assignment) =>
        assignment.title.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [assignments, searchQuery]
  );

  const handleDelete = (assignmentId: string, paperId: string) => {
    setAssignments(removeAssignment(assignmentId, paperId));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
      {filteredAssignments.map((assignment) => (
        <AssignmentCard
          key={assignment.id}
          id={assignment.id}
          paperId={assignment.paperId}
          title={assignment.title}
          assignedDate={assignment.assignedDate}
          dueDate={assignment.dueDate}
          onDelete={handleDelete}
        />
      ))}
      
      {filteredAssignments.length === 0 && (
        <div className="col-span-full py-20 text-center text-zinc-400 font-[family-name:var(--font-bricolage)]">
          No assignments found matching &quot;{searchQuery}&quot;
        </div>
      )}
    </div>
  );
}
