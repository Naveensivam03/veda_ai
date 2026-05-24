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
        // Extract plain text blocks from the binary stream for Gemini
        const rawText = await selectedFile.text();
        const cleanText = rawText
          .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
          .replace(/\s+/g, ' ')
          .substring(0, 15000); // Pull up to 15,000 characters
        setFileContent(cleanText);
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
        className="bg-white border border-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] rounded-[32px] p-8 md:p-12 transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-10">
          <h2 className="text-xl font-bold text-[#272727] font-[family-name:var(--font-bricolage)] tracking-tight">Assignment Structure</h2>
          <p className="text-zinc-400 text-xs font-semibold font-[family-name:var(--font-inter)] mt-1.5 uppercase tracking-wider">
            Configuring assignment details for {teacherData?.fullName || 'Loading...'} ({teacherData?.subject || 'Mathematics'})
          </p>
        </div>

        {/* SECTION 1 - Upload Zone */}
        <div className="space-y-4 mb-12">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest font-[family-name:var(--font-inter)] block">
            Upload Source Materials
          </label>

          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileSelect}
            accept="application/pdf,text/plain"
            className="hidden"
          />

          {!file ? (
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={triggerFileSelect}
              className={`w-full border-2 border-dashed rounded-[24px] p-10 flex flex-col items-center justify-center bg-white/30 cursor-pointer transition-all duration-300 ${isDragActive
                  ? 'border-[#171717] bg-white/60 scale-[0.99] shadow-sm'
                  : 'border-zinc-200/80 hover:border-zinc-300 hover:bg-white/45'
                }`}
            >
              <div className="bg-white/80 backdrop-blur-md rounded-full p-4 shadow-sm mb-4 border border-white/40">
                <UploadCloud size={28} className="text-zinc-500" />
              </div>
              <h4 className="text-base font-bold text-[#272727] font-[family-name:var(--font-bricolage)]">
                Choose a file or drag & drop it here
              </h4>
              <p className="text-zinc-400 text-xs mt-1.5 mb-6 font-[family-name:var(--font-inter)]">
                PDF or TXT up to 10MB
              </p>
              <button
                type="button"
                className="px-6 py-2.5 bg-white border border-zinc-100 rounded-full text-xs font-bold text-[#272727] hover:bg-zinc-50 hover:border-zinc-200 shadow-sm transition-all duration-200 font-[family-name:var(--font-bricolage)]"
              >
                Browse Files
              </button>
            </div>
          ) : (
            <div className="w-full bg-white/70 backdrop-blur-md border border-white/60 rounded-3xl p-6 shadow-sm flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
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
        <div className="space-y-1.5 mb-12">
          <label className="text-[12px] font-semibold text-zinc-400 font-[family-name:var(--font-inter)] block select-none">
            Due Date
          </label>
          <div className="relative w-full h-9 px-4 pr-10 bg-zinc-50/40 border border-zinc-100 rounded-xl flex items-center justify-between">
            {/* Visual styled text and custom icon layer (rendered underneath) */}
            <span className="text-xs font-normal font-[family-name:var(--font-inter)] text-zinc-600 select-none">
              {dueDate ? formatDisplayDate(dueDate) : 'DD-MM-YYYY'}
            </span>
            <Calendar size={14} className="text-zinc-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />

            {/* Native date input stretched over the container, completely transparent (opacity 0) */}
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
          </div>
        </div>

        {/* SECTION 3 - Question Configuration */}
        <div className="space-y-6 mb-12">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-500 uppercase tracking-widest font-[family-name:var(--font-inter)]">
            <span>Question Structure</span>
            <div className="flex gap-16 text-right font-bold pr-16 md:pr-20">
              <span className="w-20">No. of Questions</span>
              <span className="w-16">Marks each</span>
            </div>
          </div>

          <div className="space-y-4">
            {rows.map((row) => (
              <div key={row.id} className="flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {/* Custom Styled Dropdown */}
                <div className="flex-1 relative">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDropdown(row.id);
                    }}
                    className="flex items-center justify-between px-6 py-3.5 bg-white border border-zinc-100 rounded-full cursor-pointer hover:border-zinc-200 transition-all font-[family-name:var(--font-inter)] shadow-sm"
                  >
                    <span className="text-sm font-medium text-zinc-700">{row.label}</span>
                    <ChevronDown size={16} className={`text-zinc-400 transition-transform duration-200 ${row.isDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>

                  {row.isDropdownOpen && (
                    <div className="absolute left-0 right-0 top-[54px] z-50 bg-white border border-zinc-100 rounded-[24px] shadow-2xl p-2 flex flex-col gap-1 font-[family-name:var(--font-inter)] text-sm animate-in fade-in zoom-in-95 duration-150">
                      {QUESTION_TYPES.map((option) => (
                        <button
                          key={option.type}
                          type="button"
                          onClick={() => selectType(row.id, option.label)}
                          className={`w-full text-left px-4 py-2.5 rounded-full transition-colors font-medium ${row.type === option.type
                              ? 'bg-zinc-50 text-zinc-950 font-bold'
                              : 'text-zinc-500 hover:bg-zinc-50/50 hover:text-zinc-950'
                            }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => removeRow(row.id)}
                  className="text-zinc-300 hover:text-red-400 transition-colors p-2 rounded-full hover:bg-zinc-50"
                  title="Remove this type"
                >
                  <X size={18} />
                </button>

                {/* Question Count Stepper */}
                <div className="flex items-center justify-between px-3 py-2 bg-zinc-50 border border-zinc-100/50 rounded-full w-32 shrink-0 shadow-inner">
                  <button
                    type="button"
                    onClick={() => updateRow(row.id, 'count', -1)}
                    className="w-8 h-8 rounded-full bg-white border border-zinc-100 shadow-sm flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors shrink-0"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="text-sm font-bold text-zinc-900 font-[family-name:var(--font-inter)] w-8 text-center">{row.count}</span>
                  <button
                    type="button"
                    onClick={() => updateRow(row.id, 'count', 1)}
                    className="w-8 h-8 rounded-full bg-white border border-zinc-100 shadow-sm flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors shrink-0"
                  >
                    <Plus size={13} />
                  </button>
                </div>

                {/* Marks Stepper */}
                <div className="flex items-center justify-between px-3 py-2 bg-zinc-50 border border-zinc-100/50 rounded-full w-32 shrink-0 shadow-inner">
                  <button
                    type="button"
                    onClick={() => updateRow(row.id, 'marks', -1)}
                    className="w-8 h-8 rounded-full bg-white border border-zinc-100 shadow-sm flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors shrink-0"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="text-sm font-bold text-zinc-900 font-[family-name:var(--font-inter)] w-8 text-center">{row.marks}</span>
                  <button
                    type="button"
                    onClick={() => updateRow(row.id, 'marks', 1)}
                    className="w-8 h-8 rounded-full bg-white border border-zinc-100 shadow-sm flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors shrink-0"
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addRow}
            className="mt-6 hover:opacity-80 transition-opacity cursor-pointer duration-200"
          >
            <QuestionConfigCard />
          </button>
        </div>

        {/* SECTION 4 - Summary */}
        <div className="flex flex-col items-end gap-2 border-t border-zinc-100/70 pt-8 mb-12">
          <div className="flex items-center gap-3 text-xs font-semibold text-zinc-400 font-[family-name:var(--font-inter)]">
            <span>Total Questions :</span>
            <span className="text-[#272727] font-bold text-sm bg-zinc-50 px-3 py-1 rounded-full border border-zinc-100 shadow-inner">
              {totalQuestions}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold text-zinc-400 font-[family-name:var(--font-inter)] mt-1">
            <span>Total Marks :</span>
            <span className="text-[#272727] font-bold text-sm bg-zinc-50 px-3 py-1 rounded-full border border-zinc-100 shadow-inner">
              {totalMarks}
            </span>
          </div>
          {teacherData && (
            <div className="flex items-center gap-3 text-xs font-semibold text-zinc-400 font-[family-name:var(--font-inter)] mt-1">
              <span>AI Generations Remaining :</span>
              <span className={`font-bold text-sm px-3 py-1 rounded-full border shadow-inner ${
                teacherData.generationCredits <= 0 
                  ? 'bg-red-50 text-red-600 border-red-100 animate-pulse' 
                  : 'bg-zinc-50 text-zinc-800 border-zinc-100'
              }`}>
                {teacherData.generationCredits} / 3
              </span>
            </div>
          )}
        </div>

        {/* SECTION 5 - Additional Instructions */}
        <div className="space-y-4">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest font-[family-name:var(--font-inter)] block">
            Additional Instructions (For better output)
          </label>
          <div className="relative bg-white/30 rounded-[24px] border border-zinc-200/50 shadow-inner group focus-within:border-zinc-300 transition-all duration-300">
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Generate a question paper for a 3-hour exam duration with a mix of rigorous analytical and conceptual question types..."
              className="w-full px-6 py-6 bg-transparent text-sm font-medium font-[family-name:var(--font-inter)] text-zinc-800 placeholder:text-zinc-400/80 outline-none min-h-[140px] resize-none pr-16 leading-relaxed"
            />
            <VoiceInputButton />
          </div>
        </div>

        {/* Soft limit exceeded premium banner warning block */}
        {teacherData && teacherData.generationCredits <= 0 && (
          <div className="mt-8 p-6 bg-red-50/60 border border-red-100 rounded-[24px] flex items-start gap-3.5 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-red-500/10 p-2 rounded-xl text-red-500 shrink-0">
              <AlertCircle size={20} />
            </div>
            <div className="space-y-1 text-left">
              <h4 className="text-sm font-bold text-red-950 font-[family-name:var(--font-bricolage)]">AI Generation Limit Reached</h4>
              <p className="text-xs text-red-600 leading-relaxed font-medium font-[family-name:var(--font-inter)]">
                You’ve reached the current AI generation limit for this demo.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="space-y-4 pt-2">
        {generationError ? (
          <p className="text-sm text-red-500 font-[family-name:var(--font-inter)]">
            {generationError}
          </p>
        ) : null}

        <div className="flex items-center justify-between w-full font-[family-name:var(--font-bricolage)]">
          <Link href="/assignments">
            <button
              type="button"
              className="flex items-center gap-2.5 px-8 py-3.5 bg-white border border-zinc-200 rounded-full text-zinc-900 font-bold hover:bg-zinc-50 hover:border-zinc-300 transition-all shadow-sm cursor-pointer text-sm"
            >
              <ArrowLeft size={18} />
              Previous
            </button>
          </Link>
          <button
            type="button"
            onClick={handleGenerateAssignment}
            disabled={isGenerating || uploading || (teacherData !== null && teacherData.generationCredits <= 0)}
            className="flex items-center gap-2.5 px-10 py-3.5 bg-[#171717] hover:bg-zinc-800 disabled:bg-zinc-300 disabled:cursor-not-allowed text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all cursor-pointer text-sm"
          >
            {isGenerating ? 'Submitting...' : 'Generate Assignment'}
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
