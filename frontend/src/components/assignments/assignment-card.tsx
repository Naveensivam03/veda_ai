'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Eye, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface AssignmentCardProps {
  id: string;
  paperId: string;
  title: string;
  assignedDate: string;
  dueDate: string;
  onDelete: (id: string, paperId: string) => void;
}

export function AssignmentCard({
  id,
  paperId,
  title,
  assignedDate,
  dueDate,
  onDelete,
}: AssignmentCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative bg-white rounded-[24px] p-7 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-zinc-100 hover:border-zinc-200 transition-all group">
      <div className="flex justify-between items-start mb-8">
        <h3 className="text-xl font-bold text-[#272727] font-[family-name:var(--font-bricolage)] leading-tight max-w-[80%]">
          {title}
        </h3>
        
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`text-zinc-400 hover:text-zinc-600 transition-colors p-1 rounded-full ${isOpen ? 'bg-zinc-100 text-zinc-900' : ''} cursor-pointer`}
          >
            <MoreVertical size={24} />
          </button>
          
          {/* Interactive Dropdown */}
          {isOpen && (
            <div className="absolute top-10 right-0 z-50 w-56 bg-white rounded-[24px] shadow-2xl border border-zinc-100 p-2 flex flex-col gap-1 font-[family-name:var(--font-bricolage)] animate-in fade-in zoom-in-95 duration-200">
              <Link href={`/papers/${paperId}`} className="block w-full">
                <button className="flex items-center gap-3 px-4 py-3 text-base font-medium text-zinc-700 hover:bg-zinc-50 rounded-[18px] transition-colors text-left w-full cursor-pointer">
                  <Eye size={18} className="text-zinc-400" />
                  View Assignment
                </button>
              </Link>
              <button
                onClick={() => onDelete(id, paperId)}
                className="flex items-center gap-3 px-4 py-3 text-base font-medium text-red-500 hover:bg-red-50 rounded-[18px] transition-colors text-left w-full cursor-pointer"
              >
                <Trash2 size={18} className="text-red-400" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs font-medium text-zinc-400 font-[family-name:var(--font-bricolage)]">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-zinc-900">Assigned on :</span>
          <span>{assignedDate}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-zinc-900">Due :</span>
          <span>{dueDate}</span>
        </div>
      </div>
    </div>
  );
}
