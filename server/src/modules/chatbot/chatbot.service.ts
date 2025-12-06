import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../../config";

// Lazy initialization - genAI will be created when first needed
let genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(config.apiKey || "");
  }
  return genAI;
}

const SYSTEM_PROMPT = [
  "Ban la GreenBot - tro ly AI cua GreenLoop.",
  "GreenLoop ket noi nguoi quyen gop rac (Donor) voi nguoi thu gom (Collector).",
  "Donor nhan diem thuong khi quyen gop thanh cong.",
  "Tra loi ngan gon, than thien. Ho tro tieng Viet va tieng Anh.",
].join(" ");

// Rate limiter
let requestTimes: number[] = [];
const MAX_REQUESTS = 10;
const WINDOW_MS = 60000;

function canMakeRequest(): boolean {
  const now = Date.now();
  requestTimes = requestTimes.filter((t) => now - t < WINDOW_MS);
  return requestTimes.length < MAX_REQUESTS;
}

function addRequest(): void {
  requestTimes.push(Date.now());
}

// Fallback response
function getFallbackResponse(): string {
  return [
    "Xin chao! Toi la GreenBot.",
    "",
    "Toi co the giup ban voi:",
    "- Cach quyen gop rac tai che",
    "- Thong tin ve diem thuong",
    "- Cac loai rac co the tai che",
    "",
    "Vui long thu lai sau!",
  ].join("\n");
}

export const chatbotService = {
  async chat(
    message: string,
    history: Array<{ role: string; content: string }> = []
  ) {
    if (!canMakeRequest()) {
      return {
        success: true,
        message: getFallbackResponse(),
        rateLimited: true,
      };
    }

    try {
      addRequest();

      const model = getGenAI().getGenerativeModel({
        model: "gemini-2.5-flash",
      });

      const chatHistory = history.map((msg) => ({
        role: msg.role === "user" ? ("user" as const) : ("model" as const),
        parts: [{ text: msg.content }],
      }));

      const chat = model.startChat({
        history: [
          { role: "user" as const, parts: [{ text: SYSTEM_PROMPT }] },
          {
            role: "model" as const,
            parts: [{ text: "Da hieu! Toi la GreenBot." }],
          },
          ...chatHistory,
        ],
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.7,
        },
      });

      const result = await chat.sendMessage(message);
      const response = result.response.text();

      return { success: true, message: response };
    } catch (error: unknown) {
      console.error("Chatbot error:", error);
      return {
        success: true,
        message: getFallbackResponse(),
        rateLimited: true,
      };
    }
  },
};
