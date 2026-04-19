import { AnimatePresence, motion } from 'framer-motion'
import { Puzzle, X } from 'lucide-react'
import { LaunchCountdownPanel } from './LaunchCountdown'

type Props = {
  isOpen: boolean
  onClose: () => void
}

export function ExtensionLaunchModal({ isOpen, onClose }: Props) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          key="extension-launch-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={onClose}
          role="presentation"
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.94, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="glass-panel relative max-h-[min(90vh,720px)] w-full max-w-lg overflow-y-auto rounded-2xl p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="extension-launch-title"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 transition hover:text-white"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
              <Puzzle className="h-6 w-6 text-primary" aria-hidden />
            </div>

            <h2
              id="extension-launch-title"
              className="mb-3 pr-8 text-2xl font-bold text-white"
            >
              Extension available at launch
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-gray-400">
              The Ryft Chrome extension isn&apos;t downloadable yet—it will go
              live in the Chrome Web Store when we launch. Secure lifetime
              access now before release.
            </p>

            <LaunchCountdownPanel variant="modal" />

            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full rounded-xl bg-primary py-3 text-sm font-bold text-white transition hover:bg-violet-600"
            >
              Got it
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
