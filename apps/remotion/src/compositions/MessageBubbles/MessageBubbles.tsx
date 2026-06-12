import type { ChatMessage } from "../../editors/types";
import { useDesignFrame } from "../../use-design-frame";
import {
  ChatDemo,
  type ChatMessageItem,
  GLASS_CHAT_BACKDROP,
  GlassChatDemo,
} from "../_chat-demo/ChatDemo";
import { ChatFill } from "../_chat-demo/ChatFill";

export type MessageBubblesProps = {
  contactName: string;
  contactAvatar?: string;
  messages: ChatMessage[];
  orientation?: "landscape" | "portrait";
  scale?: number;
  /** Theme id selected in the Inspector (see meta.themes). */
  clipTheme?: string;
};

function buildItems(messages: ChatMessage[], frame: number): ChatMessageItem[] {
  const out: ChatMessageItem[] = [];
  for (let i = 0; i < messages.length; i++) {
    const m = messages[i]!;
    if (frame < m.delay) continue;
    const local = frame - m.delay;
    const isTyping = local < m.typingFrames;
    out.push({
      id: i,
      from: m.side === "right" ? "me" : "them",
      text: m.text,
      typing: isTyping,
      enterFrames: local,
    });
  }
  return out;
}

export const MessageBubbles: React.FC<MessageBubblesProps> = ({
  contactName,
  contactAvatar = "https://avatars.githubusercontent.com/aryanranderiya?s=200",
  messages,
  orientation = "landscape",
  scale = 2,
  clipTheme,
}) => {
  const frame = useDesignFrame();
  const items = buildItems(messages, frame);

  if (clipTheme === "glass") {
    return (
      <ChatFill
        backdrop={GLASS_CHAT_BACKDROP}
        // Transparent pad bars so the gradient runs edge-to-edge in
        // portrait / PhoneFrame instead of reading as solid chrome.
        chromeColor="transparent"
        scale={scale}
        orientation={orientation}
      >
        <GlassChatDemo
          title={contactName}
          headerAvatar={contactAvatar}
          messages={items}
        />
      </ChatFill>
    );
  }

  return (
    <ChatFill
      backdrop="#ffffff"
      chromeColor="#ffffff"
      scale={scale}
      orientation={orientation}
    >
      <ChatDemo
        platform="imessage"
        title={contactName}
        headerAvatar={contactAvatar}
        messages={items}
      />
    </ChatFill>
  );
};
