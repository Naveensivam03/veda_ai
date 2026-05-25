import React from 'react';
import { Paper } from '@/types/paper';

interface PaperMetadataProps {
  paper: Paper;
}

export function PaperMetadata({ paper }: PaperMetadataProps) {
  return (
    <div className="space-y-6 font-[family-name:var(--font-inter)] select-none mt-6">
      {/* Time & Marks Metadata Row */}
      <div className="flex items-center justify-between text-sm md:text-base font-semibold text-[#171717]">
        <p>Time Allowed: {paper.duration} minutes</p>
        <p>Maximum Marks: {paper.totalMarks}</p>
      </div>

      {/* Primary Instruction Line */}
      <div className="text-sm md:text-base font-medium text-[#272727]">
        {paper.instructions && paper.instructions.length > 0 ? (
          <p>{paper.instructions[0]}</p>
        ) : (
          <p>All questions are compulsory unless stated otherwise.</p>
        )}
      </div>
    </div>
  );
}
