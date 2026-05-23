import { AssignmentForm } from "@/components/assignment/AssignmentForm";

export default function NewAssignmentPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Create assignment
        </h1>
        <p className="mt-2 text-slate-600">
          Fill in the details below to generate a structured exam paper with AI.
        </p>
      </div>
      <AssignmentForm />
    </div>
  );
}
