import { NextResponse } from "next/server";
import { store } from "@/lib/server/store";
import { generatePaperForAssignment } from "@/lib/server/generatePaper";

export const maxDuration = 60;

async function runGeneration(id: string) {
  const assignment = store.getAssignment(id);
  if (!assignment) throw new Error("Assignment not found");

  store.updateAssignment(id, { status: "processing", generationError: undefined });

  try {
    const content = await generatePaperForAssignment(assignment);
    const paper = store.savePaper(id, content);
    return { assignment: store.getAssignment(id), paperId: paper._id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed";
    store.updateAssignment(id, { status: "failed", generationError: message });
    throw err;
  }
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    store.updateAssignment(id, { status: "queued" });
    const result = await runGeneration(id);
    return NextResponse.json({
      success: true,
      data: result.assignment,
      paperId: result.paperId,
      message: "Generation completed",
    });
  } catch (err) {
    if (err instanceof Error && err.message === "Assignment not found") {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: err instanceof Error ? err.message : "Generation failed",
      },
      { status: 500 }
    );
  }
}
