import { z } from "zod";
import { QUESTION_TYPES } from "../types/assignment.js";

export const createAssignmentSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  subject: z.string().optional(),
  dueDate: z.coerce.date(),
  questionTypes: z
    .union([z.string(), z.array(z.string())])
    .transform((v) => (Array.isArray(v) ? v : [v]))
    .pipe(z.array(z.enum(QUESTION_TYPES)).min(1, "Select at least one question type")),
  numberOfQuestions: z.coerce.number().int().min(1).max(100),
  totalMarks: z.coerce.number().int().min(1).max(500),
  additionalInstructions: z.string().max(2000).optional(),
});

export type CreateAssignmentBody = z.infer<typeof createAssignmentSchema>;
