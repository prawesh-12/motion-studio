"use client"

import { useState } from "react"
import { MessageSquare, Repeat2, Send, MoreHorizontal, Globe, ThumbsUp } from "lucide-react"

interface LinkedInCardProps {
  name: string
  title: string
  website?: string
  avatar: string
  content: string
  image?: string
  time: string
  likes: number
  comments: number
  connection?: "1st" | "2nd" | "3rd"
}

const reactionList = [
  { emoji: "👍", label: "Like",       bg: "#378fe9" },
  { emoji: "❤️", label: "Love",       bg: "#df704d" },
  { emoji: "🎉", label: "Celebrate",  bg: "#44712e" },
  { emoji: "🤝", label: "Support",    bg: "#7f9052" },
  { emoji: "💡", label: "Insightful", bg: "#f5bb5c" },
  { emoji: "😂", label: "Funny",      bg: "#e9a418" },
]

export function LinkedInCard({
  name,
  title,
  website,
  avatar,
  content,
  image,
  time,
  likes,
  comments,
  connection = "2nd",
}: LinkedInCardProps) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(likes)
  const [activeReaction, setActiveReaction] = useState<string | null>(null)
  const [showReactions, setShowReactions] = useState(false)
  const [expanded, setExpanded] = useState(false)
  let timer: ReturnType<typeof setTimeout>

  function onLikeEnter() { timer = setTimeout(() => setShowReactions(true), 500) }
  function onLikeLeave() { clearTimeout(timer); setTimeout(() => setShowReactions(false), 200) }

  function pickReaction(label: string) {
    if (activeReaction === label) {
      setActiveReaction(null); setLiked(false); setLikeCount(p => p - 1)
    } else {
      if (!activeReaction) setLikeCount(p => p + 1)
      setActiveReaction(label); setLiked(true)
    }
    setShowReactions(false)
  }

  function toggleLike() {
    if (liked) { setLiked(false); setActiveReaction(null); setLikeCount(p => p - 1) }
    else { setLiked(true); setActiveReaction("Like"); setLikeCount(p => p + 1) }
  }

  const truncated = content.length > 160 && !expanded
  const activeColor = reactionList.find(r => r.label === activeReaction)?.bg ?? "#378fe9"

  function fmt(n: number) {
    return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n)
  }

  return (
    <div className="w-[420px] bg-[#1b1f23] border border-white/10 rounded-xl overflow-visible font-sans shadow-xl">

      {/* Header */}
      <div className="flex items-start gap-3 px-4 pt-4 pb-0">
        <img src={avatar} alt={name} className="size-14 rounded-full object-cover ring-1 ring-white/10 shrink-0" />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              {/* Name row */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[15px] font-semibold text-white leading-tight">{name}</span>
                <span className="text-white/30 text-[13px]">· {connection}</span>
              </div>
              {/* Title */}
              <p className="text-[12px] text-white/45 leading-snug mt-0.5 line-clamp-2 max-w-[240px]">{title}</p>
              {/* Website */}
              {website && (
                <button className="text-[12px] text-[#70b5f9] hover:underline mt-0.5 block">{website}</button>
              )}
              {/* Time */}
              <div className="flex items-center gap-1 mt-1">
                <span className="text-[11px] text-white/30">{time}</span>
                <span className="text-white/20 text-[10px]">·</span>
                <Globe size={10} className="text-white/30" />
              </div>
            </div>
            {/* Follow */}
            <button className="shrink-0 text-[14px] font-semibold text-[#70b5f9] hover:text-[#a8d4ff] transition-colors whitespace-nowrap">
              + Follow
            </button>
          </div>
        </div>

        <button className="text-white/30 hover:text-white/60 transition-colors shrink-0 -mt-1">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pt-3 pb-3">
        <p className="text-[14px] text-white/80 leading-relaxed">
          {truncated ? content.slice(0, 160) : content}
          {truncated && (
            <span>
              {"... "}
              <button onClick={() => setExpanded(true)} className="text-[#70b5f9] hover:underline font-medium">
                more
              </button>
            </span>
          )}
        </p>
      </div>

      {/* Image */}
      {image && <img src={image} alt="" className="w-full object-cover max-h-72" />}

      {/* Stats */}
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-1.5">
          <div className="flex -space-x-1">
            {[
              { bg: "#378fe9", emoji: "👍" },
              { bg: "#df704d", emoji: "❤️" },
              { bg: "#44712e", emoji: "🎉" },
            ].map(r => (
              <span
                key={r.emoji}
                className="size-[18px] rounded-full flex items-center justify-center text-[9px] ring-[1.5px] ring-[#1b1f23]"
                style={{ backgroundColor: r.bg }}
              >
                {r.emoji}
              </span>
            ))}
          </div>
          <span className="text-[12px] text-white/35 hover:text-white/60 cursor-pointer transition-colors">{fmt(likeCount)}</span>
        </div>
        <button className="text-[12px] text-white/35 hover:text-white/60 hover:underline transition-colors">
          {fmt(comments)} comments
        </button>
      </div>

      {/* Divider */}
      <div className="mx-3 border-t border-white/8" />

      {/* Actions */}
      <div className="flex items-center px-1 py-1">
        {/* Like */}
        <div className="relative flex-1">
          {showReactions && (
            <div
              onMouseEnter={() => setShowReactions(true)}
              onMouseLeave={() => setShowReactions(false)}
              className="absolute bottom-full left-0 mb-2 flex items-end gap-1 bg-[#2a3038] border border-white/10 rounded-full px-3 py-2.5 shadow-2xl z-20"
            >
              {reactionList.map(r => (
                <button
                  key={r.label}
                  title={r.label}
                  onClick={() => pickReaction(r.label)}
                  className="text-[24px] leading-none hover:scale-125 transition-transform duration-100 active:scale-110"
                >
                  {r.emoji}
                </button>
              ))}
            </div>
          )}
          <button
            onClick={toggleLike}
            onMouseEnter={onLikeEnter}
            onMouseLeave={onLikeLeave}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-[13px] font-medium"
            style={{ color: liked ? activeColor : "rgba(255,255,255,0.4)" }}
          >
            <ThumbsUp size={17} style={{ fill: liked ? activeColor : "transparent", strokeWidth: 1.8 }} />
            <span>{activeReaction ?? "Like"}</span>
          </button>
        </div>

        <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-white/40 hover:bg-white/5 hover:text-white/75 transition-colors text-[13px] font-medium">
          <MessageSquare size={17} strokeWidth={1.8} />
          <span>Comment</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-white/40 hover:bg-white/5 hover:text-white/75 transition-colors text-[13px] font-medium">
          <Repeat2 size={17} strokeWidth={1.8} />
          <span>Repost</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-white/40 hover:bg-white/5 hover:text-white/75 transition-colors text-[13px] font-medium">
          <Send size={17} strokeWidth={1.8} />
          <span>Send</span>
        </button>
      </div>
    </div>
  )
}
