/**
 * Inbox for support (mailto fallback + Web3Forms dashboard “send to” email).
 */
export const SUPPORT_EMAIL = 'info@ryft.us'

export function getSupportMailtoHref(): string {
  const subject = encodeURIComponent('RYFT — Support request')
  return `mailto:${SUPPORT_EMAIL}?subject=${subject}`
}
