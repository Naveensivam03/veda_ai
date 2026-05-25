'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './sidebar';
import { AuthGuard } from './auth-guard';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const isCleanCanvas = pathname === '/login' || pathname === '/admin';

  return (
    <AuthGuard>
      {isCleanCanvas ? (
        <main className="w-full min-h-screen relative overflow-hidden bg-[#171717]">
          {children}
        </main>
      ) : (
        <div className="mx-auto flex max-w-[1440px] min-h-screen relative print:block print:max-w-none print:w-full">
          {/* Sidebar - Hidden on mobile, fixed width on desktop */}
          <div className="hidden md:block print:hidden shrink-0">
            <Sidebar />
          </div>
          
          {/* Main Content Area - Full width on mobile, margined on desktop */}
          <main className="flex-1 w-full px-4 md:px-0 md:ml-[327px] md:pr-[13px] pb-10 print:ml-0 print:pr-0 print:pb-0 print:w-full">
            {children}
          </main>
        </div>
      )}
    </AuthGuard>
  );
}
