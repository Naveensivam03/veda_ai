import React from 'react';
import { Filter, Search } from 'lucide-react';

interface AssignmentToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function AssignmentToolbar({ searchQuery, onSearchChange }: AssignmentToolbarProps) {
  return (
    <div className="flex items-center justify-between bg-white border border-zinc-200/60 rounded-full px-8 py-3 mb-10 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
      {/* Left side: Filter By */}
      <div className="flex items-center gap-3 text-zinc-400 font-[family-name:var(--font-bricolage)] text-base cursor-pointer hover:text-zinc-600 transition-colors">
        <Filter size={20} className="text-zinc-300" />
        <span className="font-medium">Filter By</span>
      </div>

      {/* Right side: Search Assignment with Pill Border */}
      <div className="flex items-center gap-3 text-zinc-400 font-[family-name:var(--font-bricolage)] text-base border border-zinc-200 rounded-full px-5 py-2 focus-within:border-zinc-400 transition-colors">
        <Search size={20} className="text-zinc-300" />
        <input 
          type="text" 
          placeholder="Search Assignment" 
          className="bg-transparent border-none outline-none placeholder:text-zinc-300 text-zinc-600 w-48 text-sm"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}
