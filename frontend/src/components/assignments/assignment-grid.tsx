'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { listAssignments, deleteAssignment } from '@/services/assignment.service';
import { AssignmentListItem } from '@/types/assignment';
import { AssignmentCard } from './assignment-card';
import { useTeacher } from '@/hooks/use-teacher';
import { Loader2, SearchX } from 'lucide-react';
import { EmptyState } from './empty-state';

interface AssignmentGridProps {
  searchQuery: string;
  onEmptyStateChange?: (isEmpty: boolean) => void;
}

export function AssignmentGrid({ searchQuery, onEmptyStateChange }: AssignmentGridProps) {
  const { teacher, loading: teacherLoading } = useTeacher();
  const [assignments, setAssignments] = useState<AssignmentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssignments = useCallback(async () => {
    if (!teacher) return;
    
    setLoading(true);
    try {
      const response = await listAssignments(teacher.id);
      const fetchedAssignments = response.assignments || [];
      setAssignments(fetchedAssignments);
      onEmptyStateChange?.(fetchedAssignments.length === 0);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch assignments:', err);
      setError('Failed to load assignments. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [teacher, onEmptyStateChange]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const filteredAssignments = useMemo(
    () =>
      assignments.filter((assignment) =>
        assignment.title.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [assignments, searchQuery]
  );

  const handleDelete = async (assignmentId: string) => {
    if (!confirm('Are you sure you want to delete this assignment?')) {
      return;
    }

    try {
      await deleteAssignment(assignmentId);
      setAssignments((prev) => {
        const next = prev.filter((a) => a.id !== assignmentId);
        onEmptyStateChange?.(next.length === 0);
        return next;
      });
    } catch (err) {
      console.error('Failed to delete assignment:', err);
      alert('Failed to delete assignment. Please try again.');
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).replace(/\//g, '-');
    } catch {
      return dateStr;
    }
  };

  if (loading || teacherLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-zinc-400">
        <Loader2 size={40} className="animate-spin text-zinc-300" />
        <p className="font-[family-name:var(--font-bricolage)]">Loading your assignments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center text-red-400 font-[family-name:var(--font-bricolage)] border border-red-100 rounded-[32px] bg-red-50/30">
        {error}
      </div>
    );
  }

  if (assignments.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
      {filteredAssignments.map((assignment) => (
        <AssignmentCard
          key={assignment.id}
          id={assignment.id}
          paperId={assignment.paperId}
          title={assignment.title}
          assignedDate={formatDate(assignment.createdAt)}
          dueDate={formatDate(assignment.dueDate)}
          status={assignment.status}
          onDelete={handleDelete}
        />
      ))}
      
      {filteredAssignments.length === 0 && searchQuery && (
        <div className="col-span-full py-24 text-center flex flex-col items-center justify-center bg-white/40 border border-dashed border-zinc-200 rounded-[32px] animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center mb-4 text-zinc-300">
            <SearchX size={32} />
          </div>
          <h3 className="text-lg font-bold text-zinc-800 font-[family-name:var(--font-bricolage)]">No results found</h3>
          <p className="text-zinc-400 text-sm mt-1 max-w-[300px]">
            We couldn't find any assignments matching <span className="text-zinc-600 font-semibold">"{searchQuery}"</span>
          </p>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('clear-search'))}
            className="mt-6 text-xs font-bold text-zinc-900 hover:text-zinc-600 underline underline-offset-4 decoration-zinc-200"
          >
            Clear search filter
          </button>
        </div>
      )}
    </div>
  );
}
