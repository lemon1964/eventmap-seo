// src/entities/event/ticketmasterSchema.ts
import { z } from "zod";

export const TicketmasterEventSchema = z.object({
  id: z.string(),
  name: z.string(),
  info: z.string().optional(),
  pleaseNote: z.string().optional(),
  url: z.string().optional(),
  images: z
    .array(
      z.object({
        url: z.string(),
        width: z.number().optional(),
        height: z.number().optional(),
      }),
    )
    .optional(),
  dates: z
    .object({
      start: z
        .object({
          localDate: z.string().optional(),
          localTime: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
  classifications: z
    .array(
      z.object({
        genre: z
          .object({
            name: z.string().optional(),
          })
          .optional(),
        segment: z
          .object({
            name: z.string().optional(),
          })
          .optional(),
      }),
    )
    .optional(),
  priceRanges: z
    .array(
      z.object({
        currency: z.string().optional(),
        max: z.number().optional(),
        min: z.number().optional(),
      }),
    )
    .optional(),
  _embedded: z
    .object({
      venues: z
        .array(
          z.object({
            name: z.string().optional(),
            city: z
              .object({
                name: z.string().optional(),
              })
              .optional(),
            country: z
              .object({
                name: z.string().optional(),
              })
              .optional(),
          }),
        )
        .optional(),
    })
    .optional(),
});

export const TicketmasterEventsResponseSchema = z.object({
  _embedded: z
    .object({
      events: z.array(TicketmasterEventSchema).optional(),
    })
    .optional(),
  page: z
    .object({
      totalElements: z.number().optional(),
      totalPages: z.number().optional(),
      number: z.number().optional(),
      size: z.number().optional(),
    })
    .optional(),
});

export type TicketmasterEvent = z.infer<typeof TicketmasterEventSchema>;
