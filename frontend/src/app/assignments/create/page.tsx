import React from 'react';
import { TopNav } from '@/components/layout/top-nav';
import { AssignmentForm } from '@/components/assignments/assignment-form';

export default function CreateAssignmentPage() {
  return (
    <div className="flex flex-col min-h-screen font-[family-name:var(--font-inter)] selection:bg-zinc-200/50 relative overflow-hidden">
      {/* Decorative soft glowing glassmorphism backdrops */}
      <div className="absolute top-[20%] left-[10%] w-[380px] h-[380px] rounded-full bg-[#FF7950]/4 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[15%] right-[5%] w-[480px] h-[480px] rounded-full bg-[#4BC26D]/5 blur-[150px] pointer-events-none" />
      
      <TopNav />
      
      {/* Create Assignment Workspace */}
      <div className="flex-1 max-w-[810px] w-full mx-auto pb-16 px-4 md:px-0 relative z-10">
        
        {/* TOP: Page title section */}
        <div className="mb-10 animate-in fade-in slide-in-from-top-3 duration-500">
          <div className="flex items-center gap-3.5 mb-2">
            <span className="w-3.5 h-3.5 rounded-full bg-[#4BC26D] ring-[6px] ring-[#4BC26D]/20 shadow-sm shrink-0" />
            <h1 className="text-2xl md:text-[28px] font-bold text-[#272727] font-[family-name:var(--font-bricolage)] leading-none tracking-tight">
              Create Assignment
            </h1>
          </div>
          <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider ml-[30px] font-[family-name:var(--font-inter)]">
            Set up a new assignment for your students
          </p>
        </div>

        {/* CENTER & BOTTOM: Large glass assignment configuration card + controls */}
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150">
          <AssignmentForm />
        </div>
      </div>
    </div>
  );
}
