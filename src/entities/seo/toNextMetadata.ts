// src/entities/seo/toNextMetadata.ts
import type { Metadata } from "next";
import { siteConfig, toAbsoluteUrl } from "@/entities/seo/siteConfig";

export type SeoInput = {
  title: string;
  description: string;
  imageUrl?: string;
  noIndex?: boolean;
  canonicalPath?: string;
  languageAlternates?: Record<string, string>;
};

const defaultOgImage = "/og/eventmap.png";

export function toNextMetadata({
  canonicalPath,
  description,
  imageUrl,
  languageAlternates,
  noIndex = false,
  title,
}: SeoInput): Metadata {
  const absoluteImageUrl = toAbsoluteUrl(imageUrl ?? defaultOgImage);
  const canonical = toAbsoluteUrl(canonicalPath);

  const images = absoluteImageUrl
    ? [
        {
          url: absoluteImageUrl,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ]
    : undefined;

  const languages = languageAlternates
    ? Object.fromEntries(
        Object.entries(languageAlternates).flatMap(([locale, path]) => {
          const href = toAbsoluteUrl(path);

          return href ? [[locale, href]] : [];
        }),
      )
    : undefined;

  return {
    title,
    description,
    alternates:
      canonical || languages
        ? {
            canonical,
            languages,
          }
        : undefined,
    openGraph: {
      title,
      description,
      images,
      siteName: siteConfig.name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: absoluteImageUrl ? [absoluteImageUrl] : undefined,
    },
    robots: noIndex ? { follow: false, index: false } : undefined,
  };
}
// // src/entities/seo/toNextMetadata.ts
// import type { Metadata } from "next";
// import { siteConfig, toAbsoluteUrl } from "@/entities/seo/siteConfig";

// export type SeoInput = {
//   title: string;
//   description: string;
//   imageUrl?: string;
//   noIndex?: boolean;
//   canonicalPath?: string;
//   languageAlternates?: Record<string, string>;
// };

// export function toNextMetadata({
//   canonicalPath,
//   description,
//   imageUrl,
//   languageAlternates,
//   noIndex = false,
//   title,
// }: SeoInput): Metadata {
//   const absoluteImageUrl = toAbsoluteUrl(imageUrl);
//   const canonical = toAbsoluteUrl(canonicalPath);
//   const images = absoluteImageUrl ? [{ url: absoluteImageUrl }] : undefined;
//   const languages = languageAlternates
//     ? Object.fromEntries(
//         Object.entries(languageAlternates).flatMap(([locale, path]) => {
//           const href = toAbsoluteUrl(path);

//           return href ? [[locale, href]] : [];
//         }),
//       )
//     : undefined;

//   return {
//     title,
//     description,
//     alternates:
//       canonical || languages
//         ? {
//             canonical,
//             languages,
//           }
//         : undefined,
//     openGraph: {
//       title,
//       description,
//       images,
//       siteName: siteConfig.name,
//     },
//     twitter: {
//       card: images ? "summary_large_image" : "summary",
//       title,
//       description,
//       images: absoluteImageUrl ? [absoluteImageUrl] : undefined,
//     },
//     robots: noIndex ? { follow: false, index: false } : undefined,
//   };
// }
