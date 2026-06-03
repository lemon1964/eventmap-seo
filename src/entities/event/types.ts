// src/entities/event/types.ts
export type EventPreview = {
  id: string;
  title: string;
  city: string;
  category: string;
  dateLabel: string;
  description: string;
};

export type EventCardData = {
  id: string;
  title: string;
  city: string;
  country: string;
  category: string;
  dateLabel: string;
  venue: string;
  description: string;
  imageUrl: string;
  genreLabel?: string;
  priceLabel?: string;
  ticketUrl?: string;
  timeLabel?: string;
};
