import type { ExamPaperContent } from "@/types/examPaper";
import type { StoredAssignment } from "./store";
import { buildSmartMockPaper } from "./mockQuestionBank";

export async function generatePaperForAssignment(
  assignment: StoredAssignment
): Promise<ExamPaperContent> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return buildSmartMockPaper(assignment);
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
Rules: Questions must be specific to the subject "${assignment.subject || "General"}", not generic placeholders.
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
        {
          role: "system",
          content:
            "You output valid JSON only for exam papers. Questions must be subject-specific and academically sound.",
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    return buildSmartMockPaper(assignment);
  }

  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content as string | undefined;
  if (!raw) {
    return buildSmartMockPaper(assignment);
  }

  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) {
    return buildSmartMockPaper(assignment);
  }

  try {
    return JSON.parse(match[0]) as ExamPaperContent;
  } catch {
    return buildSmartMockPaper(assignment);
  }
}
