import React from 'react';
import { PaperQuestion } from '@/types/paper';

interface QuestionRowProps {
  question: PaperQuestion;
  index: number;
}

export function QuestionRow({ question, index }: QuestionRowProps) {
  return (
    <div className="flex items-start gap-2 font-[family-name:var(--font-inter)] text-sm md:text-base text-[#2E2E2E] leading-relaxed py-1">
      {/* Question Number */}
      <span className="shrink-0">{index}.</span>

      {/* Content Area */}
      <div className="flex-1">
        {/* Difficulty & Text & Marks Inline */}
        <span className="font-normal">
          [{question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}] {question.text}
        </span>
        <span className="font-normal whitespace-nowrap ml-1">
          [{question.marks} {question.marks === 1 ? 'Mark' : 'Marks'}]
        </span>

        {/* Options (for Multiple Choice Questions) */}
        {question.options && question.options.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1.5 mt-2.5 text-[#2E2E2E]">
            {question.options.map((option, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span>{option}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
