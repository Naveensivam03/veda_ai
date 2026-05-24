'use client';

import { useEffect, useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { TopNav } from '@/components/layout/top-nav';
import { usePaperStatus } from '@/hooks/use-paper-status';

export default function PaperLoadingPage({
  params,
}: {
  params: Promise<{ assignmentId: string }>;
}) {
  const router = useRouter();
  const [assignmentId, setAssignmentId] = useState<string | null>(null);
  const { status, isPolling, error } = usePaperStatus(assignmentId);

  useEffect(() => {
    let isMounted = true;

    params.then(({ assignmentId: resolvedAssignmentId }) => {
      if (isMounted) {
        setAssignmentId(resolvedAssignmentId);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [params]);

  useEffect(() => {
    if (!assignmentId || status !== 'completed') {
      return;
    }

    router.replace(`/papers/${assignmentId}`);
  }, [assignmentId, router, status]);

  const showFailureState = status === 'failed' || Boolean(error);

  return (
    <div className="flex min-h-screen flex-col font-[family-name:var(--font-inter)] selection:bg-zinc-200/50 relative overflow-hidden">
      <div className="absolute top-[18%] left-[8%] w-[360px] h-[360px] rounded-full bg-[#FF7950]/4 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[12%] right-[7%] w-[460px] h-[460px] rounded-full bg-[#4BC26D]/5 blur-[150px] pointer-events-none" />

      <div className="relative z-10">
        <TopNav />
      </div>

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-[720px] rounded-[36px] border border-white bg-white/90 p-10 md:p-14 shadow-[0_20px_60px_rgba(0,0,0,0.06)] backdrop-blur-sm">
          {showFailureState ? (
            <div className="space-y-5 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-400">
                <span className="text-lg font-semibold">!</span>
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-[#272727] font-[family-name:var(--font-bricolage)] tracking-tight">
                  Generation could not be completed
                </h1>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  {error ?? 'The assignment worker reported a failure while preparing the paper.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => router.push('/assignments/create')}
                className="inline-flex items-center justify-center rounded-full bg-[#171717] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-zinc-800"
              >
                Create a new assignment
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-zinc-100 bg-zinc-50 text-zinc-500">
                  <LoaderCircle className="h-7 w-7 animate-spin" />
                </div>
              </div>

              <div className="space-y-3 text-center">
                <h1 className="text-2xl font-bold text-[#272727] font-[family-name:var(--font-bricolage)] tracking-tight">
                  Generating your assignment paper...
                </h1>
                <p className="mx-auto max-w-[520px] text-sm text-zinc-500 leading-relaxed">
                  Our AI is preparing structured questions and answer keys.
                </p>
              </div>

              <div className="rounded-[28px] border border-zinc-100 bg-zinc-50/70 p-6">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                  <span>Generation status</span>
                  <span>{status ?? 'starting'}</span>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
                  <div
                    className={`h-full rounded-full bg-[#171717] transition-all duration-700 ${
                      status === 'completed'
                        ? 'w-full'
                        : status === 'generating'
                          ? 'w-2/3'
                          : 'w-1/3'
                    }`}
                  />
                </div>
                <p className="mt-4 text-sm text-zinc-500">
                  {isPolling
                    ? 'We are checking the worker status every few seconds.'
                    : 'Finalizing the current generation state.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
