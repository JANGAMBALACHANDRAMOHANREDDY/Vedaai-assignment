import { randomUUID } from "crypto";
import type { ExamPaperContent } from "@/types/examPaper";
import type { AssignmentStatus } from "@/types/assignment";

export interface StoredAssignment {
  _id: string;
  title: string;
  subject?: string;
  dueDate: string;
  questionTypes: string[];
  numberOfQuestions: number;
  totalMarks: number;
  additionalInstructions?: string;
  sourceText?: string;
  status: AssignmentStatus;
  generationError?: string;
  latestPaperId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoredPaper {
  _id: string;
  assignmentId: string;
  version: number;
  content: ExamPaperContent;
  createdAt: string;
}

interface Db {
  assignments: StoredAssignment[];
  papers: StoredPaper[];
}

const globalStore = globalThis as unknown as { __vedaaiDb?: Db };

function db(): Db {
  if (!globalStore.__vedaaiDb) {
    globalStore.__vedaaiDb = { assignments: [], papers: [] };
  }
  return globalStore.__vedaaiDb;
}

export const store = {
  createAssignment(
    data: Omit<StoredAssignment, "_id" | "status" | "createdAt" | "updatedAt">
  ): StoredAssignment {
    const now = new Date().toISOString();
    const assignment: StoredAssignment = {
      _id: randomUUID(),
      ...data,
      status: "draft",
      createdAt: now,
      updatedAt: now,
    };
    db().assignments.push(assignment);
    return assignment;
  },

  listAssignments(): StoredAssignment[] {
    return [...db().assignments].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  getAssignment(id: string): StoredAssignment | undefined {
    return db().assignments.find((a) => a._id === id);
  },

  updateAssignment(id: string, patch: Partial<StoredAssignment>): StoredAssignment | undefined {
    const a = db().assignments.find((x) => x._id === id);
    if (!a) return undefined;
    Object.assign(a, patch, { updatedAt: new Date().toISOString() });
    return a;
  },

  savePaper(assignmentId: string, content: ExamPaperContent): StoredPaper {
    const version =
      db().papers.filter((p) => p.assignmentId === assignmentId).length + 1;
    const paper: StoredPaper = {
      _id: randomUUID(),
      assignmentId,
      version,
      content,
      createdAt: new Date().toISOString(),
    };
    db().papers.push(paper);
    const a = db().assignments.find((x) => x._id === assignmentId);
    if (a) {
      a.latestPaperId = paper._id;
      a.status = "completed";
      a.generationError = undefined;
      a.updatedAt = new Date().toISOString();
    }
    return paper;
  },

  getPaper(id: string): StoredPaper | undefined {
    return db().papers.find((p) => p._id === id);
  },

  getLatestPaper(assignmentId: string): StoredPaper | undefined {
    return db().papers
      .filter((p) => p.assignmentId === assignmentId)
      .sort((a, b) => b.version - a.version)[0];
  },
};
