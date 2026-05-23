export type Difficulty = "easy" | "medium" | "hard";

export interface ExamQuestion {
  question: string;
  difficulty: Difficulty;
  marks: number;
  type?: string;
}

export interface ExamSection {
  title: string;
  instruction: string;
  questions: ExamQuestion[];
}

export interface ExamPaperContent {
  sections: ExamSection[];
}

export interface GeneratedPaper {
  _id: string;
  assignmentId: string;
  version: number;
  content: ExamPaperContent;
  createdAt: string;
}
