import type { IAssignment } from "../models/Assignment.js";

export function buildGenerationPrompt(assignment: IAssignment): string {
  const types = assignment.questionTypes.join(", ");
  const source = assignment.sourceFile?.extractedText
    ? `\nReference material from uploaded file:\n${assignment.sourceFile.extractedText.slice(0, 8000)}`
    : "";

  return `You are an expert assessment designer for K-12 and higher education.

Create an exam question paper as STRICT JSON only (no markdown, no prose outside JSON).

Assignment:
- Title: ${assignment.title}
- Subject: ${assignment.subject || "General"}
- Due date: ${assignment.dueDate.toISOString().split("T")[0]}
- Question types to include: ${types}
- Target number of questions: ${assignment.numberOfQuestions}
- Total marks budget: ${assignment.totalMarks}
- Additional instructions: ${assignment.additionalInstructions || "None"}
${source}

Rules:
1. Return ONLY valid JSON matching this exact shape:
{
  "sections": [
    {
      "title": "Section A",
      "instruction": "Attempt all questions",
      "questions": [
        {
          "question": "Question text here",
          "difficulty": "easy",
          "marks": 2
        }
      ]
    }
  ]
}
2. difficulty must be one of: easy, medium, hard
3. Sum of all question marks should equal ${assignment.totalMarks}
4. Include at least ${assignment.numberOfQuestions} questions across sections
5. Group questions logically by type in sections when possible
6. Questions must be clear, academically sound, and appropriate for the subject`;
}
