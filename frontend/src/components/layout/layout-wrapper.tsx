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
  const isLoginPage = pathname === '/login';

  return (
    <AuthGuard>
      {isLoginPage ? (
        <main className="w-full min-h-screen relative overflow-hidden bg-[#171717]">
          {children}
        </main>
      ) : (
        <div className="mx-auto flex max-w-[1440px] min-h-screen relative print:block print:max-w-none print:w-full">
          <div className="print:hidden shrink-0">
            <Sidebar />
          </div>
          <main className="flex-1 ml-[327px] pr-[13px] pb-10 print:ml-0 print:pr-0 print:pb-0 print:w-full">
            {children}
          </main>
        </div>
      )}
    </AuthGuard>
  );
}
