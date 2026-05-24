'use client';

import { GeneratedPaperResponse } from '@/lib/paper-generation';

const STORAGE_KEY = 'generated-paper-responses';

export function saveGeneratedPaper(response: GeneratedPaperResponse) {
  if (typeof window === 'undefined') {
    return;
  }

  const storedValue = window.localStorage.getItem(STORAGE_KEY);
  const parsed = storedValue ? (JSON.parse(storedValue) as Record<string, GeneratedPaperResponse>) : {};

  parsed[response.paper._id] = response;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
}

export function loadGeneratedPaper(paperId: string) {
  if (typeof window === 'undefined') {
    return null;
  }

  const storedValue = window.localStorage.getItem(STORAGE_KEY);

  if (!storedValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(storedValue) as Record<string, GeneratedPaperResponse>;
    return parsed[paperId] ?? null;
  } catch {
    return null;
  }
}

export function deleteGeneratedPaper(paperId: string) {
  if (typeof window === 'undefined') {
    return;
  }

  const storedValue = window.localStorage.getItem(STORAGE_KEY);

  if (!storedValue) {
    return;
  }

  try {
    const parsed = JSON.parse(storedValue) as Record<string, GeneratedPaperResponse>;
    delete parsed[paperId];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}
