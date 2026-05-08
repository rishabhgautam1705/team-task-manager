import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import pinoHttp from "pino-http";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import {
  apiLimiter,
  corsOptions,
  csrfProtection,
  issueCsrfToken,
  sanitizeRequest,
} from "./middleware/securityMiddleware.js";
import { csrfTokens, isProduction } from "./config/security.js";

dotenv.config();

const app = express();

app.set("trust proxy", 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors(corsOptions));
app.use(apiLimiter);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());
app.use(sanitizeRequest);
app.use(issueCsrfToken);
app.use(csrfProtection);
app.use(isProduction ? pinoHttp() : morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "TeamTask API is healthy" });
});

app.get("/api/csrf-token", (req, res) => {
  res.json({ success: true, csrfToken: csrfTokens.create(req.csrfSecret) });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/notifications", notificationRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
