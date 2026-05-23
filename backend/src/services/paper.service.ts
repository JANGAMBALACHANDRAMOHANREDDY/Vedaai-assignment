import { env } from "../config/env.js";
import { GeneratedPaper, type IGeneratedPaper } from "../models/GeneratedPaper.js";
import { Assignment } from "../models/Assignment.js";
import { fileStore } from "../simple/fileStore.js";
import type { ExamPaperContent } from "../types/examPaper.js";

export async function saveGeneratedPaper(
  assignmentId: string,
  content: ExamPaperContent,
  promptSnapshot?: string
): Promise<IGeneratedPaper> {
  if (env.simpleDev) {
    return fileStore.savePaper(
      assignmentId,
      content,
      promptSnapshot
    ) as unknown as IGeneratedPaper;
  }

  const latest = await GeneratedPaper.findOne({ assignmentId })
    .sort({ version: -1 })
    .select("version");

  const version = (latest?.version ?? 0) + 1;

  const paper = await GeneratedPaper.create({
    assignmentId,
    version,
    content,
    promptSnapshot,
  });

  await Assignment.findByIdAndUpdate(assignmentId, {
    latestPaperId: paper._id,
    status: "completed",
    generationError: undefined,
  });

  return paper;
}

export async function getPaperById(id: string): Promise<IGeneratedPaper | null> {
  if (env.simpleDev) {
    return fileStore.getPaper(id) as unknown as IGeneratedPaper | null;
  }
  return GeneratedPaper.findById(id).populate("assignmentId");
}

export async function getLatestPaperForAssignment(
  assignmentId: string
): Promise<IGeneratedPaper | null> {
  if (env.simpleDev) {
    return fileStore.getLatestPaper(assignmentId) as unknown as IGeneratedPaper | null;
  }
  return GeneratedPaper.findOne({ assignmentId }).sort({ version: -1 });
}
