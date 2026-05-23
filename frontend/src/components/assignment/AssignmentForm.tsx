"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAssignmentStore } from "@/store/assignmentStore";
import { useGenerationStore } from "@/store/generationStore";
import { useToastStore } from "@/store/toastStore";
import { useGenerationSocket } from "@/hooks/useSocket";
import { api, ApiError } from "@/lib/api";
import { validateAssignmentForm, hasErrors } from "@/lib/validation";
import { QUESTION_TYPE_OPTIONS } from "@/types/assignment";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FileUpload } from "./FileUpload";
import { GenerationStatus } from "./GenerationStatus";
import { clsx } from "clsx";

export function AssignmentForm() {
  const router = useRouter();
  const { form, setFormField, toggleQuestionType, isSubmitting, setSubmitting } =
    useAssignmentStore();
  const { reset: resetGeneration, setUpdate } = useGenerationStore();
  const addToast = useToastStore((s) => s.addToast);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [activeAssignmentId, setActiveAssignmentId] = useState<string | null>(null);

  useGenerationSocket(activeAssignmentId);

  const buildFormData = () => {
    const fd = new FormData();
    fd.append("title", form.title.trim());
    if (form.subject) fd.append("subject", form.subject.trim());
    fd.append("dueDate", new Date(form.dueDate).toISOString());
    form.questionTypes.forEach((t) => fd.append("questionTypes", t));
    fd.append("numberOfQuestions", String(form.numberOfQuestions));
    fd.append("totalMarks", String(form.totalMarks));
    if (form.additionalInstructions) {
      fd.append("additionalInstructions", form.additionalInstructions.trim());
    }
    if (form.file) fd.append("file", form.file);
    return fd;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateAssignmentForm(form);
    if (hasErrors(errors)) {
      setFieldErrors(errors as Record<string, string>);
      addToast("Please fix form errors", "error");
      return;
    }
    setFieldErrors({});
    setSubmitting(true);
    resetGeneration();

    try {
      const assignment = await api.createAssignment(buildFormData());
      setActiveAssignmentId(assignment._id);
      setUpdate({ status: "queued", progress: 5 });
      addToast("Assignment created — generating paper…", "info");

      setUpdate({ status: "processing", progress: 50 });
      const { paperId } = await api.generatePaper(assignment._id);
      if (paperId) {
        addToast("Paper generated successfully!", "success");
        router.push(`/papers/${paperId}`);
        return;
      }
      router.push(`/assignments/${assignment._id}`);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Failed to create assignment";
      addToast(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card>
        <h2 className="text-lg font-semibold text-slate-900">Assignment details</h2>
        <p className="mt-1 text-sm text-slate-500">
          Configure your assessment and we&apos;ll generate a structured question paper.
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Input
              label="Assignment title"
              placeholder="e.g. Mid-term Physics Assessment"
              value={form.title}
              onChange={(e) => setFormField("title", e.target.value)}
              error={fieldErrors.title}
              required
            />
          </div>
          <Input
            label="Subject"
            placeholder="e.g. Physics"
            value={form.subject}
            onChange={(e) => setFormField("subject", e.target.value)}
          />
          <Input
            label="Due date"
            type="datetime-local"
            value={form.dueDate}
            onChange={(e) => setFormField("dueDate", e.target.value)}
            error={fieldErrors.dueDate}
            required
          />
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-slate-900">Question configuration</h2>
        <div className="mt-6 space-y-5">
          <div>
            <span className="block text-sm font-medium text-slate-700 mb-2">
              Question types
            </span>
            <div className="flex flex-wrap gap-2">
              {QUESTION_TYPE_OPTIONS.map((opt) => {
                const selected = form.questionTypes.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleQuestionType(opt.value)}
                    className={clsx(
                      "rounded-full border px-3 py-1.5 text-sm font-medium transition",
                      selected
                        ? "border-brand-600 bg-brand-50 text-brand-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            {fieldErrors.questionTypes && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.questionTypes}</p>
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="Number of questions"
              type="number"
              min={1}
              max={100}
              value={form.numberOfQuestions}
              onChange={(e) =>
                setFormField("numberOfQuestions", parseInt(e.target.value, 10) || 1)
              }
              error={fieldErrors.numberOfQuestions}
              required
            />
            <Input
              label="Total marks"
              type="number"
              min={1}
              max={500}
              value={form.totalMarks}
              onChange={(e) =>
                setFormField("totalMarks", parseInt(e.target.value, 10) || 1)
              }
              error={fieldErrors.totalMarks}
              required
            />
          </div>

          <Textarea
            label="Additional instructions"
            placeholder="Difficulty distribution, topics to cover, formatting preferences…"
            value={form.additionalInstructions}
            onChange={(e) => setFormField("additionalInstructions", e.target.value)}
          />
        </div>
      </Card>

      <Card>
        <FileUpload
          file={form.file}
          onChange={(f) => setFormField("file", f)}
          error={fieldErrors.file}
        />
      </Card>

      {(activeAssignmentId || isSubmitting) && <GenerationStatus />}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/")}
        >
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting} size="lg">
          Create &amp; Generate Paper
        </Button>
      </div>
    </form>
  );
}
