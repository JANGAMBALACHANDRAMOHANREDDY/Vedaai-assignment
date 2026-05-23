import { NextResponse } from "next/server";
import { store } from "@/lib/server/store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const paper = store.getPaper(id);
  if (!paper) {
    return NextResponse.json(
      { success: false, message: "Paper not found" },
      { status: 404 }
    );
  }
  const assignment = store.getAssignment(paper.assignmentId);
  return NextResponse.json({
    success: true,
    data: { paper, assignment },
  });
}
