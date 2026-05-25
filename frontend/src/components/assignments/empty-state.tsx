import React from 'react';
import Image from 'next/image';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 py-12 md:py-20 animate-in fade-in zoom-in-95 duration-700">
      {/* Illustration Wrapper */}
      <div className="relative w-full max-w-[420px] aspect-[4/3] mb-8">
        <Image 
          src="/navbar/center/Illustrations(1).png" 
          alt="No assignments illustration" 
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Content Section */}
      <div className="max-w-[500px] flex flex-col items-center">
        <h2 className="text-[28px] md:text-[32px] font-bold text-[#272727] mb-4 font-[family-name:var(--font-bricolage)] tracking-tight">
          No assignments yet
        </h2>
        
        <p className="text-zinc-500 leading-relaxed mb-12 text-sm md:text-base font-medium max-w-[460px]">
          Create your first assignment to start collecting and grading student submissions. 
          You can set up rubrics, define marking criteria, and let AI assist with grading.
        </p>
        
        <Link href="/assignments/create">
          <button className="inline-flex items-center gap-2 bg-[#171717] text-white px-10 py-4 rounded-full hover:bg-zinc-800 transition-all font-[family-name:var(--font-bricolage)] shadow-[0_10px_30px_rgba(0,0,0,0.15)] group cursor-pointer border border-white/10 active:scale-[0.98]">
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            <span className="font-semibold text-base">Create Your First Assignment</span>
          </button>
        </Link>
      </div>
    </div>
  );
}
