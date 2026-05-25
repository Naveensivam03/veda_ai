import React from 'react';

interface StudentInfoProps {
  gradeClass: string;
}

export function StudentInfo({ gradeClass }: StudentInfoProps) {
  return (
    <div className="space-y-3 py-6 font-[family-name:var(--font-inter)] text-sm text-[#2E2E2E] select-none">
      <div className="flex items-center gap-2 max-w-[300px]">
        <span className="font-semibold text-[#171717] shrink-0">Name:</span>
        <div className="flex-1 border-b border-zinc-400 min-h-[1px] translate-y-1.5" />
      </div>
      <div className="flex items-center gap-2 max-w-[300px]">
        <span className="font-semibold text-[#171717] shrink-0">Roll Number:</span>
        <div className="flex-1 border-b border-zinc-400 min-h-[1px] translate-y-1.5" />
      </div>
      <div className="flex items-center gap-2 max-w-[300px]">
        <span className="font-semibold text-[#171717] shrink-0">Class: {gradeClass} Section:</span>
        <div className="flex-1 border-b border-zinc-400 min-h-[1px] translate-y-1.5" />
      </div>
    </div>
  );
}
