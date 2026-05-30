import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, stepCountIs, streamText } from "ai";
import { systemPrompt } from "@/lib/agent/system";
import { tools } from "@/lib/agent/tools";

// Builds need time: ~15 tool calls (listScenesInCategory ×2-3 +
// getSceneDetails ×6-8 + buildProject), plus the model has to think
// about narrative pacing between calls. 30s was cutting builds off
// mid-flow with only half the planned scenes added.
export const maxDuration = 300;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-5-mini"),
    system: systemPrompt,
    messages: await convertToModelMessages(messages, { tools }),
    tools,
    stopWhen: stepCountIs(60),
    // Default is ~1.0 but explicit so we remember to tune. Higher than
    // default would risk invalid tool args; lower would make the agent
    // pick the same scenes every build (which it was doing).
    temperature: 0.9,
    // Log stream-internal errors so we can see rate limits / malformed
    // tool-result state issues server-side instead of staring at a
    // silent client.
    onError: ({ error }) => {
      console.error("[agent] streamText error:", error);
    },
  });

  return result.toUIMessageStreamResponse({
    // Surface the actual error text to the client UI instead of a
    // generic "An error occurred" — otherwise the AgentPanel just
    // shows a vague chip and the user can't tell rate-limit from bug.
    onError: (error) => {
      console.error("[agent] response error:", error);
      if (error instanceof Error) return error.message;
      return typeof error === "string" ? error : "Agent request failed.";
    },
  });
}
