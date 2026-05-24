'use client';

import React, { useMemo } from 'react';
import { ArrowLeft, LayoutGrid, Bell, ChevronDown } from 'lucide-react';
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
    <div className="flex items-center justify-between bg-white/75 backdrop-blur-md rounded-[16px] h-[56px] px-6 py-3 shadow-sm mt-3 mb-6 font-[family-name:var(--font-bricolage)]">
      <div className="flex items-center gap-6">
        <button onClick={handleBack} className="text-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer">
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-2 text-zinc-400">
          <LayoutGrid size={20} />
          <span className="text-sm font-medium">{sectionLabel}</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative cursor-pointer">
          <Bell size={20} className="text-zinc-900" />
          <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </div>
        
        <div className="flex items-center gap-3 pl-6 border-l border-zinc-100 cursor-pointer group">
          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
            <Image 
              src={teacher?.avatarUrl || "/navbar/Avatar.png"} 
              alt={teacher?.fullName || "User"} 
              width={32} 
              height={32} 
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>
          <span className="text-sm font-bold text-zinc-900">{teacher?.fullName || "Loading..."}</span>
          <ChevronDown size={16} className="text-zinc-400 group-hover:text-zinc-900 transition-colors" />
        </div>
      </div>
    </div>
  );
}

