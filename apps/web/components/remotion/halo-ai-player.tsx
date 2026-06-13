"use client";

import { Player } from "@remotion/player";
import {
  HALO_AI_DURATION,
  HALO_AI_FPS,
  HALO_AI_HEIGHT,
  HALO_AI_WIDTH,
  HaloAI,
} from "./halo-ai";

export function HaloAIPlayer() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-black">
      <Player
        component={HaloAI}
        durationInFrames={HALO_AI_DURATION}
        fps={HALO_AI_FPS}
        compositionWidth={HALO_AI_WIDTH}
        compositionHeight={HALO_AI_HEIGHT}
        style={{
          width: "100%",
          aspectRatio: `${HALO_AI_WIDTH} / ${HALO_AI_HEIGHT}`,
        }}
        controls
        autoPlay
        loop
      />
    </div>
  );
}
