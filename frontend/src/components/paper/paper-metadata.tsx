import React from 'react';
import { Paper } from '@/types/paper';

interface PaperMetadataProps {
  paper: Paper;
}

export function PaperMetadata({ paper }: PaperMetadataProps) {
  return (
    <div className="space-y-4 font-[family-name:var(--font-inter)] select-none">
      {/* Time & Marks Metadata Row */}
      <div className="flex items-center justify-between text-xs md:text-sm text-[#2E2E2E] font-semibold border-b border-zinc-100 pb-3">
        <div className="flex items-center gap-1.5">
          <span className="text-zinc-400 font-bold uppercase tracking-wider text-[10px] md:text-[11px]">Time Allowed:</span>
          <span className="text-[#171717] font-bold">{paper.duration} minutes</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-zinc-400 font-bold uppercase tracking-wider text-[10px] md:text-[11px]">Maximum Marks:</span>
          <span className="text-[#171717] font-bold">{paper.totalMarks}</span>
        </div>
      </div>

      {/* Instructions list */}
      {paper.instructions.length > 0 && (
        <div className="bg-zinc-50/30 rounded-2xl p-4 border border-zinc-100 text-left space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-1">
            General Instructions:
          </span>
          <ul className="list-decimal pl-4.5 space-y-1 text-xs md:text-[13px] font-medium text-zinc-500 leading-relaxed">
            {paper.instructions.map((inst, idx) => (
              <li key={idx}>{inst}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
