"use client"

import type { ComponentProps } from "react"
import { FieldsRenderer } from "@workspace/compositions/editors"
import type { Clip } from "@workspace/compositions/project"
import { compositionsById } from "@workspace/compositions/registry"

type Info = NonNullable<(typeof compositionsById)[string]>

type Props = {
  clip: Clip
  info: Info
  onChange: ComponentProps<typeof FieldsRenderer>["onChange"]
  onClose: () => void
}

export function Inspector({ clip, info, onChange, onClose }: Props) {
  return (
    <aside className="flex w-80 shrink-0 flex-col border-l border-zinc-800 bg-[#0f0f11]">
      <div className="flex items-start justify-between gap-3 border-b border-zinc-800 px-4 py-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Inspector
          </p>
          <p className="mt-1 truncate text-sm font-medium text-zinc-100">
            {info.title}
          </p>
        </div>
        <button
          onClick={onClose}
          className="flex size-7 shrink-0 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
          title="Close"
        >
          ×
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <FieldsRenderer
          fields={info.fields}
          value={clip.props}
          onChange={onChange}
        />
      </div>
    </aside>
  )
}
