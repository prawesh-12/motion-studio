"use client"

import { useEffect, useMemo, useReducer, useRef, useState } from "react"
import type { PlayerRef } from "@remotion/player"
import { projectDuration } from "@workspace/compositions/project"
import { compositionsById } from "@workspace/compositions/registry"
import {
  initialStudioState,
  studioReducer,
} from "../state/reducer"
import { useExportRender } from "../hooks/use-export-render"
import { TopBar } from "./top-bar"
import { ToolRail } from "./tool-rail"
import { LibraryPanel } from "./library-panel"
import { PreviewStage } from "./preview-stage"
import { Inspector } from "./inspector"
import { Timeline } from "./timeline"
import { ExportProgressOverlay } from "./export-progress-overlay"

export function Builder() {
  const [state, dispatch] = useReducer(studioReducer, initialStudioState)
  const { state: exportState, start: startExport, reset: resetExport } =
    useExportRender()

  const totalDuration = projectDuration(state.project)
  const totalSeconds = totalDuration / state.project.fps
  const selectedClip = state.project.clips.find(
    (c) => c.id === state.selectedClipId,
  )
  const selectedInfo = selectedClip
    ? compositionsById[selectedClip.compositionId]
    : undefined

  const playerInputProps = useMemo(() => state.project, [state.project])
  const hasClips = state.project.clips.length > 0
  const isExporting =
    exportState.phase === "starting" || exportState.phase === "rendering"

  const playerRef = useRef<PlayerRef>(null)
  const [currentFrame, setCurrentFrame] = useState(0)

  useEffect(() => {
    const player = playerRef.current
    if (!player) return
    const onFrame = (e: { detail: { frame: number } }) => {
      setCurrentFrame(e.detail.frame)
    }
    player.addEventListener("frameupdate", onFrame)
    return () => player.removeEventListener("frameupdate", onFrame)
  }, [hasClips])

  const seekToFrame = (frame: number) => {
    const player = playerRef.current
    if (!player) return
    const clamped = Math.max(0, Math.min(frame, Math.max(0, totalDuration - 1)))
    player.seekTo(clamped)
    setCurrentFrame(clamped)
  }

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <TopBar
        clipCount={state.project.clips.length}
        totalSeconds={totalSeconds}
        exporting={isExporting}
        canExport={hasClips}
        onExport={() => startExport(state.project)}
      />

      <div className="relative flex min-h-0 flex-1">
        <ToolRail
          openPanel={state.openPanel}
          onToggle={(p) => dispatch({ type: "TOGGLE_PANEL", panel: p })}
        />

        {state.openPanel === "library" && (
          <LibraryPanel
            onAdd={(id) =>
              dispatch({ type: "ADD_CLIP", compositionId: id })
            }
          />
        )}

        <main className="flex min-w-0 flex-1 flex-col">
          <PreviewStage
            project={state.project}
            playerInputProps={playerInputProps}
            totalDuration={totalDuration}
            hasClips={hasClips}
            onOpenLibrary={() =>
              dispatch({ type: "TOGGLE_PANEL", panel: "library" })
            }
            playerRef={playerRef}
          />

          <Timeline
            project={state.project}
            selectedClipId={state.selectedClipId}
            currentFrame={currentFrame}
            onSeek={seekToFrame}
            onSelect={(id) => dispatch({ type: "SELECT_CLIP", clipId: id })}
            onReorder={(clipIds) =>
              dispatch({ type: "REORDER_CLIPS", clipIds })
            }
            onDelete={(id) => dispatch({ type: "DELETE_CLIP", clipId: id })}
            onDurationChange={(id, durationInFrames) =>
              dispatch({
                type: "UPDATE_CLIP_DURATION",
                clipId: id,
                durationInFrames,
              })
            }
          />
        </main>

        {selectedClip && selectedInfo && (
          <Inspector
            clip={selectedClip}
            info={selectedInfo}
            onChange={(next) =>
              dispatch({
                type: "UPDATE_CLIP_PROPS",
                clipId: selectedClip.id,
                props: next,
              })
            }
            onClose={() => dispatch({ type: "SELECT_CLIP", clipId: null })}
          />
        )}
      </div>

      <ExportProgressOverlay state={exportState} onClose={resetExport} />
    </div>
  )
}
