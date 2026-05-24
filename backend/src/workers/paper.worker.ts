/* Starts the BullMQ worker for paper generation jobs. */

import { Worker } from "bullmq";
import { connectDB } from "../config/db";
import { redisConnection } from "../config/redis";
import { PAPER_GENERATION_QUEUE_NAME } from "../queues/paper.queue";
import { AssignmentService } from "../services/assignment.service";
import type { PaperGenerationJob } from "../types/paper.types";
import { logger } from "../utils/logger";

const PAPER_WORKER_CONCURRENCY = 5;

async function startWorker(): Promise<void> {
  await connectDB();

  const worker = new Worker<PaperGenerationJob>(
    PAPER_GENERATION_QUEUE_NAME,
    async (job) => {
      await AssignmentService.processPaperGeneration(job.data.assignmentId);
    },
    {
      connection: redisConnection,
      concurrency: PAPER_WORKER_CONCURRENCY,
    }
  );

  worker.on("completed", (job) => {
    logger.info("Worker job completed", {
      assignmentId: job.data.assignmentId,
      jobId: String(job.id),
    });
  });

  worker.on("failed", (job, error) => {
    logger.error("Worker job failed", error, {
      assignmentId: job?.data.assignmentId,
      jobId: job?.id ? String(job.id) : undefined,
    });
  });

  logger.info("Paper worker started", { queue: PAPER_GENERATION_QUEUE_NAME });
}

startWorker().catch((error) => {
  logger.error("Worker startup failed", error);
  process.exit(1);
});
