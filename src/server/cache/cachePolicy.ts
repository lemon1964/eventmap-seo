// src/server/cache/cachePolicy.ts
// Единая учебная карта cache policy для серверных источников EventMap.
// Controlled content не требует внешнего fetch, live API получает revalidate,
// а preview-сценарии могут явно отключать кэш.
export const cachePolicy = {
    liveEventsRevalidate: 300,
    liveEventDetailRevalidate: 600,
    previewNoStore: "no-store",
    tags: {
      liveEvents: "live-events",
      liveEventDetail: "live-event-detail",
    },
  } as const;
  