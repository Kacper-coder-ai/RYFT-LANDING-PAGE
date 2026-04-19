import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useState } from 'react'
import { X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import {
  getPaddleInstance,
  getPaddlePriceId,
  isPaddleCheckoutConfigured,
} from '../lib/paddle'
import { LoginAuthPanel } from './LoginAuthPanel'

export type InterestKind = 'login' | 'beta-lifetime' | 'subscribe'

type Props = {
  isOpen: boolean
  kind: InterestKind
  onClose: () => void
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
    body: 'Subscriptions are managed in the Ryft web app after you sign in. This landing build has no checkout or database attached.',
  },
}

export function InterestModal({ isOpen, kind, onClose }: Props) {
  const { title, body } = copy[kind]
  const isLogin = kind === 'login'
  const isBetaLifetime = kind === 'beta-lifetime'
  const paddleReady = isPaddleCheckoutConfigured()
  const { user } = useAuth()
  const [paddleBusy, setPaddleBusy] = useState(false)
  const [paddleError, setPaddleError] = useState<string | null>(null)

  const openPaddleSandboxCheckout = useCallback(async () => {
    setPaddleError(null)
    setPaddleBusy(true)
    try {
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
        customer: user?.email ? { email: user.email } : undefined,
        customData: {
          flow: 'landing_founding_seat',
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
  }, [user?.email])

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
            className="glass-panel relative w-full max-w-md rounded-2xl p-8"
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
            ) : isBetaLifetime && paddleReady ? (
              <div className="space-y-4">
                <p className="text-sm leading-relaxed text-gray-400">
                  Open Paddle&apos;s <span className="text-amber-200/90">sandbox</span>{' '}
                  checkout to test a founding-seat payment. Use Paddle&apos;s test cards—no
                  real charges.
                </p>
                {user?.email ? (
                  <p className="text-xs text-gray-500">
                    Signed in as {user.email} — email can be prefilled in checkout.
                  </p>
                ) : (
                  <p className="text-xs text-amber-100/80">
                    Tip: sign in first if you want checkout prefilled with your email.
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
                  disabled={paddleBusy}
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
