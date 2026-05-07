"use client";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export type StatCounterProps = {
  target: number;
  label: string;
  prefix: string;
  suffix: string;
  backgroundColor: string;
  textColor: string;
};

const COUNTER_START = 10;
const COUNTER_DURATION = 130;
const LABEL_DELAY = 28;
const LABEL_DURATION = 28;
const APPLE_EASE = Easing.bezier(0.16, 1, 0.3, 1);

export const StatCounter: React.FC<StatCounterProps> = ({
  target,
  label,
  prefix,
  suffix,
  backgroundColor,
  textColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const numberProgress = interpolate(
    frame,
    [COUNTER_START, COUNTER_START + COUNTER_DURATION],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: APPLE_EASE,
    },
  );

  const numberPop = spring({
    frame: frame - COUNTER_START,
    fps,
    config: { damping: 14, stiffness: 110, mass: 0.7 },
  });

  const value = Math.round(numberProgress * Math.max(0, target));
  const formatted = value.toLocaleString();

  const labelStart = COUNTER_START + LABEL_DELAY;
  const labelProgress = interpolate(
    frame,
    [labelStart, labelStart + LABEL_DURATION],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: APPLE_EASE,
    },
  );

  const labelColor = isLightColor(backgroundColor)
    ? "rgba(15,16,20,0.55)"
    : "rgba(255,255,255,0.65)";

  return (
    <AbsoluteFill
      style={{
        background: backgroundColor,
        color: textColor,
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'SF Pro Display', Inter, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 80px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 280,
          fontWeight: 800,
          letterSpacing: "-0.06em",
          lineHeight: 1,
          opacity: numberPop,
          transform: `scale(${0.85 + numberPop * 0.15})`,
          fontVariantNumeric: "tabular-nums",
          willChange: "transform, opacity",
        }}
      >
        {prefix}
        {formatted}
        {suffix}
      </div>
      {label.trim() && (
        <div
          style={{
            marginTop: 36,
            fontSize: 48,
            fontWeight: 500,
            letterSpacing: "-0.012em",
            color: labelColor,
            opacity: labelProgress,
            transform: `translateY(${(1 - labelProgress) * 14}px)`,
            willChange: "transform, opacity",
          }}
        >
          {label}
        </div>
      )}
    </AbsoluteFill>
  );
};

function isLightColor(color: string): boolean {
  const c = color.trim().toLowerCase();
  if (c === "white" || c === "#fff" || c === "#ffffff") return true;
  if (c.startsWith("#") && c.length === 7) {
    const r = parseInt(c.slice(1, 3), 16);
    const g = parseInt(c.slice(3, 5), 16);
    const b = parseInt(c.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.6;
  }
  return false;
}
