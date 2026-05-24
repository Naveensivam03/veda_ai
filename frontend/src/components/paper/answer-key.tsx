import React from 'react';
import { PaperSection } from '@/types/paper';

interface AnswerKeyProps {
  sections: PaperSection[];
}

export function AnswerKey({ sections }: AnswerKeyProps) {
  return (
    <div className="space-y-5 pt-8 mt-12 border-t border-dashed border-zinc-300 print:hidden">
      {/* Separator / Title */}
      <div className="text-center select-none pb-2">
        <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 block mb-1">
          Teacher Evaluation Resource
        </span>
        <h3 className="text-sm font-bold text-zinc-700 tracking-widest uppercase font-[family-name:var(--font-bricolage)]">
          ANSWER KEY & SOLUTION CRITERIA
        </h3>
      </div>

      {/* Answer solutions list */}
      <div className="space-y-3.5 font-[family-name:var(--font-inter)] text-xs md:text-sm text-zinc-500 leading-relaxed pl-1 md:pl-2">
        {sections.flatMap((section) =>
          section.questions.map((question) => (
            <div key={question.id} className="flex items-start gap-3">
              <span className="font-bold text-[#171717] w-10 shrink-0 text-right select-none">
                Ans {question.number}.
              </span>
              <p className="flex-1 text-justify font-medium">{question.answerKey}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
