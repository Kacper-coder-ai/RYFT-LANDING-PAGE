/**
 * Social profile URLs for the landing footer (and anywhere else you import this).
 *
 * Footer currently shows only Instagram + Discord (`SocialFooterLinks`). Other
 * keys stay for easy turn-up later.
 */
export type SocialPlatformId =
  | 'x'
  | 'instagram'
  | 'youtube'
  | 'tiktok'
  | 'discord'

export const SOCIAL_LINKS: Record<SocialPlatformId, string> = {
  x: 'https://example.com/ryft-placeholder/x',
  instagram: 'https://www.instagram.com/ryft_app/',
  youtube: 'https://example.com/ryft-placeholder/youtube',
  tiktok: 'https://example.com/ryft-placeholder/tiktok',
  discord: 'https://discord.gg/WmA5WJxz',
}
