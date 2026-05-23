import { NextResponse } from "next/server";
import { store } from "@/lib/server/store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  const { assignmentId } = await params;
  const paper = store.getLatestPaper(assignmentId);
  if (!paper) {
    return NextResponse.json(
      { success: false, message: "No paper generated yet" },
      { status: 404 }
    );
  }
  const assignment = store.getAssignment(assignmentId);
  return NextResponse.json({
    success: true,
    data: { paper, assignment },
  });
}
