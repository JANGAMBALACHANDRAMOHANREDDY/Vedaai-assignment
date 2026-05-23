"use client";

import { useEffect, useCallback } from "react";
import { getSocket, type GenerationUpdate } from "@/lib/socket";
import { useGenerationStore } from "@/store/generationStore";

export function useGenerationSocket(assignmentId: string | null) {
  const setUpdate = useGenerationStore((s) => s.setUpdate);

  const join = useCallback(() => {
    if (!assignmentId) return;
    const socket = getSocket();
    if (!socket.connected) socket.connect();
    socket.emit("join", { assignmentId });
  }, [assignmentId]);

  useEffect(() => {
    if (!assignmentId) return;

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
