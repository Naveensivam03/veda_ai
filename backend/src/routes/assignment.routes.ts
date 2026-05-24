/* Registers assignment endpoints. */

import { Router } from "express";
import {
  createAssignment,
  getAssignmentStatus,
  listAssignments,
} from "../controllers/assignment.controller";

const assignmentRouter = Router();

assignmentRouter.get("/", listAssignments);
assignmentRouter.post("/", createAssignment);
assignmentRouter.get("/:id/status", getAssignmentStatus);

export { assignmentRouter };
