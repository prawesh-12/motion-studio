import type { BrandKit } from "./brand";
import { DEFAULT_BRAND } from "./brand";
import type { ClipEffect } from "./effects/schema";

export type Clip = {
  id: string;
  compositionId: string;
  props: Record<string, unknown>;
  durationInFrames: number;
  effects?: ClipEffect[];
};

export type Project = {
  fps: number;
  width: number;
  height: number;
  clips: Clip[];
  brand?: BrandKit;
};

export const DEFAULT_PROJECT: Project = {
  fps: 60,
  width: 1920,
  height: 1080,
  clips: [],
  brand: DEFAULT_BRAND,
};

export function projectDuration(project: Project): number {
  return Math.max(
    1,
    project.clips.reduce((sum, c) => sum + c.durationInFrames, 0),
  );
}
