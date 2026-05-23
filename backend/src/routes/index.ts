import { Router } from "express";
import assignmentRoutes from "./assignment.routes.js";
import paperRoutes from "./paper.routes.js";

const router = Router();

router.use("/assignments", assignmentRoutes);
router.use("/papers", paperRoutes);

export default router;
