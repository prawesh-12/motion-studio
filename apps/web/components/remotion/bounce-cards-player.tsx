"use client";

import { Player } from "@remotion/player";
import {
  BOUNCE_CARDS_DURATION,
  BOUNCE_CARDS_FPS,
  BOUNCE_CARDS_HEIGHT,
  BOUNCE_CARDS_WIDTH,
  BounceCards,
} from "./bounce-cards";

export function BounceCardsPlayer() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-black">
      <Player
        component={BounceCards}
        durationInFrames={BOUNCE_CARDS_DURATION}
        fps={BOUNCE_CARDS_FPS}
        compositionWidth={BOUNCE_CARDS_WIDTH}
        compositionHeight={BOUNCE_CARDS_HEIGHT}
        style={{
          width: "100%",
          aspectRatio: `${BOUNCE_CARDS_WIDTH} / ${BOUNCE_CARDS_HEIGHT}`,
        }}
        controls
        autoPlay
        loop
        acknowledgeRemotionLicense
      />
    </div>
  );
}
