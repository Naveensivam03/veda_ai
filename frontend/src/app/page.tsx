'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect immediately to the Create Assignment page
    router.replace('/assignments/create');
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#171717] font-[family-name:var(--font-inter)] select-none">
      <div className="relative w-12 h-12 mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-zinc-800" />
        <div className="absolute inset-0 rounded-full border-4 border-t-[#FF7950] animate-spin" />
      </div>
      <p className="text-zinc-500 font-semibold text-xs tracking-wider uppercase">
        Loading creator workspace...
      </p>
    </div>
  );
}
