import fs from "fs/promises";
import { env } from "../config/env.js";
import { Assignment, type IAssignment } from "../models/Assignment.js";
import { fileStore } from "../simple/fileStore.js";
import { enqueueGeneration } from "../queue/generation.queue.js";

export interface CreateAssignmentInput {
  title: string;
  subject?: string;
  dueDate: Date;
  questionTypes: string[];
  numberOfQuestions: number;
  totalMarks: number;
  additionalInstructions?: string;
  sourceFile?: {
    filename: string;
    mimetype: string;
    path: string;
    extractedText?: string;
  };
}

export async function createAssignment(
  input: CreateAssignmentInput
): Promise<IAssignment> {
  if (env.simpleDev) {
    return fileStore.createAssignment(input) as unknown as IAssignment;
  }
  const assignment = await Assignment.create({
    ...input,
    status: "draft",
  });
  return assignment;
}

export async function listAssignments(): Promise<IAssignment[]> {
  if (env.simpleDev) {
    return fileStore.listAssignments() as unknown as IAssignment[];
  }
  return Assignment.find().sort({ createdAt: -1 }).lean() as unknown as IAssignment[];
}

export async function getAssignmentById(id: string): Promise<IAssignment | null> {
  if (env.simpleDev) {
    return fileStore.getAssignment(id) as unknown as IAssignment | null;
  }
  return Assignment.findById(id);
}

export async function startGeneration(assignmentId: string): Promise<IAssignment> {
  const assignment = await getAssignmentById(assignmentId);
  if (!assignment) {
    throw new Error("Assignment not found");
  }

  if (env.simpleDev) {
    await fileStore.updateAssignment(assignmentId, {
      status: "queued",
      generationError: undefined,
    });
    await enqueueGeneration(assignmentId);
    return (await getAssignmentById(assignmentId))!;
  }

  const doc = await Assignment.findById(assignmentId);
  if (!doc) throw new Error("Assignment not found");
  doc.status = "queued";
  doc.generationError = undefined;
  await doc.save();
  await enqueueGeneration(assignmentId);
  return doc;
}

export async function regeneratePaper(assignmentId: string): Promise<IAssignment> {
  return startGeneration(assignmentId);
}

export async function updateAssignmentStatus(
  assignmentId: string,
  status: IAssignment["status"],
  extra?: { generationError?: string; latestPaperId?: string }
): Promise<void> {
  if (env.simpleDev) {
    await fileStore.updateAssignment(assignmentId, {
      status,
      ...(extra?.generationError !== undefined && {
        generationError: extra.generationError,
      }),
      ...(extra?.latestPaperId && { latestPaperId: extra.latestPaperId }),
    });
    return;
  }
  await Assignment.findByIdAndUpdate(assignmentId, {
    status,
    ...(extra?.generationError !== undefined && {
      generationError: extra.generationError,
    }),
    ...(extra?.latestPaperId && { latestPaperId: extra.latestPaperId }),
  });
}

export async function deleteAssignmentFiles(assignment: IAssignment): Promise<void> {
  if (assignment.sourceFile?.path) {
    try {
      await fs.unlink(assignment.sourceFile.path);
    } catch {
      /* file may already be removed */
    }
  }
}
