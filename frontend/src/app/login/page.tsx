'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Sparkles, 
  BookOpen, 
  School, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  GraduationCap
} from 'lucide-react';

export default function LoginPage() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = () => {
    setIsLoggingIn(true);
    
    // Simulate login by setting session token in localStorage
    localStorage.setItem('vedaai_logged_in', 'true');

    // Smooth redirect using window.location.href to fully trigger a clean mount
    setTimeout(() => {
      window.location.href = '/';
    }, 800);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#171717] font-[family-name:var(--font-inter)] selection:bg-[#FF7950]/30 relative overflow-hidden px-4 md:px-0 select-none">
      
      {/* Dynamic Glowing Aura Background spheres */}
      <div className="absolute top-[-10%] right-[10%] w-[580px] h-[580px] rounded-full bg-[#FF7950]/8 blur-[150px] pointer-events-none animate-pulse duration-[10000ms]" />
      <div className="absolute bottom-[-10%] left-[10%] w-[480px] h-[480px] rounded-full bg-[#4BC26D]/5 blur-[130px] pointer-events-none animate-pulse duration-[8000ms]" />
      
      {/* Decorative Grid Mesh overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="w-full max-w-[460px] relative z-10 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Portal Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-white/5 border border-white/10 rounded-2xl shadow-xl mb-4 backdrop-blur-md">
            <GraduationCap size={32} className="text-[#FF7950]" />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white font-[family-name:var(--font-bricolage)] tracking-tight">
            VedaAI
          </h1>
          <p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest font-[family-name:var(--font-inter)]">
            Smart Exam Generation Suite
          </p>
        </div>

        {/* Main Glassmorphic Login Card */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_30px_70px_rgba(0,0,0,0.4)] rounded-[32px] p-8 md:p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-[1px] bg-gradient-to-r from-transparent via-[#FF7950]/55 to-transparent" />

          <h2 className="text-lg font-bold text-white font-[family-name:var(--font-bricolage)] tracking-tight">
            Teacher Session Portal
          </h2>
          <p className="text-zinc-400 text-xs mt-1.5 leading-relaxed font-medium">
            Authentication is mocked for this release. Simulate a logged-in dashboard session using real seeded MongoDB context.
          </p>

          {/* Seeded Teacher Profile Preview Card */}
          <div className="mt-8 p-6 bg-white/[0.02] border border-white/5 rounded-2xl text-left space-y-4 relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF7950]/0 to-[#FF7950]/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
            
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full border border-white/10 overflow-hidden shadow-inner bg-zinc-800 shrink-0">
                <Image 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
                  alt="Dr. Sarah Jenkins Avatar"
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="bg-[#4BC26D]/10 text-[#4BC26D] text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase">
                    Seeded Account
                  </span>
                </div>
                <h3 className="text-sm font-bold text-zinc-100 truncate">Dr. Sarah Jenkins</h3>
                <p className="text-zinc-500 text-[11px] font-semibold flex items-center gap-1">
                  <BookOpen size={11} className="text-zinc-600" />
                  <span>Mathematics Educator</span>
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 space-y-1.5 text-[11px] text-zinc-400 font-medium">
              <div className="flex items-center gap-1.5">
                <School size={12} className="text-zinc-500 shrink-0" />
                <span className="truncate">St. Xavier's International School</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin size={12} className="text-zinc-500 shrink-0" />
                <span>Mumbai, CBSE Board</span>
              </div>
            </div>
          </div>

          {/* LARGE LOGIN ACTION BUTTON */}
          <div className="mt-8">
            <button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full relative p-[3px] rounded-full bg-gradient-to-r from-[#FF7950] to-[#C0350A] block hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:scale-100 cursor-pointer shadow-lg hover:shadow-xl shadow-red-950/20"
            >
              <div className="flex items-center justify-center gap-2.5 w-full py-4 bg-[#1f1f1f] text-white rounded-full font-[family-name:var(--font-bricolage)] text-sm font-semibold tracking-wide hover:bg-zinc-800 transition-all px-6">
                {isLoggingIn ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-zinc-500 border-t-white animate-spin shrink-0" />
                    <span>Activating Session...</span>
                  </>
                ) : (
                  <>
                    <span>Login as Dr. Sarah Jenkins</span>
                    <ArrowRight size={14} className="text-[#FF7950] shrink-0" />
                  </>
                )}
              </div>
            </button>
          </div>

        </div>

        {/* Security Footer Notice */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-zinc-500 font-medium select-none">
          <ShieldCheck size={12} className="text-[#4BC26D]" />
          <span>MongoDB & Redis persistence initialized. Sandbox isolation is active.</span>
        </div>

      </div>
    </div>
  );
}
