// src/features/auth/authRedirect.ts
export function getSafeAuthNext(value: string | null, fallback: string): string {
    if (!value) {
      return fallback;
    }
  
    if (!value.startsWith("/")) {
      return fallback;
    }
  
    if (value.startsWith("//")) {
      return fallback;
    }
  
    try {
      const parsed = new URL(value, "https://eventmap.local");
  
      if (parsed.origin !== "https://eventmap.local") {
        return fallback;
      }
  
      return `${parsed.pathname}${parsed.search}${parsed.hash}`;
    } catch {
      return fallback;
    }
  }
  
  export function getAuthCallbackUrl(origin: string, next: string): string {
    const safeNext = getSafeAuthNext(next, "/");
    const callbackUrl = new URL("/auth/callback", origin);
    callbackUrl.search = new URLSearchParams({ next: safeNext }).toString();
  
    return callbackUrl.toString();
  }
  