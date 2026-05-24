import React from 'react';
import { PaperQuestion } from '@/types/paper';
import { DifficultyBadge } from './difficulty-badge';

interface QuestionRowProps {
  question: PaperQuestion;
}

export function QuestionRow({ question }: QuestionRowProps) {
  return (
    <div className="py-4 border-b border-zinc-100/50 last:border-b-0 flex items-start gap-3 md:gap-4 font-[family-name:var(--font-inter)] text-sm text-[#2E2E2E] leading-relaxed">
      {/* Question Number */}
      <span className="font-bold text-[#171717] w-8 shrink-0 text-right select-none">
        Q{question.number}.
      </span>

      {/* Content Area */}
      <div className="flex-1 space-y-3">
        <div className="flex items-start justify-between gap-3 flex-wrap md:flex-nowrap">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            {/* Difficulty Badge */}
            <DifficultyBadge difficulty={question.difficulty} />
            
            {/* Question Text */}
            <p className="font-semibold text-[#2E2E2E] text-justify leading-relaxed">
              {question.text}
            </p>
          </div>
          
          {/* Marks */}
          <span className="text-[11px] font-bold text-zinc-400 border border-zinc-100 bg-zinc-50/50 rounded px-2.5 py-0.5 leading-none shrink-0 select-none">
            [{question.marks} {question.marks === 1 ? 'Mark' : 'Marks'}]
          </span>
        </div>

        {/* Options (for Multiple Choice Questions) */}
        {question.options && question.options.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 pl-2 pt-1 text-zinc-500 font-medium">
            {question.options.map((option, idx) => (
              <div key={idx} className="flex items-center gap-2 text-[13px]">
                <span className="font-semibold">{option}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
