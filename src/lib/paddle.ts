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
