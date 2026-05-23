import OpenAI from "openai";
import { env } from "../config/env.js";
import { examPaperContentSchema, type ExamPaperContent } from "../types/examPaper.js";
import { logger } from "../utils/logger.js";

function parseJsonFromText(text: string): unknown {
  const trimmed = text.trim();
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("No JSON object found in AI response");
  }
  return JSON.parse(jsonMatch[0]);
}

function mockExamPaper(
  title: string,
  numberOfQuestions: number,
  totalMarks: number
): ExamPaperContent {
  const perQuestion = Math.max(1, Math.floor(totalMarks / numberOfQuestions));
  const questions = Array.from({ length: numberOfQuestions }, (_, i) => ({
    question: `[${title}] Sample question ${i + 1}: Explain the key concept related to this topic.`,
    difficulty: (["easy", "medium", "hard"] as const)[i % 3],
    marks: i === numberOfQuestions - 1 ? totalMarks - perQuestion * (numberOfQuestions - 1) : perQuestion,
  }));

  return {
    sections: [
      {
        title: "Section A",
        instruction: "Attempt all questions. Each question carries marks as indicated.",
        questions,
      },
    ],
  };
}

export async function generateExamPaper(
  prompt: string,
  meta: { title: string; numberOfQuestions: number; totalMarks: number }
): Promise<{ content: ExamPaperContent; raw?: string }> {
  if (!env.openaiApiKey) {
    logger.warn("OPENAI_API_KEY not set — using mock generator");
    const content = mockExamPaper(meta.title, meta.numberOfQuestions, meta.totalMarks);
    return { content, raw: JSON.stringify(content) };
  }

  const client = new OpenAI({ apiKey: env.openaiApiKey });

  const response = await client.chat.completions.create({
    model: env.openaiModel,
    messages: [
      {
        role: "system",
        content:
          "You output only valid JSON for exam papers. Never include markdown fences or explanations.",
      },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  const raw = response.choices[0]?.message?.content;
  if (!raw) {
    throw new Error("Empty response from AI provider");
  }

  const parsed = parseJsonFromText(raw);
  const content = examPaperContentSchema.parse(parsed);
  return { content, raw };
}
