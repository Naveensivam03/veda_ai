import React from 'react';
import { Paper } from '@/types/paper';

interface PaperHeaderProps {
  paper: Paper;
}

export function PaperHeader({ paper }: PaperHeaderProps) {
  return (
    <div className="text-center space-y-1.5 select-none pb-8">
      <h2 className="text-xl md:text-2xl font-bold text-[#171717] font-[family-name:var(--font-bricolage)] leading-tight tracking-tight">
        {paper.schoolName}
      </h2>
      <div className="flex flex-col gap-1 text-sm md:text-base font-semibold text-[#272727] font-[family-name:var(--font-inter)]">
        <p>Subject: {paper.subject}</p>
        <p>Class: {paper.grade}</p>
      </div>
    </div>
  );
}
