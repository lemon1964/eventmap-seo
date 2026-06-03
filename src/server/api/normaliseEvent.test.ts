// src/server/api/normaliseEvent.test.ts
import { describe, expect, it } from "vitest";
import type { RawEvent } from "@/entities/event/rawEventSchema";
import type { TicketmasterEvent } from "@/entities/event/ticketmasterSchema";
import {
  normaliseEvent,
  normaliseTicketmasterEvent,
} from "@/server/api/normaliseEvent";
import { EVENT_PLACEHOLDER_IMAGE } from "@/server/api/pickBestImage";

const controlledEvent = {
  id: "london-music-night",
  name: "London Music Night",
  location: {
    city: "London",
    country: "United Kingdom",
  },
  category: "music",
  date: {
    label: "12 Jun 2026",
  },
  venue: {
    name: "Roundhouse",
  },
  description: "A live music night in London.",
  image: {
    url: "/events/london-music-night.jpg",
  },
  price: "from 25 GBP",
} satisfies RawEvent;

describe("normaliseEvent", () => {
  it("normalises a controlled raw event", () => {
    expect(normaliseEvent(controlledEvent)).toEqual({
      id: "london-music-night",
      title: "London Music Night",
      city: "London",
      country: "United Kingdom",
      category: "music",
      dateLabel: "12 Jun 2026",
      venue: "Roundhouse",
      description: "A live music night in London.",
      imageUrl: "/events/london-music-night.jpg",
      priceLabel: "from 25 GBP",
    });
  });

  it("uses the placeholder image when controlled image is missing", () => {
    const rawEventWithoutImage = {
      id: controlledEvent.id,
      name: controlledEvent.name,
      location: controlledEvent.location,
      category: controlledEvent.category,
      date: controlledEvent.date,
      venue: controlledEvent.venue,
      description: controlledEvent.description,
      price: controlledEvent.price,
    } satisfies RawEvent;

    expect(normaliseEvent(rawEventWithoutImage).imageUrl).toBe(
      EVENT_PLACEHOLDER_IMAGE,
    );
  });

  it("uses Price not available when controlled price is missing", () => {
    const rawEventWithoutPrice = {
      id: controlledEvent.id,
      name: controlledEvent.name,
      location: controlledEvent.location,
      category: controlledEvent.category,
      date: controlledEvent.date,
      venue: controlledEvent.venue,
      description: controlledEvent.description,
      image: controlledEvent.image,
    } satisfies RawEvent;

    expect(normaliseEvent(rawEventWithoutPrice).priceLabel).toBe(
      "Price not available",
    );
  });
});

describe("normaliseTicketmasterEvent", () => {
  it("normalises a basic Ticketmaster event", () => {
    const ticketmasterEvent = {
      id: "tm-1",
      name: "Ticketmaster Music Night",
      info: "Live show from Ticketmaster.",
      url: "https://example.com/tickets",
      images: [
        { url: "/tm-small.jpg", width: 300, height: 200 },
        { url: "/tm-wide.jpg", width: 900, height: 500 },
      ],
      dates: {
        start: {
          localDate: "2026-06-12",
          localTime: "19:30:00",
        },
      },
      classifications: [
        {
          segment: { name: "Music" },
          genre: { name: "Rock" },
        },
      ],
      priceRanges: [
        {
          min: 25,
          currency: "GBP",
        },
      ],
      _embedded: {
        venues: [
          {
            name: "Roundhouse",
            city: { name: "London" },
            country: { name: "United Kingdom" },
          },
        ],
      },
    } satisfies TicketmasterEvent;

    expect(normaliseTicketmasterEvent(ticketmasterEvent)).toEqual({
      id: "tm-1",
      title: "Ticketmaster Music Night",
      city: "London",
      country: "United Kingdom",
      category: "Music",
      dateLabel: "2026-06-12",
      venue: "Roundhouse",
      description: "Live show from Ticketmaster.",
      imageUrl: "/tm-wide.jpg",
      genreLabel: "Rock",
      priceLabel: "from 25 GBP",
      ticketUrl: "https://example.com/tickets",
      timeLabel: "19:30",
    });
  });

  it("uses pleaseNote when info is not present", () => {
    const ticketmasterEvent = {
      id: "tm-2",
      name: "Please Note Event",
      pleaseNote: "Important venue note.",
    } satisfies TicketmasterEvent;

    expect(normaliseTicketmasterEvent(ticketmasterEvent).description).toBe(
      "Important venue note.",
    );
  });

  it("uses fallback description when no description is present", () => {
    const ticketmasterEvent = {
      id: "tm-3",
      name: "Fallback Description Event",
    } satisfies TicketmasterEvent;

    expect(normaliseTicketmasterEvent(ticketmasterEvent).description).toBe(
      "Event details are coming soon.",
    );
  });

  it("sets Free when priceRanges are missing", () => {
    const ticketmasterEvent = {
      id: "tm-4",
      name: "Free Event",
    } satisfies TicketmasterEvent;

    expect(normaliseTicketmasterEvent(ticketmasterEvent).priceLabel).toBe("Free");
  });

  it("takes image through pickBestImage", () => {
    const ticketmasterEvent = {
      id: "tm-5",
      name: "Image Event",
      images: [
        { url: "/portrait.jpg", width: 500, height: 900 },
        { url: "/best-wide.jpg", width: 1200, height: 600 },
      ],
    } satisfies TicketmasterEvent;

    expect(normaliseTicketmasterEvent(ticketmasterEvent).imageUrl).toBe(
      "/best-wide.jpg",
    );
  });

  it("trims localTime to HH:MM", () => {
    const ticketmasterEvent = {
      id: "tm-6",
      name: "Timed Event",
      dates: {
        start: {
          localTime: "21:45:00",
        },
      },
    } satisfies TicketmasterEvent;

    expect(normaliseTicketmasterEvent(ticketmasterEvent).timeLabel).toBe("21:45");
  });
});
