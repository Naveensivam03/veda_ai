/* Creates and exports the shared Redis connection. */

import IORedis from "ioredis";
import { env } from "./env";
import { logger } from "../utils/logger";

export const redisConnection = env.REDIS_URL
  ? new IORedis(env.REDIS_URL, {
      maxRetriesPerRequest: null,
      enableReadyCheck: true,
    })
  : new IORedis({
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      maxRetriesPerRequest: null,
      enableReadyCheck: true,
    });

redisConnection.on("connect", () => {
  logger.info("Redis connected", {
    host: redisConnection.options.host,
    port: redisConnection.options.port,
  });
});

redisConnection.on("error", (error: Error) => {
  logger.error("Redis connection error", error);
});
