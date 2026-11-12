import Image from "next/image";
import type { Photo as PhotoData } from "@/lib/media";

type Props = {
  photo: PhotoData;
  /** Responsive `sizes` hint. Be accurate, it decides which file is fetched. */
  sizes: string;
  preload?: boolean;
  /** Force a crop ratio (width / height). Defaults to the photo's own ratio. */
  ratio?: number;
  /** object-position when cropping, e.g. "50% 30%". */
  position?: string;
  /**
   * Parallax inside the frame: the image slides by up to this fraction of the
   * frame's height as it crosses the viewport (e.g. 0.06). Only animates on
   * pages that mount <SmoothScroll />; elsewhere it's ignored.
   */
  drift?: number;
  className?: string;
};

export function Photo({ photo, sizes, preload, ratio, position, drift, className = "" }: Props) {
  const ar = ratio ?? photo.width / photo.height;
  return (
    <div
      data-drift={drift || undefined}
      className={`frame ${className}`}
      style={{ aspectRatio: String(ar), backgroundColor: photo.color }}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={sizes}
        preload={preload}
        placeholder="blur"
        blurDataURL={photo.blurDataURL}
        className="object-cover"
        style={position ? { objectPosition: position } : undefined}
      />
    </div>
  );
}
