import React from 'react';
import type { PaperSection } from '@/types/paper';
import { QuestionRow } from './question-row';

interface PaperSectionProps {
  section: PaperSection;
}

export function PaperSection({ section }: PaperSectionProps) {
  return (
    <div className="space-y-4 pt-6">
      {/* Section Header */}
      <div className="text-center space-y-1 pb-2 border-b border-[#171717] mt-6 select-none">
        <h3 className="text-sm font-bold text-[#171717] tracking-widest uppercase font-[family-name:var(--font-bricolage)]">
          {section.title}
        </h3>
        {section.instruction && (
          <p className="text-[11px] font-semibold text-zinc-400 font-[family-name:var(--font-inter)] italic">
            ({section.instruction})
          </p>
        )}
      </div>

      {/* Question List */}
      <div className="divide-y divide-zinc-100/60">
        {section.questions.map((question) => (
          <QuestionRow key={question.id} question={question} />
        ))}
      </div>
    </div>
  );
}
