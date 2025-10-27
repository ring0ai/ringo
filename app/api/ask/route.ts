// app/api/ask/route.ts
import { NextRequest } from "next/server";
import { streamText } from "ai";
import { model } from "@/lib/services/aiService";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  const stream = streamText({ model, prompt });

  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream.textStream) {
          const text = chunk.toString();
          controller.enqueue(new TextEncoder().encode(text));
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new Response(readableStream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
