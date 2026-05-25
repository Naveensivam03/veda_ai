'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  Calendar,
  Plus,
  Minus,
  X,
  FileText,
  CheckCircle,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createAssignment } from '@/services/assignment.service';
import type {
  CreateAssignmentRequest,
  DifficultyLevel,
  QuestionType,
  UploadedMaterialType,
} from '@/types/assignment';
import { QuestionConfigCard } from './question-config-card';
import { VoiceInputButton } from './voice-input-button';
import { currentTeacher } from '@/lib/current-teacher';
import { useTeacher } from '@/hooks/use-teacher';

interface QuestionRow {
  id: string;
  label: string;
  type: QuestionType;
  count: number;
  marks: number;
  difficulty: DifficultyLevel;
  isDropdownOpen?: boolean;
}

const QUESTION_TYPES: Array<{
  label: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
}> = [
  { label: 'Multiple Choice Questions', type: 'mcq', difficulty: 'mixed' },
  { label: 'Short Answer Questions', type: 'short', difficulty: 'mixed' },
  { label: 'Long/Essay Questions', type: 'long', difficulty: 'mixed' },
  { label: 'True / False Questions', type: 'true-false', difficulty: 'mixed' }
];

function getUploadedMaterialType(file: File): UploadedMaterialType | null {
  if (file.type === 'application/pdf') {
    return 'pdf';
  }

  if (file.type === 'text/plain') {
    return 'text';
  }

  return null;
}

export function AssignmentForm() {
  const router = useRouter();
  const { teacher: teacherData } = useTeacher();
  // Question configuration rows state
  const [rows, setRows] = useState<QuestionRow[]>([
    { id: '1', label: 'Multiple Choice Questions', type: 'mcq', count: 4, marks: 1, difficulty: 'mixed' },
    { id: '2', label: 'Short Answer Questions', type: 'short', count: 3, marks: 2, difficulty: 'mixed' },
    { id: '3', label: 'Long/Essay Questions', type: 'long', count: 2, marks: 5, difficulty: 'mixed' }
  ]);

  // File Upload states
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Due Date state
  const [dueDate, setDueDate] = useState('2026-06-15');
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Format date helper from YYYY-MM-DD to DD-MM-YYYY
  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return 'DD-MM-YYYY';
    const parts = dateStr.split('-');
    if (parts.length === 3 && parts[0].length === 4) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  };

  // Additional instructions state
  const [instructions, setInstructions] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Load PDF.js dynamically on client mount for binary PDF text parsing
  useEffect(() => {
    if (typeof window !== 'undefined' && !(window as any).pdfjsLib) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.onload = () => {
        const pdfjs = (window as any)['pdfjs-dist/build/pdf'];
        if (pdfjs) {
          pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }
      };
      document.head.appendChild(script);
    }
  }, []);

  // Totals calculations
  const totalQuestions = rows.reduce((sum, row) => sum + row.count, 0);
  const totalMarks = rows.reduce((sum, row) => sum + (row.count * row.marks), 0);

  // Simulate file upload progress and extract text content
  const handleFileUpload = async (selectedFile: File) => {
    setFile(selectedFile);
    setUploading(true);
    setUploadProgress(0);
    setFileContent(null);

    try {
      const fileType = getUploadedMaterialType(selectedFile);
      if (fileType === 'text') {
        const text = await selectedFile.text();
        setFileContent(text);
      } else if (fileType === 'pdf') {
        const pdfjs = (window as any)['pdfjs-dist/build/pdf'];
        if (pdfjs) {
          try {
            const arrayBuffer = await selectedFile.arrayBuffer();
            const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            let fullText = '';
            
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              const pageText = textContent.items
                .map((item: any) => item.str)
                .join(' ');
              fullText += pageText + '\n';
            }
            
            setFileContent(fullText.substring(0, 25000));
            console.log('Successfully extracted PDF plain text using PDF.js!');
          } catch (pdfErr) {
            console.error('PDF.js parsing failed, using raw fallback:', pdfErr);
            const rawText = await selectedFile.text();
            const cleanText = rawText
              .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
              .replace(/\s+/g, ' ')
              .substring(0, 15000);
            setFileContent(cleanText);
          }
        } else {
          const rawText = await selectedFile.text();
          const cleanText = rawText
            .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
            .replace(/\s+/g, ' ')
            .substring(0, 15000);
          setFileContent(cleanText);
        }
      }
    } catch (err) {
      console.error('Failed to extract file text:', err);
    }

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 120);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const onDragLeave = () => {
    setIsDragActive(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleDateClick = () => {
    const input = dateInputRef.current;
    if (input) {
      try {
        // Use showPicker() if available (modern browsers)
        if (typeof (input as any).showPicker === 'function') {
          (input as any).showPicker();
        } else {
          // Fallback: trigger click on the element
          input.click();
        }
      } catch (err) {
        console.error('Failed to show date picker:', err);
        // Fallback: trigger click on the element
        input.click();
      }
    }
  };

  const removeFile = () => {
    setFile(null);
    setUploadProgress(0);
    setUploading(false);
    setFileContent(null);
  };

  // Steppers handlers
  const updateRow = (id: string, field: 'count' | 'marks', value: number) => {
    setRows(rows.map(row => {
      if (row.id === id) {
        const currentVal = row[field];
        const newVal = Math.max(1, currentVal + value);
        return { ...row, [field]: newVal };
      }
      return row;
    }));
  };

  // Toggle Dropdown for Row
  const toggleDropdown = (id: string) => {
    setRows(rows.map(row => {
      if (row.id === id) {
        return { ...row, isDropdownOpen: !row.isDropdownOpen };
      }
      return { ...row, isDropdownOpen: false };
    }));
  };

  // Select Type for Row
  const selectType = (id: string, label: string) => {
    const nextType = QUESTION_TYPES.find((option) => option.label === label);

    if (!nextType) {
      return;
    }

    setRows(rows.map(row => {
      if (row.id === id) {
        return {
          ...row,
          label: nextType.label,
          type: nextType.type,
          difficulty: nextType.difficulty,
          isDropdownOpen: false
        };
      }
      return row;
    }));
  };

  // Add a new configuration row
  const addRow = () => {
    const newId = String(Date.now());
    setRows([
      ...rows,
      {
        id: newId,
        label: 'Multiple Choice Questions',
        type: 'mcq',
        count: 5,
        marks: 1,
        difficulty: 'mixed'
      }
    ]);
  };

  // Remove a configuration row
  const removeRow = (id: string) => {
    setRows(rows.filter(row => row.id !== id));
  };

  const handleGenerateAssignment = async () => {
    setIsGenerating(true);
    setGenerationError(null);

    try {
      if (rows.length === 0) {
        throw new Error('Add at least one question type to continue.');
      }

      const activeSubject = teacherData?.subject || 'Mathematics';
      const activeSchoolName = teacherData?.school?.name || 'VedaAI Academy';
      const activeTitle = `${activeSubject} Assignment - ${formatDisplayDate(dueDate)}`;
      const activeGrade = 'Grade 8';

      const uploadedMaterial = file
        ? (() => {
            const fileType = getUploadedMaterialType(file);

            if (!fileType) {
              throw new Error('Only PDF and text files are supported right now.');
            }

            return {
              fileName: file.name,
              fileUrl: `local-upload://${encodeURIComponent(file.name)}`,
              fileType,
              fileContent,
            };
          })()
        : null;

      const payload: CreateAssignmentRequest = {
        teacherId: currentTeacher.teacherId,
        schoolId: currentTeacher.schoolId,
        schoolName: activeSchoolName,
        title: activeTitle,
        subject: activeSubject,
        grade: activeGrade,
        dueDate: new Date(dueDate).toISOString(),
        instructions: instructions.trim(),
        uploadedMaterial,
        questionConfigs: rows.map(({ type, count, marks, difficulty }) => ({
          type,
          count,
          marksPerQuestion: marks,
          difficulty,
        })),
        totalQuestions,
        totalMarks,
      };

      const response = await createAssignment(payload);
      router.push(`/papers/loading/${response.assignmentId}`);
    } catch (error) {
      setGenerationError(
        error instanceof Error ? error.message : 'Failed to submit the assignment.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setRows(prevRows => prevRows.map(row => ({ ...row, isDropdownOpen: false })));
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="w-full space-y-12">
      {/* Configuration Card */}
      <div
        className="bg-[#EFEFEF] md:bg-white border border-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] rounded-[32px] p-6 md:p-12 transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-8 md:mb-10">
          <h2 className="text-xl font-bold text-[#272727] font-[family-name:var(--font-bricolage)] tracking-tight">Assignment Details</h2>
          <p className="text-zinc-500 text-xs font-medium font-[family-name:var(--font-inter)] mt-1 tracking-tight">
            Basic information about your assignment
          </p>
        </div>

        {/* SECTION 1 - Upload Zone */}
        <div className="space-y-4 mb-8 md:mb-12">
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileSelect}
            accept="application/pdf,text/plain,image/jpeg,image/png"
            className="hidden"
          />

          {!file ? (
            <div className="space-y-4">
              <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={triggerFileSelect}
                className={`w-full border-2 border-dashed rounded-[32px] p-8 md:p-10 flex flex-col items-center justify-center bg-white cursor-pointer transition-all duration-300 ${isDragActive
                    ? 'border-[#171717] bg-white/60 scale-[0.99] shadow-sm'
                    : 'border-zinc-200 hover:border-zinc-300'
                  }`}
              >
                <div className="bg-white rounded-full p-4 mb-4">
                  <UploadCloud size={32} className="text-zinc-900" />
                </div>
                <h4 className="text-sm font-bold text-[#272727] font-[family-name:var(--font-bricolage)] text-center">
                  Choose a file or drag & drop it here
                </h4>
                <p className="text-zinc-400 text-[10px] mt-1 font-medium font-[family-name:var(--font-inter)]">
                  JPEG, PNG, upto 10MB
                </p>
                <button
                  type="button"
                  className="mt-6 px-8 py-2.5 bg-white border border-zinc-100 rounded-full text-xs font-bold text-[#272727] hover:bg-zinc-50 hover:border-zinc-200 shadow-sm transition-all duration-200 font-[family-name:var(--font-bricolage)]"
                >
                  Browse Files
                </button>
              </div>
              <p className="text-center text-[11px] font-medium text-zinc-500 font-[family-name:var(--font-inter)] px-4">
                Upload images of your preferred document/image
              </p>
            </div>
          ) : (
            <div className="w-full bg-white border border-white rounded-[32px] p-6 shadow-sm flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="bg-zinc-900 text-white rounded-2xl p-3.5 shadow-md flex items-center justify-center">
                  <FileText size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="text-sm font-bold text-[#272727] truncate pr-4">
                      {file.name}
                    </h4>
                    <span className="text-xs text-zinc-400 font-medium font-[family-name:var(--font-inter)] shrink-0">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>

                  {uploading ? (
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#171717] rounded-full transition-all duration-150 ease-out"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-zinc-500 font-[family-name:var(--font-inter)] min-w-[24px]">
                        {uploadProgress}%
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-[#4BC26D] text-xs font-bold font-[family-name:var(--font-inter)]">
                      <CheckCircle size={14} className="fill-[#4BC26D]/10" />
                      <span>Ready for Assignment generation</span>
                    </div>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={removeFile}
                className="p-2 hover:bg-zinc-100 rounded-full text-zinc-400 hover:text-zinc-600 transition-colors shrink-0"
              >
                <X size={18} />
              </button>
            </div>
          )}
        </div>

        {/* SECTION 2 - Due Date */}
        <div className="space-y-2 mb-8 md:mb-12">
          <label className="text-[13px] font-bold text-[#272727] font-[family-name:var(--font-inter)] block select-none">
            Due Date
          </label>
          <div 
            onClick={handleDateClick}
            className="relative w-full h-12 px-6 bg-white border border-zinc-100 rounded-2xl flex items-center justify-between cursor-pointer group shadow-sm"
          >
            <span className="text-sm font-medium font-[family-name:var(--font-inter)] text-zinc-400 select-none">
              {dueDate ? formatDisplayDate(dueDate) : 'DD-MM-YYYY'}
            </span>
            <div className="p-1.5 bg-zinc-50 rounded-lg">
              <Calendar size={18} className="text-zinc-900" />
            </div>

            <input
              ref={dateInputRef}
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 pointer-events-none"
            />
          </div>
        </div>

        {/* SECTION 3 - Question Configuration */}
        <div className="space-y-4 mb-10">
          <label className="text-[13px] font-bold text-[#272727] font-[family-name:var(--font-inter)] block select-none">
            Question Type
          </label>

          <div className="space-y-4">
            {rows.map((row) => (
              <div key={row.id} className="bg-white rounded-2xl md:rounded-[32px] p-3.5 md:p-6 shadow-sm border border-zinc-50 space-y-3.5 md:space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {/* Type Selector Header */}
                <div className="flex items-center justify-between gap-2 md:gap-4">
                  <div className="flex-1 relative">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDropdown(row.id);
                      }}
                      className="flex items-center justify-between px-2 py-1.5 md:px-4 md:py-2 hover:bg-zinc-50 rounded-xl cursor-pointer transition-all font-[family-name:var(--font-inter)]"
                    >
                      <span className="text-xs md:text-[13px] font-bold text-zinc-800 truncate">{row.label}</span>
                      <ChevronDown size={14} className={`text-zinc-400 transition-transform duration-200 ${row.isDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {row.isDropdownOpen && (
                      <div className="absolute left-0 right-0 top-[36px] md:top-[40px] z-50 bg-white border border-zinc-100 rounded-2xl md:rounded-[24px] shadow-2xl p-2 flex flex-col gap-1 font-[family-name:var(--font-inter)] text-xs md:text-sm animate-in fade-in zoom-in-95 duration-150">
                        {QUESTION_TYPES.map((option) => (
                          <button
                            key={option.type}
                            type="button"
                            onClick={() => selectType(row.id, option.label)}
                            className={`w-full text-left px-4 py-2.5 rounded-full transition-colors font-medium ${row.type === option.type
                                ? 'bg-zinc-50 text-zinc-950 font-bold'
                                : 'text-zinc-500 hover:bg-zinc-50/50'
                              }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => removeRow(row.id)}
                    className="text-zinc-400 hover:text-red-400 transition-colors p-1 shrink-0"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Steppers Area */}
                <div className="flex gap-2.5 md:gap-3">
                  {/* Question Count Stepper */}
                  <div className="flex-1 bg-[#F5F5F5] rounded-xl md:rounded-2xl p-2 md:p-3 flex flex-col items-center gap-1.5 md:gap-2">
                    <span className="text-[8px] md:text-[10px] font-bold text-zinc-400 uppercase tracking-tight select-none text-center">No. of Questions</span>
                    <div className="flex items-center justify-between w-full px-0.5 md:px-2">
                      <button
                        type="button"
                        onClick={() => updateRow(row.id, 'count', -1)}
                        className="w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-900 transition-colors shrink-0"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-xs md:text-sm font-bold text-zinc-900 font-[family-name:var(--font-inter)]">{row.count}</span>
                      <button
                        type="button"
                        onClick={() => updateRow(row.id, 'count', 1)}
                        className="w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-900 transition-colors shrink-0"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Marks Stepper */}
                  <div className="flex-1 bg-[#F5F5F5] rounded-xl md:rounded-2xl p-2 md:p-3 flex flex-col items-center gap-1.5 md:gap-2">
                    <span className="text-[8px] md:text-[10px] font-bold text-zinc-400 uppercase tracking-tight select-none text-center">Marks</span>
                    <div className="flex items-center justify-between w-full px-0.5 md:px-2">
                      <button
                        type="button"
                        onClick={() => updateRow(row.id, 'marks', -1)}
                        className="w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-900 transition-colors shrink-0"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-xs md:text-sm font-bold text-zinc-900 font-[family-name:var(--font-inter)]">{row.marks}</span>
                      <button
                        type="button"
                        onClick={() => updateRow(row.id, 'marks', 1)}
                        className="w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-900 transition-colors shrink-0"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addRow}
            className="w-full flex items-center gap-2 text-sm font-bold text-[#171717] font-[family-name:var(--font-inter)] py-2 group"
          >
            <div className="w-8 h-8 rounded-full bg-[#171717] flex items-center justify-center text-white group-active:scale-95 transition-transform">
              <Plus size={18} />
            </div>
            <span>Add Question Type</span>
          </button>
        </div>

        {/* SECTION 4 - Summary */}
        <div className="flex flex-col items-end gap-1.5 mb-10 text-[13px] font-bold font-[family-name:var(--font-inter)] text-[#272727]">
          <div className="flex items-center gap-1">
            <span className="font-medium text-zinc-500">Total Questions :</span>
            <span>{totalQuestions}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium text-zinc-500">Total Marks :</span>
            <span>{totalMarks}</span>
          </div>
        </div>

        {/* SECTION 5 - Additional Instructions (Desktop only or optional on mobile) */}
        <div className="hidden md:block space-y-4">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest font-[family-name:var(--font-inter)] block">
            Additional Instructions
          </label>
          <div className="relative bg-white/30 rounded-[24px] border border-zinc-200/50 shadow-inner group focus-within:border-zinc-300 transition-all duration-300">
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Generate a question paper for a 3-hour exam duration..."
              className="w-full px-6 py-6 bg-transparent text-sm font-medium font-[family-name:var(--font-inter)] text-zinc-800 placeholder:text-zinc-400/80 outline-none min-h-[140px] resize-none pr-16 leading-relaxed"
            />
            <VoiceInputButton />
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="space-y-4 pt-4 px-2">
        {generationError ? (
          <p className="text-sm text-red-500 font-[family-name:var(--font-inter)] text-center">
            {generationError}
          </p>
        ) : null}

        <div className="flex items-center justify-center gap-4 w-full font-[family-name:var(--font-bricolage)]">
          <Link href="/assignments" className="flex-1 max-w-[180px]">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-zinc-200 rounded-full text-zinc-900 font-bold hover:bg-zinc-50 transition-all shadow-sm cursor-pointer text-sm"
            >
              <ArrowLeft size={18} />
              Previous
            </button>
          </Link>
          <button
            type="button"
            onClick={handleGenerateAssignment}
            disabled={isGenerating || uploading || (teacherData !== null && teacherData.generationCredits <= 0)}
            className="flex-1 max-w-[180px] flex items-center justify-center gap-2 px-6 py-3.5 bg-[#171717] hover:bg-zinc-800 disabled:bg-zinc-300 disabled:cursor-not-allowed text-white rounded-full font-bold shadow-lg transition-all cursor-pointer text-sm"
          >
            {isGenerating ? 'Submitting...' : 'Next'}
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
