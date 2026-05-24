'use client';

import React, { useEffect, useState } from 'react';
import { TopNav } from '@/components/layout/top-nav';
import { PaperPreview } from '@/components/paper/paper-preview';
import { Download, Sparkles, Printer } from 'lucide-react';
import { Paper } from '@/types/paper';
import { getPaperByAssignmentId } from '@/services/paper.service';

export default function PaperPage({ params }: { params: Promise<{ paperId: string }> }) {
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

  // Trigger native browser printing dialog (lets user save directly as a clean PDF)
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-[family-name:var(--font-inter)] selection:bg-zinc-200/50 relative overflow-hidden pb-20 print:bg-white print:pb-0 select-none">
      {/* Decorative soft glowing glassmorphism backdrops */}
      <div className="absolute top-[20%] left-[10%] w-[380px] h-[380px] rounded-full bg-[#FF7950]/4 blur-[130px] pointer-events-none print:hidden" />
      <div className="absolute bottom-[15%] right-[5%] w-[480px] h-[480px] rounded-full bg-[#4BC26D]/5 blur-[150px] pointer-events-none print:hidden" />

      {/* Hide header layout during printing */}
      <div className="print:hidden relative z-10">
        <TopNav />
      </div>

      <div className="max-w-[850px] w-full mx-auto px-4 md:px-0 space-y-8 mt-4 relative z-10">
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
        <div className="bg-[#1F1F1F] text-white rounded-2xl p-5 md:p-6 shadow-md border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-5 print:hidden animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-start gap-3.5 flex-1">
            <div className="bg-white/10 rounded-full p-2.5 shrink-0 mt-0.5 border border-white/5">
              <Sparkles size={16} className="text-[#FF7950]" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">AI Gen Output</span>
              <p className="text-xs md:text-sm font-medium text-zinc-200 leading-relaxed font-[family-name:var(--font-inter)]">
                Your assignment paper has been generated and saved. Review the paper and print when ready.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 select-none">
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-3 bg-[#FF7950] hover:bg-[#e05f36] text-white rounded-full text-xs font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer font-[family-name:var(--font-bricolage)]"
            >
              <Download size={14} />
              <span>Download as PDF</span>
            </button>
            <button 
              onClick={handlePrint}
              className="p-3 bg-white/10 hover:bg-white/15 text-white border border-white/10 rounded-full shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              title="Print Examination Sheet"
            >
              <Printer size={14} />
            </button>
          </div>
        </div>
        ) : null}

        {/* Centered Printable Paper Canvas */}
        {paper ? (
          <div className="pb-16 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200">
            <PaperPreview paper={paper} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
