import React from 'react';

interface StudentInfoProps {
  gradeClass: string;
}

export function StudentInfo({ gradeClass }: StudentInfoProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 py-5 border-y border-dashed border-zinc-200 font-[family-name:var(--font-inter)] text-xs md:text-sm text-[#2E2E2E] select-none my-5">
      <div className="flex items-end gap-2">
        <span className="font-bold text-[#171717] shrink-0">Student Name:</span>
        <div className="flex-1 border-b border-zinc-300 min-h-[20px] mb-0.5" />
      </div>
      <div className="flex items-end gap-2">
        <span className="font-bold text-[#171717] shrink-0">Roll Number:</span>
        <div className="flex-1 border-b border-zinc-300 min-h-[20px] mb-0.5" />
      </div>
      <div className="flex items-end gap-2">
        <span className="font-bold text-[#171717] shrink-0">Class & Section:</span>
        <span className="font-semibold text-zinc-700 shrink-0">{gradeClass} -</span>
        <div className="flex-1 border-b border-zinc-300 min-h-[20px] mb-0.5" />
      </div>
    </div>
  );
}
