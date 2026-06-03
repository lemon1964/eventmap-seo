// src/entities/event/rawMockEvents.ts
export const rawMockEvents: unknown[] = [
    {
      id: "london-music-night",
      name: "London Music Night",
      location: {
        city: "London",
        country: "United Kingdom",
      },
      category: "Music",
      date: {
        label: "21 July",
      },
      venue: {
        name: "River Hall",
      },
      description: "An evening of indie performances near the Thames.",
      image: {
        url: "/event-placeholder.svg",
      },
      price: "from £24",
    },
    {
      id: "berlin-design-week",
      name: "Berlin Design Week",
      location: {
        city: "Berlin",
        country: "Germany",
      },
      category: "Design",
      date: {
        label: "28 July",
      },
      venue: {
        name: "Mitte Studio",
      },
      description: "A compact showcase of product, spatial and digital design.",
      image: {
        url: "/event-placeholder.svg",
      },
      price: "free entry",
    },
    // Намеренно сломанная запись: нет name.
    {
      id: "broken-without-name",
      location: {
        city: "Berlin",
        country: "Germany",
      },
      category: "Design",
      date: {
        label: "30 July",
      },
      venue: {
        name: "Design Factory",
      },
      description: "This raw item should not reach UI.",
      price: "free",
    },
    {
      id: "new-york-rooftop-jazz",
      name: "New York Rooftop Jazz",
      location: {
        city: "New York",
        country: "United States",
      },
      category: "Music",
      date: {
        label: "3 August",
      },
      venue: {
        name: "Skyline Loft",
      },
      description: "Late-night jazz session with a clear view over the city.",
      price: "from $32",
    },
    // Намеренно сломанная запись: id пришёл числом.
    {
      id: 4102,
      name: "Broken Numeric Id",
      location: {
        city: "London",
        country: "United Kingdom",
      },
      category: "Family",
      date: {
        label: "9 August",
      },
      venue: {
        name: "Greenwich Lab",
      },
      description: "This raw item should not reach UI.",
      price: "£12",
    },
    // Намеренно сломанная запись: нет location.city.
    {
      id: "broken-without-city",
      name: "Broken Without City",
      location: {
        country: "Germany",
      },
      category: "Food",
      date: {
        label: "14 August",
      },
      venue: {
        name: "Kreuzberg Yard",
      },
      description: "This raw item should not reach UI.",
      price: "free entry",
    },
    // Намеренно сломанная запись: date.label пришёл числом.
    {
      id: "broken-date-label",
      name: "Broken Date Label",
      location: {
        city: "New York",
        country: "United States",
      },
      category: "Art",
      date: {
        label: 2208,
      },
      venue: {
        name: "Hudson Gallery",
      },
      description: "This raw item should not reach UI.",
      price: "from $18",
    },
    // Намеренно сломанная запись: нет venue.name.
    {
      id: "broken-without-venue-name",
      name: "Broken Without Venue Name",
      location: {
        city: "London",
        country: "United Kingdom",
      },
      category: "Tech",
      date: {
        label: "26 August",
      },
      venue: {},
      description: "This raw item should not reach UI.",
      price: "from £16",
    },
  ];
  