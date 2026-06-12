import type { CompositionInfo } from "../../schema";
import type { MessageBubblesProps } from "./MessageBubbles";

export const MESSAGE_BUBBLES_DURATION = 660;
export const MESSAGE_BUBBLES_FPS = 60;
export const MESSAGE_BUBBLES_WIDTH = 1280;
export const MESSAGE_BUBBLES_HEIGHT = 720;

export const messageBubblesDefaultProps: MessageBubblesProps = {
  contactName: "sanku",
  contactAvatar: "https://avatars.githubusercontent.com/aryanranderiya?s=200",
  messages: [
    { text: "hey, you up?", side: "left", typingFrames: 50, delay: 30 },
    { text: "yeah whats up", side: "right", typingFrames: 55, delay: 150 },
    { text: "wanna grab food?", side: "right", typingFrames: 55, delay: 270 },
    { text: "always 🍕", side: "left", typingFrames: 50, delay: 400 },
    {
      text: "on my way ❤️",
      side: "left",
      typingFrames: 55,
      delay: 530,
    },
  ],
  orientation: "landscape",
  scale: 2,
};

export const messageBubblesInfo: CompositionInfo<MessageBubblesProps> = {
  id: "MessageBubbles",
  category: "social",
  title: "Message Bubbles",
  description:
    "An animated iMessage-style chat conversation with grouped bubble corners, tails, and spring-stacked rows.",
  durationInFrames: MESSAGE_BUBBLES_DURATION,
  fps: MESSAGE_BUBBLES_FPS,
  width: MESSAGE_BUBBLES_WIDTH,
  height: MESSAGE_BUBBLES_HEIGHT,
  defaultProps: messageBubblesDefaultProps,
  brandMode: "locked",
  phoneFitMode: "cover",
  // Curated skins — first entry is the default look. Locked compositions
  // still get the Theme picker (themes are hand-built, not free recoloring).
  themes: [
    { id: "imessage", label: "iMessage" },
    {
      id: "glass",
      label: "Liquid Glass",
      description: "Frosted translucent bubbles over a vivid gradient",
    },
  ],
  fields: [
    { kind: "text", key: "contactName", label: "Contact name" },
    { kind: "text", key: "contactAvatar", label: "Avatar URL" },
    { kind: "chat", key: "messages", label: "Messages" },
    {
      kind: "select",
      key: "orientation",
      label: "Orientation",
      options: [
        { value: "landscape", label: "Landscape" },
        { value: "portrait", label: "Portrait (phone)" },
      ],
    },
    {
      kind: "number",
      key: "scale",
      label: "UI scale (landscape)",
      min: 0.5,
      max: 3,
    },
  ],
};
