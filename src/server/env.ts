// src/server/env.ts
export function getTicketmasterApiKey(): string | null {
    const key = process.env.TICKETMASTER_API_KEY;
  
    // Секретный ключ остаётся на сервере и не должен иметь префикс NEXT_PUBLIC_.
    return key && key.trim().length > 0 ? key : null;
  }
  