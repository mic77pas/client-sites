"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { formatDuration } from "@/lib/format";

export type VideoSource =
  | { kind: "file"; hd: string; sd: string }
  | { kind: "youtube"; id: string }
  | { kind: "vimeo"; id: string };

type Props = {
  title: string;
  source: VideoSource;
  poster: string;
  posterBlur?: string;
  /** width / height */
  ratio?: number;
  duration?: number | null;
  /**
   * Play a silent, looping preview while the player is on screen (file sources
   * only). Skipped for reduced-motion and data-saver users.
   */
  preview?: boolean;
  sizes?: string;
  /** Seconds into the clip where the silent preview starts. */
  previewStart?: number;
};

/**
 * Poster-first video. Nothing heavy loads until the visitor asks for it:
 * file videos stream on click; YouTube/Vimeo iframes are only inserted on click.
 */
export function VideoPlayer({ title, source, poster, posterBlur, ratio = 16 / 9, duration, preview, sizes = "100vw", previewStart = 0 }: Props) {
  const [playing, setPlaying] = useState(false);
  const [previewOn, setPreviewOn] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!preview || source.kind !== "file" || playing) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduce || saveData || !boxRef.current) return;
    const io = new IntersectionObserver(([entry]) => setPreviewOn(entry.isIntersecting), { threshold: 0.35 });
    io.observe(boxRef.current);
    return () => io.disconnect();
  }, [preview, source.kind, playing]);

  return (
    <div ref={boxRef} className="relative overflow-hidden bg-black" style={{ aspectRatio: String(ratio) }}>
      {playing ? (
        source.kind === "file" ? (
          <video controls autoPlay playsInline poster={poster} className="absolute inset-0 h-full w-full bg-black object-contain">
            <source src={source.sd} type="video/mp4" media="(max-width: 767px)" />
            <source src={source.hd} type="video/mp4" />
          </video>
        ) : (
          <iframe
            title={title}
            className="absolute inset-0 h-full w-full"
            src={
              source.kind === "youtube"
                ? `https://www.youtube-nocookie.com/embed/${source.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`
                : `https://player.vimeo.com/video/${source.id}?autoplay=1&dnt=1&title=0&byline=0`
            }
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowFullScreen
          />
        )
      ) : (
        <button type="button" onClick={() => setPlaying(true)} className="group absolute inset-0 block h-full w-full text-left">
          <Image
            src={poster}
            alt=""
            fill
            unoptimized
            sizes={sizes}
            placeholder={posterBlur ? "blur" : "empty"}
            blurDataURL={posterBlur}
            className="object-cover transition-transform duration-[1200ms] ease-out-quint group-hover:scale-[1.02]"
          />
          {previewOn && source.kind === "file" ? (
            <video
              src={`${source.sd}#t=${previewStart}`}
              muted
              autoPlay
              loop
              playsInline
              preload="none"
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : null}
          <span className="absolute bottom-0 left-0 flex items-center gap-3 bg-paper px-4 py-3 text-ink">
            <svg aria-hidden="true" viewBox="0 0 10 12" className="h-3 w-2.5 fill-current">
              <path d="M0 0 10 6 0 12Z" />
            </svg>
            <span className="t-label">
              Play {title}
              {duration ? <span className="ml-3 text-mute">{formatDuration(duration)}</span> : null}
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
