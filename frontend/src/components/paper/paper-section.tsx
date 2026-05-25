import React from 'react';
import type { PaperSection } from '@/types/paper';
import { QuestionRow } from './question-row';

interface PaperSectionProps {
  section: PaperSection;
}

export function PaperSection({ section }: PaperSectionProps) {
  return (
    <div className="space-y-6 pt-4">
      {/* Section Identifier (e.g. Section A) */}
      <div className="text-center select-none py-4">
        <h3 className="text-xl md:text-2xl font-bold text-[#171717] font-[family-name:var(--font-bricolage)]">
          {section.title}
        </h3>
      </div>

      {/* Section Heading & Instructions */}
      <div className="space-y-1 select-none">
        <h4 className="text-base md:text-lg font-bold text-[#171717]">
          {section.type === 'mcq' ? 'Multiple Choice Questions' : 
           section.type === 'short' ? 'Short Answer Questions' : 
           section.type === 'long' ? 'Long/Essay Questions' : 'True / False Questions'}
        </h4>
        {section.instruction && (
          <p className="text-sm md:text-base font-medium text-zinc-500 italic">
            {section.instruction}
          </p>
        )}
      </div>

      {/* Question List */}
      <div className="space-y-4">
        {section.questions.map((question, idx) => (
          <QuestionRow key={question.id} question={question} index={idx + 1} />
        ))}
      </div>
    </div>
  );
}
