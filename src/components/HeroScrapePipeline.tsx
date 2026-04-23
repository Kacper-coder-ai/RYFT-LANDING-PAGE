import {
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Loader2,
  Lock,
  MoreHorizontal,
  Music2,
  Play,
  Puzzle,
  RotateCw,
  Sparkles,
  Star,
} from 'lucide-react'

const SCRAPE_URL =
  'readfiction.io/novel/pride-prejudice/volume-1/chapter-1'
const SITE_BRAND = 'Paperstack'
const SCRAPE_LINES = [
  { label: 'h1', text: 'Chapter 1' },
  {
    label: 'p',
    text: 'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.',
  },
  {
    label: 'p',
    text: 'However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters.',
  },
  {
    label: 'p',
    text: '"My dear Mr. Bennet," said his lady to him one day, "have you heard that Netherfield Park is let at last?"',
  },
  {
    label: 'p',
    text: 'Mr. Bennet replied that he had not.',
  },
  {
    label: 'p',
    text: '"But it is," returned she; "for Mrs. Long has just been here, and she told me all about it." Mr. Bennet made no answer.',
  },
  {
    label: 'p',
    text: '"Do you not want to know who has taken it?" cried his wife impatiently. "You want to tell me, and I have no objection to hearing it." This was invitation enough.',
  },
  {
    label: 'p',
    text: '"Why, my dear, you must know, Mrs. Long says that Netherfield is taken by a young man of large fortune from the north of England; that he came down on Monday in a chaise and four to see the place, and was so much delighted with it, that he agreed with Mr. Morris immediately; that he is to take possession before Michaelmas, and some of his servants are to be in the house by the end of next week."',
  },
  {
    label: 'p',
    text: '"What is his name?" "Bingley." "Is he married or single?" "Oh! Single, my dear, to be sure! A single man of large fortune; four or five thousand a year. What a fine thing for our girls!"',
  },
  {
    label: 'p',
    text: '"How so? How can it affect them?" "My dear Mr. Bennet," replied his wife, "how can you be so tiresome! You must know that I am thinking of his marrying one of them." "Is that his design in settling here?"',
  },
  {
    label: 'p',
    text: '"Design! Nonsense, how can you talk so! But it is very likely that he may fall in love with one of them, and therefore you must visit him as soon as he comes." "I see no occasion for that."',
  },
  {
    label: 'p',
    text: '"You and the girls may go, or you may send them by themselves, which perhaps will still be better, for as you are as handsome as any of them, Mr. Bingley may like you the best of the party." "My dear, you flatter me. I certainly have had my share of beauty, but I do not pretend to be anything extraordinary now."',
  },
  {
    label: 'p',
    text: '"But consider your daughters: only think what an establishment it would be for one of them. Sir William and Lady Lucas are determined to go, merely on that account, for in general, you know, they visit no newcomers. Indeed you must go, for it will be impossible for us to visit him if you do not."',
  },
  {
    label: 'p',
    text: 'Mr. Bennet was so odd a mixture of quick parts, sarcastic humour, reserve, and caprice, that the experience of three-and-twenty years had been insufficient to make his wife understand his character. Her mind was less difficult to develop.',
  },
] as const

/** Smooth 0–1; gentler than cubic so the middle doesn’t “rush” the scroll. */
function easeInOutQuint(t: number): number {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2
}

/** Time each “scene” stays on screen (slideshow / video-style pacing). */
const SLIDE_MS = [11500, 2800, 7000, 8500] as const

const SLIDE_LABELS = [
  'Analyze Site',
  'Send into RYFT',
  'Edit in the overlay',
  'Generate Audio',
] as const

const SLIDE_COUNT = SLIDE_LABELS.length

const transition = { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const }

/**
 * First hero step only: browser + reader page + RYFT capture HUD + scan beam.
 * `loop` repeats the scrape for embeds; `loop={false}` matches one hero slide duration.
 */
export function HeroScrapeAnalyzeChapter({
  interactive = false,
  loop = false,
  className = '',
}: {
  interactive?: boolean
  loop?: boolean
  className?: string
}) {
  const [scrapeProgress, setScrapeProgress] = useState(0)
  const rafRef = useRef<number>(0)
  const articleScrollRef = useRef<HTMLDivElement>(null)
  const [scannerTopPct, setScannerTopPct] = useState(12)

  useEffect(() => {
    const duration = SLIDE_MS[0]
    const start = performance.now()

    const frame = (now: number) => {
      if (loop) {
        const elapsed = (now - start) % duration
        const linearT = elapsed / duration
        const easedT = easeInOutQuint(linearT)
        setScrapeProgress(easedT * 100)
      } else {
        const elapsed = now - start
        const linearT = Math.min(1, elapsed / duration)
        const easedT = easeInOutQuint(linearT)
        setScrapeProgress(easedT * 100)
        if (elapsed >= duration) {
          return
        }
      }
      rafRef.current = requestAnimationFrame(frame)
    }
    rafRef.current = requestAnimationFrame(frame)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [loop])

  const visibleLineCount = Math.min(
    SCRAPE_LINES.length,
    Math.max(1, Math.ceil((scrapeProgress / 100) * SCRAPE_LINES.length)),
  )

  useLayoutEffect(() => {
    const el = articleScrollRef.current
    if (!el) return
    const maxScroll = Math.max(0, el.scrollHeight - el.clientHeight)
    const t = scrapeProgress / 100
    el.scrollTop = t * maxScroll
    const ratio = maxScroll > 0 ? el.scrollTop / maxScroll : 0
    setScannerTopPct(8 + ratio * 84)
  }, [scrapeProgress])

  return (
    <div
      role="img"
      aria-label="Animation: extension scraping a web novel page"
      className={`flex h-full min-h-0 w-full min-w-0 flex-col bg-[#1c1c1e] ${interactive ? '' : 'pointer-events-none select-none'} ${className}`.trim()}
    >
      {/* Browser chrome — dark mode, closer to real Chromium */}
      <div className="flex shrink-0 items-center gap-2 border-b border-black/40 bg-[#2b2b2d] px-3 py-2.5 sm:px-4">
        <div className="flex gap-1.5 pr-1">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="hidden min-w-0 flex-1 items-center gap-1 sm:flex">
          <div className="flex h-7 items-center rounded-md bg-[#1e1e20] px-1">
            <button
              type="button"
              tabIndex={-1}
              className="rounded p-1 text-gray-500"
              aria-hidden
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              tabIndex={-1}
              className="rounded p-1 text-gray-600"
              aria-hidden
            >
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              tabIndex={-1}
              className="rounded p-1 text-gray-500"
              aria-hidden
            >
              <RotateCw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <div className="flex min-h-[34px] min-w-0 flex-1 items-center gap-2 rounded-lg border border-white/[0.06] bg-[#3a3a3c] px-3 py-1.5 sm:min-h-[36px]">
          <Lock className="h-3.5 w-3.5 shrink-0 text-emerald-400/90" />
          <span className="min-w-0 truncate font-mono text-[11px] text-gray-200 sm:text-xs">
            https://{SCRAPE_URL}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
          <button
            type="button"
            tabIndex={-1}
            className="rounded-md p-1.5 text-gray-400 hover:bg-white/5"
            aria-hidden
          >
            <Star className="h-4 w-4" />
          </button>
          <div className="relative flex h-8 items-center gap-1 rounded-md border border-primary/45 bg-[#2d2640] px-2 shadow-[0_0_20px_rgba(139,92,246,0.25)]">
            <Puzzle className="h-3.5 w-3.5 text-primary" />
            <span className="hidden text-[11px] font-bold text-primary sm:inline">
              RYFT
            </span>
          </div>
          <button
            type="button"
            tabIndex={-1}
            className="rounded-md p-1.5 text-gray-400 hover:bg-white/5"
            aria-hidden
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Tab strip */}
      <div className="flex shrink-0 items-end gap-0.5 border-b border-black/30 bg-[#252526] px-2 pt-1">
        <div className="flex max-w-[200px] items-center gap-2 rounded-t-md border border-b-0 border-white/[0.07] bg-[#1e1e1e] px-3 py-2 sm:max-w-[240px]">
          <div className="h-4 w-4 shrink-0 rounded-sm bg-gradient-to-br from-amber-400/80 to-orange-600/80" />
          <span className="truncate text-[11px] text-gray-300">
            {SCRAPE_LINES[0].text} · {SITE_BRAND}
          </span>
          <button
            type="button"
            tabIndex={-1}
            className="ml-auto text-gray-500 hover:text-gray-400"
            aria-hidden
          >
            <span className="text-xs leading-none">×</span>
          </button>
        </div>
        <div className="mb-0.5 flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-white/5">
          <span className="text-lg leading-none">+</span>
        </div>
      </div>

      {/* Site viewport — light “reader” page like many novel hosts */}
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-[#141416] p-2 sm:p-3">
        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-black/20 bg-[#faf8f4] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
          {/* Fake site header */}
          <header className="shrink-0 border-b border-stone-200/90 bg-white/90 px-4 py-3 sm:px-6">
            <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-800 font-serif text-sm font-bold text-[#faf8f4]">
                  P
                </div>
                <div>
                  <div className="font-serif text-base font-bold tracking-tight text-stone-900">
                    {SITE_BRAND}
                  </div>
                  <div className="text-[10px] text-stone-500">
                    Read fiction in your browser
                  </div>
                </div>
              </div>
              <nav className="hidden gap-4 text-[11px] font-medium text-stone-600 sm:flex">
                <span className="cursor-default hover:text-stone-900">
                  Browse
                </span>
                <span className="cursor-default hover:text-stone-900">
                  Library
                </span>
                <span className="cursor-default hover:text-stone-900">
                  Updates
                </span>
              </nav>
            </div>
          </header>

          {/* Article scrolls; scan overlay is a sibling so the cyan beam stays in view */}
          <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-b-lg">
            <div
              ref={articleScrollRef}
              className={`relative z-10 min-h-0 flex-1 ${
                interactive
                  ? 'overflow-y-auto scroll-auto'
                  : 'overflow-y-hidden'
              }`}
            >
              <article className="mx-auto max-w-xl px-5 pb-8 pt-8 sm:px-8 sm:pb-10 sm:pt-10">
                <p className="mb-3 font-sans text-[10px] font-medium tracking-wide text-stone-400 uppercase">
                  Classics · Regency Romance
                </p>
                <div className="mb-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <h1 className="font-serif text-2xl font-bold leading-tight text-stone-900 sm:text-[1.65rem]">
                    Pride and Prejudice
                  </h1>
                </div>
                <p className="mb-6 font-sans text-sm text-stone-600">
                  by{' '}
                  <span className="font-medium text-stone-800">Jane Austen</span>
                  <span className="text-stone-400"> · </span>
                  <span className="text-stone-500">
                    Vol. I · Est. 12 min read
                  </span>
                </p>

                <div className="mb-8 flex flex-wrap gap-3 border-b border-stone-200/80 pb-6 text-[11px] text-stone-500">
                  <span className="rounded-full bg-stone-100 px-2.5 py-0.5 font-medium text-stone-600">
                    Chapter {visibleLineCount > 0 ? '1' : '…'}
                  </span>
                  <span>~6.2k words on page</span>
                  <span className="flex items-center gap-1">
                    <Bookmark className="h-3 w-3" />
                    14.2k bookmarks
                  </span>
                </div>

                <div className="space-y-5 font-serif text-[0.9375rem] leading-[1.75] text-stone-800 sm:text-base sm:leading-[1.8]">
                  {SCRAPE_LINES.map((line, i) => {
                    const revealed = i < visibleLineCount
                    return (
                      <motion.div
                        key={`${line.text}-${i}`}
                        initial={false}
                        animate={{ opacity: revealed ? 1 : 0 }}
                        transition={{
                          duration: 0.22,
                          delay: revealed ? Math.min(i, 4) * 0.02 : 0,
                        }}
                        className={revealed ? '' : 'pointer-events-none'}
                        aria-hidden={!revealed}
                      >
                        {line.label === 'h1' ? (
                          <h2 className="mb-4 font-sans text-lg font-bold text-stone-900 sm:text-xl">
                            {line.text}
                          </h2>
                        ) : (
                          <p
                            className={`rounded-sm ${
                              line.label === 'p' &&
                              scrapeProgress > 28 &&
                              i === visibleLineCount - 1
                                ? 'bg-amber-100/90 ring-1 ring-amber-300/80'
                                : ''
                            }`}
                          >
                            {line.text}
                          </p>
                        )}
                      </motion.div>
                    )
                  })}
                </div>

                <div className="mt-10 border-t border-stone-200/90 pt-6 text-center text-[11px] text-stone-400">
                  <span className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1.5">
                    <span className="h-1 w-1 rounded-full bg-stone-400" />
                    Next: Chapter 2 — Mr. Bennet visits Mr. Bingley
                  </span>
                </div>
              </article>
            </div>

            <div className="pointer-events-none absolute inset-0 z-[15] overflow-hidden rounded-b-lg">
              <div className="absolute inset-0 z-[5] opacity-[0.04]">
                <div
                  className="h-full w-full"
                  style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
                    backgroundSize: '11px 11px',
                  }}
                />
              </div>
              <div
                className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-cyan-400/35 via-violet-400/20 to-transparent"
                style={{
                  animation: 'hero-scrape-sweep 3.2s linear infinite',
                }}
              />
              <div
                className="absolute top-0 bottom-0 left-0 w-[50%] max-w-[14rem] bg-gradient-to-r from-transparent via-white/55 to-transparent opacity-20"
                style={{
                  animation: 'hero-scrape-shimmer 2.8s ease-in-out infinite',
                }}
              />
              <div
                className="absolute right-4 left-4 z-20 h-[5px] -translate-y-1/2 rounded-full bg-gradient-to-r from-transparent via-cyan-200 to-transparent shadow-[0_0_18px_5px_rgba(34,211,238,0.85),0_0_36px_8px_rgba(139,92,246,0.4)]"
                style={{
                  top: `${scannerTopPct}%`,
                }}
              />
              <div
                className="absolute top-[14%] bottom-[20%] left-1.5 w-[2px] bg-gradient-to-b from-cyan-400/0 via-cyan-400/60 to-cyan-400/0"
                aria-hidden
              />
              <div
                className="absolute top-[14%] right-1.5 bottom-[20%] w-[2px] bg-gradient-to-b from-violet-500/0 via-violet-500/55 to-violet-500/0"
                aria-hidden
              />
            </div>
          </div>

          {/* Extension HUD — extraction */}
          <div className="pointer-events-none absolute bottom-3 right-3 z-[40] max-w-[min(100%,17rem)] rounded-lg border border-stone-300/90 bg-white/95 p-3 shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-sm sm:bottom-4 sm:right-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold tracking-wide text-stone-600 uppercase">
                RYFT · Capture
              </span>
              <Sparkles className="h-3.5 w-3.5 text-violet-500" />
            </div>
            <div className="mb-1.5 h-1.5 overflow-hidden rounded-full bg-stone-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-[width] duration-100 ease-linear"
                style={{ width: `${scrapeProgress}%` }}
              />
            </div>
            <p className="font-mono text-[10px] text-stone-500">
              {Math.round(scrapeProgress)}% · parsing article DOM
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

type HeroScrapePipelineProps = {
  children: ReactNode
  /** When false, the demo is view-only (no clicks, no manual slide jumps). */
  interactive?: boolean
}

export function HeroScrapePipeline({
  children,
  interactive = true,
}: HeroScrapePipelineProps) {
  const [slide, setSlide] = useState(0)

  useEffect(() => {
    const ms = SLIDE_MS[slide]
    const t = window.setTimeout(() => {
      setSlide((s) => (s + 1) % SLIDE_COUNT)
    }, ms)
    return () => window.clearTimeout(t)
  }, [slide])

  return (
    <div
      className={`flex min-h-0 w-full min-w-0 flex-1 flex-col ${
        interactive ? '' : 'select-none'
      }`}
    >
      <div
        className={`relative w-full flex-1 min-h-[min(22rem,46svh)] overflow-hidden bg-[#0a0a0f] sm:min-h-[min(28rem,52vh)] md:min-h-0 ${
          interactive ? '' : 'pointer-events-none'
        }`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {slide === 0 ? (
            <motion.div
              key="scrape"
              className="absolute inset-0 flex flex-col"
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={transition}
            >
              <HeroScrapeAnalyzeChapter interactive={interactive} loop={false} />
            </motion.div>
          ) : null}

          {slide === 1 ? (
            <motion.div
              key="transfer"
              role="img"
              aria-label="Animation: sending chapters to RYFT"
              className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#0c0c12] via-[#0a0a10] to-[#08080c] px-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={transition}
            >
              <div className="mb-8 flex items-center gap-3 sm:mb-10">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-lg sm:h-16 sm:w-16">
                  <Puzzle className="h-7 w-7 text-primary sm:h-8 sm:w-8" />
                </div>
                <div className="flex flex-col gap-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="h-1.5 w-16 rounded-full bg-primary/40 sm:w-24"
                      animate={{ opacity: [0.35, 1, 0.35], scaleX: [0.6, 1, 0.6] }}
                      transition={{
                        duration: 1.1,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: 'easeInOut',
                      }}
                    />
                  ))}
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/30 bg-primary/15 shadow-[0_0_40px_rgba(139,92,246,0.35)] sm:h-16 sm:w-16">
                  <Loader2 className="h-7 w-7 animate-spin text-primary sm:h-8 sm:w-8" />
                </div>
              </div>

              <motion.div
                className="mb-3 flex items-center gap-2 text-primary"
                animate={{ x: [0, 6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ArrowRight className="h-8 w-8 sm:h-10 sm:w-10" />
                <ArrowRight className="h-8 w-8 opacity-60 sm:h-10 sm:w-10" />
                <ArrowRight className="h-8 w-8 opacity-30 sm:h-10 sm:w-10" />
              </motion.div>

              <h3 className="mb-2 text-center text-xl font-black text-white sm:text-2xl md:text-3xl">
                Sending chapters to RYFT
              </h3>
              <p className="max-w-md text-center text-sm leading-relaxed text-gray-400 sm:text-base">
                Text from the analyzed page is piped straight into the desktop
                workflow—no copy-paste marathon.
              </p>
            </motion.div>
          ) : null}

          {slide === 2 ? (
            <motion.div
              key="editor"
              role="img"
              aria-label="Animation: chapter editor overlay"
              className={`absolute inset-0 flex flex-col bg-[#0B0B0F] ${
                interactive ? '' : 'pointer-events-none'
              }`}
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={transition}
            >
              <div className="relative z-[1] flex h-full min-h-0 flex-1 flex-col">
                <div className="flex shrink-0 items-center justify-center gap-2 border-b border-primary/20 bg-primary/10 py-2.5 text-[10px] font-bold tracking-widest text-primary uppercase sm:py-3 sm:text-xs">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  Chapters loaded — Chapter editor
                </div>
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                  {children}
                </div>
              </div>
            </motion.div>
          ) : null}

          {slide === 3 ? (
            <motion.div
              key="generate"
              role="img"
              aria-label="Animation: TTS audio generating in RYFT"
              className="absolute inset-0 flex flex-col bg-[#0B0B0F]"
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={transition}
            >
              <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-[#0a0a0c] px-4 py-3 sm:px-5 sm:py-3.5">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 sm:h-11 sm:w-11">
                    <Loader2
                      className="h-5 w-5 animate-spin text-primary sm:h-6 sm:w-6"
                      aria-hidden
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold tracking-wider text-gray-500 uppercase sm:text-[11px]">
                      RYFT engine
                    </p>
                    <p className="truncate text-sm font-bold text-white sm:text-base">
                      Generating audio
                    </p>
                  </div>
                </div>
                <span className="shrink-0 rounded-full border border-primary/35 bg-primary/10 px-2.5 py-1 text-[9px] font-bold tracking-wide text-primary animate-pulse sm:px-3 sm:text-[10px]">
                  SYNTHESIZING
                </span>
              </div>

              <div
                className={`flex min-h-0 flex-1 flex-col justify-center px-4 py-5 sm:px-6 sm:py-7 ${
                  interactive ? 'overflow-y-auto' : 'overflow-y-hidden'
                }`}
              >
                <div className="mx-auto w-full max-w-xl space-y-4 sm:max-w-2xl sm:space-y-5">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-xl sm:p-6">
                    <div className="mb-4 flex items-start justify-between gap-3 sm:mb-5">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold tracking-wider text-gray-500 uppercase sm:text-xs">
                          Active chapter
                        </p>
                        <p className="truncate text-lg font-bold text-white sm:text-xl">
                          Volume I, Chapter I
                        </p>
                        <p className="mt-0.5 text-sm text-gray-400 sm:text-base">
                          Pride and Prejudice · Heart (Female)
                        </p>
                      </div>
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 sm:h-12 sm:w-12">
                        <Play className="h-5 w-5 text-primary sm:h-6 sm:w-6" aria-hidden />
                      </div>
                    </div>
                    <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-gray-800 sm:h-2.5">
                      <div className="h-full rounded-full bg-gradient-to-r from-primary to-cyan-500 animate-[loadwidth_4s_ease-in-out_infinite]" />
                    </div>
                    <div className="flex justify-between font-mono text-[10px] text-gray-500 sm:text-xs">
                      <span>~8.4 min est. · WAV</span>
                      <span className="font-bold text-primary animate-pulse">Synthesizing…</span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
                    <div className="mb-3 flex items-center gap-2 sm:mb-3.5">
                      <Music2 className="h-4 w-4 text-gray-500 sm:h-5 sm:w-5" aria-hidden />
                      <p className="text-[10px] font-bold tracking-wider text-gray-500 uppercase sm:text-xs">
                        Output
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] sm:gap-2.5 sm:text-xs">
                      <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-gray-300 sm:px-3 sm:py-1.5">
                        Batch: Ch 1–12
                      </span>
                      <span className="rounded-lg border border-purple-500/30 bg-purple-500/15 px-2.5 py-1 font-bold text-purple-400 sm:px-3 sm:py-1.5">
                        WAV · 48 kHz
                      </span>
                      <span className="ml-auto flex items-center gap-1.5 text-[10px] font-bold text-primary sm:text-xs">
                        <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-primary" />
                        Processing
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="shrink-0 border-t border-white/10 bg-[#0a0a0c]/95 px-4 py-3 backdrop-blur-sm sm:px-6">
                <div className="mx-auto flex max-w-2xl items-center justify-center">
                  <div className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/25 sm:px-6 sm:py-3 sm:text-base">
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin sm:h-5 sm:w-5" aria-hidden />
                    Generate audio
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Slideshow / video-style step bar */}
      <div className="shrink-0 border-t border-white/10 bg-black/50 px-3 py-3 sm:px-5">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-1 sm:gap-2">
          {SLIDE_LABELS.map((label, i) => {
            const bar = (
              <>
                <span
                  className={`h-1.5 w-full max-w-[2.75rem] rounded-full transition sm:max-w-[3.5rem] md:max-w-[4.5rem] ${
                    slide === i
                      ? 'bg-gradient-to-r from-primary to-secondary'
                      : 'bg-white/10'
                  }`}
                />
                <span className="max-w-[4.5rem] text-center text-[8px] font-semibold leading-tight tracking-wide uppercase sm:max-w-none sm:text-[9px] md:text-[10px]">
                  {label}
                </span>
              </>
            )
            if (!interactive) {
              return (
                <div
                  key={label}
                  className={`flex min-w-0 flex-1 flex-col items-center gap-1.5 rounded-lg px-1 py-1 sm:gap-2 sm:px-2 ${
                    slide === i ? 'text-white' : 'text-gray-500'
                  }`}
                  aria-hidden
                >
                  {bar}
                </div>
              )
            }
            return (
              <button
                key={label}
                type="button"
                onClick={() => setSlide(i)}
                className={`flex min-w-0 flex-1 flex-col items-center gap-1.5 rounded-lg px-1 py-1 transition sm:gap-2 sm:px-2 ${
                  slide === i ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {bar}
              </button>
            )
          })}
        </div>
        <p className="mt-2 text-center text-[10px] text-gray-600 sm:text-xs">
          {interactive
            ? 'Auto-advances like a short demo — tap a step to jump.'
            : 'Auto-advances as a short demo.'}
        </p>
      </div>
    </div>
  )
}
