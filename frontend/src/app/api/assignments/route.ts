import { NextResponse } from "next/server";
import { store } from "@/lib/server/store";
import { parseAssignmentForm } from "@/lib/server/parseAssignmentForm";

export async function GET() {
  return NextResponse.json({ success: true, data: store.listAssignments() });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const parsed = await parseAssignmentForm(formData);
    if (parsed.errors) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: parsed.errors },
        { status: 400 }
      );
    }
    const assignment = store.createAssignment(parsed.data!);
    return NextResponse.json({ success: true, data: assignment }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to create assignment" },
      { status: 500 }
    );
  }
}
