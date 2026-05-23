"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { api } from "@/lib/api";
import { useAssignmentStore } from "@/store/assignmentStore";
import type { Assignment } from "@/types/assignment";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";

const statusColor: Record<string, string> = {
  draft: "outline",
  queued: "outline",
  processing: "outline",
  completed: "outline",
  failed: "outline",
};

export default function DashboardPage() {
  const { assignments, setAssignments } = useAssignmentStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getAssignments()
      .then((data) => setAssignments(data as Assignment[]))
      .catch(() => setError("Could not load assignments. Is the API running?"))
      .finally(() => setLoading(false));
  }, [setAssignments]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Your assignments
          </h1>
          <p className="mt-2 text-slate-600">
            Create, generate, and manage AI-powered exam papers.
          </p>
        </div>
        <Link href="/assignments/new">
          <Button size="lg">+ New Assignment</Button>
        </Link>
      </div>

      {error && (
        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {error}
        </div>
      )}

      <div className="mt-8 grid gap-4">
        {loading &&
          [1, 2, 3].map((i) => (
            <Card key={i} className="!p-5">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="mt-2 h-4 w-1/2" />
            </Card>
          ))}

        {!loading && assignments.length === 0 && (
          <Card className="text-center">
            <p className="text-slate-600">No assignments yet.</p>
            <Link href="/assignments/new" className="mt-4 inline-block">
              <Button>Create your first assignment</Button>
            </Link>
          </Card>
        )}

        {!loading &&
          assignments.map((a) => (
            <Link key={a._id} href={`/assignments/${a._id}`}>
              <Card className="transition hover:border-brand-200 hover:shadow-elevated !p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold text-slate-900">{a.title}</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {a.subject || "General"} · Due{" "}
                      {format(new Date(a.dueDate), "PP")}
                    </p>
                  </div>
                  <Badge variant={statusColor[a.status] as "outline"}>
                    {a.status}
                  </Badge>
                </div>
                <p className="mt-3 text-xs text-slate-400">
                  {a.numberOfQuestions} questions · {a.totalMarks} marks
                </p>
              </Card>
            </Link>
          ))}
      </div>
    </div>
  );
}
