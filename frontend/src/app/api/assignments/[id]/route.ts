import { NextResponse } from "next/server";
import { store } from "@/lib/server/store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const assignment = store.getAssignment(id);
  if (!assignment) {
    return NextResponse.json(
      { success: false, message: "Assignment not found" },
      { status: 404 }
    );
  }
  const latestPaper = store.getLatestPaper(id) ?? null;
  return NextResponse.json({
    success: true,
    data: { assignment, latestPaper },
  });
}
