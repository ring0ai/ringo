import "server-only";
import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export const model = google("gemini-2.0-flash");

export const getResponseFromText = async (question: string) => {
  const result = streamText({
    model,
    prompt: question,
  });

  return result.toTextStreamResponse();
};
