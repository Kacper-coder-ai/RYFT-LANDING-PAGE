/**
 * Social profile URLs for the landing footer (and anywhere else you import this).
 *
 * Replace each `https://example.com/...` value with your real link when the
 * account exists — for example:
 *   x: 'https://x.com/ryft'
 *   discord: 'https://discord.gg/your-invite-code'
 *
 * This file is the single place to edit them: src/config/socialLinks.ts
 */
export type SocialPlatformId =
  | 'x'
  | 'instagram'
  | 'youtube'
  | 'tiktok'
  | 'discord'

export const SOCIAL_LINKS: Record<SocialPlatformId, string> = {
  x: 'https://example.com/ryft-placeholder/x',
  instagram: 'https://example.com/ryft-placeholder/instagram',
  youtube: 'https://example.com/ryft-placeholder/youtube',
  tiktok: 'https://example.com/ryft-placeholder/tiktok',
  discord: 'https://example.com/ryft-placeholder/discord',
}
