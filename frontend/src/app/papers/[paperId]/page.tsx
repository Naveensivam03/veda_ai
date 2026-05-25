'use client';

import React, { useEffect, useState, useRef } from 'react';
import { TopNav } from '@/components/layout/top-nav';
import { PaperPreview } from '@/components/paper/paper-preview';
import { Download } from 'lucide-react';
import { Paper } from '@/types/paper';
import { getPaperByAssignmentId } from '@/services/paper.service';
import { useTeacher } from '@/hooks/use-teacher';

export default function PaperPage({ params }: { params: Promise<{ paperId: string }> }) {
  const { teacher: teacherData } = useTeacher();
  const paperRef = useRef<HTMLDivElement>(null);
  const [assignmentId, setAssignmentId] = useState<string | null>(null);
  const [paper, setPaper] = useState<Paper | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    params.then(({ paperId: resolvedPaperId }) => {
      if (!isMounted) {
        return;
      }

      setAssignmentId(resolvedPaperId);
    });

    return () => {
      isMounted = false;
    };
  }, [params]);

  useEffect(() => {
    if (!assignmentId) {
      return;
    }

    let isActive = true;

    const loadPaper = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getPaperByAssignmentId(assignmentId);

        if (!isActive) {
          return;
        }

        setPaper(response.paper);
      } catch (loadError) {
        if (!isActive) {
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Unable to load the generated paper.'
        );
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadPaper();

    return () => {
      isActive = false;
    };
  }, [assignmentId]);

  // Trigger native browser printing dialog (for PDF export)
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      try {
        window.print();
      } catch (err) {
        console.error('Print failed:', err);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-[family-name:var(--font-inter)] selection:bg-zinc-200/50 relative overflow-hidden print:overflow-visible pb-20 print:bg-white print:pb-0 select-none">
      {/* Decorative soft glowing glassmorphism backdrops */}
      <div className="absolute top-[20%] left-[10%] w-[380px] h-[380px] rounded-full bg-[#FF7950]/4 blur-[130px] pointer-events-none print:hidden" />
      <div className="absolute bottom-[15%] right-[5%] w-[480px] h-[480px] rounded-full bg-[#4BC26D]/5 blur-[150px] pointer-events-none print:hidden" />

      {/* Hide header layout during printing */}
      <div className="print:hidden relative z-10">
        <TopNav />
      </div>

      <div className="max-w-[850px] w-full mx-auto px-4 md:px-0 space-y-6 mt-4 relative z-10 print:max-w-none print:m-0">
        {isLoading ? (
          <div className="bg-white/80 border border-white rounded-3xl p-10 text-center text-sm text-zinc-500 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
            Loading generated paper...
          </div>
        ) : null}

        {error ? (
          <div className="bg-white/80 border border-red-100 rounded-3xl p-10 text-center shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
            <p className="text-base font-semibold text-[#272727]">Paper unavailable</p>
            <p className="mt-2 text-sm text-zinc-500">{error}</p>
          </div>
        ) : null}

        {/* Top Dark Action Banner */}
        {paper ? (
        <div className="bg-[#171717] text-white rounded-[32px] p-8 md:p-10 shadow-2xl border border-white/5 flex flex-col gap-6 print:hidden animate-in fade-in slide-in-from-top-4 duration-500 relative overflow-hidden action-banner">
          {/* Subtle background glow inside the banner */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#FF7950]/10 blur-[80px] pointer-events-none" />
          
          <div className="space-y-3 relative z-10">
            <h3 className="text-base md:text-lg font-medium text-zinc-100 leading-relaxed font-[family-name:var(--font-inter)]">
              Certainly, {teacherData?.fullName.split(' ')[0] || 'Teacher'}! Here are customized Question Paper for your {paper.grade} {paper.subject} classes on the {paper.paperTitle.split('-')[0].trim() || 'requested'} chapters:
            </h3>
          </div>

          <div className="flex items-center gap-3 relative z-10">
            <button 
              onClick={handlePrint}
              className="flex items-center justify-center gap-2.5 p-3 md:px-6 md:py-3 bg-white hover:bg-zinc-100 text-[#171717] rounded-full text-sm font-bold shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer font-[family-name:var(--font-bricolage)]"
              disabled={isLoading}
              title="Download as PDF"
            >
              <Download size={18} />
              <span className="hidden md:inline">Download as PDF</span>
            </button>
          </div>
        </div>
        ) : null}

        {/* Centered Printable Paper Canvas */}
        {paper ? (
          <div ref={paperRef} className="pb-16 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200 print:pb-0">
            <PaperPreview paper={paper} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
