import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Photos are pre-sized by `npm run media` (scripts/media.mjs), so Next just
    // picks a file — no on-demand optimisation, no Vercel image quota used.
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
    // Must match WIDTHS in scripts/media.mjs.
    deviceSizes: [480, 960, 1440, 2048],
    imageSizes: [240],
  },
};

export default nextConfig;
