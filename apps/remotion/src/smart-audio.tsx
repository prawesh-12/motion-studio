import { Audio as MediaAudio } from "@remotion/media";
import { Audio as Html5Audio, useRemotionEnvironment } from "remotion";

type SmartAudioProps = {
  src: string;
  /** Constant volume, or a per-(sequence-local)-frame envelope. */
  volume?: number | ((frame: number) => number);
  loop?: boolean;
  /** Frames to skip into the source before playback starts. */
  trimBefore?: number;
  playbackRate?: number;
};

/**
 * Audio that stays in sync everywhere AND doesn't lag the <Player>.
 *
 * Three environments, three needs:
 *   - **Player (preview):** classic HTML5 <Audio> — lightweight, so dozens of
 *     short SFX don't stutter/freeze the preview.
 *   - **Web-renderer (client-side, in-browser export):** `@remotion/media`'s
 *     WebCodecs <Audio> — that renderer pulls audio through WebCodecs and this
 *     is the path that captures correctly there.
 *   - **Lambda / server render:** classic HTML5 <Audio>. `@remotion/media`
 *     audio plays OUT OF SYNC on Lambda (the swoosh landed before its bubble),
 *     while the classic <Audio> is Remotion's canonical, frame-accurate server
 *     audio.
 *
 * `isRendering` is true for BOTH render paths; `isClientSideRendering`
 * separates the in-browser web-renderer (true) from Lambda/server (false).
 */
export function SmartAudio(props: SmartAudioProps) {
  const env = useRemotionEnvironment();
  // Only the in-browser web-renderer needs the WebCodecs <Audio>.
  if (env.isRendering && env.isClientSideRendering) {
    return <MediaAudio {...props} />;
  }
  return (
    <Html5Audio pauseWhenBuffering={false} crossOrigin="anonymous" {...props} />
  );
}
