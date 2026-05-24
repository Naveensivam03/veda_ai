'use client';

import React, { useState, useEffect } from 'react';
import { Mic } from 'lucide-react';

export function VoiceInputButton() {
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (showTooltip) {
      const timer = setTimeout(() => {
        setShowTooltip(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [showTooltip]);

  const handleClick = () => {
    setShowTooltip(true);
  };

  return (
    <div className="absolute right-5 bottom-5 z-20">
      {showTooltip && (
        <div className="absolute bottom-12 right-0 bg-[#1F1F1F] text-white text-[11px] font-semibold px-3 py-1.5 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] pointer-events-none whitespace-nowrap tracking-tight animate-in fade-in slide-in-from-bottom-1.5 duration-200 font-[family-name:var(--font-inter)]">
          Voice dictation coming soon
        </div>
      )}
      <button
        type="button"
        onClick={handleClick}
        className="p-3 rounded-full bg-white text-zinc-950 border border-zinc-100 hover:bg-zinc-50 shadow-sm hover:scale-105 transition-all cursor-pointer flex items-center justify-center"
        title="Voice dictation coming soon"
      >
        <Mic size={16} />
      </button>
    </div>
  );
}
