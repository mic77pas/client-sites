import manifest from "@/content/media.json";
import { categories, photoText, type CategoryConfig } from "@/content/portfolio";

export type Exif = {
  camera: string | null;
  lens: string | null;
  focal: string | null;
  aperture: string | null;
  shutter: string | null;
  iso: string | null;
  year: number | null;
};

export type Photo = {
  id: string;
  src: string;
  width: number;
  height: number;
  blurDataURL: string;
  color: string;
  exif: Exif | null;
  title: string;
  alt: string;
  place?: string;
  category: { slug: string; title: string };
};

export type Category = CategoryConfig & { photos: Photo[]; coverPhoto: Photo };

export type Video = (typeof manifest.videos)[number];

type RawPhoto = (typeof manifest.photos)[number];

const categoryByKey = new Map(categories.map((c) => [c.key, c]));

function toPhoto(raw: RawPhoto): Photo {
  const cat = categoryByKey.get(raw.category);
  const catTitle = cat?.title ?? raw.category.replace(/\b\w/g, (c) => c.toUpperCase());
  const text = photoText[raw.id];
  return {
    id: raw.id,
    src: raw.src,
    width: raw.width,
    height: raw.height,
    blurDataURL: raw.blurDataURL,
    color: raw.color,
    exif: raw.exif as Exif | null,
    title: text?.title ?? catTitle,
    alt: text?.alt ?? `${catTitle} photograph by Nik Karpov`,
    place: text?.place,
    category: { slug: cat?.slug ?? raw.category, title: catTitle },
  };
}

const allRaw = manifest.photos.map(toPhoto);
const byId = new Map(allRaw.map((p) => [p.id, p]));

function ordered(key: string, cfg?: CategoryConfig): Photo[] {
  const inCat = manifest.photos.filter((p) => p.category === key).map((p) => byId.get(p.id)!);
  if (!cfg?.order) return inCat;
  const rank = new Map(cfg.order.map((id, i) => [id, i]));
  return [...inCat].sort((a, b) => (rank.get(a.id) ?? 1e6) - (rank.get(b.id) ?? 1e6));
}

/** Categories in configured order, plus any new folders that aren't configured yet. */
export function getCategories(): Category[] {
  const configured = categories
    .map((cfg) => ({ cfg, photos: ordered(cfg.key, cfg) }))
    .filter((c) => c.photos.length > 0)
    .map(({ cfg, photos }) => ({ ...cfg, photos, coverPhoto: byId.get(cfg.cover) ?? photos[0] }));

  const extraKeys = [...new Set(manifest.photos.map((p) => p.category))].filter((k) => !categoryByKey.has(k));
  const extras = extraKeys.map((key) => {
    const photos = ordered(key);
    const title = photos[0].category.title;
    return { key, slug: key, title, blurb: "", cover: photos[0].id, photos, coverPhoto: photos[0] };
  });
  return [...configured, ...extras];
}

export function getCategory(slug: string) {
  return getCategories().find((c) => c.slug === slug);
}

/** Every photo, grouped in category order — the archive sequence. */
export function getAllPhotos(): Photo[] {
  return getCategories().flatMap((c) => c.photos);
}

export function getPhotos(ids: string[]): Photo[] {
  return ids.map((id) => byId.get(id)).filter((p): p is Photo => Boolean(p));
}

export function getPhoto(id: string) {
  return byId.get(id);
}

const MEDIA_BASE = process.env.NEXT_PUBLIC_MEDIA_BASE_URL?.replace(/\/$/, "") ?? "";

/** Video URLs honour NEXT_PUBLIC_MEDIA_BASE_URL, like photos do via the image loader. */
export function getVideo(id: string): Video | undefined {
  const v = manifest.videos.find((x) => x.id === id);
  if (!v) return undefined;
  return { ...v, hd: MEDIA_BASE + v.hd, sd: MEDIA_BASE + v.sd, poster: MEDIA_BASE + v.poster };
}

export const photoCount = manifest.photos.length;
