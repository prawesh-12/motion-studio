"use client"

import { useEffect, useMemo } from "react"
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable"
import {
  projectDuration,
  type Project,
} from "@workspace/compositions/project"
import { PX_PER_SECOND } from "../lib/clip-colors"
import { SortableClipBlock } from "./sortable-clip-block"

type Props = {
  project: Project
  selectedClipId: string | null
  currentFrame: number
  onSeek: (frame: number) => void
  onSelect: (id: string) => void
  onReorder: (clipIds: string[]) => void
  onDelete: (id: string) => void
  onDurationChange: (id: string, durationInFrames: number) => void
}

const TRACK_INSET = 12

export function Timeline({
  project,
  selectedClipId,
  currentFrame,
  onSeek,
  onSelect,
  onReorder,
  onDelete,
  onDurationChange,
}: Props) {
  const total = projectDuration(project)
  const totalSeconds = total / project.fps
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  )

  const tickEvery = totalSeconds <= 10 ? 1 : totalSeconds <= 30 ? 2 : 5
  const ticks = useMemo(() => {
    const arr: number[] = []
    const span = Math.max(totalSeconds, 5)
    for (let s = 0; s <= span; s += tickEvery) arr.push(s)
    return arr
  }, [totalSeconds, tickEvery])

  const trackWidth = Math.max(totalSeconds, 5) * PX_PER_SECOND

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e
    if (!over || active.id === over.id) return
    const ids = project.clips.map((c) => c.id)
    const oldIndex = ids.indexOf(active.id as string)
    const newIndex = ids.indexOf(over.id as string)
    if (oldIndex < 0 || newIndex < 0) return
    onReorder(arrayMove(ids, oldIndex, newIndex))
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        selectedClipId &&
        !isTextInputFocused()
      ) {
        e.preventDefault()
        onDelete(selectedClipId)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [selectedClipId, onDelete])

  return (
    <div className="shrink-0 border-t border-border bg-background">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <p className="text-xs font-medium text-muted-foreground">
          Timeline
        </p>
        <p className="text-[11px] tabular-nums text-muted-foreground">
          {totalSeconds.toFixed(2)}s · {project.fps}fps · {project.width}×
          {project.height}
        </p>
      </div>

      <div className="overflow-x-auto">
        <div
          style={{ minWidth: trackWidth + 32 }}
          className="relative w-full"
        >
          <TimeRuler
            ticks={ticks}
            pxPerSecond={PX_PER_SECOND}
            totalSeconds={Math.max(totalSeconds, 5)}
            fps={project.fps}
            onSeek={onSeek}
          />

          {project.clips.length === 0 ? (
            <div className="px-4 py-10 text-center text-[12px] text-muted-foreground">
              Empty timeline — add a clip from the library.
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={project.clips.map((c) => c.id)}
                strategy={horizontalListSortingStrategy}
              >
                <div className="flex items-stretch gap-2 px-3 py-3">
                  {project.clips.map((clip) => (
                    <SortableClipBlock
                      key={clip.id}
                      clip={clip}
                      fps={project.fps}
                      selected={clip.id === selectedClipId}
                      onSelect={() => onSelect(clip.id)}
                      onDelete={() => onDelete(clip.id)}
                      onDurationChange={(d) => onDurationChange(clip.id, d)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}

          <Playhead
            frame={currentFrame}
            fps={project.fps}
            pxPerSecond={PX_PER_SECOND}
          />
        </div>
      </div>
    </div>
  )
}

function Playhead({
  frame,
  fps,
  pxPerSecond,
}: {
  frame: number
  fps: number
  pxPerSecond: number
}) {
  const left = TRACK_INSET + (frame / fps) * pxPerSecond
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-0 bottom-0 z-20"
      style={{ left, transform: "translateX(-50%)" }}
    >
      <div className="absolute -top-px left-1/2 -translate-x-1/2">
        <div
          className="size-0 border-x-[6px] border-t-[8px] border-x-transparent"
          style={{ borderTopColor: "rgb(239 68 68)" }}
        />
      </div>
      <div
        className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2"
        style={{ background: "rgb(239 68 68)" }}
      />
    </div>
  )
}

function TimeRuler({
  ticks,
  pxPerSecond,
  totalSeconds,
  fps,
  onSeek,
}: {
  ticks: number[]
  pxPerSecond: number
  totalSeconds: number
  fps: number
  onSeek: (frame: number) => void
}) {
  function handleSeek(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left - TRACK_INSET
    const seconds = Math.max(0, Math.min(x / pxPerSecond, totalSeconds))
    onSeek(Math.round(seconds * fps))
  }

  return (
    <div
      className="relative h-7 cursor-pointer border-b border-border/60 px-3"
      onMouseDown={handleSeek}
    >
      {ticks.map((t) => (
        <div
          key={t}
          className="pointer-events-none absolute top-0 flex h-full flex-col items-start gap-0.5"
          style={{ left: TRACK_INSET + t * pxPerSecond }}
        >
          <span className="mt-1 text-[9px] tabular-nums text-muted-foreground">
            {formatTime(t)}
          </span>
          <span className="absolute bottom-0 h-1.5 w-px bg-border" />
        </div>
      ))}
    </div>
  )
}

function formatTime(s: number): string {
  const mm = Math.floor(s / 60)
  const ss = Math.floor(s % 60)
  return `${mm}:${ss.toString().padStart(2, "0")}`
}

function isTextInputFocused(): boolean {
  const el = document.activeElement
  if (!el) return false
  const tag = el.tagName.toLowerCase()
  return (
    tag === "input" ||
    tag === "textarea" ||
    (el as HTMLElement).isContentEditable
  )
}
