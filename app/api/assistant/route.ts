// app/api/assistant/route.ts
import { AssistantResponse } from "ai";
import OpenAI from "openai";

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// Allow streaming responses up to 60 seconds
export const maxDuration = 60;

export async function POST(req: Request) {
  // Parse the request body
  const input: {
    threadId: string | null; // Thread ID can be null if it's a new conversation
    message: string;
  } = await req.json();

  // Retrieve the Assistant ID from environment variables
  const assistantId = process.env.ASSISTANT_ID;
  if (!assistantId) {
    return new Response(
      JSON.stringify({
        error: "ASSISTANT_ID is not set in environment variables.",
      }),
      { status: 500 }
    );
  }

  // Create a thread if needed
  const threadId = input.threadId ?? (await openai.beta.threads.create({})).id;

  // Add a message to the thread
  const createdMessage = await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: input.message,
  });

  // Use Vercel's AssistantResponse helper to handle streaming
  return AssistantResponse(
    { threadId: threadId, messageId: createdMessage.id },
    async ({ forwardStream }) => {
      // Create a run stream
      const runStream = openai.beta.threads.runs.stream(threadId, {
        assistant_id: assistantId,
        // Optional: Set additional instructions or parameters for this specific run
        // instructions: "Please address the user as Jane Doe.",
      });

      // Forward the run stream results to the client
      // This utility handles all the events from the Assistants API
      await forwardStream(runStream);
    }
  );
}
