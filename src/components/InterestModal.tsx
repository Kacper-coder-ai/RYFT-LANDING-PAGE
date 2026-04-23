import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useState } from 'react'
import { useBodyScrollLock } from '../hooks/useBodyScrollLock'
import { X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import {
  getPaddleInstance,
  getPaddlePriceId,
  getPaddleSubscriptionPriceId,
  isPaddleCheckoutConfigured,
  isPaddleSubscriptionCheckoutConfigured,
} from '../lib/paddle'
import { getSupabase, isSupabaseConfigured } from '../lib/supabase'
import { LoginAuthPanel } from './LoginAuthPanel'

export type InterestKind = 'login' | 'beta-lifetime' | 'subscribe'

type Props = {
  isOpen: boolean
  kind: InterestKind
  onClose: () => void
  /** Used when `kind` is `subscribe` to pick the Paddle price (monthly vs yearly). */
  subscriptionBilling?: 'monthly' | 'yearly'
}

const copy: Record<
  InterestKind,
  { title: string; body: string }
> = {
  login: {
    title: 'Account',
    body: '',
  },
  'beta-lifetime': {
    title: 'Lifetime Founding Member access',
    body: 'The $49 founding offer and seat counter will be fulfilled in the Ryft app at checkout. This landing build has no payment processor or database attached—hook up your billing provider when you are ready to go live.',
  },
  subscribe: {
    title: 'Subscribe to RYFT',
    body: 'Add Paddle subscription price IDs and your Supabase keys to .env to open sandbox checkout here. Sign in first so your subscription can be linked to your account.',
  },
}

export function InterestModal({
  isOpen,
  kind,
  onClose,
  subscriptionBilling = 'monthly',
}: Props) {
  const { title, body } = copy[kind]
  const isLogin = kind === 'login'
  const isBetaLifetime = kind === 'beta-lifetime'
  const isSubscribe = kind === 'subscribe'
  const paddleReady = isPaddleCheckoutConfigured()
  const paddleSubscriptionReady =
    isSubscribe && isPaddleSubscriptionCheckoutConfigured(subscriptionBilling)
  const { user } = useAuth()
  const [paddleBusy, setPaddleBusy] = useState(false)
  const [paddleError, setPaddleError] = useState<string | null>(null)

  useBodyScrollLock(isOpen)

  const openPaddleSandboxCheckout = useCallback(async () => {
    setPaddleError(null)
    setPaddleBusy(true)
    try {
      if (!isSupabaseConfigured()) {
        setPaddleError(
          'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.',
        )
        return
      }
      const supabase = getSupabase()
      if (!supabase) {
        setPaddleError('Supabase client is not available.')
        return
      }
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser()
      if (authError || !authUser?.id) {
        setPaddleError(
          authError?.message ??
            'Sign in to claim a founding seat so we can attach your payment to your account.',
        )
        return
      }

      const paddle = await getPaddleInstance()
      const priceId = getPaddlePriceId()
      if (!paddle || !priceId) {
        setPaddleError(
          'Paddle is not configured. Add VITE_PADDLE_CLIENT_TOKEN and VITE_PADDLE_PRICE_ID to .env.',
        )
        return
      }
      paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        customer: authUser.email ? { email: authUser.email } : undefined,
        customData: {
          flow: 'landing_founding_seat',
          supabase_user_id: authUser.id,
        },
        settings: {
          displayMode: 'overlay',
          theme: 'dark',
        },
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Could not start checkout.'
      setPaddleError(msg)
    } finally {
      setPaddleBusy(false)
    }
  }, [])

  const openPaddleSubscriptionCheckout = useCallback(async () => {
    setPaddleError(null)
    setPaddleBusy(true)
    try {
      if (!isSupabaseConfigured()) {
        setPaddleError(
          'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.',
        )
        return
      }
      const supabase = getSupabase()
      if (!supabase) {
        setPaddleError('Supabase client is not available.')
        return
      }
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser()
      if (authError || !authUser?.id) {
        setPaddleError(
          authError?.message ??
            'Sign in to subscribe so we can attach your payment to your account.',
        )
        return
      }

      const paddle = await getPaddleInstance()
      const priceId = getPaddleSubscriptionPriceId(subscriptionBilling)
      if (!paddle || !priceId) {
        setPaddleError(
          'Paddle subscription is not configured. Add VITE_PADDLE_CLIENT_TOKEN and subscription price ID env vars (see .env.example).',
        )
        return
      }

      paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        customer: authUser.email ? { email: authUser.email } : undefined,
        customData: {
          supabase_user_id: authUser.id,
        },
        settings: {
          displayMode: 'overlay',
          theme: 'dark',
        },
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Could not start checkout.'
      setPaddleError(msg)
    } finally {
      setPaddleBusy(false)
    }
  }, [subscriptionBilling])

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={onClose}
          role="presentation"
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.94, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className={`relative w-full max-w-md rounded-2xl p-8 ${
              isLogin
                ? 'border border-white/10 bg-[#14141c]'
                : 'glass-panel'
            }`}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="interest-modal-title"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-400 transition hover:text-white"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <h2
              id="interest-modal-title"
              className="mb-3 pr-8 text-2xl font-bold text-white"
            >
              {title}
            </h2>
            {isLogin ? (
              <LoginAuthPanel onSuccess={onClose} />
            ) : paddleSubscriptionReady ? (
              <div className="space-y-4">
                <p className="text-sm leading-relaxed text-gray-400">
                  Open Paddle&apos;s{' '}
                  <span className="text-amber-200/90">sandbox</span> overlay
                  checkout for your selected plan. Your Supabase user id is sent
                  as <code className="font-mono text-[11px] text-gray-300">customData.supabase_user_id</code>{' '}
                  for your backend. Use Paddle&apos;s test cards—no real charges.
                </p>
                {!user ? (
                  <div className="space-y-3">
                    <p className="text-xs text-amber-100/80">
                      Sign in below so we can include your account id in checkout.
                    </p>
                    <LoginAuthPanel />
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">
                    Signed in — your subscription will be linked to this account.
                  </p>
                )}
                {paddleError ? (
                  <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                    {paddleError}
                  </p>
                ) : null}
                <button
                  type="button"
                  onClick={() => void openPaddleSubscriptionCheckout()}
                  disabled={paddleBusy || !user}
                  className="w-full rounded-xl bg-gradient-to-r from-secondary to-blue-600 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {paddleBusy
                    ? 'Starting checkout…'
                    : `Open subscription checkout (${subscriptionBilling})`}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full rounded-xl border border-white/15 bg-transparent py-3 text-sm font-semibold text-gray-300 transition hover:border-white/25 hover:text-white"
                >
                  Close
                </button>
              </div>
            ) : isBetaLifetime && paddleReady ? (
              <div className="space-y-4">
                <p className="text-sm leading-relaxed text-gray-400">
                  Open Paddle&apos;s <span className="text-amber-200/90">sandbox</span>{' '}
                  overlay checkout to test a founding-seat payment.{' '}
                  <code className="font-mono text-[11px] text-gray-300">customData</code>{' '}
                  includes <code className="font-mono text-[11px] text-gray-300">flow</code>{' '}
                  and{' '}
                  <code className="font-mono text-[11px] text-gray-300">supabase_user_id</code>
                  . Use Paddle&apos;s test cards—no real charges.
                </p>
                {!user ? (
                  <div className="space-y-3">
                    <p className="text-xs text-amber-100/80">
                      Sign in below so your founding seat can be linked to your account.
                    </p>
                    <LoginAuthPanel />
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">
                    Signed in as {user.email} — email can be prefilled in checkout.
                  </p>
                )}
                {paddleError ? (
                  <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                    {paddleError}
                  </p>
                ) : null}
                <button
                  type="button"
                  onClick={() => void openPaddleSandboxCheckout()}
                  disabled={paddleBusy || !user}
                  className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-white transition hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {paddleBusy ? 'Starting checkout…' : 'Open Paddle checkout (sandbox)'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full rounded-xl border border-white/15 bg-transparent py-3 text-sm font-semibold text-gray-300 transition hover:border-white/25 hover:text-white"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm leading-relaxed text-gray-400">{body}</p>
                {isBetaLifetime ? (
                  <p className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-100/90">
                    To test payments: add{' '}
                    <code className="rounded bg-white/10 px-1 font-mono text-[11px]">
                      VITE_PADDLE_CLIENT_TOKEN
                    </code>{' '}
                    and{' '}
                    <code className="rounded bg-white/10 px-1 font-mono text-[11px]">
                      VITE_PADDLE_PRICE_ID
                    </code>{' '}
                    to <code className="font-mono text-[11px]">.env</code> (see{' '}
                    <code className="font-mono text-[11px]">.env.example</code>).
                  </p>
                ) : null}
                {isSubscribe ? (
                  <p className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-100/90">
                    For subscription checkout: set{' '}
                    <code className="rounded bg-white/10 px-1 font-mono text-[11px]">
                      VITE_PADDLE_CLIENT_TOKEN
                    </code>
                    ,{' '}
                    <code className="rounded bg-white/10 px-1 font-mono text-[11px]">
                      VITE_PADDLE_SUBSCRIPTION_MONTHLY_PRICE_ID
                    </code>{' '}
                    /{' '}
                    <code className="rounded bg-white/10 px-1 font-mono text-[11px]">
                      VITE_PADDLE_SUBSCRIPTION_YEARLY_PRICE_ID
                    </code>{' '}
                    (or{' '}
                    <code className="rounded bg-white/10 px-1 font-mono text-[11px]">
                      VITE_PADDLE_SUBSCRIPTION_PRICE_ID
                    </code>{' '}
                    for both), and Supabase env vars. Keep{' '}
                    <code className="font-mono text-[11px]">VITE_PADDLE_ENV</code>{' '}
                    unset or{' '}
                    <code className="font-mono text-[11px]">sandbox</code> for testing.
                  </p>
                ) : null}
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-8 w-full rounded-xl bg-primary py-3 text-sm font-bold text-white transition hover:bg-violet-600"
                >
                  Got it
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
