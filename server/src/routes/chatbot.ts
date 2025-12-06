import { Router } from "express";
import { chatbotController } from "../modules/chatbot/chatbot.controller";

const router = Router();

// Public endpoint - no auth required for chatbot
router.post("/", chatbotController.chat);

export default router;
