"use client"

import { useState } from "react"
import { InstagramCard } from "@/components/social-cards/instagram-card"
import { TwitterCard } from "@/components/social-cards/twitter-card"
import { LinkedInCard } from "@/components/social-cards/linkedin-card"
import { TikTokCard } from "@/components/social-cards/tiktok-card"

const platforms = [
  {
    id: "instagram",
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" className="size-4 fill-current">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
    gradient: "from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888]",
    activeClass: "bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white",
  },
  {
    id: "twitter",
    label: "X (Twitter)",
    icon: (
      <svg viewBox="0 0 24 24" className="size-4 fill-current">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    activeClass: "bg-white text-black",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    icon: (
      <svg viewBox="0 0 24 24" className="size-4 fill-current">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    activeClass: "bg-[#0a66c2] text-white",
  },
  {
    id: "tiktok",
    label: "TikTok",
    icon: (
      <svg viewBox="0 0 24 24" className="size-4 fill-current">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z" />
      </svg>
    ),
    activeClass: "bg-[#fe2c55] text-white",
  },
]

export default function HomePage() {
  const [active, setActive] = useState("instagram")

  return (
    <div className="flex flex-col h-full">
      {/* Platform tab bar */}
      <div className="flex items-center gap-2 px-8 py-4 border-b border-white/8">
        {platforms.map((p) => (
          <button
            key={p.id}
            onClick={() => setActive(p.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 ${
              active === p.id
                ? p.activeClass
                : "text-white/40 hover:text-white/70 hover:bg-white/5"
            }`}
          >
            {p.icon}
            {p.label}
          </button>
        ))}
      </div>

      {/* Card preview */}
      <div className="flex-1 flex items-start justify-center pt-12 overflow-auto">
        {active === "instagram" && (
          <InstagramCard
            username="sankalpa"
            handle="@sankalpa.dev"
            avatar="https://i.pravatar.cc/150?img=11"
            image="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80"
            caption="shipped something today that i've been thinking about for weeks. consistency > perfection 🚀"
            likes={1482}
            comments={34}
            timestamp="2 hours ago"
          />
        )}
        {active === "twitter" && (
          <TwitterCard
            name="Sankalpa"
            handle="@sankalpa_dev"
            avatar="https://i.pravatar.cc/150?img=11"
            content={`the gap between "i want to build this" and "i built this" is just discipline\n\nnothing else`}
            time="2:41 PM · May 5, 2026"
            replies={48}
            retweets={312}
            likes={2100}
            views={84000}
            verified
          />
        )}
        {active === "linkedin" && (
          <LinkedInCard
            name="Sankalpa Acharya"
            title="Building PostCrow · Indie Maker · Shipping in public"
            website="Visit my website"
            avatar="https://i.pravatar.cc/150?img=11"
            content={`After 6 months of building in public, here's what actually moved the needle:\n\n→ Shipping ugly v1s fast\n→ Talking to 3 users a week\n→ Writing about the process\n\nThe "perfect product" mindset is the #1 killer of indie projects.\n\nBuild. Ship. Learn. Repeat.`}
            time="2h"
            likes={847}
            comments={63}
            reposts={112}
            connection="2nd"
          />
        )}
        {active === "tiktok" && (
          <TikTokCard
            username="sankalpa"
            handle="sankalpa.dev"
            avatar="https://i.pravatar.cc/150?img=11"
            thumbnail="https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&q=80"
            caption="turned my apartment into a mini studio and shot 10 videos in one day 🎬 consistency hits different"
            sound="original sound - sankalpa.dev"
            likes={24800}
            comments={312}
            saves={1500}
            shares={890}
          />
        )}
      </div>
    </div>
  )
}
