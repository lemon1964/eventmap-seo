// src/entities/event/rawEventSchema.ts
import { z } from "zod";

export const RawEventSchema = z.object({
  id: z.string(),
  name: z.string(),
  location: z.object({
    city: z.string(),
    country: z.string(),
  }),
  category: z.string(),
  date: z.object({
    label: z.string(),
  }),
  venue: z.object({
    name: z.string(),
  }),
  description: z.string(),
  image: z
    .object({
      url: z.string(),
    })
    .optional(),
  price: z.string().optional(),
});

export type RawEvent = z.infer<typeof RawEventSchema>;
