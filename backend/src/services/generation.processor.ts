import type { IAssignment } from "../models/Assignment.js";
import { buildGenerationPrompt } from "./prompt.service.js";
import { generateExamPaper } from "./ai.service.js";
import { saveGeneratedPaper } from "./paper.service.js";
import { updateAssignmentStatus, getAssignmentById } from "./assignment.service.js";
import type { GenerationUpdatePayload } from "../socket/index.js";
import { logger } from "../utils/logger.js";

export type GenerationEmitter = (
  payload: GenerationUpdatePayload
) => void | Promise<void>;

export async function processGeneration(
  assignmentId: string,
  emit: GenerationEmitter
): Promise<void> {
  const assignment = await getAssignmentById(assignmentId);
  if (!assignment) {
    throw new Error(`Assignment ${assignmentId} not found`);
  }

  const doc = assignment as IAssignment;

  await updateAssignmentStatus(assignmentId, "processing");
  await emit({ assignmentId, status: "processing", progress: 10 });

  const prompt = buildGenerationPrompt(doc);
  await emit({ assignmentId, status: "processing", progress: 40 });

  try {
    const { content } = await generateExamPaper(prompt, {
      title: doc.title,
      numberOfQuestions: doc.numberOfQuestions,
      totalMarks: doc.totalMarks,
    });

    await emit({ assignmentId, status: "processing", progress: 80 });

    const paper = await saveGeneratedPaper(assignmentId, content, prompt);
    const paperId =
      typeof paper._id === "string" ? paper._id : paper._id.toString();

    await emit({
      assignmentId,
      status: "completed",
      progress: 100,
      paperId,
    });

    logger.info(`Generated paper for assignment ${assignmentId}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed";
    await updateAssignmentStatus(assignmentId, "failed", {
      generationError: message,
    });
    await emit({ assignmentId, status: "failed", error: message });
    throw err;
  }
}
