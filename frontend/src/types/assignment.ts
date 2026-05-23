export type AssignmentStatus =
  | "draft"
  | "queued"
  | "processing"
  | "completed"
  | "failed";

export const QUESTION_TYPE_OPTIONS = [
  { value: "mcq", label: "Multiple Choice" },
  { value: "short_answer", label: "Short Answer" },
  { value: "long_answer", label: "Long Answer" },
  { value: "true_false", label: "True / False" },
  { value: "fill_blank", label: "Fill in the Blank" },
] as const;

export interface Assignment {
  _id: string;
  title: string;
  subject?: string;
  dueDate: string;
  questionTypes: string[];
  numberOfQuestions: number;
  totalMarks: number;
  additionalInstructions?: string;
  status: AssignmentStatus;
  generationError?: string;
  latestPaperId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssignmentFormData {
  title: string;
  subject: string;
  dueDate: string;
  questionTypes: string[];
  numberOfQuestions: number;
  totalMarks: number;
  additionalInstructions: string;
  file: File | null;
}
