"use client"

import type { StudioPanel } from "../state/reducer"

type Props = {
  openPanel: StudioPanel
  onToggle: (panel: StudioPanel) => void
}

export function ToolRail({ openPanel, onToggle }: Props) {
  return (
    <aside className="flex w-14 shrink-0 flex-col items-center gap-1 border-r border-zinc-800 bg-[#0d0d0f] py-3">
      <ToolButton
        active={openPanel === "library"}
        onClick={() => onToggle("library")}
        label="Library"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </ToolButton>
    </aside>
  )
}

function ToolButton({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean
  onClick: () => void
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`group relative flex size-10 items-center justify-center rounded-lg transition-colors ${
        active
          ? "bg-blue-600/20 text-blue-300"
          : "text-zinc-400 hover:bg-zinc-800/70 hover:text-zinc-100"
      }`}
    >
      {children}
      {active && (
        <span className="absolute -left-3 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-r bg-blue-500" />
      )}
    </button>
  )
}
