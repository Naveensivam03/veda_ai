import React from 'react';
import { Plus } from 'lucide-react';

export function QuestionConfigCard() {
  return (
    <div className="inline-flex items-center gap-3 select-none">
      <div className="h-8 w-8 rounded-full bg-[#1F1F1F] flex items-center justify-center shrink-0">
        <Plus className="text-white w-4 h-4" />
      </div>
      <span className="text-[14px] font-semibold text-[#2E2E2E] font-[family-name:var(--font-inter)] tracking-tight">
        Add Question Type
      </span>
    </div>
  );
}
