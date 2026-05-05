"use client"

import { useState } from "react"
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react"

interface InstagramCardProps {
  username: string
  handle: string
  avatar: string
  image: string
  caption: string
  likes: number
  comments: number
  timestamp: string
}

export function InstagramCard({
  username,
  handle,
  avatar,
  image,
  caption,
  likes,
  comments,
  timestamp,
}: InstagramCardProps) {
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [likeCount, setLikeCount] = useState(likes)

  function toggleLike() {
    setLiked((p) => !p)
    setLikeCount((p) => (liked ? p - 1 : p + 1))
  }

  return (
    <div className="w-[380px] rounded-xl bg-[#0a0a0a] border border-white/10 overflow-hidden font-sans">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px]">
            <img src={avatar} alt={username} className="size-full rounded-full object-cover ring-1 ring-black" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-white leading-none">{username}</p>
            <p className="text-[11px] text-white/40 mt-0.5">{handle}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-[13px] font-semibold text-sky-400">Follow</button>
          <MoreHorizontal size={18} className="text-white/60" />
        </div>
      </div>

      {/* Image */}
      <div className="aspect-square w-full bg-white/5 overflow-hidden">
        <img src={image} alt="post" className="w-full h-full object-cover" />
      </div>

      {/* Actions */}
      <div className="px-4 pt-3 pb-1 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={toggleLike} className="transition-transform active:scale-90">
            <Heart
              size={24}
              className={liked ? "fill-red-500 text-red-500" : "text-white"}
            />
          </button>
          <button>
            <MessageCircle size={24} className="text-white" />
          </button>
          <button>
            <Send size={24} className="text-white" />
          </button>
        </div>
        <button onClick={() => setSaved((p) => !p)}>
          <Bookmark
            size={24}
            className={saved ? "fill-white text-white" : "text-white"}
          />
        </button>
      </div>

      {/* Likes */}
      <div className="px-4 pt-1">
        <p className="text-[13px] font-semibold text-white">{likeCount.toLocaleString()} likes</p>
      </div>

      {/* Caption */}
      <div className="px-4 pt-1 pb-1">
        <p className="text-[13px] text-white">
          <span className="font-semibold mr-1">{username}</span>
          {caption}
        </p>
      </div>

      {/* Comments & timestamp */}
      <div className="px-4 pb-3 pt-1 space-y-0.5">
        <p className="text-[12px] text-white/40">View all {comments} comments</p>
        <p className="text-[10px] text-white/30 uppercase tracking-wide">{timestamp}</p>
      </div>
    </div>
  )
}
