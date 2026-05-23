import dotenv from "dotenv";
import path from "path";

dotenv.config();

export const env = {
  simpleDev:
    process.env.SIMPLE_DEV === "true" || process.env.SIMPLE_DEV === "1",
  port: parseInt(process.env.PORT || "4000", 10),
  mongodbUri: process.env.MONGODB_URI || "mongodb://localhost:27017/assessment_creator",
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
  },
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  openaiApiKey: process.env.OPENAI_API_KEY || "",
  openaiModel: process.env.OPENAI_MODEL || "gpt-4o-mini",
  uploadDir: path.resolve(process.env.UPLOAD_DIR || "./uploads"),
};
