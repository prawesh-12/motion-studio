"use client";
import { AbsoluteFill, Sequence } from "remotion";
import { BrandProvider, brandCssVars, DEFAULT_BRAND } from "../../brand";
import { componentsById } from "../../components";
import { EffectsWrap } from "../../effects/EffectsWrap";
import type { Project } from "../../project";

export const ProjectComposition: React.FC<Project> = ({ clips, brand }) => {
  const activeBrand = brand ?? DEFAULT_BRAND;
  let cursor = 0;
  return (
    <AbsoluteFill
      style={{
        background: "#000",
        ...brandCssVars(activeBrand),
      }}
    >
      <BrandProvider value={activeBrand}>
        {clips.map((clip) => {
          const Component = componentsById[clip.compositionId];
          const from = cursor;
          cursor += clip.durationInFrames;
          const inner = Component ? (
            <Component {...clip.props} />
          ) : (
            <MissingClip compositionId={clip.compositionId} />
          );
          return (
            <Sequence
              key={clip.id}
              from={from}
              durationInFrames={clip.durationInFrames}
            >
              <EffectsWrap
                effects={clip.effects}
                clipDurationInFrames={clip.durationInFrames}
              >
                {inner}
              </EffectsWrap>
            </Sequence>
          );
        })}
      </BrandProvider>
    </AbsoluteFill>
  );
};

function MissingClip({ compositionId }: { compositionId: string }) {
  return (
    <AbsoluteFill
      style={{
        background: "#1a1a1d",
        color: "#fafafa",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'SF Pro Display', Inter, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        padding: "0 80px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 48, fontWeight: 700, letterSpacing: "-0.02em" }}>
        Missing scene
      </div>
      <div style={{ fontSize: 22, opacity: 0.6 }}>
        No component registered for id &ldquo;{compositionId}&rdquo;.
      </div>
    </AbsoluteFill>
  );
}
