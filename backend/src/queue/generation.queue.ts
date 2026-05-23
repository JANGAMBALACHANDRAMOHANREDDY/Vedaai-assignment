import { env } from "../config/env.js";
import { createQueue, GENERATION_QUEUE_NAME } from "./connection.js";
import { processGeneration } from "../services/generation.processor.js";
import { emitGenerationUpdate } from "../socket/index.js";
import { logger } from "../utils/logger.js";

export interface GenerationJobData {
  assignmentId: string;
}

export const generationQueue = env.simpleDev
  ? null
  : createQueue(GENERATION_QUEUE_NAME);

export async function enqueueGeneration(assignmentId: string): Promise<string> {
  if (env.simpleDev) {
    setImmediate(() => {
      processGeneration(assignmentId, emitGenerationUpdate).catch((err) => {
        logger.error("Inline generation failed", err);
      });
    });
    return assignmentId;
  }

  const job = await generationQueue!.add(
    "generate-paper",
    { assignmentId },
    {
      attempts: 3,
      backoff: { type: "exponential", delay: 2000 },
      removeOnComplete: 100,
      removeOnFail: 50,
    }
  );
  return job.id ?? assignmentId;
}
