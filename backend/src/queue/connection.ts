import { Queue, Worker, type ConnectionOptions } from "bullmq";
import { redisConnection } from "../config/redis.js";

export const bullConnection: ConnectionOptions = redisConnection;

export const GENERATION_QUEUE_NAME = "paper-generation";

export function createQueue(name: string) {
  return new Queue(name, { connection: bullConnection });
}

export function createWorker<T>(
  name: string,
  processor: (data: T) => Promise<void>
) {
  return new Worker(
    name,
    async (job) => {
      await processor(job.data as T);
    },
    { connection: bullConnection }
  );
}
