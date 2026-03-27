/**
 * SSR-safe localStorage with sessionStorage + RAM fallback (Safari guard).
 */

declare global {
  interface Window {
    [key: string]: any;
  }
}

const FALLBACK_PREFIX = '__planb_fallback_';

export function safeSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Safari private browsing or quota exceeded
    if (typeof window !== 'undefined') {
      window.__storage_disabled = true;
      try { sessionStorage.setItem(key, value); } catch {}
      window[`${FALLBACK_PREFIX}${key}`] = value;
    }
  }
}

export function safeGet(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key)
      ?? sessionStorage.getItem(key)
      ?? window[`${FALLBACK_PREFIX}${key}`]
      ?? null;
  } catch {
    return window[`${FALLBACK_PREFIX}${key}`] ?? null;
  }
}

export function safeRemove(key: string): void {
  try { localStorage.removeItem(key); } catch {}
  try { sessionStorage.removeItem(key); } catch {}
  if (typeof window !== 'undefined') {
    delete window[`${FALLBACK_PREFIX}${key}`];
  }
}

export function safeGetJSON<T = unknown>(key: string): T | null {
  const raw = safeGet(key);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as T;
    }
    throw new Error('invalid');
  } catch {
    safeRemove(key);
    return null;
  }
}

export function safeSetJSON(key: string, value: unknown): void {
  try {
    safeSet(key, JSON.stringify(value));
  } catch {}
}

export function cleanupFallback(key: string): void {
  if (typeof window !== 'undefined') {
    delete window[`${FALLBACK_PREFIX}${key}`];
    try { sessionStorage.removeItem(key); } catch {}
  }
}
