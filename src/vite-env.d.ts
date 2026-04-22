/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  /** PostHog project API key (PostHog → Project settings → Project API Key) */
  readonly VITE_POSTHOG_KEY?: string
  /** Optional. Default https://us.i.posthog.com — EU: https://eu.i.posthog.com */
  readonly VITE_POSTHOG_HOST?: string
  /** Paddle Billing client-side token (Dashboard → Developer tools → Authentication) */
  readonly VITE_PADDLE_CLIENT_TOKEN?: string
  /** Paddle price ID for founding seat (e.g. pri_01...) — Catalog → Prices */
  readonly VITE_PADDLE_PRICE_ID?: string
  /** Optional: one subscription price ID for both monthly/yearly (sandbox testing) */
  readonly VITE_PADDLE_SUBSCRIPTION_PRICE_ID?: string
  readonly VITE_PADDLE_SUBSCRIPTION_MONTHLY_PRICE_ID?: string
  readonly VITE_PADDLE_SUBSCRIPTION_YEARLY_PRICE_ID?: string
  /** sandbox (default) or production */
  readonly VITE_PADDLE_ENV?: string
  /** Web3Forms access key — https://web3forms.com (set “Send to” email to info@ryft.us) */
  readonly VITE_WEB3FORMS_ACCESS_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
