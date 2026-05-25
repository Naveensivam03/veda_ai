'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Read state from localStorage on client-side mount
    const loggedIn = localStorage.getItem('vedaai_logged_in') === 'true';
    setIsLoggedIn(loggedIn);

    if (!loggedIn && pathname !== '/login' && pathname !== '/admin') {
      router.push('/login');
    } else if (loggedIn && pathname === '/login') {
      router.push('/');
    }
  }, [pathname, router]);

  // Prevent layout flashes while resolving session state
  if (isLoggedIn === null && pathname !== '/admin') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#171717] font-[family-name:var(--font-inter)] select-none">
        <div className="relative w-12 h-12 mb-4">
          <div className="absolute inset-0 rounded-full border-4 border-zinc-800" />
          <div className="absolute inset-0 rounded-full border-4 border-t-[#FF7950] animate-spin" />
        </div>
        <p className="text-zinc-500 font-semibold text-xs tracking-wider uppercase">
          Verifying teacher session...
        </p>
      </div>
    );
  }

  // Allow showing login page or admin console to unauthenticated users, or protected pages to authenticated users
  if (!isLoggedIn && pathname !== '/login' && pathname !== '/admin') {
    return null; // Will trigger redirect in useEffect
  }

  if (isLoggedIn && pathname === '/login') {
    return null; // Will trigger redirect in useEffect
  }

  return <>{children}</>;
}
