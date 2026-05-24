/* Centralizes queue interactions for background processing. */

import { paperGenerationQueue } from "../queues/paper.queue";
import { logger } from "../utils/logger";

export class QueueService {
  static async enqueuePaperGeneration(assignmentId: string): Promise<void> {
    await paperGenerationQueue.add(
      "generate-paper",
      { assignmentId },
      { jobId: assignmentId }
    );
    logger.info("Job queued", { assignmentId });
  }
}
