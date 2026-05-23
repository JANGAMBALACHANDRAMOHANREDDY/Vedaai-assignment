import type { AssignmentFormData } from "@/types/assignment";

export interface FormErrors {
  title?: string;
  dueDate?: string;
  questionTypes?: string;
  numberOfQuestions?: string;
  totalMarks?: string;
  file?: string;
}

export function validateAssignmentForm(data: AssignmentFormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.title.trim() || data.title.trim().length < 3) {
    errors.title = "Title must be at least 3 characters";
  }

  if (!data.dueDate) {
    errors.dueDate = "Due date is required";
  }

  if (data.questionTypes.length === 0) {
    errors.questionTypes = "Select at least one question type";
  }

  if (data.numberOfQuestions < 1 || data.numberOfQuestions > 100) {
    errors.numberOfQuestions = "Enter between 1 and 100 questions";
  }

  if (data.totalMarks < 1 || data.totalMarks > 500) {
    errors.totalMarks = "Enter marks between 1 and 500";
  }

  if (data.file) {
    const allowed = ["application/pdf", "text/plain"];
    if (!allowed.includes(data.file.type) && !data.file.type.startsWith("text/")) {
      errors.file = "Only PDF or text files are allowed";
    }
    if (data.file.size > 10 * 1024 * 1024) {
      errors.file = "File must be under 10MB";
    }
  }

  return errors;
}

export function hasErrors(errors: FormErrors): boolean {
  return Object.keys(errors).length > 0;
}
