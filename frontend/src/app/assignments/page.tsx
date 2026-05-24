'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TopNav } from '@/components/layout/top-nav';
import { AssignmentToolbar } from '@/components/assignments/assignment-toolbar';
import { AssignmentGrid } from '@/components/assignments/assignment-grid';
import { Plus } from 'lucide-react';

export default function AssignmentsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex flex-col min-h-screen font-[family-name:var(--font-inter)] selection:bg-zinc-200/50 relative overflow-hidden pb-16">
      {/* Decorative soft glowing glassmorphism backdrops */}
      <div className="absolute top-[20%] left-[10%] w-[380px] h-[380px] rounded-full bg-[#FF7950]/4 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[15%] right-[5%] w-[480px] h-[480px] rounded-full bg-[#4BC26D]/5 blur-[150px] pointer-events-none" />
      
      <div className="relative z-10">
        <TopNav />
      </div>
      
      {/* Header Section */}
      <div className="mb-8 relative z-10 animate-in fade-in slide-in-from-top-3 duration-500">
        <div className="flex items-center gap-3.5 mb-2">
          <span className="w-3.5 h-3.5 rounded-full bg-[#4BC26D] ring-[6px] ring-[#4BC26D]/20 shadow-sm shrink-0" />
          <h1 className="text-2xl md:text-[28px] font-bold text-[#272727] font-[family-name:var(--font-bricolage)] leading-none tracking-tight">
            Assignments
          </h1>
        </div>
        <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider ml-[30px] font-[family-name:var(--font-inter)]">
          Manage and create assignments for your classes
        </p>
      </div>

      <div className="relative z-10 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150">
        <AssignmentToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <AssignmentGrid searchQuery={searchQuery} />
      </div>

      {/* Floating Create Assignment Button */}
      <div className="fixed bottom-12 left-[calc(327px+(1100px/2))] -translate-x-1/2 z-50">
        <Link href="/assignments/create" className="block">
          <button className="flex items-center gap-3.5 bg-[#171717] text-white px-10 py-5 rounded-full hover:bg-zinc-800 transition-all font-[family-name:var(--font-bricolage)] shadow-[0_15px_40px_rgba(0,0,0,0.3)] group border border-white/10 cursor-pointer">
            <Plus size={24} className="group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-lg">Create Assignment</span>
          </button>
        </Link>
      </div>
    </div>
  );
}
