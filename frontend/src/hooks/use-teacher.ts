'use client';

import { useState, useEffect } from 'react';
import { getDashboard } from '@/services/dashboard.service';
import { currentTeacher } from '@/lib/current-teacher';
import type { TeacherSummary } from '@/types/dashboard';

export function useTeacher() {
  const [teacher, setTeacher] = useState<TeacherSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadTeacher() {
      try {
        const data = await getDashboard(currentTeacher.teacherId);
        if (active) {
          setTeacher(data.teacher);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Failed to fetch teacher context');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadTeacher();

    // Listen for custom event to trigger re-fetch of teacher context/credits
    const handleCreditsUpdate = () => {
      void loadTeacher();
    };

    window.addEventListener('credits-updated', handleCreditsUpdate);

    return () => {
      active = false;
      window.removeEventListener('credits-updated', handleCreditsUpdate);
    };
  }, []);

  return { teacher, loading, error };
}
