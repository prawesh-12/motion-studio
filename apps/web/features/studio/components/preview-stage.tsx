"use client"

import { Player } from "@remotion/player"
import { ProjectComposition } from "@workspace/compositions/compositions/Project/Project"
import type { Project } from "@workspace/compositions/project"

type Props = {
  project: Project
  playerInputProps: Project
  totalDuration: number
  hasClips: boolean
}

export function PreviewStage({
  project,
  playerInputProps,
  totalDuration,
  hasClips,
}: Props) {
  return (
    <div className="relative flex min-h-0 flex-1 items-center justify-center bg-[#0a0a0b] p-8">
      <div
        className="relative max-h-full max-w-full overflow-hidden rounded-2xl border border-zinc-800 bg-black shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]"
        style={{
          aspectRatio: `${project.width} / ${project.height}`,
          height: "100%",
          width: "auto",
          maxWidth: "100%",
          maxHeight: "100%",
        }}
      >
        {hasClips ? (
          <Player
            component={ProjectComposition}
            inputProps={playerInputProps}
            durationInFrames={totalDuration}
            fps={project.fps}
            compositionWidth={project.width}
            compositionHeight={project.height}
            style={{ width: "100%", height: "100%" }}
            controls
            loop
            initiallyMuted
            acknowledgeRemotionLicense
          />
        ) : (
          <EmptyStage />
        )}
      </div>
    </div>
  )
}

function EmptyStage() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full border border-white/10 bg-white/5">
          <svg
            viewBox="0 0 24 24"
            className="size-5 text-white/40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        </div>
        <p className="text-sm font-medium text-white/70">Your video</p>
        <p className="mt-1 text-[12px] text-white/40">
          Open the library and add your first scene.
        </p>
      </div>
    </div>
  )
}
