import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import type { ExamPaperContent } from "../types/examPaper.js";
import type { AssignmentStatus } from "../types/assignment.js";
import type { CreateAssignmentInput } from "../services/assignment.service.js";

const DATA_DIR = path.resolve("./data");

export interface StoredAssignment {
  _id: string;
  title: string;
  subject?: string;
  dueDate: Date;
  questionTypes: string[];
  numberOfQuestions: number;
  totalMarks: number;
  additionalInstructions?: string;
  sourceFile?: CreateAssignmentInput["sourceFile"];
  status: AssignmentStatus;
  generationError?: string;
  latestPaperId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StoredPaper {
  _id: string;
  assignmentId: string;
  version: number;
  content: ExamPaperContent;
  promptSnapshot?: string;
  createdAt: Date;
  updatedAt: Date;
}

async function ensureDataDir(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  for (const f of ["assignments.json", "papers.json"]) {
    const p = path.join(DATA_DIR, f);
    try {
      await fs.access(p);
    } catch {
      await fs.writeFile(p, "[]");
    }
  }
}

async function readAssignments(): Promise<StoredAssignment[]> {
  await ensureDataDir();
  const raw = await fs.readFile(path.join(DATA_DIR, "assignments.json"), "utf-8");
  const list = JSON.parse(raw) as StoredAssignment[];
  return list.map((a) => ({
    ...a,
    dueDate: new Date(a.dueDate),
    createdAt: new Date(a.createdAt),
    updatedAt: new Date(a.updatedAt),
  }));
}

async function writeAssignments(list: StoredAssignment[]): Promise<void> {
  await fs.writeFile(
    path.join(DATA_DIR, "assignments.json"),
    JSON.stringify(list, null, 2)
  );
}

async function readPapers(): Promise<StoredPaper[]> {
  await ensureDataDir();
  const raw = await fs.readFile(path.join(DATA_DIR, "papers.json"), "utf-8");
  const list = JSON.parse(raw) as StoredPaper[];
  return list.map((p) => ({
    ...p,
    createdAt: new Date(p.createdAt),
    updatedAt: new Date(p.updatedAt),
  }));
}

async function writePapers(list: StoredPaper[]): Promise<void> {
  await fs.writeFile(path.join(DATA_DIR, "papers.json"), JSON.stringify(list, null, 2));
}

export const fileStore = {
  async createAssignment(input: CreateAssignmentInput): Promise<StoredAssignment> {
    const list = await readAssignments();
    const now = new Date();
    const assignment: StoredAssignment = {
      _id: randomUUID(),
      ...input,
      status: "draft",
      createdAt: now,
      updatedAt: now,
    };
    list.push(assignment);
    await writeAssignments(list);
    return assignment;
  },

  async listAssignments(): Promise<StoredAssignment[]> {
    const list = await readAssignments();
    return list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  async getAssignment(id: string): Promise<StoredAssignment | null> {
    const list = await readAssignments();
    return list.find((a) => a._id === id) ?? null;
  },

  async updateAssignment(
    id: string,
    patch: Partial<StoredAssignment>
  ): Promise<StoredAssignment | null> {
    const list = await readAssignments();
    const idx = list.findIndex((a) => a._id === id);
    if (idx < 0) return null;
    list[idx] = { ...list[idx], ...patch, updatedAt: new Date() };
    await writeAssignments(list);
    return list[idx];
  },

  async savePaper(
    assignmentId: string,
    content: ExamPaperContent,
    promptSnapshot?: string
  ): Promise<StoredPaper> {
    const papers = await readPapers();
    const latest = papers
      .filter((p) => p.assignmentId === assignmentId)
      .sort((a, b) => b.version - a.version)[0];
    const version = (latest?.version ?? 0) + 1;
    const now = new Date();
    const paper: StoredPaper = {
      _id: randomUUID(),
      assignmentId,
      version,
      content,
      promptSnapshot,
      createdAt: now,
      updatedAt: now,
    };
    papers.push(paper);
    await writePapers(papers);
    await this.updateAssignment(assignmentId, {
      latestPaperId: paper._id,
      status: "completed",
      generationError: undefined,
    });
    return paper;
  },

  async getPaper(id: string): Promise<StoredPaper | null> {
    const papers = await readPapers();
    return papers.find((p) => p._id === id) ?? null;
  },

  async getLatestPaper(assignmentId: string): Promise<StoredPaper | null> {
    const papers = await readPapers();
    return (
      papers
        .filter((p) => p.assignmentId === assignmentId)
        .sort((a, b) => b.version - a.version)[0] ?? null
    );
  },
};
