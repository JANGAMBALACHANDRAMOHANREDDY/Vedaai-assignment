import type { ExamPaperContent } from "@/types/examPaper";
import type { StoredAssignment } from "./store";

function mockExamPaper(
  title: string,
  numberOfQuestions: number,
  totalMarks: number
): ExamPaperContent {
  const perQuestion = Math.max(1, Math.floor(totalMarks / numberOfQuestions));
  const questions = Array.from({ length: numberOfQuestions }, (_, i) => ({
    question: `${title} — Question ${i + 1}: Explain a core concept from this subject with a clear example.`,
    difficulty: (["easy", "medium", "hard"] as const)[i % 3],
    marks:
      i === numberOfQuestions - 1
        ? totalMarks - perQuestion * (numberOfQuestions - 1)
        : perQuestion,
  }));

  return {
    sections: [
      {
        title: "Section A",
        instruction: "Attempt all questions. Marks are shown in brackets.",
        questions,
      },
    ],
  };
}

export async function generatePaperForAssignment(
  assignment: StoredAssignment
): Promise<ExamPaperContent> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return mockExamPaper(
      assignment.title,
      assignment.numberOfQuestions,
      assignment.totalMarks
    );
  }

  const prompt = `Create an exam paper as JSON only:
{
  "sections": [{ "title": "Section A", "instruction": "...", "questions": [{ "question": "...", "difficulty": "easy|medium|hard", "marks": 2 }] }]
}
Title: ${assignment.title}
Subject: ${assignment.subject || "General"}
Types: ${assignment.questionTypes.join(", ")}
Questions: ${assignment.numberOfQuestions}
Total marks: ${assignment.totalMarks}
Instructions: ${assignment.additionalInstructions || "None"}
${assignment.sourceText ? `Reference:\n${assignment.sourceText.slice(0, 4000)}` : ""}`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: "Output valid JSON only for exam papers." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    return mockExamPaper(
      assignment.title,
      assignment.numberOfQuestions,
      assignment.totalMarks
    );
  }

  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content as string | undefined;
  if (!raw) {
    return mockExamPaper(
      assignment.title,
      assignment.numberOfQuestions,
      assignment.totalMarks
    );
  }

  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) {
    return mockExamPaper(
      assignment.title,
      assignment.numberOfQuestions,
      assignment.totalMarks
    );
  }

  return JSON.parse(match[0]) as ExamPaperContent;
}
