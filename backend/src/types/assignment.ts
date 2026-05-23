export type AssignmentStatus =
  | "draft"
  | "queued"
  | "processing"
  | "completed"
  | "failed";

export const QUESTION_TYPES = [
  "mcq",
  "short_answer",
  "long_answer",
  "true_false",
  "fill_blank",
] as const;

export type QuestionType = (typeof QUESTION_TYPES)[number];
