import React from 'react';
import { ChevronDown, X, Minus, Plus } from 'lucide-react';

interface QuestionTypeRowProps {
  type: string;
  count: number;
  marks: number;
}

export function QuestionTypeRow({ type, count, marks }: QuestionTypeRowProps) {
  return (
    <div className="flex items-center gap-4">
      {/* Type Dropdown */}
      <div className="flex-1 flex items-center justify-between px-6 py-3.5 bg-white border border-zinc-100 rounded-2xl cursor-pointer group hover:border-zinc-200 transition-colors">
        <span className="text-base font-medium text-zinc-700 font-[family-name:var(--font-inter)]">{type}</span>
        <ChevronDown size={20} className="text-zinc-400 group-hover:text-zinc-600 transition-colors" />
      </div>

      <button className="text-zinc-300 hover:text-zinc-500 transition-colors px-1">
        <X size={20} />
      </button>

      {/* Number of Questions Counter */}
      <div className="flex items-center gap-4 px-3 py-2 bg-zinc-50 border border-zinc-100 rounded-2xl w-32 justify-between">
        <button className="text-zinc-400 hover:text-zinc-900 transition-colors">
          <Minus size={16} />
        </button>
        <span className="text-base font-bold text-zinc-900 font-[family-name:var(--font-inter)]">{count}</span>
        <button className="text-zinc-400 hover:text-zinc-900 transition-colors">
          <Plus size={16} />
        </button>
      </div>

      {/* Marks Counter */}
      <div className="flex items-center gap-4 px-3 py-2 bg-zinc-50 border border-zinc-100 rounded-2xl w-32 justify-between">
        <button className="text-zinc-400 hover:text-zinc-900 transition-colors">
          <Minus size={16} />
        </button>
        <span className="text-base font-bold text-zinc-900 font-[family-name:var(--font-inter)]">{marks}</span>
        <button className="text-zinc-400 hover:text-zinc-900 transition-colors">
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}
