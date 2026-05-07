import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import {
  HeroDemo,
  HERO_DEMO_DURATION,
  HERO_DEMO_FPS,
  HERO_DEMO_WIDTH,
  HERO_DEMO_HEIGHT,
} from "./HeroDemo";
import {
  FollowerCelebration,
  FOLLOWER_DURATION,
  FOLLOWER_FPS,
  FOLLOWER_WIDTH,
  FOLLOWER_HEIGHT,
  calculateFollowerMetadata,
} from "./FollowerCelebration";
import {
  MessagePopup,
  MESSAGE_POPUP_DURATION,
  MESSAGE_POPUP_FPS,
  MESSAGE_POPUP_WIDTH,
  MESSAGE_POPUP_HEIGHT,
} from "./MessagePopup";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MessagePopup"
        component={MessagePopup}
        durationInFrames={MESSAGE_POPUP_DURATION}
        fps={MESSAGE_POPUP_FPS}
        width={MESSAGE_POPUP_WIDTH}
        height={MESSAGE_POPUP_HEIGHT}
      />
      <Composition
        id="FollowerCelebration"
        component={FollowerCelebration}
        durationInFrames={FOLLOWER_DURATION}
        fps={FOLLOWER_FPS}
        width={FOLLOWER_WIDTH}
        height={FOLLOWER_HEIGHT}
        defaultProps={{
          username: "t3dotgg",
          userAvatarUrl: "https://github.com/t3dotgg.png?size=200",
          followerCount: 0,
          followers: [],
        }}
        calculateMetadata={calculateFollowerMetadata}
      />
      <Composition
        id="HeroDemo"
        component={HeroDemo}
        durationInFrames={HERO_DEMO_DURATION}
        fps={HERO_DEMO_FPS}
        width={HERO_DEMO_WIDTH}
        height={HERO_DEMO_HEIGHT}
      />
      <Composition
        id="MyComp"
        component={MyComposition}
        durationInFrames={60}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};
