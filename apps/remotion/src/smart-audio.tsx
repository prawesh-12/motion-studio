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
 * Audio that doesn't lag the browser <Player>.
 *
 * `@remotion/media`'s <Audio> decodes via WebCodecs so RENDERS are frame
 * accurate — but that pipeline is heavy in the live <Player>, and mounting
 * many of them (e.g. MessageBubbles' per-keystroke key taps + per-bubble
 * sounds) stutters or outright freezes the preview. So mirror what
 * Project.tsx does for the project music track: play through the lightweight
 * classic HTML5 <Audio> in preview, and only use the @remotion/media <Audio>
 * when actually rendering.
 */
export function SmartAudio(props: SmartAudioProps) {
  const { isRendering } = useRemotionEnvironment();
  if (isRendering) {
    return <MediaAudio {...props} />;
  }
  return (
    <Html5Audio pauseWhenBuffering={false} crossOrigin="anonymous" {...props} />
  );
}
