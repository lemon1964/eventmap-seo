// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { buildSitemapEntries } from "@/entities/seo/sitemapEntries";

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemapEntries();
}
