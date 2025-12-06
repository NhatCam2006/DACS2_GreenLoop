/// <reference path="./types/express.d.ts" />
import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { healthRouter } from "./routes/health";
import { authRouter } from "./routes/auth";
import { userRouter } from "./routes/users";
import { addressRouter } from "./routes/addresses";
import { wasteCategoryRouter } from "./routes/waste-categories";
import { donationRequestRouter } from "./routes/donation-requests";
import { transactionRouter } from "./routes/transactions";
import { rewardRouter } from "./routes/rewards";
import { uploadRouter } from "./routes/upload";
import notificationRouter from "./routes/notifications";
import chatbotRouter from "./routes/chatbot";
import { notFoundHandler, errorHandler } from "./middlewares/error-handlers";

export const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("dev"));
  app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

  app.get("/", (_req, res) => {
    res.json({ message: "Recycling API - Phase 0", uptime: process.uptime() });
  });

  app.use("/api/auth", authRouter);
  app.use("/api/users", userRouter);
  app.use("/api/addresses", addressRouter);
  app.use("/api/waste-categories", wasteCategoryRouter);
  app.use("/api/donation-requests", donationRequestRouter);
  app.use("/api/transactions", transactionRouter);
  app.use("/api/rewards", rewardRouter);
  app.use("/api/upload", uploadRouter);
  app.use("/api/notifications", notificationRouter);
  app.use("/api/chatbot", chatbotRouter);
  app.use("/health", healthRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
