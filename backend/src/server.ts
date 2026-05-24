/* Starts the HTTP server after infrastructure initialization. */

import { connectDB } from "./config/db";
import "./config/redis";
import { env } from "./config/env";
import { createApp } from "./app";
import { logger } from "./utils/logger";

async function startServer(): Promise<void> {
  await connectDB();

  const app = createApp();

  app.listen(env.PORT, () => {
    logger.info("Server started", { port: env.PORT });
  });
}

startServer().catch((error) => {
  logger.error("Server startup failed", error);
  process.exit(1);
});
