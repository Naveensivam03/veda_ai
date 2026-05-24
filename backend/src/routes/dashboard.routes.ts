/* Registers dashboard endpoints. */

import { Router } from "express";
import { getDashboard } from "../controllers/dashboard.controller";

const dashboardRouter = Router();

dashboardRouter.get("/:teacherId", getDashboard);

export { dashboardRouter };
