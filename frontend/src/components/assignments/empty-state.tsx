import React from 'react';
import Image from 'next/image';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4">
      {/* Simplified Illustration Wrapper */}
      <div className="relative w-[320px] h-[320px] mb-8">
        <Image 
          src="/navbar/center/Illustrations(1).png" 
          alt="No assignments illustration" 
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Content Section */}
      <div className="max-w-[460px]">
        <h2 className="text-[28px] font-bold text-[#272727] mb-3 font-[family-name:var(--font-bricolage)]">
          No assignments yet
        </h2>
        
        <p className="text-zinc-500 leading-relaxed mb-10 text-sm font-medium">
          Create your first assignment to start collecting and grading student submissions. 
          You can set up rubrics, define marking criteria, and let AI assist with grading.
        </p>
        
        <Link href="/assignments/create">
          <button className="inline-flex items-center gap-2 bg-[#171717] text-white px-8 py-4 rounded-full hover:bg-zinc-800 transition-all font-[family-name:var(--font-bricolage)] shadow-lg group cursor-pointer">
            <Plus size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-base">Create Your First Assignment</span>
          </button>
        </Link>
      </div>
    </div>
  );
}
