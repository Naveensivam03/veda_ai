import React from 'react';
import { UploadCloud } from 'lucide-react';

export function UploadZone() {
  return (
    <div className="w-full border-2 border-dashed border-zinc-200 rounded-[24px] p-10 flex flex-col items-center justify-center bg-white/30 hover:border-zinc-300 transition-colors">
      <div className="bg-white rounded-full p-4 shadow-sm mb-4">
        <UploadCloud size={32} className="text-zinc-400" />
      </div>
      <h4 className="text-lg font-bold text-[#272727] font-[family-name:var(--font-bricolage)]">
        Choose a file or drag & drop it here
      </h4>
      <p className="text-zinc-400 text-sm mt-1 mb-6 font-[family-name:var(--font-inter)]">
        JPEG, PNG, upto 10MB
      </p>
      <button className="px-6 py-2.5 bg-zinc-50 border border-zinc-100 rounded-full text-sm font-semibold text-[#272727] hover:bg-zinc-100 transition-colors font-[family-name:var(--font-bricolage)] shadow-sm">
        Browse Files
      </button>
    </div>
  );
}
