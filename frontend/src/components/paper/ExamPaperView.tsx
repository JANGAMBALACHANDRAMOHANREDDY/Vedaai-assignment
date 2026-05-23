"use client";

import { useRef } from "react";
import type { Assignment } from "@/types/assignment";
import type { GeneratedPaper } from "@/types/examPaper";
import { StudentInfoHeader } from "./StudentInfoHeader";
import { SectionBlock } from "./SectionBlock";

interface ExamPaperViewProps {
  assignment: Assignment;
  paper: GeneratedPaper;
}

export function ExamPaperView({ assignment, paper }: ExamPaperViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const totalQuestions = paper.content.sections.reduce(
    (sum, s) => sum + s.questions.length,
    0
  );

  let questionOffset = 0;

  return (
    <div
      ref={containerRef}
      id="exam-paper-export"
      className="exam-paper mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 shadow-card md:p-12 print:shadow-none print:border-0"
    >
      <StudentInfoHeader assignment={assignment} totalQuestions={totalQuestions} />

      {paper.content.sections.map((section, si) => {
        const block = (
          <SectionBlock
            key={si}
            section={section}
            sectionIndex={si}
            questionOffset={questionOffset}
          />
        );
        questionOffset += section.questions.length;
        return block;
      })}

      <footer className="mt-10 border-t border-slate-200 pt-4 text-center text-xs text-slate-400">
        — End of Question Paper — Version {paper.version}
      </footer>
    </div>
  );
}

export function getExamPaperElement(): HTMLElement | null {
  return document.getElementById("exam-paper-export");
}
