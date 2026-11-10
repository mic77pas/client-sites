/**
 * Film / motion work.
 *
 * Three ways to add a film:
 *  - kind "file":    a clip processed by `npm run media` (drop it in media/video/),
 *                    referenced by its id in content/media.json. Best for short reels.
 *  - kind "youtube": a YouTube video id. Best for long-form — free adaptive
 *                    streaming, nothing stored in the repo.
 *  - kind "vimeo":   a Vimeo video id. Same idea, cleaner player.
 *
 * Embeds only load after the visitor presses play, so they cost nothing up front.
 * `poster` can point at an image in /public. YouTube falls back to its own
 * thumbnail if omitted; Vimeo needs one.
 */
export type Film = {
  id: string;
  title: string;
  summary?: string;
  year?: number;
  /** e.g. ["Direction", "Camera", "Edit"] — only list what's true. */
  credits?: string[];
} & (
  | { kind: "file"; video: string }
  | { kind: "youtube"; youtubeId: string; poster?: string }
  | { kind: "vimeo"; vimeoId: string; poster: string }
);

export const films: Film[] = [
  {
    id: "showreel",
    kind: "file",
    video: "showreel",
    title: "Showreel",
    summary: "A short cut of motion work — light, texture and movement.",
  },
];
