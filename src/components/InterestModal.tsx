import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

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
    title: 'Sign in',
    body: 'Accounts and cloud sync run in the full Ryft web app. This page is a static preview of the marketing site.',
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
            <p className="text-sm leading-relaxed text-gray-400">{body}</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-8 w-full rounded-xl bg-primary py-3 text-sm font-bold text-white transition hover:bg-violet-600"
            >
              Got it
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
