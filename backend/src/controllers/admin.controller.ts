/* Handles administrative control HTTP request and response flow. */

import type { Response } from "express";
import { env } from "../config/env";
import { UserModel } from "../models/User";
import { logger } from "../utils/logger";

function checkAdminAuth(req: any): boolean {
  const authHeader = req.headers?.authorization;
  const adminPasswordHeader = req.headers?.["x-admin-password"];
  
  const expectedPassword = env.ADMIN_PASSWORD;
  
  if (adminPasswordHeader === expectedPassword) {
    return true;
  }
  
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    if (token === expectedPassword) {
      return true;
    }
  }
  
  return false;
}

export async function adminLogin(
  req: any,
  res: Response
): Promise<void> {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
      return;
    }

    if (username === env.ADMIN_USERNAME && password === env.ADMIN_PASSWORD) {
      res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          token: env.ADMIN_PASSWORD, // Simple stateless token
        },
      });
      logger.info("Admin login successful");
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid admin credentials",
      });
      logger.warn("Failed admin login attempt", { username });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    res.status(500).json({
      success: false,
      message,
    });
  }
}

export async function getTeachers(
  req: any,
  res: Response
): Promise<void> {
  try {
    if (!checkAdminAuth(req)) {
      res.status(403).json({
        success: false,
        message: "Unauthorized admin access",
      });
      return;
    }

    const teachers = await UserModel.find().lean();

    res.status(200).json({
      success: true,
      data: teachers,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch teachers";
    res.status(500).json({
      success: false,
      message,
    });
  }
}

export async function restoreLimit(
  req: any,
  res: Response
): Promise<void> {
  try {
    if (!checkAdminAuth(req)) {
      res.status(403).json({
        success: false,
        message: "Unauthorized admin access",
      });
      return;
    }

    const { teacherId, credits } = req.body;

    if (!teacherId) {
      res.status(400).json({
        success: false,
        message: "teacherId is required",
      });
      return;
    }

    const targetCredits = typeof credits === "number" ? credits : 3;

    const teacher = await UserModel.findByIdAndUpdate(
      teacherId,
      { generationCredits: targetCredits },
      { new: true }
    );

    if (!teacher) {
      res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
      return;
    }

    logger.info("Admin restored AI generation limit for teacher", {
      teacherId,
      restoredCredits: targetCredits,
    });

    res.status(200).json({
      success: true,
      message: `Successfully restored AI generation credits to ${targetCredits}`,
      data: teacher,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to restore limit";
    res.status(500).json({
      success: false,
      message,
    });
  }
}
