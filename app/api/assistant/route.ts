// app/api/assistant/route.ts
import { AssistantResponse } from "ai";
import OpenAI from "openai";

// Create an OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    // Parse the request body to include assistantId
    const input: {
      threadId: string | null;
      message: string;
      assistantId?: string; // Make assistantId optional initially or require it
    } = await req.json();

    // --- Get Assistant ID ---
    // Prioritize assistantId from request body, fall back to env variable if needed, or error
    const assistantIdToUse = input.assistantId || process.env.ASSISTANT_ID;
    if (!assistantIdToUse) {
      console.error(
        "Error: Assistant ID is missing in request body and environment variables."
      );
      return new Response(
        JSON.stringify({ error: "Assistant ID is required." }),
        { status: 400 }
      );
    }
    console.log(`Using Assistant ID: ${assistantIdToUse}`); // Log which assistant is used

    // Create a thread if needed (or use existing one)
    const threadId =
      input.threadId ?? (await openai.beta.threads.create({})).id;
    console.log(`Using Thread ID: ${threadId}`);

    // Add a message to the thread
    const createdMessage = await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: input.message,
    });

    // Use Vercel's AssistantResponse helper
    return AssistantResponse(
      { threadId: threadId, messageId: createdMessage.id },
      async ({ forwardStream }) => {
        // Create a run stream using the selected assistantId
        const runStream = openai.beta.threads.runs.stream(threadId, {
          assistant_id: assistantIdToUse, // Use the ID from input/env
        });

        // Forward the run stream results to the client
        await forwardStream(runStream);
      }
    );
  } catch (error) {
    console.error("API Route Error:", error);
    // Basic error response
    let errorMessage = "An internal server error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
    });
  }
}
