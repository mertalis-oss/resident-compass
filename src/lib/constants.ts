/** Centralized constants — single source of truth */
export const WHATSAPP_NUMBER = '66647036510';

export const buildWhatsAppUrl = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
