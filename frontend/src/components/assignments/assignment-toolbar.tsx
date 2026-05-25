import React from 'react';
import { Filter, Search } from 'lucide-react';

interface AssignmentToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function AssignmentToolbar({ searchQuery, onSearchChange }: AssignmentToolbarProps) {
  return (
    <div className="flex items-center bg-white border border-zinc-200/60 rounded-full h-12 md:h-14 px-6 md:px-8 mb-8 md:mb-10 shadow-[0_2px_15px_rgba(0,0,0,0.02)] transition-all focus-within:border-zinc-300">
      {/* Left side: Filter By */}
      <div className="flex items-center gap-2 text-zinc-400 font-[family-name:var(--font-inter)] text-sm md:text-base cursor-pointer hover:text-zinc-600 transition-colors pr-4 border-r border-zinc-100">
        <Filter size={18} className="text-zinc-300" />
        <span className="font-medium hidden md:inline">Filter By</span>
        <span className="font-medium md:hidden">Filter</span>
      </div>

      {/* Right side: Search Assignment */}
      <div className="flex items-center gap-3 pl-4 flex-1">
        <Search size={18} className="text-zinc-300 shrink-0" />
        <input 
          type="text" 
          placeholder="Search Name" 
          className="bg-transparent border-none outline-none placeholder:text-zinc-300 text-zinc-600 w-full text-sm font-medium font-[family-name:var(--font-inter)]"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}
