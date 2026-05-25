/* Registers assignment endpoints. */

import { Router } from "express";
import {
  createAssignment,
  deleteAssignment,
  getAssignment,
  getAssignmentStatus,
  listAssignments,
} from "../controllers/assignment.controller";

const assignmentRouter = Router();

assignmentRouter.get("/", listAssignments);
assignmentRouter.post("/", createAssignment);
assignmentRouter.get("/:id", getAssignment);
(assignmentRouter as any).delete("/:id", deleteAssignment);
assignmentRouter.get("/:id/status", getAssignmentStatus);

export { assignmentRouter };
