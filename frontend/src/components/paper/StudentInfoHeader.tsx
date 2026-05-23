import { format } from "date-fns";
import type { Assignment } from "@/types/assignment";

interface StudentInfoHeaderProps {
  assignment: Assignment;
  totalQuestions: number;
}

export function StudentInfoHeader({
  assignment,
  totalQuestions,
}: StudentInfoHeaderProps) {
  return (
    <div className="border-b-2 border-slate-900 pb-6">
      <div className="text-center">
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
          {assignment.title}
        </h1>
        {assignment.subject && (
          <p className="mt-1 text-sm uppercase tracking-widest text-slate-600">
            {assignment.subject}
          </p>
        )}
      </div>

      <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
        <div className="space-y-3">
          <div className="flex gap-2">
            <span className="w-28 shrink-0 text-slate-500">Student Name:</span>
            <span className="flex-1 border-b border-slate-300" />
          </div>
          <div className="flex gap-2">
            <span className="w-28 shrink-0 text-slate-500">Roll No:</span>
            <span className="flex-1 border-b border-slate-300" />
          </div>
          <div className="flex gap-2">
            <span className="w-28 shrink-0 text-slate-500">Class / Section:</span>
            <span className="flex-1 border-b border-slate-300" />
          </div>
        </div>
        <div className="space-y-2 sm:text-right">
          <p>
            <span className="text-slate-500">Due Date: </span>
            <span className="font-medium">
              {format(new Date(assignment.dueDate), "PPP p")}
            </span>
          </p>
          <p>
            <span className="text-slate-500">Total Marks: </span>
            <span className="font-medium">{assignment.totalMarks}</span>
          </p>
          <p>
            <span className="text-slate-500">Questions: </span>
            <span className="font-medium">{totalQuestions}</span>
          </p>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-slate-500">
        Read all instructions carefully before attempting the paper.
      </p>
    </div>
  );
}
