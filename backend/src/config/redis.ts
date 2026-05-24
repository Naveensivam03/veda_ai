/* Creates and exports the shared Redis connection. */

import IORedis from "ioredis";
import { env } from "./env";
import { logger } from "../utils/logger";

export const redisConnection = new IORedis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
});

redisConnection.on("connect", () => {
  logger.info("Redis connected", {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
  });
});

redisConnection.on("error", (error: Error) => {
  logger.error("Redis connection error", error);
});
