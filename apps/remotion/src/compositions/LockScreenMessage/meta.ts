import type { CompositionInfo } from "../../schema";
import type { LockScreenMessageProps } from "./LockScreenMessage";

export const LOCK_SCREEN_MESSAGE_DURATION = 150;
export const LOCK_SCREEN_MESSAGE_FPS = 60;
// Portrait 9:19.5 — iPhone screen aspect.
export const LOCK_SCREEN_MESSAGE_WIDTH = 1080;
export const LOCK_SCREEN_MESSAGE_HEIGHT = 2340;

export const lockScreenMessageDefaultProps: LockScreenMessageProps = {
  time: "9:41",
  date: "Monday, June 9",
  sender: "Mom 💚",
  message: "Did you eat? Call me when you're free ❤️",
  notifTime: "now",
  wallpaper: "",
  appIcon: "",
};

export const lockScreenMessageInfo: CompositionInfo<LockScreenMessageProps> = {
  id: "LockScreenMessage",
  category: "social",
  title: "Lock Screen Message",
  description:
    "An iPhone lock screen — wallpaper, big clock, and an iMessage notification that springs up. Upload a custom wallpaper or app icon, or keep the defaults.",
  durationInFrames: LOCK_SCREEN_MESSAGE_DURATION,
  fps: LOCK_SCREEN_MESSAGE_FPS,
  width: LOCK_SCREEN_MESSAGE_WIDTH,
  height: LOCK_SCREEN_MESSAGE_HEIGHT,
  defaultProps: lockScreenMessageDefaultProps,
  brandMode: "locked",
  agentNotes:
    "Use for a 'phone buzzes' beat — a message landing on a locked iPhone over a wallpaper and clock. Great cold open or punchline. Keep the message short (one line reads best). Pair the sender/message with the moment you want to dramatize.",
  fields: [
    { kind: "text", key: "time", label: "Clock time" },
    { kind: "text", key: "date", label: "Date" },
    { kind: "text", key: "sender", label: "Sender" },
    { kind: "textarea", key: "message", label: "Message", rows: 2 },
    { kind: "text", key: "notifTime", label: "Notification time" },
    {
      kind: "image",
      key: "wallpaper",
      label: "Wallpaper",
      placeholder: "Upload or paste a wallpaper URL",
    },
    {
      kind: "image",
      key: "appIcon",
      label: "App icon",
      placeholder: "Defaults to Messages",
    },
  ],
};
