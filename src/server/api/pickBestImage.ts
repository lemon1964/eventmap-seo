// src/server/api/pickBestImage.ts
type TicketmasterImage = {
  url: string;
  width?: number;
  height?: number;
};

export const EVENT_PLACEHOLDER_IMAGE = "/event-placeholder.svg";

export function pickBestImage(images: TicketmasterImage[] | undefined): string {
  if (!images || images.length === 0) {
    return EVENT_PLACEHOLDER_IMAGE;
  }

  const validImages = images.filter((image) => image.url.trim().length > 0);

  if (validImages.length === 0) {
    return EVENT_PLACEHOLDER_IMAGE;
  }

  // Для карточки EventMap лучше подходят широкие изображения.
  const wideImage = validImages
    .filter(
      (image) =>
        typeof image.width === "number" &&
        image.width >= 600 &&
        (image.height ?? 0) <= image.width,
    )
    .sort((a, b) => (b.width ?? 0) - (a.width ?? 0))[0];

  if (wideImage) {
    return wideImage.url;
  }

  const imagesWithWidth = validImages.filter(
    (image) => typeof image.width === "number",
  );

  if (imagesWithWidth.length === 0) {
    return validImages[0].url;
  }

  return (
    imagesWithWidth.sort((a, b) => (b.width ?? 0) - (a.width ?? 0))[0]?.url ??
    EVENT_PLACEHOLDER_IMAGE
  );
}
