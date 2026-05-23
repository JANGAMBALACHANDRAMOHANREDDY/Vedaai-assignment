const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: Record<string, string[]>
  ) {
    super(message);
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  const json = await res.json();
  if (!res.ok) {
    throw new ApiError(
      json.message || "Request failed",
      res.status,
      json.errors
    );
  }
  return json;
}

export const api = {
  async getAssignments() {
    const res = await fetch(`${API_URL}/api/assignments`);
    const json = await handleResponse<{ success: boolean; data: unknown[] }>(res);
    return json.data;
  },

  async getAssignment(id: string) {
    const res = await fetch(`${API_URL}/api/assignments/${id}`);
    const json = await handleResponse<{
      success: boolean;
      data: { assignment: unknown; latestPaper: unknown | null };
    }>(res);
    return json.data;
  },

  async createAssignment(formData: FormData) {
    const res = await fetch(`${API_URL}/api/assignments`, {
      method: "POST",
      body: formData,
    });
    const json = await handleResponse<{ success: boolean; data: { _id: string } }>(res);
    return json.data;
  },

  async generatePaper(assignmentId: string) {
    const res = await fetch(`${API_URL}/api/assignments/${assignmentId}/generate`, {
      method: "POST",
    });
    const json = await handleResponse<{ success: boolean; data: unknown }>(res);
    return json.data;
  },

  async regeneratePaper(assignmentId: string) {
    const res = await fetch(`${API_URL}/api/assignments/${assignmentId}/regenerate`, {
      method: "POST",
    });
    const json = await handleResponse<{ success: boolean; data: unknown }>(res);
    return json.data;
  },

  async getPaper(id: string) {
    const res = await fetch(`${API_URL}/api/papers/${id}`);
    const json = await handleResponse<{
      success: boolean;
      data: { paper: unknown; assignment: unknown };
    }>(res);
    return json.data;
  },

  async getPaperByAssignment(assignmentId: string) {
    const res = await fetch(`${API_URL}/api/papers/assignment/${assignmentId}`);
    const json = await handleResponse<{
      success: boolean;
      data: { paper: unknown; assignment: unknown };
    }>(res);
    return json.data;
  },
};
