import React from 'react';
import { Paper } from '@/types/paper';

interface PaperHeaderProps {
  paper: Paper;
}

export function PaperHeader({ paper }: PaperHeaderProps) {
  return (
    <div className="text-center space-y-2 select-none pb-4 border-b border-zinc-200">
      <h2 className="text-base md:text-lg font-bold text-[#171717] font-[family-name:var(--font-bricolage)] leading-snug tracking-tight uppercase">
        {paper.schoolName}
      </h2>
      <p className="text-sm font-semibold text-[#171717] font-[family-name:var(--font-inter)]">
        {paper.paperTitle}
      </p>
      <div className="flex items-center justify-center gap-4 text-xs font-semibold text-zinc-400 font-[family-name:var(--font-inter)] uppercase tracking-wider">
        <span>Class: {paper.grade}</span>
        <span className="w-1 h-1 rounded-full bg-zinc-300" />
        <span>Subject: {paper.subject}</span>
      </div>
    </div>
  );
}
