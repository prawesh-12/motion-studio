import { compositions } from "@workspace/compositions/registry";
import type { AnyCompositionInfo, Field } from "@workspace/compositions/schema";

/**
 * Serializes the composition registry into a compact reference block the
 * agent reads from its system prompt. Generated once per process; the
 * registry is static at runtime.
 *
 * Each entry includes:
 *   • id          — PascalCase composition id (used in clips[].compositionId)
 *   • title       — human label
 *   • description — registry one-liner (what the scene is for)
 *   • fps / size  — defaults the project's fps/width/height should match if
 *                   this is the only scene type used
 *   • defaultDur  — default durationInFrames
 *   • brandMode   — "locked" scenes ignore clipStyle (Twitter/Slack/etc.)
 *   • propKeys    — the props field keys, so the model knows what to fill in
 *   • defaultProps — JSON-stringified default values, so the agent can copy
 *                    and patch instead of inventing prop shapes
 */
export function buildCatalogText(): string {
  return compositions.map(formatEntry).join("\n");
}

function formatEntry(c: AnyCompositionInfo): string {
  const fieldKeys = c.fields.map((f: Field) => `${f.key}:${f.kind}`).join(", ");
  const locked = c.brandMode === "locked" ? " [brand-locked]" : "";
  const defaults = JSON.stringify(c.defaultProps);
  return [
    `### ${c.id}${locked}`,
    `${c.title} — ${c.description}`,
    `dims: ${c.width}x${c.height} @ ${c.fps}fps, defaultDuration: ${c.durationInFrames}f`,
    `fields: ${fieldKeys || "(none)"}`,
    `defaultProps: ${defaults}`,
  ].join("\n");
}
