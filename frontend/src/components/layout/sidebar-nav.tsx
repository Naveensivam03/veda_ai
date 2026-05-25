'use client';

import React from 'react';
import { LayoutGrid, FileText } from 'lucide-react';
import { SidebarNavItem } from './sidebar-nav-item';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export function SidebarNav() {
  const pathname = usePathname();
  const navItems = [
    { label: 'Assignments', icon: <FileText size={22} />, href: '/assignments', active: pathname.startsWith('/assignments') || pathname.startsWith('/papers') },
    { 
      label: 'My Groups', 
      href: '/groups',
      icon: <Image src="/navbar/mygroup.png" alt="" width={22} height={22} style={{ width: 'auto', height: 'auto' }} />, 
      active: pathname.startsWith('/groups')
    },
    { 
      label: 'AI Teacher\'s Toolkit', 
      href: '/toolkit',
      icon: <Image src="/navbar/ai-toolkit.png" alt="" width={22} height={22} style={{ width: 'auto', height: 'auto' }} />, 
      active: pathname.startsWith('/toolkit')
    },
    { 
      label: 'My Library', 
      href: '/library',
      icon: <Image src="/navbar/library.png" alt="" width={22} height={22} style={{ width: 'auto', height: 'auto' }} />, 
      active: pathname.startsWith('/library'),
      badge: 32
    },
  ];

  return (
    <nav className="flex flex-col gap-2 px-1">
      {navItems.map((item, index) => (
        <div key={index} className="relative">
          <SidebarNavItem
            label={item.label}
            icon={item.icon}
            active={item.active}
            href={item.href}
          />
          {item.badge && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#FF7950] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md min-w-[20px] text-center">
              {item.badge}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
