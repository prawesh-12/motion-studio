"use client";
import {
  AbsoluteFill,
  Img,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Analytics01Icon,
  BubbleChatIcon,
  CheckmarkBadge02Icon,
  FavouriteIcon,
  MoreHorizontalCircle01Icon,
  RepeatIcon,
  Share08Icon,
} from "@hugeicons/core-free-icons";

export type TweetCardProps = {
  displayName: string;
  handle: string;
  avatarUrl: string;
  verified: "yes" | "no";
  text: string;
  timestamp: string;
  replies: number;
  retweets: number;
  likes: number;
  views: number;
  theme: "light" | "dark";
  backgroundColor: string;
};

const CARD_ENTER_END = 18;
const TYPE_START = 14;
const FRAMES_PER_CHAR = 2;

export const TweetCard: React.FC<TweetCardProps> = ({
  displayName,
  handle,
  avatarUrl,
  verified,
  text,
  timestamp,
  replies,
  retweets,
  likes,
  views,
  theme,
  backgroundColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 110, mass: 0.7 },
  });

  const typingDuration = text.length * FRAMES_PER_CHAR;
  const typingEnd = TYPE_START + typingDuration;
  const charsTyped =
    frame < TYPE_START
      ? 0
      : Math.min(
          text.length,
          Math.floor((frame - TYPE_START) / FRAMES_PER_CHAR),
        );
  const visibleText = text.slice(0, charsTyped);
  const isTyping = frame >= TYPE_START && frame < typingEnd;
  const caretBlink =
    isTyping && Math.floor((frame - TYPE_START) / 12) % 2 === 0;

  const showAfterCard = frame >= CARD_ENTER_END;

  const isDark = theme === "dark";
  const cardBg = isDark ? "#000000" : "#ffffff";
  const cardText = isDark ? "#e7e9ea" : "#0f1419";
  const muted = isDark ? "#71767b" : "#536471";
  const divider = isDark ? "#2f3336" : "#eff3f4";
  const cardBorder = isDark ? "#2f3336" : "#eff3f4";

  return (
    <AbsoluteFill
      style={{
        background: backgroundColor,
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'SF Pro Display', Inter, sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 60,
      }}
    >
      <div
        style={{
          width: 1560,
          background: cardBg,
          color: cardText,
          borderRadius: 36,
          border: `1px solid ${cardBorder}`,
          boxShadow: isDark
            ? "0 40px 100px rgba(0,0,0,0.5)"
            : "0 36px 100px rgba(15,16,20,0.10), 0 6px 16px rgba(15,16,20,0.05)",
          padding: 60,
          opacity: enter,
          transform: `translateY(${(1 - enter) * 32}px) scale(${0.96 + enter * 0.04})`,
          willChange: "transform, opacity",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <Avatar url={avatarUrl} initial={displayName.slice(0, 1)} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 42,
                fontWeight: 700,
                letterSpacing: "-0.012em",
                lineHeight: 1.1,
              }}
            >
              <span>{displayName}</span>
              {verified === "yes" && (
                <HugeiconsIcon
                  icon={CheckmarkBadge02Icon}
                  size={36}
                  color="#1d9bf0"
                  fill="#1d9bf0"
                />
              )}
            </div>
            <div style={{ fontSize: 30, color: muted, marginTop: 4 }}>
              {handle}
            </div>
          </div>
          <HugeiconsIcon
            icon={MoreHorizontalCircle01Icon}
            size={36}
            color={muted}
          />
        </div>

        <p
          style={{
            fontSize: 52,
            fontWeight: 400,
            lineHeight: 1.32,
            letterSpacing: "-0.012em",
            margin: "36px 0 0",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            minHeight: 70,
          }}
        >
          {visibleText}
          {isTyping && (
            <span
              style={{
                display: "inline-block",
                width: 4,
                height: 56,
                marginLeft: 6,
                background: cardText,
                opacity: caretBlink ? 1 : 0,
                verticalAlign: "text-bottom",
                borderRadius: 1,
              }}
            />
          )}
        </p>

        {timestamp.trim() && (
          <div
            style={{
              fontSize: 28,
              color: muted,
              marginTop: 36,
              opacity: showAfterCard ? 1 : 0,
            }}
          >
            {timestamp}
          </div>
        )}

        <div
          style={{
            height: 1,
            background: divider,
            margin: "32px 0",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: muted,
          }}
        >
          <Stat icon={BubbleChatIcon} value={replies} color={muted} />
          <Stat icon={RepeatIcon} value={retweets} color={muted} />
          <Stat icon={FavouriteIcon} value={likes} color={muted} />
          <Stat icon={Analytics01Icon} value={views} color={muted} />
          <Stat icon={Share08Icon} value={null} color={muted} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

function Avatar({ url, initial }: { url: string; initial: string }) {
  if (url.trim()) {
    return (
      <Img
        src={url}
        width={108}
        height={108}
        style={{
          width: 108,
          height: 108,
          borderRadius: "50%",
          flexShrink: 0,
          objectFit: "cover",
        }}
      />
    );
  }
  return (
    <div
      style={{
        width: 108,
        height: 108,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #1d9bf0 0%, #4f46e5 100%)",
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 44,
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      {initial.toUpperCase() || "?"}
    </div>
  );
}

function Stat({
  icon,
  value,
  color,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  value: number | null;
  color: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        fontSize: 28,
        fontWeight: 500,
        color,
      }}
    >
      <HugeiconsIcon icon={icon} size={36} color={color} />
      {value !== null && <span>{formatCount(value)}</span>}
    </div>
  );
}

function formatCount(n: number): string {
  if (n < 1000) return String(n);
  if (n < 10000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  if (n < 1_000_000) return Math.round(n / 1000) + "K";
  return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
}
