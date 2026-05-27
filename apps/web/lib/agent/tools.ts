import {
  compositions,
  compositionsById,
} from "@workspace/compositions/registry";
import { tool } from "ai";
import { z } from "zod";

/**
 * Server-side tools have `execute`. They read from the static registry and
 * answer the model's discovery questions without touching client state.
 *
 * Client-side tools (`addClip`, `updateClipProps`, `updateClipStyle`,
 * `updateClipDuration`, `deleteClip`, `clearProject`, `listClips`) are
 * defined with a schema only — no `execute`. The AgentPanel runs them
 * against the studio reducer via `useChat({ onToolCall })` and pipes the
 * result back with `addToolResult`. The chat then continues automatically
 * because of `sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls`.
 */

export const tools = {
  listScenes: tool({
    description:
      "Get the full catalog of scenes/compositions the user has available. Call this first when you need to pick scenes. Returns the id (used by addClip), title, and a one-line description for each.",
    inputSchema: z.object({}),
    execute: async () => {
      return {
        scenes: compositions.map((c) => ({
          id: c.id,
          title: c.title,
          description: c.description,
          defaultDurationFrames: c.durationInFrames,
          fps: c.fps,
          width: c.width,
          height: c.height,
        })),
      };
    },
  }),

  getSceneDetails: tool({
    description:
      "Look up the props schema for a specific scene before calling updateClipProps. Returns the field list (keys, kinds, options) and the defaultProps shape.",
    inputSchema: z.object({
      compositionId: z
        .string()
        .describe("Composition id from listScenes (e.g. 'TitlePopup')"),
    }),
    execute: async ({ compositionId }) => {
      const info = compositionsById[compositionId];
      if (!info) {
        return { error: `Unknown composition id: ${compositionId}` };
      }
      return {
        id: info.id,
        title: info.title,
        description: info.description,
        defaultProps: info.defaultProps,
        fields: info.fields,
      };
    },
  }),

  // ───── Client-side tools (no execute) ─────────────────────────────────
  // These run in the browser via AgentPanel's onToolCall handler so they
  // can dispatch into the studio reducer and read live state.

  listClips: tool({
    description:
      "Read the current timeline. Returns the ordered list of clips with id, compositionId, durationInFrames, and props. Use this to understand what's already on the timeline before editing.",
    inputSchema: z.object({}),
  }),

  clearProject: tool({
    description:
      "Wipe the timeline so you can build from scratch. Use this before adding new clips when the user wants a fresh video.",
    inputSchema: z.object({}),
  }),

  addClip: tool({
    description:
      "Append a new clip to the timeline using a composition id from listScenes. Returns the new clipId you'll need to edit it.",
    inputSchema: z.object({
      compositionId: z
        .string()
        .describe("Composition id (e.g. 'TitlePopup', 'Terminal', 'Toast')"),
    }),
  }),

  updateClipProps: tool({
    description:
      "Replace a clip's props with new values. Pass the FULL props object (merge with the clip's existing props yourself — this is a full replace, not a patch). Use getSceneDetails to learn the schema.",
    inputSchema: z.object({
      clipId: z.string(),
      props: z.record(z.string(), z.unknown()),
    }),
  }),

  updateClipStyle: tool({
    description:
      "Change a clip's universal style: background color, text color, font family, accent color. Any omitted field is left untouched. Empty string means 'no override, use composition default'. No effect on brand-locked scenes (Tweet/Slack/etc.).",
    inputSchema: z.object({
      clipId: z.string(),
      background: z.string().optional(),
      color: z.string().optional(),
      fontFamily: z.string().optional(),
      accent: z.string().optional(),
    }),
  }),

  updateClipDuration: tool({
    description:
      "Set how long a clip plays for, in video frames. Most scenes run at 30 fps unless noted, so 90 frames = 3 seconds.",
    inputSchema: z.object({
      clipId: z.string(),
      durationInFrames: z.number().int().min(15),
    }),
  }),

  deleteClip: tool({
    description: "Remove a clip from the timeline by id.",
    inputSchema: z.object({
      clipId: z.string(),
    }),
  }),
};

export type AgentTools = typeof tools;
