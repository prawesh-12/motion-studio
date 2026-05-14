import type { CompositionInfo } from "../../schema";
import type { GitHubFollowerCountProps } from "./GitHubFollowerCount";

export const GITHUB_FOLLOWER_COUNT_DURATION = 180;
export const GITHUB_FOLLOWER_COUNT_FPS = 60;
export const GITHUB_FOLLOWER_COUNT_WIDTH = 1920;
export const GITHUB_FOLLOWER_COUNT_HEIGHT = 1080;

export const githubFollowerCountDefaultProps: GitHubFollowerCountProps = {
  username: "sankalpaacharya",
  startCount: 142,
  endCount: 150,
  // Avatars resolved via https://github.com/<name>.png — replace with your
  // actual recent followers. Comma- or whitespace-separated.
  followers:
    "t3dotgg, rauchg, shadcn, mxstbr, leerob, timneutkens, gaearon, jaredpalmer",
  theme: "light",
};

export const githubFollowerCountInfo: CompositionInfo<GitHubFollowerCountProps> =
  {
    id: "GitHubFollowerCount",
    title: "GitHub Follower Count",
    description:
      "A GitHub-styled profile card with a slot-machine follower count and an avatar cascade of recent followers rolling in.",
    durationInFrames: GITHUB_FOLLOWER_COUNT_DURATION,
    fps: GITHUB_FOLLOWER_COUNT_FPS,
    width: GITHUB_FOLLOWER_COUNT_WIDTH,
    height: GITHUB_FOLLOWER_COUNT_HEIGHT,
    defaultProps: githubFollowerCountDefaultProps,
    brandMode: "locked",
    fields: [
      { kind: "text", key: "username", label: "GitHub username" },
      {
        kind: "number",
        key: "startCount",
        label: "Starting follower count",
        min: 0,
      },
      {
        kind: "number",
        key: "endCount",
        label: "Ending follower count",
        min: 0,
      },
      {
        kind: "textarea",
        key: "followers",
        label: "Recent follower usernames",
        rows: 3,
      },
      {
        kind: "select",
        key: "theme",
        label: "Theme",
        options: [
          { value: "light", label: "Light" },
          { value: "dark", label: "Dark" },
        ],
      },
    ],
  };
