/* Starts the HTTP server after infrastructure initialization. */

import { connectDB } from "./config/db";
import "./config/redis";
import { env } from "./config/env";
import { createApp } from "./app";
import { logger } from "./utils/logger";

async function startServer(): Promise<void> {
  await connectDB();

  // Run the background worker inside the same process in production (e.g., Render Free Tier)
  if (
    process.env.NODE_ENV === "production" ||
    process.env.START_WORKER === "true" ||
    Boolean(process.env.REDIS_URL)
  ) {
    logger.info("Starting background worker inline...");
    import("./workers/paper.worker").catch((error) => {
      logger.error("Failed to start background worker inline", error);
    });
  }

  const app = createApp();

  app.listen(env.PORT, () => {
    logger.info("Server started", { port: env.PORT });
  });
}

startServer().catch((error) => {
  logger.error("Server startup failed", error);
  process.exit(1);
});
