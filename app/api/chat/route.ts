// app/api/chat/route.ts
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Ask OpenAI for a streaming text response
    const result = await streamText({
      model: openai("gpt-4o"), // Or use a different model like 'gpt-3.5-turbo'
      messages,
    });

    // Convert the response into a friendly text-stream
    return result.toDataStreamResponse();
  } catch (error) {
    // You might want to add more robust error handling here
    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }
    return new Response(JSON.stringify({ error: "Unknown error" }), {
      status: 500,
    });
  }
}
