import type { CompositionInfo } from "../../schema";
import type { CardRevealProps } from "./CardReveal";

export const CARD_REVEAL_DURATION = 240; // 4.0s @ 60fps
export const CARD_REVEAL_FPS = 60;
export const CARD_REVEAL_WIDTH = 1920;
export const CARD_REVEAL_HEIGHT = 1080;

export const cardRevealDefaultProps: CardRevealProps = {
  image: "",
  caption: "",
};

export const cardRevealInfo: CompositionInfo<CardRevealProps> = {
  id: "CardReveal",
  category: "media",
  title: "Card Reveal",
  description:
    "A white ball drops and bounces, morphs into a card, then flips on its side to reveal your uploaded image with a confetti blast. Solid colors, no gradients.",
  durationInFrames: CARD_REVEAL_DURATION,
  fps: CARD_REVEAL_FPS,
  width: CARD_REVEAL_WIDTH,
  height: CARD_REVEAL_HEIGHT,
  defaultProps: cardRevealDefaultProps,
  agentNotes:
    "Use to reveal a single image (photo, screenshot, product shot, poster) as a celebratory beat. The ball-drop → card-flip → confetti is the whole focus; pair with a short hook earlier. Background/text/font/accent come from the shared Style controls; accent also colors part of the confetti.",
  fields: [
    { kind: "image", key: "image", label: "Image" },
    { kind: "text", key: "caption", label: "Caption (optional)" },
  ],
};
