import React from 'react';
import Link from 'next/link';

interface SidebarNavItemProps {
  label: string;
  active?: boolean;
  icon: React.ReactNode;
  href: string;
}

export function SidebarNavItem({ label, active, icon, href }: SidebarNavItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors cursor-pointer font-[family-name:var(--font-bricolage)] ${
        active
          ? 'bg-[#f0f0f0] text-zinc-900 font-medium'
          : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
      }`}
    >
      <div className={`w-6 h-6 flex items-center justify-center ${active ? 'text-zinc-900' : 'text-zinc-400'}`}>
        {icon}
      </div>
      <span className="text-base">{label}</span>
    </Link>
  );
}
