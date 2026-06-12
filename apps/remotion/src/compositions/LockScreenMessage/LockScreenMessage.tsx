"use client";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useVideoConfig,
} from "remotion";
import { proxyExternalImg } from "../../proxy-image";
import { snap } from "../../snap";
import { useDesignFrame } from "../../use-design-frame";

const DEFAULT_ICON_SRC = staticFile("message_icon.png");

// iOS-flavored default wallpaper — a deep abstract gradient so the
// composition looks complete before the user uploads their own.
const DEFAULT_WALLPAPER =
  "radial-gradient(120% 90% at 25% 15%, #3b5bd1 0%, #2b2f7a 38%, #43205f 68%, #6a1f4d 100%)";

/**
 * Resolve an asset path to a renderable URL:
 *   - data: / blob: URIs pass through unchanged
 *   - absolute http(s) URLs route through `/api/img/<encoded>` so the
 *     export canvas stays untainted
 *   - relative paths get `staticFile()`'d for the Remotion bundle server
 */
function resolveAsset(src: string | undefined): string | undefined {
  if (!src) return undefined;
  if (/^(data:|blob:)/i.test(src)) return src;
  if (/^https?:/i.test(src)) return proxyExternalImg(src);
  return staticFile(src.replace(/^\//, ""));
}

export type LockScreenMessageProps = {
  /** Big lock-screen clock, e.g. "9:41". */
  time: string;
  /** Date line above the clock, e.g. "Monday, June 9". */
  date: string;
  /** Notification sender / contact name. */
  sender: string;
  /** Notification body text. */
  message: string;
  /** Small relative time on the notification, e.g. "now". */
  notifTime: string;
  /** Custom wallpaper image — falls back to the default gradient. */
  wallpaper?: string;
  /** Custom app icon — falls back to the Messages icon. */
  appIcon?: string;
};

// Frame offsets (design fps = 60).
const D_CLOCK = 0;
const D_NOTIF = 16;
const D_BODY_START = 30;
const WORD_STAGGER = 3;

export const LockScreenMessage: React.FC<LockScreenMessageProps> = ({
  time,
  date,
  sender,
  message,
  notifTime,
  wallpaper,
  appIcon,
}) => {
  const frame = useDesignFrame();
  const { fps } = useVideoConfig();

  const wallpaperSrc = resolveAsset(wallpaper);
  const iconSrc = resolveAsset(appIcon) ?? DEFAULT_ICON_SRC;

  // Clock easing — gentle fade + settle, no bounce.
  const clockIn = interpolate(frame - D_CLOCK, [0, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const clockY = (1 - clockIn) * 16;

  return (
    <AbsoluteFill
      style={{
        background: DEFAULT_WALLPAPER,
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'SF Pro Display', Inter, sans-serif",
        overflow: "hidden",
      }}
    >
      {wallpaperSrc && (
        <Img
          src={wallpaperSrc}
          alt=""
          crossOrigin="anonymous"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      )}

      {/* Legibility scrims — darken top and bottom so white chrome reads
          over any wallpaper. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0) 26%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.34) 100%)",
        }}
      />

      <StatusBar time={time} />

      {/* Clock cluster */}
      <div
        style={{
          position: "absolute",
          top: 150,
          left: 0,
          right: 0,
          textAlign: "center",
          color: "#fff",
          opacity: clockIn,
          transform: `translate3d(0, ${snap(clockY)}px, 0)`,
        }}
      >
        <div
          style={{
            fontSize: 40,
            fontWeight: 600,
            letterSpacing: "0.01em",
            textShadow: "0 2px 12px rgba(0,0,0,0.25)",
          }}
        >
          {date}
        </div>
        <div
          style={{
            fontSize: 228,
            fontWeight: 600,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            marginTop: 6,
            textShadow: "0 4px 30px rgba(0,0,0,0.3)",
          }}
        >
          {time}
        </div>
      </div>

      {/* Notification */}
      <div
        style={{
          position: "absolute",
          left: 40,
          right: 40,
          top: 640,
        }}
      >
        <NotificationCard
          frame={frame}
          fps={fps}
          sender={sender}
          message={message}
          notifTime={notifTime}
          iconSrc={iconSrc}
        />
      </div>

      <BottomChrome />
    </AbsoluteFill>
  );
};

function StatusBar({ time }: { time: string }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 96,
        padding: "0 54px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        color: "#fff",
      }}
    >
      <span style={{ fontSize: 34, fontWeight: 600, letterSpacing: "-0.01em" }}>
        {time}
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* Cellular */}
        <svg width="36" height="24" viewBox="0 0 36 24" aria-hidden>
          {[0, 1, 2, 3].map((i) => (
            <rect
              key={i}
              x={i * 9}
              y={14 - i * 4}
              width="6"
              height={6 + i * 4}
              rx="1.5"
              fill="#fff"
            />
          ))}
        </svg>
        {/* Wifi */}
        <svg width="32" height="24" viewBox="0 0 32 24" aria-hidden fill="#fff">
          <path d="M16 19.5l3.2-4a4 4 0 0 0-6.4 0l3.2 4Zm0-9a10 10 0 0 1 7.6 3.5l2.4-3A14 14 0 0 0 16 6.5 14 14 0 0 0 6 14l2.4 3A10 10 0 0 1 16 10.5Z" />
        </svg>
        {/* Battery */}
        <svg width="44" height="24" viewBox="0 0 44 24" aria-hidden>
          <rect
            x="1"
            y="5"
            width="34"
            height="14"
            rx="4"
            fill="none"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="1.6"
          />
          <rect x="3.5" y="7.5" width="26" height="9" rx="2" fill="#fff" />
          <rect
            x="37"
            y="9.5"
            width="3"
            height="5"
            rx="1.5"
            fill="rgba(255,255,255,0.5)"
          />
        </svg>
      </div>
    </div>
  );
}

function NotificationCard({
  frame,
  fps,
  sender,
  message,
  notifTime,
  iconSrc,
}: {
  frame: number;
  fps: number;
  sender: string;
  message: string;
  notifTime: string;
  iconSrc: string;
}) {
  const words = message.split(" ");

  const pop = spring({
    frame: frame - D_NOTIF,
    fps,
    config: { damping: 15, stiffness: 140, mass: 0.9 },
  });
  const scale = 0.92 + pop * 0.08;
  const translateY = (1 - pop) * 70;

  return (
    <div
      style={{
        borderRadius: 36,
        // Smoky translucent glass so white text stays legible over any
        // wallpaper. rgba base survives web-renderer exports; the blur is
        // progressive enhancement for the live preview.
        background: "rgba(28,28,32,0.46)",
        border: "1px solid rgba(255,255,255,0.14)",
        boxShadow: "0 20px 50px rgba(0,0,0,0.28)",
        backdropFilter: "blur(26px) saturate(160%)",
        WebkitBackdropFilter: "blur(26px) saturate(160%)",
        padding: 26,
        display: "flex",
        gap: 20,
        alignItems: "flex-start",
        opacity: pop,
        transform: `translate3d(0, ${snap(translateY)}px, 0) scale(${scale})`,
        transformOrigin: "center bottom",
      }}
    >
      <Img
        src={iconSrc}
        alt={sender}
        width={84}
        height={84}
        style={{ width: 84, height: 84, borderRadius: 20, flexShrink: 0 }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 4,
          }}
        >
          <span
            style={{
              fontSize: 37,
              fontWeight: 600,
              color: "#fff",
              letterSpacing: "-0.01em",
            }}
          >
            {sender}
          </span>
          <span
            style={{
              fontSize: 26,
              color: "rgba(255,255,255,0.55)",
              fontWeight: 500,
            }}
          >
            {notifTime}
          </span>
        </div>
        <div
          style={{
            fontSize: 34,
            color: "rgba(255,255,255,0.92)",
            fontWeight: 400,
            lineHeight: 1.32,
            letterSpacing: "-0.005em",
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {words.map((word, i) => {
            const wp = spring({
              frame: frame - (D_BODY_START + i * WORD_STAGGER),
              fps,
              config: { damping: 16, stiffness: 170, mass: 0.6 },
            });
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  marginRight: "0.28em",
                  opacity: wp,
                  transform: `translate3d(0, ${snap((1 - wp) * 12)}px, 0)`,
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function BottomChrome() {
  return (
    <>
      {/* Flashlight + Camera quick-action buttons */}
      <div
        style={{
          position: "absolute",
          bottom: 110,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "space-between",
          padding: "0 64px",
        }}
      >
        {[0, 1].map((i) => (
          <div
            key={i}
            style={{
              width: 92,
              height: 92,
              borderRadius: 9999,
              background: "rgba(0,0,0,0.32)",
              border: "1px solid rgba(255,255,255,0.12)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
            }}
          >
            {i === 0 ? <FlashlightIcon /> : <CameraIcon />}
          </div>
        ))}
      </div>

      {/* Home indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 30,
          left: "50%",
          transform: "translateX(-50%)",
          width: 280,
          height: 9,
          borderRadius: 9999,
          background: "rgba(255,255,255,0.85)",
        }}
      />
    </>
  );
}

function FlashlightIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 3h10l-1.5 5.5v0a2 2 0 0 1-.5 1.3L13 12v8a1 1 0 0 1-1 1h0a1 1 0 0 1-1-1v-8L9 9.8A2 2 0 0 1 8.5 8.5L7 3Z" />
      <path d="M12 13.5v2" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h1.2a1 1 0 0 0 .8-.4l.9-1.2a1 1 0 0 1 .8-.4h3.6a1 1 0 0 1 .8.4l.9 1.2a1 1 0 0 0 .8.4h1.2A2.5 2.5 0 0 1 21 8.5v8A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-8Z" />
      <circle cx="12" cy="12.5" r="3.4" />
    </svg>
  );
}
