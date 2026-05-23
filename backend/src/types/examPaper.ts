import { z } from "zod";

export const questionSchema = z.object({
  question: z.string().min(1),
  difficulty: z.enum(["easy", "medium", "hard"]),
  marks: z.number().positive(),
  type: z.string().optional(),
});

export const sectionSchema = z.object({
  title: z.string().min(1),
  instruction: z.string().min(1),
  questions: z.array(questionSchema).min(1),
});

export const examPaperContentSchema = z.object({
  sections: z.array(sectionSchema).min(1),
});

export type ExamPaperContent = z.infer<typeof examPaperContentSchema>;
export type ExamQuestion = z.infer<typeof questionSchema>;
export type ExamSection = z.infer<typeof sectionSchema>;
