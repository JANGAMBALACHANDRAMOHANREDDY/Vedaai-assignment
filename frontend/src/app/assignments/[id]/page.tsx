"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useGenerationSocket } from "@/hooks/useSocket";
import { useGenerationStore } from "@/store/generationStore";
import { useToastStore } from "@/store/toastStore";
import type { Assignment } from "@/types/assignment";
import type { GeneratedPaper } from "@/types/examPaper";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { GenerationStatus } from "@/components/assignment/GenerationStatus";
import { PaperSkeleton } from "@/components/ui/Skeleton";

export default function AssignmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const { status, paperId, isGenerating } = useGenerationStore();
  const addToast = useToastStore((s) => s.addToast);
  const setUpdate = useGenerationStore((s) => s.setUpdate);

  useGenerationSocket(id);

  const load = async () => {
    try {
      const data = await api.getAssignment(id);
      setAssignment(data.assignment as Assignment);
      const paper = data.latestPaper as GeneratedPaper | null;
      if (paper) {
        setUpdate({ status: "completed", progress: 100, paperId: paper._id });
      } else {
        const a = data.assignment as Assignment;
        setUpdate({ status: a.status, progress: a.status === "processing" ? 50 : 0 });
      }
    } catch {
      addToast("Assignment not found", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  useEffect(() => {
    if (status === "completed" && paperId) {
      addToast("Paper generated successfully!", "success");
      router.push(`/papers/${paperId}`);
    }
  }, [status, paperId, router, addToast]);

  const handleRegenerate = async () => {
    try {
      setUpdate({ status: "queued", progress: 5 });
      await api.regeneratePaper(id);
      addToast("Regeneration started", "info");
    } catch {
      addToast("Failed to regenerate", "error");
    }
  };

  const handleGenerate = async () => {
    try {
      setUpdate({ status: "queued", progress: 5 });
      await api.generatePaper(id);
      addToast("Generation started", "info");
    } catch {
      addToast("Failed to start generation", "error");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Card>
          <PaperSkeleton />
        </Card>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-center">
        <p>Assignment not found</p>
        <Link href="/" className="mt-4 inline-block text-brand-600">
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-6">
        <Link href="/" className="text-sm text-brand-600 hover:underline">
          ← Back to dashboard
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">{assignment.title}</h1>
        <p className="text-sm text-slate-500">Status: {assignment.status}</p>
      </div>

      <div className="space-y-6">
        <GenerationStatus />

        <Card>
          <div className="flex flex-wrap gap-3">
            {assignment.status === "draft" && (
              <Button onClick={handleGenerate} isLoading={isGenerating}>
                Generate Paper
              </Button>
            )}
            {(assignment.status === "completed" || assignment.status === "failed") && (
              <Button onClick={handleRegenerate} isLoading={isGenerating} variant="secondary">
                Regenerate Paper
              </Button>
            )}
            {paperId && (
              <Link href={`/papers/${paperId}`}>
                <Button variant="primary">View Exam Paper</Button>
              </Link>
            )}
            {assignment.latestPaperId && !paperId && (
              <Link href={`/papers/${assignment.latestPaperId}`}>
                <Button>View Latest Paper</Button>
              </Link>
            )}
          </div>
          {assignment.generationError && (
            <p className="mt-4 text-sm text-red-600">{assignment.generationError}</p>
          )}
        </Card>
      </div>
    </div>
  );
}
