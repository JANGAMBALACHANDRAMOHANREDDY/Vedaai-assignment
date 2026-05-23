import { env } from "./env.js";

export const redisConnection = {
  host: env.redis.host,
  port: env.redis.port,
  maxRetriesPerRequest: null as null,
};
