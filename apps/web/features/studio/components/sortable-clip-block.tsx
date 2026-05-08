"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { Clip } from "@workspace/compositions/project"
import { compositionsById } from "@workspace/compositions/registry"
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
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 10 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`group relative shrink-0 select-none overflow-hidden rounded-md ring-offset-2 ring-offset-[#0d0d0f] transition-shadow ${
        selected ? "ring-2 ring-blue-500" : "ring-0"
      } cursor-grab active:cursor-grabbing`}
      {...attributes}
      {...listeners}
    >
      <div
        className={`bg-gradient-to-br ${colorClass} flex h-14 flex-col justify-between p-2`}
      >
        <p className="truncate text-[11px] font-semibold leading-tight text-white drop-shadow-sm">
          {info?.title ?? clip.compositionId}
        </p>
        <p className="text-[10px] tabular-nums text-white/80">
          {seconds.toFixed(2)}s
        </p>
      </div>

      <div
        className={`absolute right-1 top-1 flex items-center gap-0.5 rounded bg-black/30 px-1 py-0.5 backdrop-blur-sm transition-opacity ${
          selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDurationChange(clip.durationInFrames - fps)
          }}
          title="−1s"
          className="flex size-5 items-center justify-center rounded text-[14px] leading-none text-white/80 hover:bg-white/15 hover:text-white"
        >
          −
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDurationChange(clip.durationInFrames + fps)
          }}
          title="+1s"
          className="flex size-5 items-center justify-center rounded text-[12px] leading-none text-white/80 hover:bg-white/15 hover:text-white"
        >
          +
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          title="Delete"
          className="flex size-5 items-center justify-center rounded text-[12px] leading-none text-white/80 hover:bg-red-500/40 hover:text-white"
        >
          ×
        </button>
      </div>
    </div>
  )
}
