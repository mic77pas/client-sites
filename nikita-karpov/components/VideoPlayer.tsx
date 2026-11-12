"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
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
          <span className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-linear-to-t from-black/60 to-transparent px-4 pb-4 pt-16 text-white md:px-5 md:pb-5">
            <Play aria-hidden="true" strokeWidth={1.5} className="size-[18px] fill-current transition-transform duration-500 ease-out-quint group-hover:scale-110" />
            <span className="t-label">
              <span className="sr-only">Play </span>
              {title}
              {duration ? <span className="ml-3 text-white/65">{formatDuration(duration)}</span> : null}
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
