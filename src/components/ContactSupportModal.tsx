import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import { SUPPORT_EMAIL } from '../config/contact'
import {
  isWeb3FormsConfigured,
  openSupportMailtoFallback,
  submitSupportMessage,
} from '../lib/contactForm'
import { useBodyScrollLock } from '../hooks/useBodyScrollLock'

type Props = {
  isOpen: boolean
  onClose: () => void
  /** Prefill when the visitor is signed in */
  defaultEmail?: string
}

export function ContactSupportModal({
  isOpen,
  onClose,
  defaultEmail = '',
}: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successKind, setSuccessKind] = useState<'api' | 'mailto' | null>(null)

  useBodyScrollLock(isOpen)

  useEffect(() => {
    if (!isOpen) return
    setName('')
    setEmail(defaultEmail.trim())
    setMessage('')
    setError(null)
    setSuccessKind(null)
    setBusy(false)
  }, [isOpen, defaultEmail])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    const em = email.trim()
    const msg = message.trim()
    if (!em || !msg) {
      setError('Please enter your email and a message.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      setError('Please enter a valid email address.')
      return
    }

    setBusy(true)
    try {
      if (isWeb3FormsConfigured()) {
        const result = await submitSupportMessage({
          name: name.trim(),
          email: em,
          message: msg,
        })
        if (result.ok) {
          setSuccessKind('api')
          return
        }
        setError(result.error)
        return
      }
      openSupportMailtoFallback({ name: name.trim(), email: em, message: msg })
      setSuccessKind('mailto')
    } finally {
      setBusy(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          key="contact-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={onClose}
          role="presentation"
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.94, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#14141c] p-8 shadow-2xl"
            onClick={(ev) => ev.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-support-title"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-400 transition hover:text-white"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {successKind ? (
              <div className="pr-8">
                <h2
                  id="contact-support-title"
                  className="mb-3 text-2xl font-bold text-white"
                >
                  {successKind === 'api' ? 'Message sent' : 'Almost there'}
                </h2>
                {successKind === 'api' ? (
                  <p className="text-sm leading-relaxed text-gray-400">
                    Thanks — we received your message and will get back to you at{' '}
                    <span className="text-gray-300">{email.trim()}</span>.
                  </p>
                ) : (
                  <p className="text-sm leading-relaxed text-gray-400">
                    Your email app should open with your message ready to send to{' '}
                    <span className="font-mono text-gray-300">{SUPPORT_EMAIL}</span>.
                    If it didn&apos;t, email us there directly.
                  </p>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-8 w-full rounded-xl bg-primary py-3 text-sm font-bold text-white transition hover:bg-violet-600"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <h2
                  id="contact-support-title"
                  className="mb-1 pr-8 text-2xl font-bold text-white"
                >
                  Contact support
                </h2>
                <p className="mb-6 text-sm text-gray-400">
                  Send a message to{' '}
                  <span className="font-mono text-gray-300">{SUPPORT_EMAIL}</span>
                </p>

                {!isWeb3FormsConfigured() ? (
                  <p className="mb-4 rounded-lg border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-xs text-amber-100/90">
                    Form delivery isn&apos;t configured yet — submit will open your
                    email app instead. For direct delivery from the site, add{' '}
                    <code className="rounded bg-white/10 px-1 font-mono text-[11px]">
                      VITE_WEB3FORMS_ACCESS_KEY
                    </code>{' '}
                    (see{' '}
                    <code className="font-mono text-[11px]">.env.example</code>).
                  </p>
                ) : null}

                <form onSubmit={(ev) => void handleSubmit(ev)} className="space-y-4">
                  <div>
                    <label
                      htmlFor="support-name"
                      className="mb-1.5 block text-xs font-semibold tracking-wide text-gray-300 uppercase"
                    >
                      Name{' '}
                      <span className="font-normal normal-case text-gray-400">
                        (optional)
                      </span>
                    </label>
                    <input
                      id="support-name"
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(ev) => setName(ev.target.value)}
                      className="w-full rounded-xl border border-white/25 bg-[#1a1a22] px-4 py-3 text-sm text-white placeholder:text-gray-400 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/35"
                      placeholder="Your name"
                      disabled={busy}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="support-email"
                      className="mb-1.5 block text-xs font-semibold tracking-wide text-gray-300 uppercase"
                    >
                      Email
                    </label>
                    <input
                      id="support-email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(ev) => setEmail(ev.target.value)}
                      className="w-full rounded-xl border border-white/25 bg-[#1a1a22] px-4 py-3 text-sm text-white placeholder:text-gray-400 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/35"
                      placeholder="you@example.com"
                      disabled={busy}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="support-message"
                      className="mb-1.5 block text-xs font-semibold tracking-wide text-gray-300 uppercase"
                    >
                      Message
                    </label>
                    <textarea
                      id="support-message"
                      required
                      rows={5}
                      value={message}
                      onChange={(ev) => setMessage(ev.target.value)}
                      className="w-full resize-y rounded-xl border border-white/25 bg-[#1a1a22] px-4 py-3 text-sm text-white placeholder:text-gray-400 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/35"
                      placeholder="How can we help?"
                      disabled={busy}
                    />
                  </div>

                  {error ? (
                    <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                      {error}
                    </p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={busy}
                    className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-white transition hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {busy ? 'Sending…' : 'Send message'}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
