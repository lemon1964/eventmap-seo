// src/entities/seo/siteConfig.ts
export const siteConfig = {
  name: "EventMap",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  environment: process.env.SITE_ENV ?? "development",
};

export const isProductionSite = siteConfig.environment === "production";

export function toAbsoluteUrl(pathOrUrl: string | undefined): string | undefined {
  if (!pathOrUrl) {
    return undefined;
  }

  try {
    return new URL(pathOrUrl, siteConfig.url).toString();
  } catch {
    return undefined;
  }
}
