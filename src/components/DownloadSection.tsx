import { type ReactNode, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Puzzle, Terminal, X } from 'lucide-react'
import { useBodyScrollLock } from '../hooks/useBodyScrollLock'
import { landingSectionReveal } from './LandingScrollChrome'
import { LocalLibraryPreview } from './LocalLibraryPreview'
import { HeroScrapeAnalyzeChapter } from './HeroScrapePipeline'

function IconWindows({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M3 5.5 10.5v-4l7-1.2v5.2H3zm0 6.2 7.5v5.2L3 15.5v-4zm8.5-7.4L21 3v5.5h-9.5V4.3zm0 7.4H21V21l-9.5-1.7v-5.6z" />
    </svg>
  )
}

function IconApple({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M16.36 3.2c.95 1.1 1.55 2.62 1.45 4.15-.05.04-1.38.8-2.28 2.4-.95 1.7-.78 3.65.05 4.85-.9 1.2-2.2 2.05-3.35 2.08-1.15.03-1.52-.72-2.85-.72-1.32 0-1.75.7-2.85.75-1.14.05-2.5-1-3.45-2.2-1.88-2.4-1.65-5.85.45-8.95.95-1.35 2.35-2.25 3.7-2.28 1.15-.03 2.25.75 2.85.75.62 0 1.78-.93 3.2-.8.55.02 2.1.22 3.1 1.65l-.02.02zM13.05 2.05c.05-1.15.85-2.15 1.75-2.65.95-.55 2.25-.95 3.15-.98-.15 1.1-.65 2.15-1.55 2.8-.85.65-2.05 1.15-3.35 1.15v-.32z" />
    </svg>
  )
}

function DownloadTile({
  icon,
  platform,
  onClick,
}: {
  icon: ReactNode
  platform: string
  onClick?: () => void
}) {
  const shell =
    'flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-left transition hover:border-primary/35 hover:bg-white/[0.07] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50'

  const inner = (
    <>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5 text-gray-200">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-[11px] font-medium text-gray-400">
          Download for
        </span>
        <span className="block text-sm font-bold leading-snug text-white sm:text-base">
          {platform}
        </span>
      </span>
    </>
  )

  return (
    <button type="button" className={shell} onClick={onClick}>
      {inner}
    </button>
  )
}

type DownloadSectionProps = {
  reveal: ReturnType<typeof landingSectionReveal>
}

export function DownloadSection({ reveal }: DownloadSectionProps) {
  const [unsupportedFormatOpen, setUnsupportedFormatOpen] = useState(false)
  const [extensionLaunchOpen, setExtensionLaunchOpen] = useState(false)
  useBodyScrollLock(unsupportedFormatOpen || extensionLaunchOpen)

  return (
    <motion.section
      id="download"
      className="relative border-t border-white/5 bg-[#06060a] px-4 py-14 sm:px-6 sm:py-20 md:py-24"
      {...reveal}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:40px_40px] opacity-50" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[480px] w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-10 text-center sm:mb-14 md:mb-16">
          <h2 className="mb-3 text-2xl font-black tracking-tight text-white sm:mb-4 sm:text-3xl md:text-5xl">
            Download the{' '}
            <span className="bg-gradient-to-r from-primary via-violet-300 to-secondary bg-clip-text text-transparent">
              RYFT app
            </span>
          </h2>
          <p className="mx-auto max-w-2xl px-1 text-sm leading-relaxed text-gray-400 sm:px-0 sm:text-base md:text-lg">
          Grab the Windows app for limitless local TTS. Use the Extension to sync chapters directly from the browser.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-0">
          {/* Desktop column */}
          <div className="flex flex-col items-center lg:items-stretch lg:border-r lg:border-white/10 lg:pr-10 xl:pr-14">
            <h3 className="mb-8 text-center text-lg font-bold text-white md:text-xl">
              RYFT Desktop
            </h3>

            <div className="mb-10 flex w-full justify-center lg:justify-center">
              <div className="relative w-full max-w-[440px]">
                <div
                  className="absolute -inset-3 rounded-[1.75rem] bg-gradient-to-br from-primary/20 via-transparent to-secondary/15 blur-xl"
                  aria-hidden
                />
                <div className="relative rounded-2xl bg-gradient-to-br from-primary/45 via-white/[0.12] to-secondary/30 p-[1.5px] shadow-[0_24px_80px_-20px_rgba(0,0,0,0.8)]">
                  <div className="relative overflow-hidden rounded-[14px] bg-[#0B0B0F] ring-1 ring-inset ring-white/[0.08]">
                    <div className="relative h-[240px] overflow-hidden sm:h-[268px] md:h-[292px]">
                      <div className="absolute top-0 left-1/2 w-[760px] max-w-none -translate-x-1/2 origin-top scale-[0.50] sm:w-[780px] sm:scale-[0.53] md:scale-[0.55]">
                        <LocalLibraryPreview embed />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
              <DownloadTile
                icon={<IconWindows className="h-5 w-5" />}
                platform="Windows"
                onClick={() => setUnsupportedFormatOpen(true)}
              />
              <DownloadTile
                icon={<IconApple className="h-5 w-5" />}
                platform="macOS"
                onClick={() => setUnsupportedFormatOpen(true)}
              />
              <DownloadTile
                icon={<Terminal className="h-5 w-5" />}
                platform="Linux"
                onClick={() => setUnsupportedFormatOpen(true)}
              />
            </div>
          </div>

          {/* Extension / mobile-style column */}
          <div className="flex flex-col items-center lg:items-stretch lg:pl-10 xl:pl-14">
            <h3 className="mb-8 text-center text-lg font-bold text-white md:text-xl">
              RYFT Browser Extension
            </h3>

            <div className="mb-10 flex w-full justify-center lg:justify-center">
              <div className="relative w-full max-w-[440px]">
                <div
                  className="absolute -inset-3 rounded-[1.75rem] bg-gradient-to-br from-secondary/20 via-transparent to-primary/15 blur-xl"
                  aria-hidden
                />
                <div className="relative rounded-2xl bg-gradient-to-br from-secondary/40 via-white/[0.1] to-primary/35 p-[1.5px] shadow-[0_24px_80px_-20px_rgba(0,0,0,0.8)]">
                  <div className="relative overflow-hidden rounded-[14px] bg-[#0a0a0f] ring-1 ring-inset ring-white/[0.08]">
                    {/* Same geometry as RYFT Desktop preview so the scaled UI fills the frame */}
                    <div className="relative h-[240px] overflow-hidden sm:h-[268px] md:h-[292px]">
                      <div className="pointer-events-none absolute top-0 left-1/2 w-[760px] max-w-none -translate-x-1/2 origin-top scale-[0.50] sm:w-[780px] sm:scale-[0.53] md:scale-[0.55]">
                        <div className="h-[520px] w-[760px] sm:w-[780px]">
                          <HeroScrapeAnalyzeChapter loop />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <DownloadTile
                icon={<Puzzle className="h-5 w-5 text-primary" />}
                platform="Chrome Web Store"
                onClick={() => setExtensionLaunchOpen(true)}
              />
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {unsupportedFormatOpen ? (
          <motion.div
            key="unsupported-download"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            onClick={() => setUnsupportedFormatOpen(false)}
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
              aria-labelledby="unsupported-download-title"
            >
              <button
                type="button"
                onClick={() => setUnsupportedFormatOpen(false)}
                className="absolute right-4 top-4 text-gray-400 transition hover:text-white"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
              <h2
                id="unsupported-download-title"
                className="mb-3 pr-8 text-2xl font-bold text-white"
              >
                Not available yet
              </h2>
              <p className="text-sm leading-relaxed text-gray-400">
                This download format is not yet supported.
              </p>
              <button
                type="button"
                onClick={() => setUnsupportedFormatOpen(false)}
                className="mt-8 w-full rounded-xl bg-primary py-3 text-sm font-bold text-white transition hover:bg-violet-600"
              >
                OK
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {extensionLaunchOpen ? (
          <motion.div
            key="extension-launch"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            onClick={() => setExtensionLaunchOpen(false)}
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
              aria-labelledby="extension-launch-title"
            >
              <button
                type="button"
                onClick={() => setExtensionLaunchOpen(false)}
                className="absolute right-4 top-4 text-gray-400 transition hover:text-white"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
              <h2
                id="extension-launch-title"
                className="mb-3 pr-8 text-2xl font-bold text-white"
              >
                Chrome Web Store
              </h2>
              <p className="text-sm leading-relaxed text-gray-400">
                The extension will be available on launch.
              </p>
              <button
                type="button"
                onClick={() => setExtensionLaunchOpen(false)}
                className="mt-8 w-full rounded-xl bg-primary py-3 text-sm font-bold text-white transition hover:bg-violet-600"
              >
                OK
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.section>
  )
}
