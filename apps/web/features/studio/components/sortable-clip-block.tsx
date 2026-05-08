"use client"

import React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { Clip } from "@workspace/compositions/project"
import { compositionsById } from "@workspace/compositions/registry"
import { cn } from "@workspace/ui/lib/utils"
import { PX_PER_SECOND, colorForCompositionId } from "../lib/clip-colors"

type Props = {
  clip: Clip
  fps: number
  selected: boolean
  onSelect: () => void
  onDelete: () => void
  onDurationChange: (durationInFrames: number) => void
}

export function SortableClipBlock({
  clip,
  fps,
  selected,
  onSelect,
  onDelete,
  onDurationChange,
}: Props) {
  const info = compositionsById[clip.compositionId]
  const seconds = clip.durationInFrames / fps
  const widthPx = Math.max(80, seconds * PX_PER_SECOND)
  const colorClass = colorForCompositionId(clip.compositionId)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: clip.id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: widthPx,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={cn(
        "group relative shrink-0 select-none overflow-hidden rounded-lg",
        "cursor-grab active:cursor-grabbing",
        "transition-all duration-150",
        // Elevation
        "shadow-[0_2px_6px_rgba(0,0,0,0.22),0_1px_2px_rgba(0,0,0,0.15)]",
        // Outer ring — selection only; elevation shadow defines the edge at rest
        selected && "ring-2 ring-blue-400 ring-offset-2 ring-offset-background",
      )}
      {...attributes}
      {...listeners}
    >
      {/* Gradient body — top lighter, bottom richer */}
      <div
        className={cn(
          "bg-gradient-to-b",
          colorClass,
          "relative flex h-14 flex-col justify-between p-2",
        )}
      >
        {/* Inner top highlight + inner outline */}
        <div
          className="pointer-events-none absolute inset-0 rounded-lg"
          style={{
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.32), inset 0 0 0 1px rgba(255,255,255,0.10)",
          }}
        />

        <p className="truncate text-[11px] font-semibold leading-tight text-white drop-shadow-sm">
          {info?.title ?? clip.compositionId}
        </p>
        <p className="text-[10px] tabular-nums text-white/75">
          {seconds.toFixed(2)}s
        </p>
      </div>

      {/* Controls: −  +  × */}
      <div
        className={cn(
          "absolute right-1 top-1 flex items-center gap-px",
          "rounded-md bg-black/30 px-0.5 py-0.5 backdrop-blur-sm",
          "transition-opacity duration-150",
          selected ? "opacity-100" : "opacity-0 group-hover:opacity-100",
        )}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <ClipButton title="−1s" onClick={(e) => { e.stopPropagation(); onDurationChange(clip.durationInFrames - fps) }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <rect x="1.5" y="4.5" width="7" height="1" rx="0.5" fill="currentColor" />
          </svg>
        </ClipButton>

        <ClipButton title="+1s" onClick={(e) => { e.stopPropagation(); onDurationChange(clip.durationInFrames + fps) }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <rect x="1.5" y="4.5" width="7" height="1" rx="0.5" fill="currentColor" />
            <rect x="4.5" y="1.5" width="1" height="7" rx="0.5" fill="currentColor" />
          </svg>
        </ClipButton>

        <div className="mx-0.5 h-3 w-px bg-white/20" />

        <ClipButton title="Delete clip" danger onClick={(e) => { e.stopPropagation(); onDelete() }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 2L8 8M8 2L2 8" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
          </svg>
        </ClipButton>
      </div>
    </div>
  )
}

function ClipButton({
  children,
  danger,
  ...props
}: React.ComponentProps<"button"> & { danger?: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        "flex size-5 items-center justify-center rounded",
        "text-white/75 transition-colors duration-100",
        danger
          ? "hover:bg-red-500/50 hover:text-white"
          : "hover:bg-white/20 hover:text-white",
      )}
      {...props}
    >
      {children}
    </button>
  )
}
