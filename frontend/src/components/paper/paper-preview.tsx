import React from 'react';
import { Paper } from '@/types/paper';
import { PaperHeader } from './paper-header';
import { StudentInfo } from './student-info';
import { PaperMetadata } from './paper-metadata';
import { PaperSection } from './paper-section';
import { AnswerKey } from './answer-key';

interface PaperPreviewProps {
  paper: Paper;
}

export function PaperPreview({ paper }: PaperPreviewProps) {
  return (
    <div className="w-full max-w-[850px] mx-auto bg-white border border-zinc-200/60 rounded-[32px] p-8 md:p-16 shadow-[0_20px_60px_rgba(0,0,0,0.02)] text-left select-text print:shadow-none print:p-0 print:border-none print:bg-white relative">
      {/* School Exam Header */}
      <PaperHeader paper={paper} />

      {/* Student Printable Identification Info */}
      <StudentInfo gradeClass={paper.grade} />

      {/* Exam Time allowed, Max Marks, and Instructions Box */}
      <PaperMetadata paper={paper} />

      {/* Dynamic Sections List */}
      <div className="space-y-8 mt-8">
        {paper.sections.map((section, index) => (
          <PaperSection key={`${section.title}-${index}`} section={section} />
        ))}
      </div>

      {/* Suggested Solution & Evaluation Criteria for Teachers */}
      <AnswerKey sections={paper.sections} />
    </div>
  );
}
