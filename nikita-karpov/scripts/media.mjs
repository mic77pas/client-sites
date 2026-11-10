#!/usr/bin/env node
/**
 * Media pipeline — turns full-resolution originals into web-ready derivatives.
 *
 *   media/photos/<category>/<file>.jpg   →  public/media/photos/<category>/<id>-<w>.webp
 *   media/video/<file>.mp4               →  public/media/video/<id>-{720,1080}.mp4 + poster
 *   media/brand/*                        →  public/brand/*  (logo mark, cutout, portrait)
 *
 * and writes content/media.json (dimensions, blur placeholders, EXIF) which the
 * site reads at build time. Originals never ship to the browser.
 *
 * Usage:
 *   npm run media           # process new/changed files only (cached by size + mtime)
 *   npm run media -- --force  # rebuild everything
 *
 * Video needs ffmpeg on PATH, or FFMPEG_PATH pointing at the binary. Without it,
 * photos still build and existing video outputs are kept.
 */
import { createHash } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import exifr from "exifr";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC_PHOTOS = path.join(ROOT, "media", "photos");
const SRC_VIDEO = path.join(ROOT, "media", "video");
const SRC_BRAND = path.join(ROOT, "media", "brand");
const OUT_PHOTOS = path.join(ROOT, "public", "media", "photos");
const OUT_VIDEO = path.join(ROOT, "public", "media", "video");
const OUT_BRAND = path.join(ROOT, "public", "brand");
const MANIFEST = path.join(ROOT, "content", "media.json");

/** Keep in sync with lib/image-loader.ts and next.config.ts deviceSizes. */
const WIDTHS = [480, 960, 1440, 2048];
const QUALITY = 78;
const FORCE = process.argv.includes("--force");

const IMAGE_EXT = /\.(jpe?g|png|webp|tiff?|avif|heic)$/i;
const VIDEO_EXT = /\.(mp4|mov|m4v|webm)$/i;

const slug = (s) =>
  s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const signature = (file) => {
  const st = fs.statSync(file);
  return createHash("sha1").update(`${st.size}:${Math.round(st.mtimeMs)}`).digest("hex").slice(0, 12);
};

const rel = (p) => path.relative(ROOT, p).split(path.sep).join("/");
const toUrl = (p) => "/" + path.relative(path.join(ROOT, "public"), p).split(path.sep).join("/");
const listDirs = (dir) =>
  fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name) : [];
const listFiles = (dir, re) =>
  fs.existsSync(dir)
    ? fs
        .readdirSync(dir)
        .filter((f) => re.test(f) && !f.startsWith("."))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    : [];

const readManifest = () => {
  try {
    return JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
  } catch {
    return { photos: [], videos: [] };
  }
};

async function blurDataUrl(input) {
  const buf = await sharp(input).rotate().resize(16, 16, { fit: "inside" }).webp({ quality: 40 }).toBuffer();
  return `data:image/webp;base64,${buf.toString("base64")}`;
}

async function dominantColor(input) {
  const { dominant } = await sharp(input).rotate().resize(64, 64, { fit: "inside" }).stats();
  return "#" + [dominant.r, dominant.g, dominant.b].map((n) => n.toString(16).padStart(2, "0")).join("");
}

const CAMERA_NAMES = { "ILCE-6700": "Sony α6700", "Canon EOS 7D": "Canon EOS 7D" };

function formatExif(e) {
  if (!e) return null;
  const model = e.Model ? CAMERA_NAMES[e.Model.trim()] ?? e.Model.trim() : null;
  const shutter = e.ExposureTime
    ? e.ExposureTime >= 1
      ? `${e.ExposureTime}s`
      : `1/${Math.round(1 / e.ExposureTime)}s`
    : null;
  const out = {
    camera: model,
    lens: e.LensModel ?? null,
    focal: e.FocalLength ? `${Math.round(e.FocalLength)}mm` : null,
    aperture: e.FNumber ? `ƒ/${e.FNumber}` : null,
    shutter,
    iso: e.ISO ? `ISO ${e.ISO}` : null,
    year: e.DateTimeOriginal instanceof Date ? e.DateTimeOriginal.getFullYear() : null,
  };
  return Object.values(out).some(Boolean) ? out : null;
}

// ---------------------------------------------------------------- photos ---

async function buildPhotos(prev) {
  const prevById = new Map(prev.photos.map((p) => [p.id, p]));
  const photos = [];
  const keep = new Set();
  const seen = new Set();

  for (const folder of listDirs(SRC_PHOTOS)) {
    const category = slug(folder);
    const outDir = path.join(OUT_PHOTOS, category);
    fs.mkdirSync(outDir, { recursive: true });

    for (const file of listFiles(path.join(SRC_PHOTOS, folder), IMAGE_EXT)) {
      const src = path.join(SRC_PHOTOS, folder, file);
      let id = slug(file.replace(/\.[^.]+$/, ""));
      if (seen.has(id)) id = `${category}-${id}`;
      seen.add(id);

      const sig = signature(src);
      const outputs = WIDTHS.map((w) => path.join(outDir, `${id}-${w}.webp`));
      outputs.forEach((o) => keep.add(o));

      const cached = prevById.get(id);
      if (!FORCE && cached && cached.sig === sig && cached.category === category && outputs.every((o) => fs.existsSync(o))) {
        photos.push(cached);
        continue;
      }

      process.stdout.write(`  photo  ${rel(src)} … `);
      const meta = await sharp(src).metadata();
      const swap = (meta.orientation ?? 1) >= 5;
      const width = swap ? meta.height : meta.width;
      const height = swap ? meta.width : meta.height;

      for (const [i, w] of WIDTHS.entries()) {
        await sharp(src, { limitInputPixels: false })
          .rotate()
          .resize({ width: Math.min(w, width), withoutEnlargement: true })
          .webp({ quality: QUALITY, effort: 5, smartSubsample: true })
          .toFile(outputs[i]);
      }

      let exif = null;
      try {
        exif = formatExif(
          await exifr.parse(src, {
            pick: ["Model", "LensModel", "FocalLength", "FNumber", "ExposureTime", "ISO", "DateTimeOriginal"],
          }),
        );
      } catch {
        /* no EXIF — fine */
      }

      photos.push({
        id,
        category,
        source: rel(src),
        sig,
        src: toUrl(path.join(outDir, id)), // base path; loader appends -<w>.webp
        width,
        height,
        maxWidth: Math.min(width, WIDTHS.at(-1)),
        blurDataURL: await blurDataUrl(src),
        color: await dominantColor(src),
        exif,
      });
      const kb = outputs.reduce((n, o) => n + fs.statSync(o).size, 0) / 1024;
      console.log(`${width}×${height} → ${WIDTHS.length} sizes, ${Math.round(kb)} KB total`);
    }
  }

  // Remove derivatives whose originals were deleted or renamed.
  for (const category of listDirs(OUT_PHOTOS)) {
    const dir = path.join(OUT_PHOTOS, category);
    for (const f of fs.readdirSync(dir)) {
      const full = path.join(dir, f);
      if (!keep.has(full)) {
        fs.rmSync(full);
        console.log(`  removed stale ${rel(full)}`);
      }
    }
    if (fs.readdirSync(dir).length === 0) fs.rmdirSync(dir);
  }
  return photos;
}

// ----------------------------------------------------------------- video ---

function findFfmpeg() {
  const candidates = [process.env.FFMPEG_PATH, "ffmpeg"].filter(Boolean);
  for (const bin of candidates) {
    const r = spawnSync(bin, ["-version"], { stdio: "ignore" });
    if (r.status === 0) return bin;
  }
  return null;
}

function probeDuration(ffmpeg, file) {
  const r = spawnSync(ffmpeg, ["-hide_banner", "-i", file], { encoding: "utf8" });
  const m = /Duration: (\d+):(\d+):(\d+\.\d+)/.exec(r.stderr ?? "");
  return m ? +m[1] * 3600 + +m[2] * 60 + +m[3] : null;
}

async function buildVideos(prev) {
  const files = listFiles(SRC_VIDEO, VIDEO_EXT);
  if (!files.length) return [];
  const prevById = new Map(prev.videos.map((v) => [v.id, v]));
  const ffmpeg = findFfmpeg();
  if (!ffmpeg) console.warn("  ! ffmpeg not found — skipping video encode (set FFMPEG_PATH). Keeping previous outputs.");
  fs.mkdirSync(OUT_VIDEO, { recursive: true });

  const videos = [];
  for (const file of files) {
    const src = path.join(SRC_VIDEO, file);
    const id = slug(file.replace(/\.[^.]+$/, ""));
    const sidecar = path.join(SRC_VIDEO, `${file.replace(/\.[^.]+$/, "")}.json`);
    const opts = fs.existsSync(sidecar) ? JSON.parse(fs.readFileSync(sidecar, "utf8")) : {};
    const sig = signature(src) + (fs.existsSync(sidecar) ? signature(sidecar) : "");
    const out = {
      hd: path.join(OUT_VIDEO, `${id}-1080.mp4`),
      sd: path.join(OUT_VIDEO, `${id}-720.mp4`),
      poster: path.join(OUT_VIDEO, `${id}-poster.webp`),
    };
    const cached = prevById.get(id);
    const outputsExist = Object.values(out).every((o) => fs.existsSync(o));

    if ((!FORCE && cached && cached.sig === sig && outputsExist) || (!ffmpeg && cached && outputsExist)) {
      videos.push(cached);
      continue;
    }
    if (!ffmpeg) continue;

    console.log(`  video  ${rel(src)}`);
    const common = ["-hide_banner", "-loglevel", "error", "-y", "-i", src];
    const h264 = ["-c:v", "libx264", "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart"];
    // Full-quality version for the player (keeps audio if present).
    execFileSync(ffmpeg, [...common, "-vf", "scale='min(1920,iw)':-2", ...h264, "-crf", "23", "-c:a", "aac", "-b:a", "128k", out.hd]);
    // Light, silent version for previews / small screens.
    execFileSync(ffmpeg, [...common, "-vf", "scale='min(1280,iw)':-2", ...h264, "-crf", "27", "-an", out.sd]);
    // Poster frame.
    const posterTmp = path.join(OUT_VIDEO, `${id}-poster.tmp.png`);
    execFileSync(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", "-ss", String(opts.posterAt ?? 1), "-i", src, "-frames:v", "1", posterTmp]);
    const pm = await sharp(posterTmp).metadata();
    await sharp(posterTmp).resize({ width: 1920, withoutEnlargement: true }).webp({ quality: 80 }).toFile(out.poster);
    const blur = await blurDataUrl(posterTmp);
    fs.rmSync(posterTmp);

    videos.push({
      id,
      source: rel(src),
      sig,
      hd: toUrl(out.hd),
      sd: toUrl(out.sd),
      poster: toUrl(out.poster),
      posterBlur: blur,
      width: pm.width,
      height: pm.height,
      duration: probeDuration(ffmpeg, out.hd),
      sizeKB: { hd: Math.round(fs.statSync(out.hd).size / 1024), sd: Math.round(fs.statSync(out.sd).size / 1024) },
    });
  }
  return videos;
}

// ----------------------------------------------------------------- brand ---

async function buildBrand() {
  fs.mkdirSync(OUT_BRAND, { recursive: true });
  const jobs = [
    // Script "nk." mark — alpha-only so CSS can recolour it via mask-image.
    {
      src: "nick2.png",
      out: "nk-mark.png",
      run: (s, o) => s.trim({ threshold: 1 }).resize({ width: 480 }).ensureAlpha().png({ compressionLevel: 9, palette: true }).toFile(o),
    },
    { src: "nickusa.png", out: "nik-cutout.webp", run: (s, o) => s.trim({ threshold: 1 }).resize({ width: 760 }).webp({ quality: 82, alphaQuality: 90 }).toFile(o) },
    { src: "headshot.jpg", out: "nik-portrait.webp", run: (s, o) => s.rotate().webp({ quality: 80 }).toFile(o) },
  ];
  for (const job of jobs) {
    const src = path.join(SRC_BRAND, job.src);
    const out = path.join(OUT_BRAND, job.out);
    if (!fs.existsSync(src)) continue;
    if (!FORCE && fs.existsSync(out) && fs.statSync(out).mtimeMs > fs.statSync(src).mtimeMs) continue;
    await job.run(sharp(src), out);
    console.log(`  brand  ${job.src} → ${rel(out)}`);
  }

  // App icons + social preview, composed from the mark.
  const mark = path.join(OUT_BRAND, "nk-mark.png");
  if (!fs.existsSync(mark)) return;
  const APP = path.join(ROOT, "app");
  const INK = { r: 22, g: 21, b: 19, alpha: 1 };
  const PAPER = { r: 239, g: 236, b: 230, alpha: 1 };
  const tinted = async (width, rgb) => {
    const alpha = await sharp(mark).resize({ width }).extractChannel("alpha").toBuffer();
    const { height } = await sharp(alpha).metadata();
    return sharp({ create: { width, height, channels: 3, background: rgb } })
      .joinChannel(alpha)
      .png()
      .toBuffer();
  };
  const icon = async (size, file) => {
    const out = path.join(APP, file);
    if (!FORCE && fs.existsSync(out)) return;
    const glyph = await tinted(Math.round(size * 0.74), PAPER);
    await sharp({ create: { width: size, height: size, channels: 4, background: INK } })
      .composite([{ input: glyph, gravity: "center" }])
      .png()
      .toFile(out);
    console.log(`  brand  ${rel(out)}`);
  };
  await icon(512, "icon.png");
  await icon(180, "apple-icon.png");

  const og = path.join(APP, "opengraph-image.jpg");
  const ogPhoto = path.join(SRC_PHOTOS, "people", "DSC04277.jpg");
  if ((FORCE || !fs.existsSync(og)) && fs.existsSync(ogPhoto)) {
    const photo = await sharp(ogPhoto).rotate().resize(520, 630, { fit: "cover", position: "attention" }).toBuffer();
    const glyph = await tinted(360, { r: 22, g: 21, b: 19 });
    await sharp({ create: { width: 1200, height: 630, channels: 4, background: PAPER } })
      .composite([
        { input: glyph, left: 150, top: 150 },
        { input: photo, left: 680, top: 0 },
      ])
      .jpeg({ quality: 84 })
      .toFile(og);
    console.log(`  brand  ${rel(og)}`);
  }
}

// ------------------------------------------------------------------ main ---

const t0 = Date.now();
const prev = readManifest();
console.log("Building media…");
const photos = await buildPhotos(prev);
const videos = await buildVideos(prev);
await buildBrand();

fs.mkdirSync(path.dirname(MANIFEST), { recursive: true });
fs.writeFileSync(MANIFEST, JSON.stringify({ widths: WIDTHS, photos, videos }, null, 2) + "\n");
console.log(`Done: ${photos.length} photos, ${videos.length} videos → ${rel(MANIFEST)} (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
