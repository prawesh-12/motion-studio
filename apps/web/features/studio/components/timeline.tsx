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
  onSelect: (id: string) => void
  onReorder: (clipIds: string[]) => void
  onDelete: (id: string) => void
  onDurationChange: (id: string, durationInFrames: number) => void
}

export function Timeline({
  project,
  selectedClipId,
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
    <div className="shrink-0 border-t border-zinc-800 bg-[#0d0d0f]">
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
          Timeline
        </p>
        <p className="text-[11px] tabular-nums text-zinc-500">
          {totalSeconds.toFixed(2)}s · {project.fps}fps · {project.width}×
          {project.height}
        </p>
      </div>

      <div className="overflow-x-auto">
        <div style={{ minWidth: trackWidth + 32, width: "max-content" }}>
          <TimeRuler ticks={ticks} pxPerSecond={PX_PER_SECOND} />

          {project.clips.length === 0 ? (
            <div
              className="px-4 py-10 text-center text-[12px] text-zinc-500"
              style={{ width: trackWidth }}
            >
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
                <div className="flex items-stretch gap-px px-3 py-3">
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
        </div>
      </div>
    </div>
  )
}

function TimeRuler({
  ticks,
  pxPerSecond,
}: {
  ticks: number[]
  pxPerSecond: number
}) {
  return (
    <div className="relative h-7 border-b border-zinc-800/60 px-3">
      {ticks.map((t) => (
        <div
          key={t}
          className="absolute top-0 flex h-full flex-col items-start gap-0.5"
          style={{ left: 12 + t * pxPerSecond }}
        >
          <span className="mt-1 text-[9px] tabular-nums text-zinc-600">
            {formatTime(t)}
          </span>
          <span className="absolute bottom-0 h-1.5 w-px bg-zinc-700" />
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
