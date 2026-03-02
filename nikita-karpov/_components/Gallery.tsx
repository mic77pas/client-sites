"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useState, type ReactNode } from "react";

import { BiSolidMegaphone } from "react-icons/bi";
import { FaEyeSlash, FaFootballBall, FaRegCalendar } from "react-icons/fa";
import { IoIosVideocam, IoMdPin } from "react-icons/io";
import { IoPerson } from "react-icons/io5";
import { LuDog } from "react-icons/lu";

export type MediaItem = {
  src: string; // for images: image src, for videos: thumbnail src
  alt: string;
  category: string;
  tag?: string;

  kind?: "image" | "video";
  videoUrl?: string; // for local videos: /videos/...
  thumbnailSrc?: string; // optional explicit thumb
};

function Spinner() {
  return (
    <div className="h-6 w-6 rounded-full border-2 border-white/30 border-t-white/80 animate-spin" />
  );
}

function MediaCard({
  item,
  onClick,
}: {
  item: MediaItem;
  onClick: () => void;
}) {
  const [loaded, setLoaded] = useState(false);

  const base =
    "group relative overflow-hidden w-full rounded-2xl border border-white/10 bg-white/5 cursor-pointer transition will-change-transform hover:-translate-y-1 hover:rotate-[0.1deg] hover:border-white/20";

  const isVideo =
    item.kind === "video" || item.category.toLowerCase() === "videos";
  const thumb = item.thumbnailSrc ?? item.src; // fallback to src if you store thumbs in src

  return (
    <button type="button" onClick={onClick} className={base}>
      <div className={`relative ${isVideo ? "aspect-4/3" : "aspect-4/5"}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
        <div className="absolute inset-0 animate-pulse bg-white/5" />

        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Spinner />
          </div>
        )}

        <Image
          src={thumb}
          alt={item.alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={[
            "object-cover grayscale transition duration-500 group-hover:grayscale-0 group-hover:scale-[1.03]",
            loaded ? "opacity-100" : "opacity-0",
          ].join(" ")}
          onLoadingComplete={() => setLoaded(true)}
        />

        <div
          className={[
            "absolute inset-0 bg-linear-to-t from-black/65 via-black/10 to-transparent transition",
            loaded ? "opacity-80 group-hover:opacity-60" : "opacity-0",
          ].join(" ")}
        />

        {/* video badge + play icon */}
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full bg-black/60 border border-white/30 px-4 py-3 backdrop-blur text-white">
              ▶
            </div>
          </div>
        )}
      </div>
    </button>
  );
}

function Lightbox({
  items,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  items: MediaItem[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const item = items[index];

  // keyboard controls + scroll lock
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, onPrev, onNext]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* backdrop */}
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/70"
      />

      {/* modal content */}
      <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8">
        <div className="relative w-full max-w-6xl">
          {/* close */}
          <button
            type="button"
            onClick={onClose}
            className="absolute  top-2 right-2 rounded-full z-30 px-3 py-2 text-md text-white backdrop-blur cursor-pointer"
          >
            ✕
          </button>

          {/* left arrow */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute -left-6 top-1/2 -translate-y-1/2 -translate-x-1/2 md:-translate-x-full rounded-md border border-white/40 bg-black p-3 text-white backdrop-blur hover:bg-white hover:text-black transition duration-150 cursor-pointer"
            aria-label="Previous"
          >
            ←
          </button>

          {/* right arrow */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute -right-6 top-1/2 -translate-y-1/2 translate-x-1/2 md:translate-x-full rounded-md border border-white/40 bg-black p-3 text-white backdrop-blur hover:bg-white hover:text-black transition duration-150 cursor-pointer"
            aria-label="Next"
          >
            →
          </button>

          {/* image */}
          <div className="relative overflow-hidden rounded-2xl border border-white/40 bg-black/80">
            <div className="relative h-[70vh] w-full">
              {item.kind === "video" ? (
                <video
                  className="h-full w-full object-contain"
                  controls
                  autoPlay
                  playsInline
                  preload="metadata"
                  src={item.videoUrl}
                />
              ) : (
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  priority
                  className="object-contain"
                  sizes="100vw"
                />
              )}
            </div>

            {/* caption overlay stays the same */}
            {item.kind !== "video" ? (
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-6 py-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <div className="text-xs tracking-[0.25em] text-white/70">
                  {item.category?.toUpperCase()}
                </div>
                <div className="text-xs text-white/70">
                  {index + 1} / {items.length}
                </div>
              </div>
            ) : null}
          </div>

          {/* hint */}
          {/* <div className="mt-3 text-center text-xs text-white/50">
            Use ← → keys • Esc to close
          </div> */}
        </div>
      </div>
    </div>
  );
}

type TabItem = {
  tab: string;
  icon?: ReactNode;
};

function pickIcon(tab: string): ReactNode | undefined {
  const t = tab.toLowerCase();
  if (t.includes("animal")) return <LuDog />;
  if (t.includes("event")) return <FaRegCalendar />;
  if (t.includes("people") || t.includes("portrait")) return <IoPerson />;
  if (t.includes("promo") || t.includes("brand")) return <BiSolidMegaphone />;
  if (t.includes("sport")) return <FaFootballBall />;
  if (t.includes("street")) return <IoMdPin />;
  if (t.includes("video")) return <IoIosVideocam />;
  return undefined;
}

export default function Gallery({
  items,
  categories,
}: {
  items: MediaItem[];
  categories: string[];
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const tabs: TabItem[] = useMemo(() => {
    const unique = new Set(categories);
    unique.add("Videos"); // always show
    return Array.from(unique).map((c) => ({ tab: c, icon: pickIcon(c) }));
  }, [categories]);

  const [activeTab, setActiveTab] = useState<string | null>(
    tabs[0]?.tab ?? null,
  );

  const filtered = useMemo(() => {
    if (activeTab === null) return []; // ✅ hidden = show nothing
    return items.filter((it) => it.category === activeTab);
  }, [items, activeTab]);

  const openLightbox = (idx: number) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);

  const prev = () =>
    setLightboxIndex((i) =>
      i === null ? i : (i - 1 + filtered.length) % filtered.length,
    );

  const next = () =>
    setLightboxIndex((i) => (i === null ? i : (i + 1) % filtered.length));

  return (
    <div className="border border-white rounded-b-2xl w-full bg-black/30 p-8">
      <div className="md:flex grid grid-cols-2 md:flex-nowrap gap-4 md:gap-6">
        {tabs.map((tab) => (
          <button
            key={tab.tab}
            onClick={() => setActiveTab(tab.tab)}
            className={[
              "border border-white/10 rounded-full w-full md:w-full px-4 py-2 flex items-center justify-center gap-2 transition duration-200 cursor-pointer",
              activeTab === tab.tab
                ? "bg-white text-black"
                : "bg-black/40 text-white hover:bg-white/10",
            ].join(" ")}
          >
            {tab.icon ? <span className="text-lg">{tab.icon}</span> : null}
            <span className="text-sm">{tab.tab}</span>
          </button>
        ))}
        <button
          type="button"
          onClick={() => setActiveTab(null)}
          className={[
            "border border-white/10 rounded-full w-full px-4 py-2 flex items-center justify-center gap-2 transition duration-200 cursor-pointer",
            activeTab === null
              ? "bg-white text-black"
              : "bg-black/40 text-white hover:bg-white/10",
          ].join(" ")}
        >
          <span className="text-lg">{<FaEyeSlash />}</span>
          <span className="text-sm">Hide All</span>
        </button>
      </div>

      <div
        className={`columns-1 md:columns-2 lg:columns-3 gap-5 ${activeTab ? "pt-8" : ""}`}
      >
        {filtered.map((item, idx) => (
          <div key={`${item.src}-${idx}`} className="mb-5 break-inside-avoid">
            <MediaCard item={item} onClick={() => openLightbox(idx)} />
          </div>
        ))}
      </div>

      {/* {filtered.length === 0 && (
        <div className="mt-8 text-sm text-white/60">
          No items yet for <span className="text-white/80">{activeTab}</span>.
        </div>
      )} */}

      {lightboxIndex !== null && filtered.length > 0 && (
        <Lightbox
          items={filtered}
          index={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prev}
          onNext={next}
        />
      )}
    </div>
  );
}
