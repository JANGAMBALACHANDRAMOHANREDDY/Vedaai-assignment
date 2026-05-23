import type { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { env } from "../config/env.js";

let io: Server | null = null;

export interface GenerationUpdatePayload {
  assignmentId: string;
  status: string;
  progress?: number;
  paperId?: string;
  error?: string;
}

export function initSocket(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: env.corsOrigin,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("join", ({ assignmentId }: { assignmentId: string }) => {
      if (assignmentId) {
        socket.join(`assignment:${assignmentId}`);
      }
    });
  });

  return io;
}

export function emitGenerationUpdate(payload: GenerationUpdatePayload): void {
  if (!io) return;
  io.to(`assignment:${payload.assignmentId}`).emit("generation:update", payload);
}
