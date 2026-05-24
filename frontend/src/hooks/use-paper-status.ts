'use client';

import { useEffect, useRef, useState } from 'react';
import { getAssignmentStatus } from '@/services/assignment.service';
import type { AssignmentGenerationStatus } from '@/types/assignment';

interface UsePaperStatusResult {
  status: AssignmentGenerationStatus | null;
  isPolling: boolean;
  error: string | null;
}

const POLLING_INTERVAL_MS = 2500;

export function usePaperStatus(assignmentId: string | null): UsePaperStatusResult {
  const [status, setStatus] = useState<AssignmentGenerationStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!assignmentId) {
      return;
    }

    let isActive = true;

    const clearPollingInterval = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    const pollStatus = async () => {
      try {
        const response = await getAssignmentStatus(assignmentId);

        if (!isActive) {
          return;
        }

        setStatus(response.status);
        setError(null);

        if (response.status === 'completed' || response.status === 'failed') {
          clearPollingInterval();
        }
      } catch (pollError) {
        if (!isActive) {
          return;
        }

        const message =
          pollError instanceof Error
            ? pollError.message
            : 'Unable to check assignment status.';

        setError(message);
        clearPollingInterval();
      }
    };

    void pollStatus();
    intervalRef.current = setInterval(() => {
      void pollStatus();
    }, POLLING_INTERVAL_MS);

    return () => {
      isActive = false;
      clearPollingInterval();
    };
  }, [assignmentId]);

  const isPolling =
    Boolean(assignmentId) &&
    !error &&
    status !== 'completed' &&
    status !== 'failed';

  return {
    status: assignmentId ? status : null,
    isPolling: assignmentId ? isPolling : false,
    error: assignmentId ? error : null,
  };
}
