/* Configures the BullMQ queue for paper generation jobs. */

import { Queue } from "bullmq";
import { redisConnection } from "../config/redis";
import type { PaperGenerationJob } from "../types/paper.types";

export const PAPER_GENERATION_QUEUE_NAME = "paper-generation";
const PAPER_JOB_ATTEMPTS = 3;
const PAPER_JOB_BACKOFF_DELAY_MS = 2000;
const PAPER_JOB_REMOVE_ON_COMPLETE_COUNT = 1000;
const PAPER_JOB_REMOVE_ON_FAIL_COUNT = 500;

export const paperGenerationQueue = new Queue<PaperGenerationJob>(
  PAPER_GENERATION_QUEUE_NAME,
  {
    connection: redisConnection,
    defaultJobOptions: {
      attempts: PAPER_JOB_ATTEMPTS,
      backoff: {
        type: "exponential",
        delay: PAPER_JOB_BACKOFF_DELAY_MS,
      },
      removeOnComplete: {
        count: PAPER_JOB_REMOVE_ON_COMPLETE_COUNT,
      },
      removeOnFail: {
        count: PAPER_JOB_REMOVE_ON_FAIL_COUNT,
      },
    },
  }
);
