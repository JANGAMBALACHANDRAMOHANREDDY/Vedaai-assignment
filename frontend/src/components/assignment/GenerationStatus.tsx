"use client";

import { useGenerationStore } from "@/store/generationStore";
import { Badge } from "@/components/ui/Badge";

const statusLabels: Record<string, string> = {
  idle: "Ready",
  draft: "Draft",
  queued: "Queued",
  processing: "Generating…",
  completed: "Completed",
  failed: "Failed",
};

export function GenerationStatus() {
  const { status, progress, error, isGenerating } = useGenerationStore();

  if (status === "idle") return null;

  return (
    <div className="rounded-xl border border-surface-border bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-800">Generation status</p>
          <p className="mt-0.5 text-xs text-slate-500">
            {error || statusLabels[status] || status}
          </p>
        </div>
        <Badge variant="outline">{statusLabels[status] || status}</Badge>
      </div>
      {isGenerating && (
        <div className="mt-4">
          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-brand-500 transition-all duration-500"
              style={{ width: `${Math.max(progress, 5)}%` }}
            />
          </div>
          <p className="mt-1 text-right text-xs text-slate-500">{progress}%</p>
        </div>
      )}
      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
