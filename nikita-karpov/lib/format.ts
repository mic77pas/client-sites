// Client-safe helpers. Keep this file free of imports from content/media.json
// so the manifest never ends up in a browser bundle.
import type { Exif } from "./media";

export function exifLine(exif: Exif | null) {
  if (!exif) return "";
  return [exif.camera, exif.focal, exif.aperture, exif.shutter, exif.iso].filter(Boolean).join("  ·  ");
}

export const pad2 = (n: number) => String(n).padStart(2, "0");

export function formatDuration(seconds: number | null | undefined) {
  if (!seconds) return "";
  const s = Math.round(seconds);
  return `${Math.floor(s / 60)}:${pad2(s % 60)}`;
}
