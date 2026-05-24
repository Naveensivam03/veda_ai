import React from 'react';
import { PaperDifficulty } from '@/types/paper';

interface DifficultyBadgeProps {
  difficulty: PaperDifficulty;
}

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const styles = {
    easy: 'text-zinc-400 border-zinc-100 bg-zinc-50/30',
    medium: 'text-zinc-500 border-zinc-200/50 bg-zinc-50/60',
    hard: 'text-zinc-600 border-zinc-200 bg-zinc-100/50'
  };
  const labels = {
    easy: 'Easy',
    medium: 'Moderate',
    hard: 'Challenging'
  };

  return (
    <span className={`text-[9px] md:text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded border leading-none ${styles[difficulty]} select-none inline-flex items-center`}>
      {labels[difficulty]}
    </span>
  );
}
