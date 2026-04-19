import { Rocket } from 'lucide-react'

type PanelProps = {
  variant?: 'hero' | 'modal'
}

/** No fixed launch clock — messaging only. */
export function LaunchCountdownPanel({ variant = 'hero' }: PanelProps) {
  const isModal = variant === 'modal'
  const shellClass = isModal
    ? 'rounded-lg border border-white/10 bg-white/[0.04] px-3 py-3 sm:px-4 sm:py-4'
    : 'rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 shadow-[0_0_28px_-14px_rgba(139,92,246,0.3)] backdrop-blur-sm sm:px-4 sm:py-3.5'

  const titleClass = isModal
    ? 'text-sm font-bold leading-snug text-white sm:text-base'
    : 'text-sm font-black leading-snug text-white sm:text-base md:text-lg'

  const bodyClass = isModal
    ? 'mt-1.5 text-xs leading-relaxed text-gray-400 sm:text-sm'
    : 'mt-1 text-xs leading-relaxed text-gray-400 sm:text-sm'

  return (
    <div className={shellClass}>
      <div className="mb-2 flex justify-center text-primary" aria-hidden>
        <Rocket className="h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]" />
      </div>

      <p className={`text-center ${titleClass}`}>Launch coming soon.</p>
      <p className={`text-center ${bodyClass}`}>
        Grab your lifetime subscription before it launches.
      </p>
    </div>
  )
}

export function LaunchCountdown() {
  return (
    <div className="mx-auto mb-8 max-w-md">
      <LaunchCountdownPanel variant="hero" />
    </div>
  )
}
