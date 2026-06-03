// src/app/robots.ts
import type { MetadataRoute } from "next";
import { isProductionSite, toAbsoluteUrl } from "@/entities/seo/siteConfig";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      ...(isProductionSite ? { allow: "/" } : { disallow: "/" }),
    },
    sitemap: toAbsoluteUrl("/sitemap.xml"),
  };
}
