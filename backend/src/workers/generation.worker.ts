import { connectDatabase } from "../config/database.js";
import { env } from "../config/env.js";
import { createWorker, GENERATION_QUEUE_NAME } from "../queue/connection.js";
import type { GenerationJobData } from "../queue/generation.queue.js";
import { processGeneration } from "../services/generation.processor.js";
import { publishGenerationUpdate } from "../services/generationEvents.service.js";
import { logger } from "../utils/logger.js";

async function main(): Promise<void> {
  if (env.simpleDev) {
    logger.info("SIMPLE_DEV is on — worker not required. Generation runs inside the API.");
    process.exit(0);
  }

  await connectDatabase();

  createWorker<GenerationJobData>(GENERATION_QUEUE_NAME, async (data) => {
    await processGeneration(data.assignmentId, publishGenerationUpdate);
  });

  logger.info("Generation worker started — waiting for jobs");
}

main().catch((err) => {
  logger.error("Worker failed to start", err);
  process.exit(1);
});
