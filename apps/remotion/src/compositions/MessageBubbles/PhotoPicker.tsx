"use client";

/**
 * iMessage "+" attachment flow, animated for the video: tapping the composer's
 * plus button opens the attachment menu card (Halo AI / Camera / Photos /
 * Stickers / Audio / Store), Photos is tapped, a photo grid slides up over the
 * keyboard, the target photo is tapped, then it sends.
 *
 * Driven by a single `t` (0→1) progress so it stays in lockstep with the
 * conversation timeline (buildChatState derives `t` from the frame). It renders
 * as an absolute overlay filling the keyboard slot, so the layout never jumps —
 * the menu card floats over the dimmed keyboard, then the grid covers it.
 *
 * All visuals are flat CSS/SVG (no WebGL, no backdrop-filter) so the studio
 * Player and the export look identical — same rule as the rest of MessageBubbles.
 */

import { Easing, Img, interpolate } from "remotion";
import { asset } from "../_chat-demo/ChatDemo";
import { SF_PRO_STACK } from "../_chat-demo/sf-pro";

const MENU_ITEMS = [
  { key: "halo", label: "Halo AI" },
  { key: "camera", label: "Camera" },
  { key: "photos", label: "Photos" },
  { key: "stickers", label: "Stickers" },
  { key: "audio", label: "Audio" },
  { key: "store", label: "Store" },
] as const;

/** Real iOS app-icon images for the rows that ship one (in
 *  apps/web/public/components/messagebubble/); the rest fall back to a flat
 *  CSS/SVG icon. */
const ICON_PNG: Record<string, string> = {
  halo: "haloai.png",
  camera: "camera.png",
  photos: "photos.png",
  audio: "audio.png",
  store: "store.png",
};

function MenuIcon({ kind }: { kind: string }) {
  const png = ICON_PNG[kind];
  if (png) {
    return (
      <Img
        src={asset(`components/messagebubble/${png}`) ?? ""}
        crossOrigin="anonymous"
        alt=""
        style={{
          width: 30,
          height: 30,
          borderRadius: 7,
          objectFit: "cover",
          flexShrink: 0,
        }}
      />
    );
  }
  const base: React.CSSProperties = {
    width: 30,
    height: 30,
    // Rounded square (app-icon shape) to match the real PNG icons above.
    borderRadius: 7,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "inset 0 1px 1px rgba(255,255,255,0.25)",
  };
  // Only "Stickers" has no PNG yet — flat CSS icon.
  return (
    <div
      style={{
        ...base,
        background: "linear-gradient(160deg, #c76bff 0%, #9b3fe0 100%)",
      }}
    >
      <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden>
        <path
          d="M12 3l2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 16.9 6.7 19.1l1-5.8L3.5 9.2l5.9-.9z"
          fill="#fff"
        />
      </svg>
    </div>
  );
}

/** Deterministic gradient "photos" to fill the grid around the real one. */
const FILLER_GRADIENTS = [
  "linear-gradient(135deg, #6a85b6, #bac8e0)",
  "linear-gradient(135deg, #f6d365, #fda085)",
  "linear-gradient(135deg, #84fab0, #8fd3f4)",
  "linear-gradient(135deg, #a18cd1, #fbc2eb)",
  "linear-gradient(135deg, #ff9a9e, #fad0c4)",
  "linear-gradient(135deg, #30cfd0, #330867)",
  "linear-gradient(135deg, #5ee7df, #b490ca)",
  "linear-gradient(135deg, #d299c2, #fef9d7)",
];

export function PhotoPicker({
  image,
  t,
  theme = "dark",
}: {
  image: string;
  /** 0→1 progress through the whole attachment flow. */
  t: number;
  theme?: "light" | "dark";
}) {
  const dark = theme !== "light";
  const labelColor = dark ? "#ffffff" : "#000000";
  const rowDivider = dark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)";

  const ease = (a: number, b: number, easing = Easing.out(Easing.cubic)) =>
    interpolate(t, [a, b], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing,
    });

  // Phases — snappy, with minimal dead time between steps so it doesn't drag.
  // + menu → Photos tap → gallery → tap a photo (badge) → the photo drops into
  // the composer (handled in IMessageChat) → gallery slides away as it sends.
  const menuIn = ease(0, 0.12); // card grows out of the + button after the tap
  // Row contents fade in only once the card has grown past a small nub, so the
  // expansion reads as the card opening UP from the + icon (not text appearing
  // in a tiny blob).
  const cardContent = ease(0.05, 0.12);
  const photosTapped = t >= 0.16 && t < 0.26; // Photos row pressed
  const toGrid = ease(0.26, 0.38, Easing.out(Easing.cubic)); // 0 menu → 1 grid
  const photoTap = ease(0.42, 0.5); // chosen tile presses + "1" badge pops
  // Gallery slides away as the message sends near the end of the flow.
  const closing = ease(0.82, 0.98, Easing.out(Easing.cubic));
  const menuVisible = menuIn * (1 - toGrid);

  const tiles = [image, ...FILLER_GRADIENTS];

  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: SF_PRO_STACK }}>
      {/* Dim the whole screen behind the menu (messages + keyboard), like iOS
          when you tap +. It extends up into the message area (the keyboard slot
          allows the overflow) and fades out at the top so there's no hard edge —
          this is what lets the translucent card read as glass over a darkened
          backdrop rather than a flat gray panel. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          top: -460,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.6) 62%, rgba(0,0,0,0))",
          opacity: menuVisible,
          pointerEvents: "none",
        }}
      />

      {/* Photo grid — covers the keyboard once Photos is tapped. Fewer, bigger
          tiles (3×2) so the photos read clearly. Fades out as the chosen photo
          flies up to the thread. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          // Solid black behind the tiles so the thin gaps read as black (like the
          // real picker) and the keyboard underneath never bleeds through.
          background: "#000",
          // Slide UP from below to appear (when Photos is tapped) and slide back
          // DOWN to close on send — no fade. (1 - toGrid) starts it fully below;
          // `closing` drops it again at the end.
          transform: `translateY(${(1 - toGrid + closing) * 100}%)`,
          padding: 0,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridAutoRows: "1fr",
          // Thin iMessage-style gap between tiles instead of a wide gutter.
          gap: 2,
        }}
      >
        {tiles.slice(0, 6).map((tile, i) => {
          const isTarget = i === 0;
          const tapScale = isTarget ? 1 - photoTap * 0.05 : 1;
          // Round only the OUTER corners of the 3×2 block (top-left, top-right,
          // bottom-left, bottom-right tiles) so the whole grid reads as a single
          // rounded rectangle with square inner gaps — like the iMessage picker.
          const GRID_R = 22;
          return (
            <div
              key={i}
              style={{
                position: "relative",
                borderTopLeftRadius: i === 0 ? GRID_R : 0,
                borderTopRightRadius: i === 2 ? GRID_R : 0,
                borderBottomLeftRadius: i === 3 ? GRID_R : 0,
                borderBottomRightRadius: i === 5 ? GRID_R : 0,
                overflow: "hidden",
                // The chosen tile empties out as its photo flies to the thread.
                background: isTarget ? "#000" : tile,
                transform: `scale(${tapScale})`,
                boxShadow:
                  isTarget && photoTap > 0 ? "0 0 0 3px #0a84ff inset" : "none",
              }}
            >
              {isTarget && (
                <Img
                  src={asset(tile) ?? ""}
                  crossOrigin="anonymous"
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              )}
              {/* Selection badge — a numbered "1" pill like real iMessage, pops
                  on once the photo is tapped. */}
              {isTarget && photoTap > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    width: 20,
                    height: 20,
                    borderRadius: 9999,
                    background: "#0a84ff",
                    border: "1.5px solid #fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 600,
                    lineHeight: 1,
                    transform: `scale(${0.6 + 0.4 * photoTap})`,
                  }}
                >
                  1
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* The selected photo now drops into the COMPOSER (handled in
          IMessageChat) and sends from there as a normal message — no fly from
          the grid, matching the real iMessage flow. */}

      {/* Attachment menu card — grows UP out of the + button (its bottom sits at
          the composer, above the keyboard slot) and floats over the messages
          like real iMessage, then fades into the grid. */}
      {menuVisible > 0.01 && (
        <div
          style={{
            position: "absolute",
            left: 20,
            // Anchor the card's bottom at the top of the keyboard slot (= the
            // composer / + button), so it rises upward from the + instead of
            // sitting low in the keyboard area.
            bottom: "100%",
            marginBottom: 8,
            width: 240,
            // Liquid-glass material: a DARK, see-through frosted fill (not a
            // milky/whitish panel) with only a faint rim — over the dimmed
            // backdrop it reads as transparent dark glass. The blur is
            // progressive enhancement for the live Player; the translucent fill
            // carries the look in the export.
            background: dark ? "rgba(30,30,34,0.55)" : "rgba(250,250,252,0.7)",
            border: dark
              ? "1px solid rgba(255,255,255,0.1)"
              : "1px solid rgba(0,0,0,0.07)",
            backdropFilter: "blur(32px) saturate(150%)",
            WebkitBackdropFilter: "blur(32px) saturate(150%)",
            // Grows from a small rounded nub (reads like the + button) into the
            // card's rounded rectangle as it opens.
            borderRadius: 16 + (1 - menuIn) * 90,
            padding: "3px 0",
            opacity: menuVisible,
            // Scale UP from a point at the + button (bottom-left), so the card
            // appears to spring open out of the icon rather than slide in.
            transform: `scale(${0.16 + menuIn * 0.84})`,
            transformOrigin: "bottom left",
            // Clip the rows to the rounded shape while it's still a small nub so
            // no text spills outside the blob mid-expansion.
            overflow: "hidden",
            boxShadow: dark
              ? "inset 0 1px 0.5px rgba(255,255,255,0.14), 0 18px 50px rgba(0,0,0,0.55)"
              : "inset 0 1px 0.5px rgba(255,255,255,0.7), 0 18px 50px rgba(0,0,0,0.22)",
          }}
        >
          {/* Rows fade + settle in once the card has opened, counter-scaled so
              the text isn't distorted by the card's own scale-up. */}
          <div
            style={{
              opacity: cardContent,
              transform: `translateY(${(1 - cardContent) * 8}px)`,
            }}
          >
            {MENU_ITEMS.map((item, i) => (
              <div
                key={item.key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "8px 13px",
                  borderBottom:
                    i < MENU_ITEMS.length - 1
                      ? `0.5px solid ${rowDivider}`
                      : "none",
                  background:
                    item.key === "photos" && photosTapped
                      ? dark
                        ? "rgba(255,255,255,0.12)"
                        : "rgba(0,0,0,0.06)"
                      : "transparent",
                }}
              >
                <MenuIcon kind={item.key} />
                <span
                  style={{
                    fontSize: 16,
                    color: labelColor,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
