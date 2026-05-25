import React from 'react';
import { PaperSection } from '@/types/paper';

interface AnswerKeyProps {
  sections: PaperSection[];
}

export function AnswerKey({ sections }: AnswerKeyProps) {
  const allQuestions = sections.flatMap((section) => section.questions);

  return (
    <div className="space-y-6 pt-12 mt-12 border-t border-zinc-200">
      <div className="text-center font-bold text-[#171717] py-4 uppercase tracking-wider text-sm select-none">
        End of Question Paper
      </div>

      <div className="space-y-4 font-[family-name:var(--font-inter)]">
        <h3 className="text-base md:text-lg font-bold text-[#171717] select-none">
          Answer Key:
        </h3>
        <div className="space-y-3 text-sm md:text-base text-[#2E2E2E] leading-relaxed">
          {allQuestions.map((question, idx) => (
            <div key={question.id} className="flex items-start gap-2">
              <span className="shrink-0">{idx + 1}.</span>
              <p className="flex-1">{question.answerKey}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
