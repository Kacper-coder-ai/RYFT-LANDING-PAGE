import { initializePaddle, type Environments, type Paddle } from '@paddle/paddle-js'

let paddleInitPromise: Promise<Paddle | undefined> | null = null

export function isPaddleCheckoutConfigured(): boolean {
  const token = import.meta.env.VITE_PADDLE_CLIENT_TOKEN?.trim()
  const priceId = import.meta.env.VITE_PADDLE_PRICE_ID?.trim()
  return Boolean(token && priceId)
}

export function getPaddlePriceId(): string | undefined {
  const id = import.meta.env.VITE_PADDLE_PRICE_ID?.trim()
  return id || undefined
}

/**
 * Subscription checkout uses separate catalog prices from the founding-seat flow.
 * Set monthly/yearly IDs when both plans exist; otherwise a single fallback ID is enough for testing.
 */
export function getPaddleSubscriptionPriceId(
  period: 'monthly' | 'yearly',
): string | undefined {
  const monthly =
    import.meta.env.VITE_PADDLE_SUBSCRIPTION_MONTHLY_PRICE_ID?.trim()
  const yearly = import.meta.env.VITE_PADDLE_SUBSCRIPTION_YEARLY_PRICE_ID?.trim()
  const fallback = import.meta.env.VITE_PADDLE_SUBSCRIPTION_PRICE_ID?.trim()
  if (period === 'monthly') {
    return monthly || fallback || undefined
  }
  return yearly || fallback || undefined
}

export function isPaddleSubscriptionCheckoutConfigured(
  period: 'monthly' | 'yearly',
): boolean {
  const token = import.meta.env.VITE_PADDLE_CLIENT_TOKEN?.trim()
  return Boolean(token && getPaddleSubscriptionPriceId(period))
}

/** Defaults to Paddle Sandbox unless `VITE_PADDLE_ENV=production` (live keys + prices only). */
function paddleEnvironment(): Environments {
  return import.meta.env.VITE_PADDLE_ENV === 'production'
    ? 'production'
    : 'sandbox'
}

/**
 * Single shared init for Paddle.js (client token from Paddle → Developer tools).
 */
export function getPaddleInstance(): Promise<Paddle | undefined> {
  if (!isPaddleCheckoutConfigured()) {
    return Promise.resolve(undefined)
  }
  if (!paddleInitPromise) {
    const token = import.meta.env.VITE_PADDLE_CLIENT_TOKEN!.trim()
    paddleInitPromise = initializePaddle({
      environment: paddleEnvironment(),
      token,
    })
  }
  return paddleInitPromise
}
