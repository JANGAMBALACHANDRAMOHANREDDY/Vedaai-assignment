import { Router } from "express";
import {
  getPaperByAssignmentHandler,
  getPaperHandler,
} from "../controllers/paper.controller.js";

const router = Router();

router.get("/:id", getPaperHandler);
router.get("/assignment/:assignmentId", getPaperByAssignmentHandler);

export default router;
