import fs from "fs";
import path from "path";
import GalleryClient, { type MediaItem } from "./Gallery";

function titleCaseFromFolder(folderName: string) {
  return folderName
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function isImage(file: string) {
  return /\.(png|jpe?g|webp|gif|avif)$/i.test(file);
}

function isVideo(file: string) {
  return /\.(mp4|webm|mov)$/i.test(file);
}

function safeReadDir(dirPath: string) {
  try {
    return fs.readdirSync(dirPath);
  } catch {
    return [];
  }
}

function fileStem(file: string) {
  return file.replace(/\.[^/.]+$/, "");
}

export default function GalleryServer() {
  // ===== Photos =====
  const photosBaseDir = path.join(process.cwd(), "public", "photos");

  const photoFolders = safeReadDir(photosBaseDir).filter((name) => {
    const full = path.join(photosBaseDir, name);
    return fs.existsSync(full) && fs.statSync(full).isDirectory();
  });

  const photoItems: MediaItem[] = photoFolders.flatMap((folder) => {
    const folderPath = path.join(photosBaseDir, folder);
    const files = safeReadDir(folderPath)
      .filter(isImage)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    const category = titleCaseFromFolder(folder);

    return files.map((file) => ({
      kind: "image",
      src: `/photos/${folder}/${file}`,
      alt: fileStem(file),
      category,
      tag: category,
    }));
  });

  //   // ===== Videos =====
  //   // Put videos here: /public/videos/*.mp4
  //   const videosDir = path.join(process.cwd(), "public", "videos");

  //   // ✅ Your thumbs are here: /public/thumbs/<same-name>.jpg
  //   const videoThumbsDir = path.join(process.cwd(), "public", "thumbs");

  //   const videoFiles = safeReadDir(videosDir)
  //     .filter(isVideo)
  //     .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  //   const videoItems: MediaItem[] = videoFiles.map((file) => {
  //     const stem = fileStem(file);

  //     // find a matching thumbnail: stem.(jpg/png/webp/...)
  //     const possibleThumbs = ["jpg", "jpeg", "png", "webp", "avif"].map(
  //       (ext) => `${stem}.${ext}`,
  //     );

  //     const foundThumb = possibleThumbs.find((thumb) =>
  //       fs.existsSync(path.join(videoThumbsDir, thumb)),
  //     );

  //     // ✅ URL path for the browser
  //     const thumbSrc = foundThumb
  //       ? `/thumbs/${foundThumb}`
  //       : `/thumbs/video-placeholder.jpg`;

  //     return {
  //       kind: "video",
  //       category: "Videos",
  //       tag: "Videos",
  //       alt: stem,
  //       src: thumbSrc, // what the grid displays
  //       thumbnailSrc: thumbSrc,
  //       videoUrl: `/videos/${file}`, // what the lightbox plays
  //     };
  //   });

  // ===== Merge =====
  //   const items: MediaItem[] = [...photoItems, ...videoItems];
  const items: MediaItem[] = [...photoItems];

  // categories: photo categories + Videos (only if videos exist)
  const categories = [
    ...photoFolders.map(titleCaseFromFolder).sort((a, b) => a.localeCompare(b)),
    // ...(videoItems.length ? ["Videos"] : []),
  ];

  return <GalleryClient items={items} categories={categories} />;
}
