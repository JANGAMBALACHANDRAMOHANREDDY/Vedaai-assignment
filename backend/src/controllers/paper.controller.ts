import type { Request, Response, NextFunction } from "express";
import { getLatestPaperForAssignment, getPaperById } from "../services/paper.service.js";
import { getAssignmentById } from "../services/assignment.service.js";
import { AppError } from "../middleware/errorHandler.js";
import { paramId } from "../utils/param.js";

export async function getPaperHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const paper = await getPaperById(paramId(req.params.id));
    if (!paper) {
      throw new AppError(404, "Paper not found");
    }
    const assignmentId =
      typeof paper.assignmentId === "string"
        ? paper.assignmentId
        : paper.assignmentId.toString();
    const assignment = await getAssignmentById(assignmentId);
    res.json({
      success: true,
      data: { paper, assignment },
    });
  } catch (err) {
    next(err);
  }
}

export async function getPaperByAssignmentHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const assignmentId = paramId(req.params.assignmentId);
    const paper = await getLatestPaperForAssignment(assignmentId);
    if (!paper) {
      throw new AppError(404, "No paper generated yet");
    }
    const assignment = await getAssignmentById(assignmentId);
    res.json({
      success: true,
      data: { paper, assignment },
    });
  } catch (err) {
    next(err);
  }
}
