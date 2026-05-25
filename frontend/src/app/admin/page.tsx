'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  ShieldAlert, 
  KeyRound, 
  UserCheck, 
  RefreshCw, 
  LogOut, 
  CheckCircle2, 
  ArrowLeft, 
  AlertCircle, 
  User, 
  Database,
  Coins
} from 'lucide-react';
import { apiRequest } from '@/lib/api';

interface Teacher {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  subject: string;
  generationCredits: number;
  avatarUrl?: string;
}

export default function AdminPage() {
  // Authentication states
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Teachers data states
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoadingTeachers, setIsLoadingTeachers] = useState(false);
  const [teachersError, setTeachersError] = useState<string | null>(null);
  
  // Action states
  const [isRestoring, setIsRestoring] = useState<Record<string, boolean>>({});
  const [creditAmounts, setCreditAmounts] = useState<Record<string, number>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Check login state on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('vedaai_admin_token');
    if (savedToken) {
      setIsAdminLoggedIn(true);
      fetchTeachers(savedToken);
    }
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setAuthError(null);

    try {
      const response = await apiRequest<{ token: string }>('/admin/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });

      localStorage.setItem('vedaai_admin_token', response.token);
      setIsAdminLoggedIn(true);
      fetchTeachers(response.token);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Invalid username or password');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('vedaai_admin_token');
    setIsAdminLoggedIn(false);
    setTeachers([]);
    setUsername('');
    setPassword('');
    setSuccessMessage(null);
  };

  const fetchTeachers = async (token: string) => {
    setIsLoadingTeachers(true);
    setTeachersError(null);
    try {
      const data = await apiRequest<Teacher[]>('/admin/teachers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setTeachers(data);
      
      // Initialize creditAmounts mapping with default 3 for each teacher
      const initialCredits: Record<string, number> = {};
      data.forEach(t => {
        initialCredits[t._id] = 3;
      });
      setCreditAmounts(initialCredits);
    } catch (err) {
      setTeachersError(err instanceof Error ? err.message : 'Failed to fetch educators list');
      // If token is invalid/expired
      if (err instanceof Error && (err.message.includes('Unauthorized') || err.message.includes('token'))) {
        handleAdminLogout();
      }
    } finally {
      setIsLoadingTeachers(false);
    }
  };

  const handleRestoreLimit = async (teacherId: string) => {
    const token = localStorage.getItem('vedaai_admin_token');
    if (!token) return;

    setIsRestoring(prev => ({ ...prev, [teacherId]: true }));
    setSuccessMessage(null);

    const credits = creditAmounts[teacherId] ?? 3;

    try {
      const result = await apiRequest<Teacher>('/admin/restore-limit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ teacherId, credits }),
      });

      // Update teachers list local state
      setTeachers(prev => prev.map(t => t._id === teacherId ? { ...t, generationCredits: result.generationCredits } : t));
      
      // Dispatch event to instantly update the sidebar credits/limit
      window.dispatchEvent(new Event('credits-updated'));

      setSuccessMessage(`Successfully updated limit for ${result.fullName} to ${result.generationCredits} credits!`);
      
      // Clear success message after 4s
      setTimeout(() => {
        setSuccessMessage(null);
      }, 4000);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to restore credits limit');
    } finally {
      setIsRestoring(prev => ({ ...prev, [teacherId]: false }));
    }
  };

  const handleCreditChange = (teacherId: string, amount: number) => {
    setCreditAmounts(prev => ({ ...prev, [teacherId]: amount }));
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0e0e0e] font-[family-name:var(--font-inter)] selection:bg-[#FF7950]/30 relative overflow-x-hidden py-12 px-4 md:px-8 select-none">
      
      {/* Background Orbs */}
      <div className="absolute top-[-15%] left-[-10%] w-[650px] h-[650px] rounded-full bg-[#FF7950]/6 blur-[160px] pointer-events-none animate-pulse duration-[12000ms]" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[550px] h-[550px] rounded-full bg-[#3b82f6]/6 blur-[140px] pointer-events-none animate-pulse duration-[9000ms]" />
      
      {/* Mesh grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      {/* Clean portal layout */}
      <div className="w-full max-w-[720px] relative z-10">
        
        {/* Phase A: Admin Login Page */}
        {!isAdminLoggedIn ? (
          <div className="max-w-[460px] mx-auto animate-in fade-in zoom-in-95 duration-500">
            {/* Header */}
            <div className="text-center mb-8 space-y-2">
              <div className="inline-flex items-center justify-center p-3.5 bg-white/5 border border-white/10 rounded-2xl shadow-2xl mb-4 backdrop-blur-md">
                <ShieldAlert size={32} className="text-[#FF7950]" />
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white font-[family-name:var(--font-bricolage)] tracking-tight">
                VedaAI Admin Portal
              </h1>
              <p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest">
                System Limit Controller
              </p>
            </div>

            {/* Login Card */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_30px_70px_rgba(0,0,0,0.5)] rounded-[32px] p-8 md:p-10 relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-gradient-to-r from-transparent via-[#FF7950]/45 to-transparent" />
              
              <h2 className="text-center text-lg font-bold text-white font-[family-name:var(--font-bricolage)] tracking-tight mb-6">
                Administrative Authentication
              </h2>

              {authError && (
                <div className="mb-6 p-4 rounded-xl bg-red-950/30 border border-red-500/20 text-red-400 text-xs flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleAdminLogin} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400">Admin Username</label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input 
                      type="text" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Username"
                      required
                      className="w-full bg-white/[0.03] border border-white/10 hover:border-white/20 focus:border-[#FF7950]/50 rounded-2xl py-3.5 pl-12 pr-4 text-white text-sm placeholder-zinc-600 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400">Admin Password</label>
                  <div className="relative">
                    <KeyRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full bg-white/[0.03] border border-white/10 hover:border-white/20 focus:border-[#FF7950]/50 rounded-2xl py-3.5 pl-12 pr-4 text-white text-sm placeholder-zinc-600 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full relative p-[3px] rounded-full bg-gradient-to-r from-[#FF7950] to-[#C0350A] block hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 disabled:opacity-50 disabled:scale-100 cursor-pointer shadow-lg"
                  >
                    <div className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#141414] text-white rounded-full font-[family-name:var(--font-bricolage)] text-sm font-semibold tracking-wide hover:bg-zinc-900 transition-all">
                      {isLoggingIn ? (
                        <>
                          <RefreshCw size={14} className="animate-spin text-[#FF7950]" />
                          <span>Verifying Credentials...</span>
                        </>
                      ) : (
                        <>
                          <span>Authenticate System</span>
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-8 text-center">
              <a 
                href="/assignments/create"
                className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-white transition-colors"
              >
                <ArrowLeft size={12} />
                <span>Return to Teacher Workspace</span>
              </a>
            </div>
          </div>
        ) : (
          /* Phase B: Admin Dashboard */
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Header Control Panel */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white/5 border border-white/10 backdrop-blur-xl rounded-[24px]">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="w-12 h-12 rounded-2xl bg-[#FF7950]/10 border border-[#FF7950]/20 flex items-center justify-center shadow-inner shrink-0">
                  <Database size={24} className="text-[#FF7950]" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white font-[family-name:var(--font-bricolage)] leading-none">
                    Admin limits controller
                  </h1>
                  <p className="text-[11px] text-zinc-500 font-medium mt-1">
                    Direct access to seeded databases & resource allocations.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a 
                  href="/assignments/create"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-bold text-zinc-300 border border-white/5 hover:border-white/10 transition-all"
                >
                  <ArrowLeft size={13} />
                  <span>Workspace</span>
                </a>
                <button
                  onClick={handleAdminLogout}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-950/20 hover:bg-red-950/40 border border-red-500/10 text-xs font-bold text-red-400 transition-all cursor-pointer"
                >
                  <LogOut size={13} />
                  <span>Exit Console</span>
                </button>
              </div>
            </div>

            {/* Notification Messages */}
            {successMessage && (
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2.5 animate-in fade-in zoom-in-95">
                <CheckCircle2 size={16} className="shrink-0 text-emerald-500" />
                <span className="font-medium">{successMessage}</span>
              </div>
            )}

            {/* Main Educators List Card */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[32px] overflow-hidden p-6 md:p-8 relative">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              
              <div className="flex items-center justify-between mb-6">
                <div className="space-y-1">
                  <h2 className="text-base font-bold text-white font-[family-name:var(--font-bricolage)] tracking-tight flex items-center gap-2">
                    <UserCheck size={18} className="text-[#FF7950]" />
                    <span>Educator Accounts & Limits</span>
                  </h2>
                  <p className="text-zinc-500 text-xs font-medium">
                    Adjust generation limits directly for real seeded MongoDB records.
                  </p>
                </div>
                
                <button
                  onClick={() => fetchTeachers(localStorage.getItem('vedaai_admin_token') || '')}
                  disabled={isLoadingTeachers}
                  className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 text-zinc-400 hover:text-white transition-all cursor-pointer disabled:opacity-50"
                  title="Reload Accounts"
                >
                  <RefreshCw size={14} className={isLoadingTeachers ? 'animate-spin' : ''} />
                </button>
              </div>

              {/* Data Loading States */}
              {isLoadingTeachers && teachers.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <div className="relative w-10 h-10 mx-auto">
                    <div className="absolute inset-0 rounded-full border-2 border-zinc-800" />
                    <div className="absolute inset-0 rounded-full border-2 border-t-[#FF7950] animate-spin" />
                  </div>
                  <p className="text-zinc-500 text-xs font-medium">Retrieving active user records...</p>
                </div>
              ) : teachersError ? (
                <div className="py-12 text-center text-red-400 bg-red-950/10 border border-red-500/10 rounded-2xl p-4">
                  <AlertCircle className="mx-auto mb-2 text-red-500" size={24} />
                  <p className="text-xs font-semibold">{teachersError}</p>
                </div>
              ) : teachers.length === 0 ? (
                <div className="py-16 text-center text-zinc-500 text-xs">
                  No active educator accounts found in DB.
                </div>
              ) : (
                /* Accounts Grid */
                <div className="space-y-4">
                  {teachers.map((teacher) => {
                    const credits = teacher.generationCredits;
                    const isZero = credits <= 0;
                    
                    return (
                      <div 
                        key={teacher._id}
                        className="p-5 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 rounded-2xl flex flex-col md:flex-row gap-5 items-start md:items-center justify-between transition-all duration-300"
                      >
                        {/* Avatar & Profile */}
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-14 h-14 rounded-full border border-white/10 overflow-hidden bg-zinc-800 shrink-0">
                            {teacher.avatarUrl ? (
                              <Image 
                                src={teacher.avatarUrl}
                                alt={teacher.fullName}
                                width={56}
                                height={56}
                                className="w-full h-full object-cover animate-in fade-in"
                                unoptimized
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-400 text-base font-bold font-[family-name:var(--font-bricolage)]">
                                {teacher.fullName[0]}
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-bold text-white truncate">{teacher.fullName}</h3>
                              {teacher.role === 'Teacher' && (
                                <span className="bg-zinc-800 text-zinc-400 border border-zinc-700/50 text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase">
                                  {teacher.role}
                                </span>
                              )}
                            </div>
                            <p className="text-zinc-500 text-[11px] font-semibold">{teacher.email}</p>
                            <span className="inline-block bg-[#FF7950]/10 text-[#FF7950] text-[10px] font-bold px-2.5 py-0.5 rounded-full font-[family-name:var(--font-bricolage)]">
                              {teacher.subject}
                            </span>
                          </div>
                        </div>

                        {/* Credits Gauge & Adjust Controls */}
                        <div className="flex flex-col sm:flex-row items-stretch md:items-center gap-4 w-full md:w-auto shrink-0 md:border-l md:border-white/5 md:pl-5">
                          {/* Limit Gauge */}
                          <div className="flex flex-col gap-1 min-w-[100px]">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                              Credits Limit
                            </span>
                            <div className="flex items-center gap-2">
                              <span className={`text-base font-extrabold font-[family-name:var(--font-bricolage)] ${
                                isZero ? 'text-red-500 animate-pulse' : 'text-emerald-400'
                              }`}>
                                {credits} Remaining
                              </span>
                            </div>
                            {/* Visual Progress Bar */}
                            <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-500 ${
                                  isZero ? 'bg-red-500' : credits <= 1 ? 'bg-yellow-500' : 'bg-emerald-400'
                                }`}
                                style={{ width: `${Math.min(100, (credits / 3) * 100)}%` }}
                              />
                            </div>
                          </div>

                          {/* Control restoration dropdown */}
                          <div className="flex items-center gap-2 mt-2 sm:mt-0">
                            <div className="relative">
                              <select
                                value={creditAmounts[teacher._id] ?? 3}
                                onChange={(e) => handleCreditChange(teacher._id, Number(e.target.value))}
                                className="bg-zinc-900 border border-white/10 hover:border-white/20 text-white text-xs font-bold rounded-xl py-2 pl-3 pr-8 focus:outline-none transition-all cursor-pointer appearance-none min-w-[70px]"
                              >
                                <option value={3}>3 (Default)</option>
                                <option value={5}>5 Credits</option>
                                <option value={10}>10 Credits</option>
                                <option value={20}>20 Credits</option>
                                <option value={50}>50 Credits</option>
                              </select>
                              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none text-[8px] font-bold">
                                ▼
                              </div>
                            </div>

                            <button
                              onClick={() => handleRestoreLimit(teacher._id)}
                              disabled={isRestoring[teacher._id]}
                              className="px-4 py-2 rounded-xl bg-[#FF7950] hover:bg-[#e05b33] text-white text-xs font-bold shadow-md hover:shadow-[#FF7950]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 min-w-[120px] disabled:opacity-50 disabled:scale-100 cursor-pointer"
                            >
                              {isRestoring[teacher._id] ? (
                                <>
                                  <RefreshCw size={12} className="animate-spin" />
                                  <span>Restoring...</span>
                                </>
                              ) : (
                                <>
                                  <Coins size={12} />
                                  <span>Refill Limit</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* System Status Footer */}
            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#4BC26D] inline-block animate-pulse" />
                <span>MongoDB Link Active</span>
              </span>
              <span>Gemini Engine V2.5 Sandbox</span>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
