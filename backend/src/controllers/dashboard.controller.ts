/* Handles dashboard HTTP request flow. */

import type { Request, Response } from "express";
import { DashboardService } from "../services/dashboard.service";

export async function getDashboard(
  req: Request<{ teacherId: string }>,
  res: Response
): Promise<void> {
  try {
    const dashboard = await DashboardService.getDashboard(req.params.teacherId);

    if (!dashboard) {
      res.status(404).json({
        success: false,
        message: "Teacher dashboard not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch dashboard";

    res.status(500).json({
      success: false,
      message,
    });
  }
}
