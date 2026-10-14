import { GoogleGenerativeAI } from "@google/generative-ai";

// Model verified working on this account (gemini-2.5-flash returns 404 for
// new API users). Override with GEMINI_MODEL if a newer model is available.
export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";

export const AI_NOT_CONFIGURED = {
  error: "AI is not configured",
  message:
    "Set the GEMINI_API_KEY environment variable to enable content generation.",
} as const;

export function getGeminiClient(): GoogleGenerativeAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenerativeAI(apiKey);
}

export function getTextModel() {
  const client = getGeminiClient();
  if (!client) return null;
  return client.getGenerativeModel({ model: GEMINI_MODEL });
}
