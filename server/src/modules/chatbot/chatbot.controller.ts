import { Request, Response } from "express";
import { chatbotService } from "./chatbot.service";

export const chatbotController = {
  async chat(req: Request, res: Response) {
    try {
      const { message, history } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).json({
          success: false,
          message: "Message is required",
        });
      }

      const result = await chatbotService.chat(message, history || []);

      return res.json(result);
    } catch (error: any) {
      console.error("Chat error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },
};
