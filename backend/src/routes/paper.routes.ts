/* Registers paper endpoints. */

import { Router } from "express";
import { getPaperByAssignmentId } from "../controllers/paper.controller";

const paperRouter = Router();

paperRouter.get("/:assignmentId", getPaperByAssignmentId);

export { paperRouter };
