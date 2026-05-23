import express from "express";
import cors from "cors";
import { createServer } from "http";
import { env } from "./config/env.js";
import { connectDatabase } from "./config/database.js";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { initSocket, emitGenerationUpdate } from "./socket/index.js";
import { subscribeGenerationUpdates } from "./services/generationEvents.service.js";
import { logger } from "./utils/logger.js";

async function bootstrap(): Promise<void> {
  if (env.simpleDev) {
    logger.info(
      "SIMPLE_DEV mode — file storage in ./data, no MongoDB/Redis/worker needed"
    );
  } else {
    await connectDatabase();
  }

  const app = express();
  const httpServer = createServer(app);

  initSocket(httpServer);

  if (!env.simpleDev) {
    subscribeGenerationUpdates((payload) => {
      emitGenerationUpdate(payload);
    });
  }

  app.use(
    cors({
      origin: env.corsOrigin,
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/health", (_req, res) => {
    res.json({
      status: "ok",
      mode: env.simpleDev ? "simple" : "production",
      timestamp: new Date().toISOString(),
    });
  });

  app.use("/api", routes);

  app.use(errorHandler);

  httpServer.listen(env.port, () => {
    logger.info(`API server listening on http://localhost:${env.port}`);
    if (env.simpleDev) {
      logger.info("Open frontend: http://localhost:3000");
    }
  });
}

bootstrap().catch((err) => {
  logger.error("Failed to start server", err);
  process.exit(1);
});
