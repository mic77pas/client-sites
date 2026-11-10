import Image from "next/image";
import type { Photo as PhotoData } from "@/lib/media";

type Props = {
  photo: PhotoData;
  /** Responsive `sizes` hint — be accurate, it decides which file is fetched. */
  sizes: string;
  preload?: boolean;
  /** Force a crop ratio (width / height). Defaults to the photo's own ratio. */
  ratio?: number;
  /** object-position when cropping, e.g. "50% 30%". */
  position?: string;
  className?: string;
};

export function Photo({ photo, sizes, preload, ratio, position, className = "" }: Props) {
  const ar = ratio ?? photo.width / photo.height;
  return (
    <div className={`frame ${className}`} style={{ aspectRatio: String(ar), backgroundColor: photo.color }}>
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
