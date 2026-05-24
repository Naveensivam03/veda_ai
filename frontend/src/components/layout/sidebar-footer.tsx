'use client';

import React from 'react';
import { Settings } from 'lucide-react';
import { SidebarNavItem } from './sidebar-nav-item';
import Image from 'next/image';
import { useTeacher } from '@/hooks/use-teacher';

export function SidebarFooter() {
  const { teacher } = useTeacher();

  return (
    <div className="mt-auto flex flex-col gap-5 px-1 font-[family-name:var(--font-inter)]">
      {teacher && (
        <div className="flex flex-col gap-1.5 p-4 rounded-2xl bg-zinc-50 border border-zinc-100 shadow-sm">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-[family-name:var(--font-inter)]">
            AI Generations Remaining
          </span>
          <div className="flex items-center justify-between">
            <span className={`text-base font-extrabold font-[family-name:var(--font-bricolage)] ${
              teacher.generationCredits <= 0 ? 'text-red-500 animate-pulse' : 'text-zinc-800'
            }`}>
              {teacher.generationCredits} / 3
            </span>
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
              teacher.generationCredits <= 0 
                ? 'bg-red-100 text-red-700' 
                : 'bg-zinc-950 text-white'
            }`}>
              {teacher.generationCredits <= 0 ? 'Limit Reached' : 'Demo Limit'}
            </span>
          </div>
        </div>
      )}

      <SidebarNavItem
        label="Settings"
        icon={<Settings size={22} />}
        active={false}
        href="/settings"
      />
      
      <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-100 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0 border border-zinc-200/50">
          <Image 
            src={teacher?.school?.logoUrl || "/navbar/Avatar.png"} 
            alt={teacher?.school?.name || "School Avatar"} 
            width={48} 
            height={48} 
            className="w-full h-full object-cover"
            unoptimized
          />
        </div>
        <div className="flex flex-col overflow-hidden font-[family-name:var(--font-bricolage)]">
          <span className="text-sm font-bold text-zinc-900 truncate" title={teacher?.school?.name}>
            {teacher?.school?.name || "Loading..."}
          </span>
          <span className="text-xs text-zinc-500 truncate font-medium">
            {teacher?.school?.city || "Please wait..."}
          </span>
        </div>
      </div>
    </div>
  );
}

