import "server-only";
import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export const getResponseFromText = async (question: string) => {
  const model = google("gemini-1.5-flash"); // or "gemini-1.5-pro"
  const result = streamText({
    model,
    prompt: question,
  });

  return result.toTextStreamResponse();
};
