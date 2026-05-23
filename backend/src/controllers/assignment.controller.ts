import type { Request, Response, NextFunction } from "express";
import {
  createAssignment,
  getAssignmentById,
  listAssignments,
  regeneratePaper,
  startGeneration,
} from "../services/assignment.service.js";
import { createAssignmentSchema } from "../validators/assignment.validator.js";
import { AppError } from "../middleware/errorHandler.js";
import { extractTextFromFile } from "../utils/fileExtract.js";
import { getLatestPaperForAssignment } from "../services/paper.service.js";
import { paramId } from "../utils/param.js";

export async function createAssignmentHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = createAssignmentSchema.parse(req.body);
    let sourceFile;

    if (req.file) {
      const extractedText = await extractTextFromFile(
        req.file.path,
        req.file.mimetype
      );
      sourceFile = {
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        path: req.file.path,
        extractedText,
      };
    }

    const assignment = await createAssignment({ ...body, sourceFile });
    res.status(201).json({ success: true, data: assignment });
  } catch (err) {
    next(err);
  }
}

export async function listAssignmentsHandler(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const assignments = await listAssignments();
    res.json({ success: true, data: assignments });
  } catch (err) {
    next(err);
  }
}

export async function getAssignmentHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = paramId(req.params.id);
    const assignment = await getAssignmentById(id);
    if (!assignment) {
      throw new AppError(404, "Assignment not found");
    }
    const paper = await getLatestPaperForAssignment(id);
    res.json({
      success: true,
      data: { assignment, latestPaper: paper },
    });
  } catch (err) {
    next(err);
  }
}

export async function generateHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const assignment = await startGeneration(paramId(req.params.id));
    res.json({
      success: true,
      data: assignment,
      message: "Generation queued",
    });
  } catch (err) {
    if (err instanceof Error && err.message === "Assignment not found") {
      next(new AppError(404, err.message));
      return;
    }
    next(err);
  }
}

export async function regenerateHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const assignment = await regeneratePaper(paramId(req.params.id));
    res.json({
      success: true,
      data: assignment,
      message: "Regeneration queued",
    });
  } catch (err) {
    if (err instanceof Error && err.message === "Assignment not found") {
      next(new AppError(404, err.message));
      return;
    }
    next(err);
  }
}
