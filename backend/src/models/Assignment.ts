import mongoose, { Schema, Document, Types } from "mongoose";
import type { AssignmentStatus } from "../types/assignment.js";

export interface ISourceFile {
  filename: string;
  mimetype: string;
  path: string;
  extractedText?: string;
}

export interface IAssignment extends Document {
  title: string;
  subject?: string;
  dueDate: Date;
  questionTypes: string[];
  numberOfQuestions: number;
  totalMarks: number;
  additionalInstructions?: string;
  sourceFile?: ISourceFile;
  status: AssignmentStatus;
  generationError?: string;
  latestPaperId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const sourceFileSchema = new Schema<ISourceFile>(
  {
    filename: { type: String, required: true },
    mimetype: { type: String, required: true },
    path: { type: String, required: true },
    extractedText: { type: String },
  },
  { _id: false }
);

const assignmentSchema = new Schema<IAssignment>(
  {
    title: { type: String, required: true, trim: true },
    subject: { type: String, trim: true },
    dueDate: { type: Date, required: true },
    questionTypes: { type: [String], required: true },
    numberOfQuestions: { type: Number, required: true, min: 1 },
    totalMarks: { type: Number, required: true, min: 1 },
    additionalInstructions: { type: String },
    sourceFile: sourceFileSchema,
    status: {
      type: String,
      enum: ["draft", "queued", "processing", "completed", "failed"],
      default: "draft",
    },
    generationError: { type: String },
    latestPaperId: { type: Schema.Types.ObjectId, ref: "GeneratedPaper" },
  },
  { timestamps: true }
);

assignmentSchema.index({ createdAt: -1 });

export const Assignment = mongoose.model<IAssignment>("Assignment", assignmentSchema);
