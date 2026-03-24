/**
 * Advanced email sanitization & normalization.
 * Strips Gmail dots/plus aliases, trims whitespace, lowercases.
 */
export function normalizeEmail(raw: string | undefined | null): string {
  let cleanEmail = (raw ?? '').replace(/\s+/g, '').toLowerCase();
  if (!cleanEmail) return '';

  if (cleanEmail.endsWith('@gmail.com')) {
    const [local, domain] = cleanEmail.split('@');
    cleanEmail = `${local.split('+')[0].replace(/\./g, '')}@${domain}`;
  }

  return cleanEmail;
}
