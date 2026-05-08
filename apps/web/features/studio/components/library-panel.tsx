"use client"

import { compositions } from "@workspace/compositions/registry"
import { colorForCompositionId } from "../lib/clip-colors"

type Props = {
  onAdd: (compositionId: string) => void
}

export function LibraryPanel({ onAdd }: Props) {
  const titleAnimations = compositions.filter((c) => c.id.startsWith("Title"))
  const others = compositions.filter((c) => !c.id.startsWith("Title"))

  return (
    <aside className="flex w-72 shrink-0 flex-col overflow-y-auto border-r border-zinc-800 bg-[#0f0f11]">
      <div className="sticky top-0 z-10 border-b border-zinc-800 bg-[#0f0f11]/95 px-4 py-3 backdrop-blur">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
          Library
        </p>
        <p className="mt-1 text-[13px] text-zinc-400">Click to add a scene</p>
      </div>
      <Section title="Text Animations" items={titleAnimations} onAdd={onAdd} />
      <Section title="Templates" items={others} onAdd={onAdd} />
    </aside>
  )
}

function Section({
  title,
  items,
  onAdd,
}: {
  title: string
  items: typeof compositions
  onAdd: (id: string) => void
}) {
  if (items.length === 0) return null
  return (
    <div className="border-b border-zinc-800/60 px-3 py-3">
      <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
        {title}
      </p>
      <ul className="space-y-px">
        {items.map((c) => {
          const colorClass = colorForCompositionId(c.id)
          return (
            <li key={c.id}>
              <button
                onClick={() => onAdd(c.id)}
                className="group flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-zinc-800/60"
              >
                <span
                  className={`bg-gradient-to-br ${colorClass} flex size-8 shrink-0 items-center justify-center rounded-md text-[11px] font-semibold tracking-tight text-white shadow-sm`}
                >
                  {c.title.slice(0, 2).toUpperCase()}
                </span>
                <span className="min-w-0 flex-1 truncate text-[13px] text-zinc-300 group-hover:text-zinc-100">
                  {c.title}
                </span>
                <span className="flex size-5 shrink-0 items-center justify-center rounded text-[14px] leading-none text-zinc-600 transition-colors group-hover:bg-zinc-700 group-hover:text-zinc-200">
                  +
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
