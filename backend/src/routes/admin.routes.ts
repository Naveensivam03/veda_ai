/* Registers admin endpoints. */

import { Router } from "express";
import {
  adminLogin,
  getTeachers,
  restoreLimit,
} from "../controllers/admin.controller";

const adminRouter = Router();

adminRouter.post("/login", adminLogin);
adminRouter.get("/teachers", getTeachers);
adminRouter.post("/restore-limit", restoreLimit);

export { adminRouter };
