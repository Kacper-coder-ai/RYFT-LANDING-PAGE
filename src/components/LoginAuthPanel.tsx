import { useState, type FormEvent } from 'react'
import { useAuth } from '../contexts/AuthContext'

type Mode = 'signin' | 'signup'

export function LoginAuthPanel({ onSuccess }: { onSuccess?: () => void }) {
  const {
    configured,
    user,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    loading: authLoading,
  } = useAuth()
  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [signupHint, setSignupHint] = useState<string | null>(null)

  if (!configured) {
    return (
      <div className="space-y-3 text-sm leading-relaxed text-gray-400">
        <p>
          Add your Supabase URL and anon key to the{' '}
          <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs text-gray-300">
            .env
          </code>{' '}
          file in the project root, then restart the dev server.
        </p>
        <p className="text-xs text-gray-500">
          Dashboard → Project Settings → API → Project URL and anon public key.
        </p>
      </div>
    )
  }

  if (user) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-400">
          Signed in as{' '}
          <span className="font-medium text-white">{user.email}</span>
        </p>
        <button
          type="button"
          onClick={async () => {
            await signOut()
            onSuccess?.()
          }}
          className="w-full rounded-xl border border-white/15 bg-white/5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
        >
          Sign out
        </button>
      </div>
    )
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSignupHint(null)
    if (!email.trim() || !password) {
      setError('Enter email and password.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setBusy(true)
    try {
      if (mode === 'signin') {
        const { error: err } = await signIn(email, password)
        if (err) {
          setError(err)
          return
        }
        onSuccess?.()
      } else {
        const { error: err } = await signUp(email, password)
        if (err) {
          setError(err)
          return
        }
        setSignupHint(
          'Check your email to confirm your account if confirmation is enabled in Supabase.',
        )
        setPassword('')
      }
    } finally {
      setBusy(false)
    }
  }

  const disabled = busy || authLoading

  return (
    <div className="space-y-5">
      <div className="flex rounded-xl border border-white/10 bg-white/5 p-1">
        <button
          type="button"
          onClick={() => {
            setMode('signin')
            setError(null)
            setSignupHint(null)
          }}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
            mode === 'signin'
              ? 'bg-primary text-white shadow-lg shadow-violet-500/20'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('signup')
            setError(null)
            setSignupHint(null)
          }}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
            mode === 'signup'
              ? 'bg-primary text-white shadow-lg shadow-violet-500/20'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Create account
        </button>
      </div>

      <div className="space-y-4">
        <button
          type="button"
          disabled={disabled}
          onClick={async () => {
            setError(null)
            setSignupHint(null)
            setBusy(true)
            try {
              const { error: err } = await signInWithGoogle()
              if (err) setError(err)
            } finally {
              setBusy(false)
            }
          }}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/15 bg-white py-3 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden>
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="h-px flex-1 bg-white/10" />
          or email
          <span className="h-px flex-1 bg-white/10" />
        </div>
      </div>

      {error ? (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="auth-email"
            className="mb-1.5 block text-xs font-medium tracking-wide text-gray-500 uppercase"
          >
            Email
          </label>
          <input
            id="auth-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="you@example.com"
            disabled={disabled}
          />
        </div>
        <div>
          <label
            htmlFor="auth-password"
            className="mb-1.5 block text-xs font-medium tracking-wide text-gray-500 uppercase"
          >
            Password
          </label>
          <input
            id="auth-password"
            type="password"
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="••••••••"
            disabled={disabled}
          />
        </div>

        {signupHint ? (
          <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200/90">
            {signupHint}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={disabled}
          className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-white transition hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
        </button>
      </form>
    </div>
  )
}
