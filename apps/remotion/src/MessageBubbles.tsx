import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const MESSAGE_BUBBLES_DURATION = 480; // 8s @ 60fps
export const MESSAGE_BUBBLES_FPS = 60;
export const MESSAGE_BUBBLES_WIDTH = 1280;
export const MESSAGE_BUBBLES_HEIGHT = 720;

type Side = "left" | "right";

type Message = {
  text: string;
  side: Side;
  typingFrames: number;
  delay: number; // frame when typing starts
};

const MESSAGES: Message[] = [
  { text: "you up?", side: "left", typingFrames: 24, delay: 12 },
  { text: "for you, always 😏", side: "right", typingFrames: 28, delay: 70 },
  {
    text: "i miss you",
    side: "left",
    typingFrames: 26,
    delay: 140,
  },
  { text: "come over?", side: "right", typingFrames: 22, delay: 210 },
  {
    text: "already on my way ❤️",
    side: "left",
    typingFrames: 28,
    delay: 268,
  },
];

const CONTACT_NAME = "sanku";

export const MessageBubbles: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background: "#ffffff",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'SF Pro Display', Inter, sans-serif",
        color: "#0f1014",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ChatHeader name={CONTACT_NAME} frame={frame} fps={fps} />
      <Conversation frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};

function ChatHeader({
  name,
  frame,
  fps,
}: {
  name: string;
  frame: number;
  fps: number;
}) {
  const enter = spring({
    frame: frame - 0,
    fps,
    config: { damping: 22, stiffness: 90 },
  });

  return (
    <div
      style={{
        padding: "32px 0 20px",
        borderBottom: "1px solid rgba(15,16,20,0.08)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        opacity: enter,
        transform: `translateY(${(1 - enter) * -8}px)`,
      }}
    >
      {/* Avatar circle with initial */}
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #818cf8 0%, #6366f1 100%)",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          fontWeight: 600,
          letterSpacing: "-0.01em",
        }}
      >
        {name.slice(0, 1).toUpperCase()}
      </div>
      <div
        style={{
          fontSize: 18,
          fontWeight: 600,
          color: "#0f1014",
          letterSpacing: "-0.01em",
        }}
      >
        {name}
      </div>
    </div>
  );
}

function Conversation({ frame, fps }: { frame: number; fps: number }) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        gap: 14,
        padding: "40px 80px 56px",
      }}
    >
      {MESSAGES.map((msg, i) => (
        <MessageRow key={i} msg={msg} frame={frame} fps={fps} />
      ))}
    </div>
  );
}

function MessageRow({
  msg,
  frame,
  fps,
}: {
  msg: Message;
  frame: number;
  fps: number;
}) {
  const local = frame - msg.delay;
  if (local < 0) return null;

  const isTyping = local < msg.typingFrames;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: msg.side === "right" ? "flex-end" : "flex-start",
      }}
    >
      {isTyping ? (
        <TypingBubble side={msg.side} localFrame={local} fps={fps} />
      ) : (
        <MessageBubble
          side={msg.side}
          text={msg.text}
          localFrame={local - msg.typingFrames}
          fps={fps}
        />
      )}
    </div>
  );
}

function TypingBubble({
  side,
  localFrame,
  fps,
}: {
  side: Side;
  localFrame: number;
  fps: number;
}) {
  const enter = spring({
    frame: localFrame,
    fps,
    config: { damping: 13, stiffness: 160, mass: 0.6 },
  });

  const bubbleColor = "#E9E9EB";
  const dotColor = "rgba(60,60,67,0.55)";

  return (
    <div
      style={{
        background: bubbleColor,
        padding: "16px 20px",
        borderRadius: 22,
        borderBottomLeftRadius: side === "left" ? 6 : 22,
        borderBottomRightRadius: side === "right" ? 6 : 22,
        display: "flex",
        gap: 8,
        alignItems: "center",
        opacity: enter,
        transform: `scale(${0.7 + enter * 0.3})`,
        transformOrigin: side === "left" ? "bottom left" : "bottom right",
        willChange: "transform, opacity",
      }}
    >
      {[0, 1, 2].map((i) => {
        // Each dot bounces with phase offset for that classic iMessage feel
        const phase = (localFrame + i * 5) / 7;
        const yBob = Math.sin(phase) * 4;
        const dotOpacity = 0.5 + Math.sin(phase) * 0.3;
        return (
          <span
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: dotColor,
              transform: `translateY(${-Math.abs(yBob)}px)`,
              opacity: dotOpacity,
              willChange: "transform, opacity",
            }}
          />
        );
      })}
    </div>
  );
}

function MessageBubble({
  side,
  text,
  localFrame,
  fps,
}: {
  side: Side;
  text: string;
  localFrame: number;
  fps: number;
}) {
  // Snappy spring with overshoot for the bubble pop
  const pop = spring({
    frame: localFrame,
    fps,
    config: { damping: 11, stiffness: 170, mass: 0.55 },
  });

  const isRight = side === "right";

  return (
    <div
      style={{
        background: isRight ? "#007AFF" : "#E9E9EB",
        color: isRight ? "#ffffff" : "#0f1014",
        padding: "12px 18px",
        borderRadius: 22,
        borderBottomLeftRadius: isRight ? 22 : 6,
        borderBottomRightRadius: isRight ? 6 : 22,
        maxWidth: 540,
        fontSize: 22,
        fontWeight: 400,
        lineHeight: 1.3,
        letterSpacing: "-0.005em",
        opacity: pop,
        transform: `scale(${0.7 + pop * 0.3})`,
        transformOrigin: isRight ? "bottom right" : "bottom left",
        willChange: "transform, opacity",
        wordWrap: "break-word",
      }}
    >
      {text}
    </div>
  );
}
