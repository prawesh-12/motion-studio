"use client";

import { useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  BubbleChatIcon,
  Delete02Icon,
  ArrowReloadHorizontalIcon,
  Sent02Icon,
} from "@hugeicons/core-free-icons";
import type { EditorProps } from "../schema";
import type { ChatMessage } from "./types";

const FIRST_DELAY = 30;
const GAP_FRAMES = 90;

function computeTypingFrames(text: string): number {
  return Math.max(45, Math.min(90, Math.round(text.length * 3.5)));
}

function recomputeTimings(messages: ChatMessage[]): ChatMessage[] {
  let cursor = FIRST_DELAY;
  return messages.map((m) => {
    const typingFrames = computeTypingFrames(m.text);
    const delay = cursor;
    cursor = delay + typingFrames + GAP_FRAMES;
    return { ...m, typingFrames, delay };
  });
}

export function ChatEditor({ value, onChange }: EditorProps<ChatMessage[]>) {
  const [draft, setDraft] = useState("");
  const [flashKey, setFlashKey] = useState(0);
  const [flashedIndex, setFlashedIndex] = useState<number | null>(null);
  const lastSide = value[value.length - 1]?.side ?? "right";
  const [side, setSide] = useState<ChatMessage["side"]>(
    lastSide === "left" ? "right" : "left",
  );

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const prevLength = useRef(value.length);
  useEffect(() => {
    if (value.length > prevLength.current && scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
    prevLength.current = value.length;
  }, [value.length]);

  useEffect(() => {
    if (flashedIndex === null) return;
    const t = setTimeout(() => setFlashedIndex(null), 500);
    return () => clearTimeout(t);
  }, [flashedIndex, flashKey]);

  function setMessages(next: ChatMessage[]) {
    onChange(recomputeTimings(next));
  }

  function addMessage(text: string, sendAs: ChatMessage["side"]) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages([
      ...value,
      { text: trimmed, side: sendAs, typingFrames: 0, delay: 0 },
    ]);
    setDraft("");
    setSide(sendAs === "left" ? "right" : "left");
  }

  function patchMessage(i: number, patch: Partial<ChatMessage>) {
    const next = value.slice();
    next[i] = { ...next[i]!, ...patch };
    setMessages(next);
  }

  function deleteMessage(i: number) {
    const next = value.slice();
    next.splice(i, 1);
    setMessages(next);
  }

  function flipSide(i: number) {
    const cur = value[i]!;
    patchMessage(i, { side: cur.side === "left" ? "right" : "left" });
    setFlashedIndex(i);
    setFlashKey((k) => k + 1);
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-muted/20">
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {value.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-3 px-5 py-6">
            {value.map((m, i) => (
              <BubbleRow
                key={i}
                msg={m}
                flashing={flashedIndex === i}
                onText={(text) => patchMessage(i, { text })}
                onFlip={() => flipSide(i)}
                onDelete={() => deleteMessage(i)}
              />
            ))}
          </div>
        )}
      </div>

      <Composer
        draft={draft}
        side={side}
        onDraftChange={setDraft}
        onSideChange={setSide}
        onSend={() => addMessage(draft, side)}
      />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 py-12 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-muted">
        <HugeiconsIcon
          icon={BubbleChatIcon}
          size={24}
          className="text-muted-foreground"
        />
      </div>
      <div>
        <p className="text-sm font-medium">No messages yet</p>
        <p className="mt-1 text-[12px] text-muted-foreground">
          Type below and pick who said it.
        </p>
      </div>
    </div>
  );
}

function BubbleRow({
  msg,
  flashing,
  onText,
  onFlip,
  onDelete,
}: {
  msg: ChatMessage;
  flashing: boolean;
  onText: (t: string) => void;
  onFlip: () => void;
  onDelete: () => void;
}) {
  const isRight = msg.side === "right";
  return (
    <div className="group flex w-full items-center gap-2">
      <div
        className="transition-[flex-grow] duration-300 ease-out"
        style={{ flexGrow: isRight ? 1 : 0, flexShrink: 0, flexBasis: 0 }}
        aria-hidden
      />

      {isRight && (
        <RowActions onFlip={onFlip} onDelete={onDelete} />
      )}

      <BubbleBody
        msg={msg}
        isRight={isRight}
        flashing={flashing}
        onText={onText}
      />

      {!isRight && (
        <RowActions onFlip={onFlip} onDelete={onDelete} />
      )}

      <div
        className="transition-[flex-grow] duration-300 ease-out"
        style={{ flexGrow: !isRight ? 1 : 0, flexShrink: 0, flexBasis: 0 }}
        aria-hidden
      />
    </div>
  );
}

function BubbleBody({
  msg,
  isRight,
  flashing,
  onText,
}: {
  msg: ChatMessage;
  isRight: boolean;
  flashing: boolean;
  onText: (t: string) => void;
}) {
  const ref = useRef<HTMLTextAreaElement | null>(null);
  return (
    <div
      onClick={() => ref.current?.focus()}
      className={`relative max-w-[78%] cursor-text rounded-[22px] px-4 py-2 transition-[background-color,transform,box-shadow] duration-300 ease-out ${
        isRight
          ? "bg-blue-500 text-white shadow-sm shadow-blue-500/30"
          : "bg-zinc-200 text-zinc-900 dark:bg-zinc-700/70 dark:text-zinc-50"
      } ${flashing ? "ring-2 ring-offset-4 ring-offset-muted/20 ring-foreground scale-[1.04]" : ""}`}
      style={{
        borderBottomRightRadius: isRight ? 8 : 22,
        borderBottomLeftRadius: !isRight ? 8 : 22,
      }}
    >
      <textarea
        ref={ref}
        value={msg.text}
        onChange={(e) => onText(e.target.value)}
        rows={1}
        spellCheck={false}
        className={`block w-full min-w-[40px] resize-none overflow-hidden bg-transparent text-[14px] leading-snug outline-none placeholder:opacity-60 ${
          isRight ? "placeholder:text-white/60" : ""
        }`}
        style={
          {
            fieldSizing: "content",
          } as React.CSSProperties
        }
        placeholder="Empty"
      />
    </div>
  );
}

function RowActions({
  onFlip,
  onDelete,
}: {
  onFlip: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
      <IconButton
        onClick={onFlip}
        icon={ArrowReloadHorizontalIcon}
        title="Flip side"
      />
      <IconButton
        onClick={onDelete}
        icon={Delete02Icon}
        title="Delete"
        variant="danger"
      />
    </div>
  );
}

function IconButton({
  onClick,
  icon,
  title,
  variant,
}: {
  onClick: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  title: string;
  variant?: "danger";
}) {
  const danger = variant === "danger";
  return (
    <button
      onClick={onClick}
      title={title}
      className={`flex size-8 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm transition-colors ${
        danger
          ? "hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-500"
          : "hover:bg-muted hover:text-foreground"
      }`}
    >
      <HugeiconsIcon icon={icon} size={15} />
    </button>
  );
}

function Composer({
  draft,
  side,
  onDraftChange,
  onSideChange,
  onSend,
}: {
  draft: string;
  side: ChatMessage["side"];
  onDraftChange: (v: string) => void;
  onSideChange: (s: ChatMessage["side"]) => void;
  onSend: () => void;
}) {
  const canSend = draft.trim().length > 0;
  return (
    <div className="shrink-0 space-y-3 border-t border-border bg-background px-5 py-4">
      <div className="grid grid-cols-2 gap-2">
        <SideTab
          active={side === "left"}
          onClick={() => onSideChange("left")}
          label="Them"
          color="left"
        />
        <SideTab
          active={side === "right"}
          onClick={() => onSideChange("right")}
          label="You"
          color="right"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          value={draft}
          onChange={(e) => onDraftChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onSend();
            }
          }}
          placeholder={`Message as ${side === "right" ? "you" : "them"}…`}
          className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground/70 focus:border-foreground/30"
        />
        <button
          onClick={onSend}
          disabled={!canSend}
          aria-label="Send message"
          className={`flex size-10 shrink-0 items-center justify-center rounded-full text-white shadow-sm transition-all ${
            canSend
              ? side === "right"
                ? "bg-blue-500 hover:bg-blue-600 active:scale-95"
                : "bg-zinc-500 hover:bg-zinc-600 active:scale-95"
              : "cursor-not-allowed bg-muted text-muted-foreground"
          }`}
        >
          <HugeiconsIcon icon={Sent02Icon} size={18} />
        </button>
      </div>
    </div>
  );
}

function SideTab({
  active,
  onClick,
  label,
  color,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  color: "left" | "right";
}) {
  const dotClass =
    color === "right" ? "bg-blue-500" : "bg-zinc-400 dark:bg-zinc-500";
  const activeClasses =
    color === "right"
      ? "border-blue-500/60 bg-blue-500/10 text-foreground"
      : "border-zinc-400/60 bg-zinc-400/10 text-foreground dark:border-zinc-500/60 dark:bg-zinc-500/10";
  return (
    <button
      onClick={onClick}
      className={`flex h-9 items-center justify-center gap-2 rounded-full border text-[13px] font-medium transition-colors ${
        active
          ? activeClasses
          : "border-border bg-background text-muted-foreground hover:text-foreground"
      }`}
    >
      <span className={`size-1.5 rounded-full ${dotClass}`} />
      {label}
    </button>
  );
}
