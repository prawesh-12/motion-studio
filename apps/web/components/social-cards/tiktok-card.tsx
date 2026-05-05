"use client"

import { useState } from "react"
import { Heart, MessageCircle, Bookmark, Share2, Music2, Play } from "lucide-react"

interface TikTokCardProps {
  username: string
  handle: string
  avatar: string
  caption: string
  sound: string
  thumbnail: string
  likes: number
  comments: number
  saves: number
  shares: number
}

export function TikTokCard({
  username,
  handle,
  avatar,
  caption,
  sound,
  thumbnail,
  likes,
  comments,
  saves,
  shares,
}: TikTokCardProps) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(likes)
  const [saved, setSaved] = useState(false)
  const [following, setFollowing] = useState(false)
  const [playing, setPlaying] = useState(false)

  function toggleLike() {
    setLiked(p => !p)
    setLikeCount(p => liked ? p - 1 : p + 1)
  }

  function fmt(n: number) {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
    return String(n)
  }

  return (
    <div className="w-[320px] rounded-2xl bg-black overflow-hidden font-sans relative shadow-2xl border border-white/10">

      {/* Thumbnail */}
      <div className="relative aspect-[9/14] w-full overflow-hidden">
        <img src={thumbnail} alt="tiktok" className="w-full h-full object-cover" />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        {/* Top bar */}
        <div className="absolute top-0 inset-x-0 flex items-center justify-between px-3 pt-3">
          <div className="flex items-center gap-1 text-white/80 text-[13px] font-medium">
            <span className="opacity-50">Following</span>
            <span className="text-white/20 mx-1">|</span>
            <span>For You</span>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-white rounded-full" />
          </div>
        </div>

        {/* Play indicator */}
        {!playing && (
          <button
            onClick={() => setPlaying(true)}
            className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
          >
            <div className="size-14 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
              <Play size={24} className="text-white fill-white ml-1" />
            </div>
          </button>
        )}

        {/* Right actions column */}
        <div className="absolute right-3 bottom-20 flex flex-col items-center gap-5">
          {/* Avatar + follow */}
          <div className="relative mb-1">
            <img src={avatar} alt={username} className="size-11 rounded-full object-cover ring-2 ring-white" />
            <button
              onClick={() => setFollowing(p => !p)}
              className={`absolute -bottom-2.5 left-1/2 -translate-x-1/2 size-5 rounded-full flex items-center justify-center text-[14px] font-bold transition-colors ${
                following ? "bg-white/20 text-white" : "bg-[#fe2c55] text-white"
              }`}
            >
              {following ? "✓" : "+"}
            </button>
          </div>

          {/* Like */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={toggleLike}
              className="size-11 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center active:scale-90 transition-transform"
            >
              <Heart
                size={26}
                className={`transition-colors ${liked ? "fill-[#fe2c55] text-[#fe2c55]" : "text-white fill-white"}`}
              />
            </button>
            <span className="text-white text-[12px] font-medium drop-shadow">{fmt(likeCount)}</span>
          </div>

          {/* Comment */}
          <div className="flex flex-col items-center gap-1">
            <button className="size-11 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center">
              <MessageCircle size={26} className="text-white fill-white" />
            </button>
            <span className="text-white text-[12px] font-medium drop-shadow">{fmt(comments)}</span>
          </div>

          {/* Save */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => setSaved(p => !p)}
              className="size-11 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center"
            >
              <Bookmark
                size={26}
                className={saved ? "fill-yellow-400 text-yellow-400" : "text-white fill-white"}
              />
            </button>
            <span className="text-white text-[12px] font-medium drop-shadow">{fmt(saves)}</span>
          </div>

          {/* Share */}
          <div className="flex flex-col items-center gap-1">
            <button className="size-11 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center">
              <Share2 size={22} className="text-white" />
            </button>
            <span className="text-white text-[12px] font-medium drop-shadow">{fmt(shares)}</span>
          </div>

          {/* Spinning disc */}
          <div className="size-11 rounded-full bg-gradient-to-br from-[#333] to-black border-4 border-[#333] flex items-center justify-center animate-spin [animation-duration:3s]">
            <div className="size-4 rounded-full bg-[#1a1a1a] flex items-center justify-center">
              <div className="size-2 rounded-full bg-white/60" />
            </div>
          </div>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 inset-x-0 px-3 pb-3 pr-20">
          <p className="text-white font-semibold text-[14px]">@{handle}</p>
          <p className="text-white/85 text-[13px] leading-snug mt-1 line-clamp-2">{caption}</p>
          <div className="flex items-center gap-1.5 mt-2">
            <Music2 size={12} className="text-white/70 shrink-0" />
            <div className="overflow-hidden">
              <p className="text-white/70 text-[12px] whitespace-nowrap animate-[marquee_8s_linear_infinite]">
                {sound}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
