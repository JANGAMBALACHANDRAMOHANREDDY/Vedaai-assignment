import { create } from "zustand";

interface GenerationState {
  status: string;
  progress: number;
  paperId: string | null;
  error: string | null;
  isGenerating: boolean;
  setUpdate: (payload: {
    status: string;
    progress?: number;
    paperId?: string;
    error?: string;
  }) => void;
  reset: () => void;
}

export const useGenerationStore = create<GenerationState>((set) => ({
  status: "idle",
  progress: 0,
  paperId: null,
  error: null,
  isGenerating: false,

  setUpdate: ({ status, progress, paperId, error }) =>
    set({
      status,
      progress: progress ?? 0,
      paperId: paperId ?? null,
      error: error ?? null,
      isGenerating: ["queued", "processing"].includes(status),
    }),

  reset: () =>
    set({
      status: "idle",
      progress: 0,
      paperId: null,
      error: null,
      isGenerating: false,
    }),
}));
