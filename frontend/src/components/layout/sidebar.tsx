import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SidebarHeader } from './sidebar-header';
import { SidebarNav } from './sidebar-nav';
import { SidebarFooter } from './sidebar-footer';

export function Sidebar() {
  return (
    <aside className="fixed w-[315px] h-[calc(100vh-24px)] left-3 top-3 bg-white rounded-[16px] p-8 flex flex-col gap-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100/50">
      <SidebarHeader />
      
      {/* Create Assignment Button with Bolder Gradient Border and Inter Font */}
      <Link href="/assignments/create" className="relative p-[3px] rounded-full bg-gradient-to-r from-[#FF7950] to-[#C0350A] block">
        <button className="flex items-center justify-center gap-3 w-full py-3.5 bg-[#272727] text-white rounded-full hover:bg-[#333333] transition-all font-[family-name:var(--font-inter)] shadow-md px-6 cursor-pointer">
          <Image 
            src="/navbar/createassign.png" 
            alt="" 
            width={22} 
            height={22} 
            className="brightness-0 invert" 
          />
          <span className="text-sm font-semibold tracking-wide">Create Assignment</span>
        </button>
      </Link>

      <SidebarNav />

      <SidebarFooter />
    </aside>
  );
}
