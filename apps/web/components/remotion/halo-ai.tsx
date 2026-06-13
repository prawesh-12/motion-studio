"use client";

import {
  KEYBOARD_BG,
  Keyboard,
} from "@workspace/compositions/compositions/_chat-demo/Keyboard";
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from "remotion";

export const HALO_AI_FPS = 30;
export const HALO_AI_WIDTH = 1080;
export const HALO_AI_HEIGHT = 1920;
export const HALO_AI_DURATION = 200;

const APP_NAME = "Halo AI";
const PROMPT = "change the hotdog price to $7.32";

// Keyboard slides up first, then the prompt types out, then the app "generates".
const KB_OPEN = 12;
const TYPE_START = 20;
const TYPE_FRAMES = 92;
const POP_HOLD = 5;
const POP_RISE = 2;

const SF_STACK =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, "Apple Color Emoji", sans-serif';

type Typing = {
  text: string;
  pressedKey: string | null;
  pressT: number;
  done: boolean;
};

/**
 * Drive the prompt typing off the frame: how much text is in the field, which
 * key is mid-press (so the keyboard can pop it), and whether typing finished.
 * Same scheme as the iMessage composer — each character "presses" at the
 * midpoint of its time slice.
 */
function computeTyping(frame: number): Typing {
  const chars = Array.from(PROMPT);
  const len = chars.length;
  const local = frame - TYPE_START;
  if (local < 0) return { text: "", pressedKey: null, pressT: 0, done: false };
  const typed = Math.max(
    0,
    Math.min(len, Math.floor((local / TYPE_FRAMES) * len)),
  );
  const text = chars.slice(0, typed).join("");

  let pressedKey: string | null = null;
  let pressT = 0;
  let bestJ = -1;
  let bestT = -Infinity;
  for (let j = 0; j < len; j++) {
    const tj = TYPE_START + ((j + 0.5) / len) * TYPE_FRAMES;
    if (tj <= frame && tj > bestT) {
      bestT = tj;
      bestJ = j;
    }
  }
  if (bestJ >= 0) {
    const elapsed = frame - bestT;
    if (elapsed < POP_HOLD) {
      const c = chars[bestJ]!.toLowerCase();
      // Only letters and space have a key to pop on the QWERTY layout.
      if (/[a-z ]/.test(c)) {
        pressedKey = c;
        pressT = elapsed < POP_RISE ? elapsed / POP_RISE : 1;
      }
    }
  }
  return { text, pressedKey, pressT, done: local >= TYPE_FRAMES };
}

/** Halo AI mark — a haloed pair of wings on a blue squircle. */
function HaloIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden>
      <title>Halo AI</title>
      <defs>
        <linearGradient id="halo-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4AA3FF" />
          <stop offset="1" stopColor="#1E7BFF" />
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="28" fill="url(#halo-bg)" />
      {/* halo */}
      <ellipse
        cx="60"
        cy="36"
        rx="19"
        ry="6.5"
        fill="none"
        stroke="#FFD63D"
        strokeWidth="5"
      />
      {/* wings */}
      <path
        d="M60 54 C 51 45 37 45 28 51 C 37 53 28 58 21 61 C 33 59 26 66 20 70 C 35 64 45 61 60 62 Z"
        fill="#ffffff"
      />
      <path
        d="M60 54 C 69 45 83 45 92 51 C 83 53 92 58 99 61 C 87 59 94 66 100 70 C 85 64 75 61 60 62 Z"
        fill="#ffffff"
      />
    </svg>
  );
}

export function HaloAI() {
  const frame = useCurrentFrame();
  const { text, pressedKey, pressT, done } = computeTyping(frame);

  // Keyboard slides up at the very start.
  const kbOpen = spring({
    frame,
    fps: HALO_AI_FPS,
    config: { damping: 18, stiffness: 130, mass: 0.7 },
    durationInFrames: KB_OPEN,
  });

  // Intro: icon + title fade/scale in.
  const intro = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "Generating" appears once the prompt is sent, with a cycling-dots animation.
  const genIn = interpolate(
    frame,
    [TYPE_START + TYPE_FRAMES, TYPE_START + TYPE_FRAMES + 12],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const dotCount = 1 + (Math.floor(frame / 9) % 3);
  const generating = `Generating${".".repeat(dotCount)}`;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #ECECF1 0%, #DEDEE4 100%)",
        fontFamily: SF_STACK,
        overflow: "hidden",
      }}
    >
      {/* App header — icon, name, status */}
      <div
        style={{
          position: "absolute",
          top: 360,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: intro,
          transform: `translateY(${(1 - intro) * 24}px)`,
        }}
      >
        <HaloIcon size={224} />
        <div
          style={{
            marginTop: 40,
            fontSize: 76,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "#16171B",
          }}
        >
          {APP_NAME}
        </div>
        <div
          style={{
            marginTop: 14,
            height: 50,
            fontSize: 40,
            fontWeight: 500,
            letterSpacing: "-0.01em",
            color: "#8A8A90",
            opacity: genIn,
          }}
        >
          {generating}
        </div>
      </div>

      {/* Composer + keyboard pinned to the bottom, sliding up together. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          transform: `translateY(${(1 - kbOpen) * 100}%)`,
          willChange: "transform",
        }}
      >
        {/* Prompt input */}
        <div
          style={{
            padding: "0 28px 18px",
            display: "flex",
            alignItems: "flex-end",
            gap: 18,
          }}
        >
          <div
            style={{
              flex: 1,
              minHeight: 104,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              padding: "0 16px 0 36px",
              borderRadius: 52,
              background: "rgba(44,44,46,0.92)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "inset 0 1px 0.5px rgba(255,255,255,0.12)",
            }}
          >
            <div
              style={{
                flex: 1,
                minWidth: 0,
                fontSize: 40,
                lineHeight: "52px",
                letterSpacing: "-0.01em",
                color: text ? "#ffffff" : "rgba(235,235,245,0.4)",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {text || "Message Halo AI"}
              {!done && (
                <span
                  aria-hidden
                  style={{
                    display: "inline-block",
                    width: 3,
                    height: 42,
                    marginLeft: 3,
                    marginBottom: -8,
                    background: "#0A84FF",
                    borderRadius: 2,
                  }}
                />
              )}
            </div>
            <div
              style={{
                width: 76,
                height: 76,
                flexShrink: 0,
                borderRadius: 9999,
                background: "#0A84FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" aria-hidden>
                <title>Send</title>
                <path
                  d="M12 19V6M12 6 6 12M12 6l6 6"
                  stroke="#fff"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </div>
          </div>
        </div>

        <Keyboard theme="dark" pressedKey={pressedKey} pressT={pressT} />
        {/* Continue the keyboard surface under the home-indicator strip. */}
        <div style={{ height: 28, background: KEYBOARD_BG.dark }} />
      </div>
    </AbsoluteFill>
  );
}
