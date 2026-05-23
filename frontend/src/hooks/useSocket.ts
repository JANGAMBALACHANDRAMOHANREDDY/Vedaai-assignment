"use client";

import { useEffect, useCallback } from "react";
import { getSocket, type GenerationUpdate } from "@/lib/socket";
import { useGenerationStore } from "@/store/generationStore";
import { api } from "@/lib/api";

const useHostedApi = Boolean(
  process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.length > 0
);

export function useGenerationSocket(assignmentId: string | null) {
  const setUpdate = useGenerationStore((s) => s.setUpdate);

  const join = useCallback(() => {
    if (!assignmentId || !useHostedApi) return;
    const socket = getSocket();
    if (!socket.connected) socket.connect();
    socket.emit("join", { assignmentId });
  }, [assignmentId]);

  useEffect(() => {
    if (!assignmentId) return;

    if (!useHostedApi) {
      const poll = async () => {
        try {
          const data = await api.getAssignment(assignmentId);
          const a = data.assignment as {
            status: string;
            latestPaperId?: string;
            generationError?: string;
          };
          const paper = data.latestPaper as { _id: string } | null;
          setUpdate({
            status: a.status,
            progress: a.status === "completed" ? 100 : a.status === "processing" ? 50 : 10,
            paperId: paper?._id ?? a.latestPaperId,
            error: a.generationError,
          });
        } catch {
          /* ignore poll errors */
        }
      };
      poll();
      const interval = setInterval(poll, 2000);
      return () => clearInterval(interval);
    }

    const socket = getSocket();
    join();

    const handler = (payload: GenerationUpdate) => {
      if (payload.assignmentId !== assignmentId) return;
      setUpdate({
        status: payload.status,
        progress: payload.progress,
        paperId: payload.paperId,
        error: payload.error,
      });
    };

    socket.on("generation:update", handler);

    return () => {
      socket.off("generation:update", handler);
    };
  }, [assignmentId, join, setUpdate]);

  return { join };
}
