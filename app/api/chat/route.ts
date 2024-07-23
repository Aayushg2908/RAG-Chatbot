import { createResource } from "@/actions/resources";
import { openai } from "@ai-sdk/openai";
import { generateText, tool } from "ai";
import { z } from "zod";
import { findRelevantContent } from "@/lib/ai/embedding";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { messages } from "@/db/schema";

export const maxDuration = 30;

export async function POST(req: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = user.id;
  const { message } = await req.json();
  console.log(message);

  await db.insert(messages).values({
    userId: userId,
    content: message,
    role: "user",
  });

  const result = await generateText({
    model: openai("gpt-3.5-turbo"),
    system: `You are a helpful assistant. Check your knowledge base before answering any questions.
    Only respond to questions using information from tool calls.
    if no relevant information is found in the tool calls, respond, "Sorry, I don't know."`,
    prompt: message,
    tools: {
      addResource: tool({
        description: `add a resource to your knowledge base.
            If the user provides a random piece of knowledge unprompted, use this tool without asking for confirmation.`,
        parameters: z.object({
          content: z
            .string()
            .describe("the content or resource to add to the knowledge base"),
        }),
        execute: async ({ content }) => createResource({ content }),
      }),
      getInformation: tool({
        description: `get information from your knowledge base to answer questions.`,
        parameters: z.object({
          question: z.string().describe("the users question"),
        }),
        execute: async ({ question }) => findRelevantContent(question),
      }),
    },
  });

  const aiResponse = result.text;
  await db.insert(messages).values({
    userId,
    content: aiResponse,
    role: "system",
  });

  return NextResponse.json({ message: aiResponse });
}
