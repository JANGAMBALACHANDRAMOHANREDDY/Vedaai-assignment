import { POST as generatePost } from "../generate/route";

export const maxDuration = 60;

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  return generatePost(request, context);
}
