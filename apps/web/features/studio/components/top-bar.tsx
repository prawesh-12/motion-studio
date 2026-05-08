"use client"

type Props = {
  clipCount: number
  totalSeconds: number
  exporting: boolean
  canExport: boolean
  onExport: () => void
}

export function TopBar({
  clipCount,
  totalSeconds,
  exporting,
  canExport,
  onExport,
}: Props) {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-zinc-800 bg-[#0d0d0f] px-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="size-5 rounded bg-zinc-100" />
          <span className="text-sm font-semibold tracking-tight text-zinc-100">
            untitled
          </span>
        </div>
        <span className="text-zinc-700">·</span>
        <span className="text-[12px] tabular-nums text-zinc-500">
          {clipCount} clip{clipCount === 1 ? "" : "s"} ·{" "}
          {totalSeconds.toFixed(2)}s
        </span>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onExport}
          disabled={exporting || !canExport}
          className="flex items-center gap-1.5 rounded-md bg-blue-600 px-3.5 py-1.5 text-[12px] font-medium text-white shadow-sm transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500"
        >
          <svg
            viewBox="0 0 24 24"
            className="size-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          {exporting ? "Rendering…" : "Export"}
        </button>
      </div>
    </header>
  )
}
