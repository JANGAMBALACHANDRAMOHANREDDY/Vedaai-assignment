"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useToastStore } from "@/store/toastStore";
import type { Assignment } from "@/types/assignment";
import type { GeneratedPaper } from "@/types/examPaper";
import { ExamPaperView, getExamPaperElement } from "@/components/paper/ExamPaperView";
import { Button } from "@/components/ui/Button";
import { PaperSkeleton } from "@/components/ui/Skeleton";
import { exportElementToPdf } from "@/lib/pdfExport";

export default function PaperPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [paper, setPaper] = useState<GeneratedPaper | null>(null);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const addToast = useToastStore((s) => s.addToast);

  useEffect(() => {
    api
      .getPaper(id)
      .then((data) => {
        setPaper(data.paper as GeneratedPaper);
        setAssignment(data.assignment as Assignment);
      })
      .catch(() => addToast("Could not load paper", "error"))
      .finally(() => setLoading(false));
  }, [id, addToast]);

  const handleExport = async () => {
    const el = getExamPaperElement();
    if (!el) return;
    setExporting(true);
    try {
      await exportElementToPdf(el, `${assignment?.title || "exam"}-paper.pdf`);
      addToast("PDF downloaded", "success");
    } catch {
      addToast("PDF export failed", "error");
    } finally {
      setExporting(false);
    }
  };

  const handleRegenerate = async () => {
    if (!assignment) return;
    setRegenerating(true);
    try {
      await api.regeneratePaper(assignment._id);
      addToast("Regeneration queued — check assignment page for status", "info");
    } catch {
      addToast("Regeneration failed", "error");
    } finally {
      setRegenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <PaperSkeleton />
      </div>
    );
  }

  if (!paper || !assignment) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-center">
        <p>Paper not found</p>
        <Link href="/" className="mt-4 inline-block text-brand-600">
          Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:px-6">
      <div className="no-print mx-auto mb-6 flex max-w-3xl flex-wrap items-center justify-between gap-3">
        <Link
          href={`/assignments/${assignment._id}`}
          className="text-sm text-brand-600 hover:underline"
        >
          ← Back to assignment
        </Link>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={handleRegenerate} isLoading={regenerating}>
            Regenerate
          </Button>
          <Button onClick={handleExport} isLoading={exporting}>
            Export PDF
          </Button>
        </div>
      </div>

      <ExamPaperView assignment={assignment} paper={paper} />
    </div>
  );
}
