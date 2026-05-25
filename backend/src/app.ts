/* Configures the Express application instance. */

import express from "express";
import { assignmentRouter } from "./routes/assignment.routes";
import { dashboardRouter } from "./routes/dashboard.routes";
import { paperRouter } from "./routes/paper.routes";
import { adminRouter } from "./routes/admin.routes";

export function createApp() {
  const app = express();

  // Allow cross-origin requests from the Next.js frontend
  app.use(((req: any, res: any, next: any) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-admin-password");
    
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
      return;
    }
    
    next();
  }) as any);

  app.use(express.json());
  app.use("/api/dashboard", dashboardRouter);
  app.use("/api/assignments", assignmentRouter);
  app.use("/api/papers", paperRouter);
  app.use("/api/admin", adminRouter);

  return app;
}
