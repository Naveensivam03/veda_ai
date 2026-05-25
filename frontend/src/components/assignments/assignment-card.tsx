import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Eye, Trash2, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { AssignmentStatus } from '@/types/assignment';

interface AssignmentCardProps {
  id: string;
  paperId: string | null;
  title: string;
  assignedDate: string;
  dueDate: string;
  status: AssignmentStatus;
  onDelete: (id: string) => void;
}

export function AssignmentCard({
  id,
  paperId,
  title,
  assignedDate,
  dueDate,
  status,
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

  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 size={14} className="text-[#4BC26D]" />;
      case 'generating':
        return <Loader2 size={14} className="text-blue-500 animate-spin" />;
      case 'failed':
        return <AlertCircle size={14} className="text-red-500" />;
      default:
        return <Clock size={14} className="text-zinc-400" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'generating':
        return 'Generating...';
      case 'failed':
        return 'Failed';
      default:
        return 'Draft';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'bg-[#4BC26D]/10 text-[#4BC26D] border-[#4BC26D]/20';
      case 'generating':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'failed':
        return 'bg-red-50 text-red-600 border-red-100';
      default:
        return 'bg-zinc-50 text-zinc-500 border-zinc-100';
    }
  };

  return (
    <div className="relative bg-white rounded-[32px] p-6 md:p-7 shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-zinc-100 hover:border-zinc-200 transition-all group">
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1 mr-4">
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9px] font-bold uppercase tracking-wider mb-3 ${getStatusColor()}`}>
            {getStatusIcon()}
            {getStatusText()}
          </div>
          <h3 className="text-lg md:text-xl font-bold text-[#272727] font-[family-name:var(--font-bricolage)] leading-tight">
            {title}
          </h3>
        </div>
        
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`text-zinc-400 hover:text-zinc-600 transition-colors p-1 rounded-full ${isOpen ? 'bg-zinc-100 text-zinc-900' : ''} cursor-pointer`}
          >
            <MoreVertical size={22} />
          </button>
          
          {/* Interactive Dropdown */}
          {isOpen && (
            <div className="absolute top-10 right-0 z-50 w-56 bg-white rounded-[24px] shadow-2xl border border-zinc-100 p-2 flex flex-col gap-1 font-[family-name:var(--font-bricolage)] animate-in fade-in zoom-in-95 duration-200">
              {status === 'completed' ? (
                <Link href={`/papers/${id}`} className="block w-full">
                  <button className="flex items-center gap-3 px-4 py-3 text-base font-medium text-zinc-700 hover:bg-zinc-50 rounded-[18px] transition-colors text-left w-full cursor-pointer">
                    <Eye size={18} className="text-zinc-400" />
                    View Paper
                  </button>
                </Link>
              ) : status === 'generating' ? (
                <Link href={`/papers/loading/${id}`} className="block w-full">
                  <button className="flex items-center gap-3 px-4 py-3 text-base font-medium text-zinc-700 hover:bg-zinc-50 rounded-[18px] transition-colors text-left w-full cursor-pointer">
                    <Loader2 size={18} className="text-zinc-400 animate-spin" />
                    Track Progress
                  </button>
                </Link>
              ) : (
                <button disabled className="flex items-center gap-3 px-4 py-3 text-base font-medium text-zinc-300 rounded-[18px] transition-colors text-left w-full cursor-not-allowed">
                  <Eye size={18} className="text-zinc-200" />
                  No Paper Available
                </button>
              )}
              <button
                onClick={() => {
                  setIsOpen(false);
                  onDelete(id);
                }}
                className="flex items-center gap-3 px-4 py-3 text-base font-medium text-red-500 hover:bg-red-50 rounded-[18px] transition-colors text-left w-full cursor-pointer"
              >
                <Trash2 size={18} className="text-red-400" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] md:text-xs font-medium text-zinc-500 font-[family-name:var(--font-inter)]">
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
