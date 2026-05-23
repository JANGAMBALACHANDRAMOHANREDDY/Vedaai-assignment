import { QUESTION_TYPE_OPTIONS } from "@/types/assignment";

const VALID_TYPES = QUESTION_TYPE_OPTIONS.map((o) => o.value);

export async function parseAssignmentForm(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const subject = String(formData.get("subject") || "").trim() || undefined;
  const dueDate = String(formData.get("dueDate") || "");
  const rawTypes = formData.getAll("questionTypes").map(String);
  const numberOfQuestions = parseInt(String(formData.get("numberOfQuestions")), 10);
  const totalMarks = parseInt(String(formData.get("totalMarks")), 10);
  const additionalInstructions =
    String(formData.get("additionalInstructions") || "").trim() || undefined;

  const errors: Record<string, string[]> = {};
  if (title.length < 3) errors.title = ["Title must be at least 3 characters"];
  if (!dueDate) errors.dueDate = ["Due date is required"];
  const questionTypes = rawTypes.filter((t): t is (typeof VALID_TYPES)[number] =>
    (VALID_TYPES as readonly string[]).includes(t)
  );
  if (questionTypes.length === 0) {
    errors.questionTypes = ["Select at least one question type"];
  }
  if (!numberOfQuestions || numberOfQuestions < 1 || numberOfQuestions > 100) {
    errors.numberOfQuestions = ["Enter between 1 and 100 questions"];
  }
  if (!totalMarks || totalMarks < 1 || totalMarks > 500) {
    errors.totalMarks = ["Enter marks between 1 and 500"];
  }

  if (Object.keys(errors).length > 0) return { errors };

  let sourceText: string | undefined;
  const file = formData.get("file");
  if (file instanceof File && file.size > 0) {
    if (file.type === "text/plain" || file.type.startsWith("text/")) {
      sourceText = await file.text();
    }
  }

  return {
    data: {
      title,
      subject,
      dueDate: new Date(dueDate).toISOString(),
      questionTypes,
      numberOfQuestions,
      totalMarks,
      additionalInstructions,
      sourceText,
    },
  };
}
