/* Handles assignment HTTP request and response flow. */

import type { Request, Response } from "express";
import { AssignmentService } from "../services/assignment.service";

export async function createAssignment(
  req: Request<{}, unknown, unknown>,
  res: Response
): Promise<void> {
  try {
    const result = await AssignmentService.createAssignment(req.body);

    res.status(201).json({
      success: true,
      message: "Assignment queued for generation",
      data: result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create assignment";
    const statusCode = message === "AI generation limit reached" ? 403 : 400;

    res.status(statusCode).json({
      success: false,
      message,
    });
  }
}

export async function getAssignmentStatus(
  req: Request<{ id: string }>,
  res: Response
): Promise<void> {
  try {
    const status = await AssignmentService.getAssignmentStatus(req.params.id);

    if (!status) {
      res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: status,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch assignment status";

    res.status(500).json({
      success: false,
      message,
    });
  }
}

export async function listAssignments(
  req: Request<any, any, any>,
  res: Response
): Promise<void> {
  try {
    const teacherId = ((req as any).query?.teacherId as string | undefined)?.trim();

    if (!teacherId) {
      res.status(400).json({
        success: false,
        message: "teacherId is required",
      });
      return;
    }

    const assignments = await AssignmentService.listAssignmentsByTeacher(teacherId);

    res.status(200).json({
      success: true,
      data: {
        assignments,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch assignments";

    res.status(500).json({
      success: false,
      message,
    });
  }
}
