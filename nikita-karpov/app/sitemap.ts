import type { MetadataRoute } from "next";
import { getCategories } from "@/lib/media";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL
    : process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000";
  const pages = ["", "/work", "/film", "/about", "/contact", ...getCategories().map((c) => `/work/${c.slug}`)];
  return pages.map((p) => ({ url: `${base}${p}` }));
}
