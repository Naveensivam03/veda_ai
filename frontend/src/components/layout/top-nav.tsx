'use client';

import React, { useMemo } from 'react';
import { ArrowLeft, Bell, Menu } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useTeacher } from '@/hooks/use-teacher';

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { teacher } = useTeacher();

  const sectionLabel = useMemo(() => {
    if (pathname.startsWith('/assignments/create')) {
      return 'Create Assignment';
    }

    if (pathname.startsWith('/papers/')) {
      return 'Assignment Paper';
    }

    if (pathname.startsWith('/assignments')) {
      return 'Assignments';
    }

    return 'Home';
  }, [pathname]);

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push(pathname.startsWith('/assignments') || pathname.startsWith('/papers') ? '/assignments' : '/');
  };

  return (
    <div className="space-y-4 mb-6 pt-5 md:pt-0">
      {/* Primary Global Nav Bar */}
      <div className="flex items-center justify-between bg-white rounded-[24px] md:rounded-[16px] h-[64px] md:h-[56px] px-6 py-3 shadow-[0_2px_15px_rgba(0,0,0,0.03)] font-[family-name:var(--font-bricolage)]">
        {/* Logo Area */}
        <div className="flex items-center gap-2">
          {/* Mobile Logo */}
          <Image 
            src="/navbar/mobileviewlogo.png" 
            alt="VedaAI Logo" 
            width={40} 
            height={40} 
            className="h-8 w-auto md:hidden"
            priority
          />
          {/* Desktop Logo */}
          <Image 
            src="/navbar/wholelogo.png" 
            alt="VedaAI Logo" 
            width={120} 
            height={36} 
            className="hidden md:block h-10 w-auto"
            priority
          />
        </div>

        {/* Action Area */}
        <div className="flex items-center gap-4 md:gap-6">
          <div className="relative cursor-pointer hover:opacity-80 transition-opacity">
            <Bell size={20} className="text-zinc-900" />
            <div className="absolute top-0 right-0 w-2 h-2 bg-[#FF7950] rounded-full border-2 border-white" />
          </div>
          
          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-zinc-100 cursor-pointer">
            <Image 
              src={teacher?.avatarUrl || "/navbar/Avatar.png"} 
              alt={teacher?.fullName || "User"} 
              width={32} 
              height={32} 
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>

          <button className="md:hidden text-zinc-900 cursor-pointer">
            <Menu size={24} />
          </button>
          
          <div className="hidden md:flex items-center gap-2 text-sm font-bold text-zinc-900 border-l border-zinc-100 pl-6">
            <span>{teacher?.fullName || "Loading..."}</span>
          </div>
        </div>
      </div>

      {/* Secondary Section Header (Mobile Only) */}
      <div className="md:hidden flex items-center justify-between px-2">
        <button 
          onClick={handleBack}
          className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm text-zinc-900 cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-lg font-bold text-[#272727] font-[family-name:var(--font-bricolage)]">
          {sectionLabel}
        </h2>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>
    </div>
  );
}

