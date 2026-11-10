/**
 * next/image loader for pre-generated derivatives.
 *
 * Photo `src` values are extensionless base paths written by scripts/media.mjs,
 * e.g. "/media/photos/people/dsc04277". The loader picks the smallest generated
 * width that covers the request: "/media/photos/people/dsc04277-960.webp".
 *
 * Set NEXT_PUBLIC_MEDIA_BASE_URL to serve the same files from a CDN/bucket
 * (Cloudflare R2, Vercel Blob, S3…) once the library outgrows the repo.
 * Anything that isn't a pipeline photo is returned unchanged.
 */
const WIDTHS = [480, 960, 1440, 2048];
const BASE = process.env.NEXT_PUBLIC_MEDIA_BASE_URL?.replace(/\/$/, "") ?? "";

export default function mediaLoader({ src, width }: { src: string; width: number }) {
  if (!src.startsWith("/media/photos/")) return `${src}${src.includes("?") ? "&" : "?"}w=${width}`;
  const w = WIDTHS.find((x) => x >= width) ?? WIDTHS[WIDTHS.length - 1];
  return `${BASE}${src}-${w}.webp`;
}
