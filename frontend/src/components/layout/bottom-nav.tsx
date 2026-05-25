'use client';

import React from 'react';
import { LayoutGrid, FileText, Library, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { icon: LayoutGrid, label: 'Home', href: '/' },
    { icon: FileText, label: 'My Groups', href: '/assignments' },
    { icon: Library, label: 'Library', href: '/library' },
    { icon: Sparkles, label: 'AI Toolkit', href: '/toolkit' },
  ];

  return (
    <div className="md:hidden fixed bottom-6 left-6 right-6 z-50">
      <div className="bg-[#171717] rounded-[32px] px-4 py-3 shadow-2xl flex items-center justify-around border border-white/10">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${
                isActive ? 'text-white scale-110' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <div className={`p-1 ${isActive ? 'relative' : ''}`}>
                <Icon size={20} className={isActive ? 'text-white' : ''} />
                {isActive && (
                   <div className="absolute -top-1 -right-1 w-1 h-1 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                )}
              </div>
              <span className={`text-[10px] font-bold font-[family-name:var(--font-inter)] tracking-tight ${
                isActive ? 'text-white' : 'text-zinc-500'
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
