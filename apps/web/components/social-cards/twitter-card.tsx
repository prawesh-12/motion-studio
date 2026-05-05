"use client"

import { useState } from "react"
import { MessageCircle, Repeat2, Heart, Bookmark, BarChart2, Upload } from "lucide-react"

interface TwitterCardProps {
  name: string
  handle: string
  avatar: string
  content: string
  image?: string
  time: string
  replies: number
  retweets: number
  likes: number
  views: number
  verified?: boolean
}

export function TwitterCard({
  name,
  handle,
  avatar,
  content,
  image,
  time,
  replies,
  retweets,
  likes,
  views,
  verified = false,
}: TwitterCardProps) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(likes)
  const [retweeted, setRetweeted] = useState(false)
  const [retweetCount, setRetweetCount] = useState(retweets)

  function toggleLike() {
    setLiked((p) => !p)
    setLikeCount((p) => (liked ? p - 1 : p + 1))
  }

  function toggleRetweet() {
    setRetweeted((p) => !p)
    setRetweetCount((p) => (retweeted ? p - 1 : p + 1))
  }

  function fmt(n: number) {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
    return String(n)
  }

  return (
    <div className="w-[420px] rounded-xl bg-black border border-white/10 px-4 pt-4 pb-3 font-sans">
      {/* Header */}
      <div className="flex gap-3">
        <img src={avatar} alt={name} className="size-10 rounded-full object-cover shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1">
                <span className="text-[15px] font-bold text-white leading-none">{name}</span>
                {verified && (
                  <svg viewBox="0 0 22 22" className="size-4 text-sky-400 fill-current shrink-0">
                    <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.154-.516.15-1.067-.013-1.58-.163-.513-.49-.957-.924-1.26.262-.584.249-1.258-.04-1.833-.29-.575-.812-.989-1.43-1.145-.241-.433-.63-.772-1.104-.925-.473-.152-.985-.115-1.432.103-.348-.476-.84-.83-1.4-.99-.56-.16-1.155-.13-1.695.09-.273-.488-.714-.855-1.237-.99-.524-.135-1.08-.04-1.535.266-.48-.223-1.027-.268-1.537-.13-.51.14-.947.48-1.233.938-.556.108-1.043.437-1.36.912-.315.476-.416 1.057-.283 1.61-.595.277-1.077.72-1.374 1.27-.298.55-.38 1.185-.23 1.794-.515.278-.934.71-1.186 1.242-.252.534-.307 1.138-.157 1.708-.585.315-.98.87-1.092 1.517-.113.647.088 1.31.551 1.786-.332.583-.43 1.27-.273 1.927.156.658.553 1.23 1.112 1.606-.15.57-.092 1.175.163 1.703.255.527.679.955 1.203 1.213-.026.583.17 1.156.541 1.61.37.455.901.742 1.48.808.268.501.694.9 1.215 1.128.52.227 1.104.25 1.64.066.354.463.865.778 1.432.888.568.11 1.154-.018 1.636-.358.457.408 1.045.64 1.658.64.612 0 1.2-.232 1.657-.64.483.34 1.068.467 1.636.358.568-.11 1.078-.425 1.432-.888.535.184 1.12.16 1.64-.066.52-.228.946-.627 1.214-1.128.579-.066 1.11-.353 1.48-.808.37-.454.567-1.027.54-1.61.524-.258.948-.686 1.203-1.213.255-.528.314-1.133.163-1.703.559-.376.956-.948 1.112-1.606.156-.657.058-1.344-.273-1.927.463-.476.664-1.139.551-1.786-.112-.647-.507-1.202-1.092-1.517.15-.57.095-1.174-.157-1.708-.252-.533-.671-.964-1.186-1.242.147-.609.066-1.244-.23-1.794-.298-.55-.78-.993-1.374-1.27.133-.553.032-1.134-.283-1.61-.317-.475-.804-.804-1.36-.912-.286-.458-.723-.798-1.233-.938-.51-.138-1.057-.093-1.537.13-.455-.306-1.01-.4-1.535-.266-.524.135-.964.502-1.237.99-.54-.22-1.135-.25-1.695-.09-.56.16-1.052.514-1.4.99-.447-.218-.96-.255-1.432-.103-.474.153-.863.492-1.104.925-.618.156-1.14.57-1.43 1.145-.29.575-.302 1.249-.04 1.833-.434.303-.761.747-.924 1.26-.163.513-.167 1.064-.013 1.58-.586.274-1.084.706-1.438 1.246-.354.54-.552 1.17-.57 1.816z" />
                    <path fill="#000" d="M9.662 14.028l-2.45-2.478-1.353 1.34 3.776 3.817 7.35-7.913-1.325-1.363z" />
                  </svg>
                )}
              </div>
              <span className="text-[13px] text-white/50">{handle}</span>
            </div>
            {/* X logo */}
            <svg viewBox="0 0 24 24" className="size-5 fill-white shrink-0">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </div>

          {/* Content */}
          <p className="mt-2 text-[15px] text-white leading-relaxed whitespace-pre-wrap">{content}</p>

          {/* Optional image */}
          {image && (
            <div className="mt-3 rounded-xl overflow-hidden border border-white/10">
              <img src={image} alt="" className="w-full object-cover max-h-60" />
            </div>
          )}

          {/* Timestamp */}
          <p className="mt-3 text-[13px] text-white/40">{time}</p>

          <div className="mt-3 border-t border-white/8 pt-3 flex items-center justify-between">
            <button className="flex items-center gap-1.5 text-white/50 hover:text-sky-400 transition-colors group">
              <MessageCircle size={18} />
              <span className="text-[13px]">{fmt(replies)}</span>
            </button>
            <button onClick={toggleRetweet} className={`flex items-center gap-1.5 transition-colors ${retweeted ? "text-emerald-400" : "text-white/50 hover:text-emerald-400"}`}>
              <Repeat2 size={18} />
              <span className="text-[13px]">{fmt(retweetCount)}</span>
            </button>
            <button onClick={toggleLike} className={`flex items-center gap-1.5 transition-colors ${liked ? "text-pink-500" : "text-white/50 hover:text-pink-500"}`}>
              <Heart size={18} className={liked ? "fill-pink-500" : ""} />
              <span className="text-[13px]">{fmt(likeCount)}</span>
            </button>
            <button className="flex items-center gap-1.5 text-white/50 hover:text-sky-400 transition-colors">
              <BarChart2 size={18} />
              <span className="text-[13px]">{fmt(views)}</span>
            </button>
            <div className="flex items-center gap-3 text-white/50">
              <button className="hover:text-sky-400 transition-colors"><Bookmark size={18} /></button>
              <button className="hover:text-sky-400 transition-colors"><Upload size={18} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
