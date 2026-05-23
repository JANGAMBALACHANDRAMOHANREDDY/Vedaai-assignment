import { Router } from "express";
import { upload } from "../middleware/upload.js";
import {
  createAssignmentHandler,
  generateHandler,
  getAssignmentHandler,
  listAssignmentsHandler,
  regenerateHandler,
} from "../controllers/assignment.controller.js";

const router = Router();

router.get("/", listAssignmentsHandler);
router.post("/", upload.single("file"), createAssignmentHandler);
router.get("/:id", getAssignmentHandler);
router.post("/:id/generate", generateHandler);
router.post("/:id/regenerate", regenerateHandler);

export default router;
