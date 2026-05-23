import mongoose, { Schema, Document, Types } from "mongoose";
import type { ExamPaperContent } from "../types/examPaper.js";

export interface IGeneratedPaper extends Document {
  assignmentId: Types.ObjectId;
  version: number;
  content: ExamPaperContent;
  promptSnapshot?: string;
  createdAt: Date;
  updatedAt: Date;
}

const questionSchema = new Schema(
  {
    question: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    marks: { type: Number, required: true },
    type: { type: String },
  },
  { _id: false }
);

const sectionSchema = new Schema(
  {
    title: { type: String, required: true },
    instruction: { type: String, required: true },
    questions: { type: [questionSchema], required: true },
  },
  { _id: false }
);

const generatedPaperSchema = new Schema<IGeneratedPaper>(
  {
    assignmentId: {
      type: Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
      index: true,
    },
    version: { type: Number, required: true, default: 1 },
    content: {
      sections: { type: [sectionSchema], required: true },
    },
    promptSnapshot: { type: String },
  },
  { timestamps: true }
);

generatedPaperSchema.index({ assignmentId: 1, version: -1 });

export const GeneratedPaper = mongoose.model<IGeneratedPaper>(
  "GeneratedPaper",
  generatedPaperSchema
);
