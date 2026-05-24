/* Handles paper retrieval HTTP request and response flow. */

import type { Request, Response } from "express";
import { PaperService } from "../services/paper.service";

export async function getPaperByAssignmentId(
  req: Request<{ assignmentId: string }>,
  res: Response
): Promise<void> {
  try {
    const paper = await PaperService.getPaperByAssignmentId(req.params.assignmentId);

    if (!paper) {
      res.status(404).json({
        success: false,
        message: "Paper not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        paper,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch paper";

    res.status(500).json({
      success: false,
      message,
    });
  }
}
