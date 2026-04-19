import type { PostHogConfig } from 'posthog-js'

/** US cloud (default). EU projects: https://eu.i.posthog.com */
export const POSTHOG_DEFAULT_HOST = 'https://us.i.posthog.com'

export function isPostHogConfigured(): boolean {
  const key = import.meta.env.VITE_POSTHOG_KEY?.trim()
  return Boolean(key)
}

/** Options passed to PostHogProvider — tweak in one place. */
export function getPostHogOptions(): Partial<PostHogConfig> {
  const apiHost =
    import.meta.env.VITE_POSTHOG_HOST?.trim() || POSTHOG_DEFAULT_HOST

  return {
    api_host: apiHost,
    /** Only create person profiles for identified users (after login). Saves volume on free tier. */
    person_profiles: 'identified_only',
    /** SPA: track $pageview on pushState / replaceState / popstate (React Router). */
    capture_pageview: 'history_change',
    capture_pageleave: true,
    persistence: 'localStorage+cookie',
    autocapture: true,
    /**
     * Session replay & error tracking are also toggled in the PostHog project UI.
     * Free tier includes generous monthly event allowances; see posthog.com/pricing
     */
    disable_session_recording: false,
  }
}
