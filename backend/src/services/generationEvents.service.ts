import Redis from "ioredis";
import { redisConnection } from "../config/redis.js";
import type { GenerationUpdatePayload } from "../socket/index.js";

export const GENERATION_CHANNEL = "generation:updates";

let publisher: Redis | null = null;
let subscriber: Redis | null = null;

function getPublisher(): Redis {
  if (!publisher) {
    publisher = new Redis(redisConnection);
  }
  return publisher;
}

export async function publishGenerationUpdate(
  payload: GenerationUpdatePayload
): Promise<void> {
  await getPublisher().publish(GENERATION_CHANNEL, JSON.stringify(payload));
}

export function subscribeGenerationUpdates(
  handler: (payload: GenerationUpdatePayload) => void
): void {
  if (subscriber) return;

  subscriber = new Redis(redisConnection);
  subscriber.subscribe(GENERATION_CHANNEL);
  subscriber.on("message", (_channel, message) => {
    try {
      const payload = JSON.parse(message) as GenerationUpdatePayload;
      handler(payload);
    } catch {
      /* ignore malformed */
    }
  });
}
