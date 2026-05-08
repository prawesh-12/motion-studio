"use client";
import { AbsoluteFill, Sequence } from "remotion";
import { componentsById } from "../../components";
import type { Project } from "../../project";

export const ProjectComposition: React.FC<Project> = ({ clips }) => {
  let cursor = 0;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {clips.map((clip) => {
        const Component = componentsById[clip.compositionId];
        const from = cursor;
        cursor += clip.durationInFrames;
        if (!Component) return null;
        return (
          <Sequence
            key={clip.id}
            from={from}
            durationInFrames={clip.durationInFrames}
          >
            <Component {...clip.props} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
