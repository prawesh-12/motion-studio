export const PX_PER_SECOND = 80

export const CLIP_COLORS = [
  "from-violet-500/85 to-violet-600/85",
  "from-sky-500/85 to-sky-600/85",
  "from-emerald-500/85 to-emerald-600/85",
  "from-amber-500/85 to-amber-600/85",
  "from-rose-500/85 to-rose-600/85",
  "from-fuchsia-500/85 to-fuchsia-600/85",
]

export function colorForCompositionId(id: string): string {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0
  return CLIP_COLORS[Math.abs(hash) % CLIP_COLORS.length]!
}
