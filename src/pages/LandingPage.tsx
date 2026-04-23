import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  DownloadCloud,
  FileText,
  Layers,
  GripVertical,
  Infinity,
  Languages,
  LogOut,
  Mail,
  Mic2,
  Music,
  Music2,
  Play,
  Phone,
  Plus,
  Puzzle,
  ScanFace,
  Sparkles,
  Smartphone,
  Ticket,
  Trash2,
  Upload,
  Users,
  X,
} from 'lucide-react'
import {
  InterestModal,
  type InterestKind,
} from '../components/InterestModal'
import { ContactSupportModal } from '../components/ContactSupportModal'
import { SocialFooterLinks } from '../components/SocialFooterLinks'
import { DownloadSection } from '../components/DownloadSection'
import { HeroScrapePipeline } from '../components/HeroScrapePipeline'
import { LocalLibraryPreview } from '../components/LocalLibraryPreview'
import { VoiceMarquee } from '../components/VoiceMarquee'
import { useVoiceManifest } from '../hooks/useVoiceManifest'
import {
  LandingScrollProgress,
  landingSectionReveal,
} from '../components/LandingScrollChrome'
import type { User } from '@supabase/supabase-js'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { rememberLandingScrollPosition } from '../lib/landingScrollRestore'

function landingNavUserProfile(user: User) {
  const meta = user.user_metadata ?? {}
  const avatarUrl =
    (typeof meta.avatar_url === 'string' && meta.avatar_url) ||
    (typeof meta.picture === 'string' && meta.picture) ||
    null
  const displayName =
    (typeof meta.full_name === 'string' && meta.full_name) ||
    (typeof meta.name === 'string' && meta.name) ||
    null
  const initial = (
    displayName?.trim().charAt(0) || user.email?.trim().charAt(0) || '?'
  ).toUpperCase()
  return { avatarUrl, displayName, initial }
}

/**
 * Beta founding offer: one-time lifetime access, strictly 100 seats.
 * Set claimed equal to total (100) when sold out—the pricing section then
 * shows the subscription model instead.
 */
const BETA_LIFETIME_PRICE_USD = 49
const BETA_LIFETIME_SEATS_TOTAL = 100
const BETA_LIFETIME_SEATS_CLAIMED = 0

/**
 * Hide the "seats left" pill and progress bar until this many seats are sold.
 * Count starts from 100 remaining; at 0 claimed the UI reads 100/100—so we wait
 * until there is real scarcity (e.g. 8 sold → "92 / 100 left").
 */
const BETA_SEATS_SOCIAL_PROOF_THRESHOLD = 8

/** Static chapter list + previews — mirrors ChapterEditorOverlay (desktop). */
const HERO_EDITOR_BOOK_TITLE = 'Pride and Prejudice'

const HERO_CHAPTER_EDITOR_CHAPTERS: { id: string; title: string; preview: string }[] =
  [
    {
      id: 'h1',
      title: 'Volume I, Chapter I',
      preview: `It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.

However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters.

"My dear Mr. Bennet," said his lady to him one day, "have you heard that Netherfield Park is let at last?"

Mr. Bennet replied that he had not.

"But it is," returned she; "for Mrs. Long has just been here, and she told me all about it."

Mr. Bennet made no answer.

"Do you not want to know who has taken it?" cried his wife impatiently.

"You want to tell me, and I have no objection to hearing it."

This was invitation enough.

"Why, my dear, you must know, Mrs. Long says that Netherfield is taken by a young man of large fortune from the north of England; that he came down on Monday in a chaise and four to see the place, and was so much delighted with it, that he agreed with Mr. Morris immediately; that he is to take possession before Michaelmas, and some of his servants are to be in the house by the end of next week."

"What is his name?"

"Bingley."

"Is he married or single?"

"Oh! Single, my dear, to be sure! A single man of large fortune; four or five thousand a year. What a fine thing for our girls!"

"How so? How can it affect them?"

"My dear Mr. Bennet," replied his wife, "how can you be so tiresome! You must know that I am thinking of his marrying one of them."

"Is that his design in settling here?"

"Design! Nonsense, how can you talk so! But it is very likely that he may fall in love with one of them, and therefore you must visit him as soon as he comes."

"I see no occasion for that. You and the girls may go, or you may send them by themselves, which perhaps will still be better, for as you are as handsome as any of them, Mr. Bingley may like you the best of the party."

"My dear, you flatter me. I certainly have had my share of beauty, but I do not pretend to be anything extraordinary now. When a woman has five grown-up daughters, she ought to give over thinking of her own beauty."

"In such cases, a woman has not often much beauty to think of."

"But, my dear, you must indeed go and see Mr. Bingley when he comes into the neighbourhood."

"It is more than I engage for, I assure you."

"But consider your daughters: only think what an establishment it would be for one of them. Sir William and Lady Lucas are determined to go, merely on that account, for in general, you know, they visit no newcomers. Indeed you must go, for it will be impossible for us to visit him if you do not."

"You are over-scrupulous, surely. I dare say Mr. Bingley will be very glad to see you; and I will send a few lines by you to assure him of my hearty consent to his marrying whichever he chooses of the daughters; though I must throw in a good word for my little Lizzy."

"I desire you will do no such thing. Lizzy is not a bit better than the others; and I am sure she is not half so handsome as Jane, nor half so good-humoured as Lydia. But you are always giving her the preference."

"They have none of them much to recommend them," replied he; "they are all silly and ignorant like other girls; but Lizzy has something more of quickness than her sisters."

"Mr. Bennet, how can you abuse your own children in such a way? You take delight in vexing me. You have no compassion for my poor nerves."

"You mistake me, my dear. I have a high respect for your nerves. They are my old friends. I have heard you mention them with consideration these twenty years at least."

Mr. Bennet was so odd a mixture of quick parts, sarcastic humour, reserve, and caprice, that the experience of three-and-twenty years had been insufficient to make his wife understand his character. Her mind was less difficult to develop. She was a woman of mean understanding, little information, and uncertain temper. When she was discontented, she fancied herself nervous. The business of her life was to get her daughters married; its solace was visiting and news.`,
    },
    {
      id: 'h2',
      title: 'Volume I, Chapter II',
      preview: `Mr. Bennet was among the earliest of those who waited on Mr. Bingley. He had always intended to visit him, though to the last always assuring his wife that he should not go out; and on the first evening of his being in the neighbourhood he did go out.`,
    },
    {
      id: 'h3',
      title: 'Volume I, Chapter III',
      preview: `Not all that Mrs. Bennet, however, with the assistance of her five daughters, could ask on the subject, was sufficient to draw from her husband any satisfactory description of Mr. Bingley.`,
    },
    {
      id: 'h4',
      title: 'Volume I, Chapter IV',
      preview: `When Jane and Elizabeth were alone, the former, who had been cautious in her praise of Mr. Bingley before, expressed to her sister how very much she admired him.`,
    },
    {
      id: 'h5',
      title: 'Volume I, Chapter V',
      preview: `Within a short walk of Longbourn lived a family with whom the Bennets were particularly intimate. Sir William Lucas had been formerly in trade in Meryton, where he had made a tolerable fortune.`,
    },
    {
      id: 'h6',
      title: 'Volume I, Chapter VI',
      preview: `The ladies of Longbourn soon waited on those of Netherfield. The visit was soon returned in due form. Miss Bennet's pleasing manners grew on the goodwill of Mrs. Hurst and Miss Bingley.`,
    },
  ]

function countWords(text: string): number {
  if (!text.trim()) return 0
  return text.trim().split(/\s+/).filter(Boolean).length
}

function HeroChapterEditorPreview({
  activeIndex,
  onSelectChapter,
  compact = false,
  interactive = true,
}: {
  activeIndex: number
  onSelectChapter: (index: number) => void
  /** Tighter layout so the hero slideshow can show the full overlay including the generate dock. */
  compact?: boolean
  /** When false, demo is display-only (hero pipeline). */
  interactive?: boolean
}) {
  const active = HERO_CHAPTER_EDITOR_CHAPTERS[activeIndex]
  const totalWords = HERO_CHAPTER_EDITOR_CHAPTERS.reduce(
    (sum, ch) => sum + countWords(ch.preview),
    0,
  )

  return (
    <div
      className={`flex w-full min-w-0 flex-col md:flex-row ${
        compact
          ? 'h-full min-h-0 flex-1'
          : 'min-h-[340px] flex-1 md:min-h-[380px]'
      } ${interactive ? '' : 'pointer-events-none select-none'}`}
    >
      {/* Left — chapter list (ChapterEditorOverlay sidebar) */}
      <div
        className={`glass-panel flex h-full min-h-0 w-full shrink-0 flex-col border-b border-white/10 shadow-2xl md:border-r md:border-b-0 ${
          compact ? 'md:w-[220px] lg:w-60' : 'md:w-72'
        }`}
      >
        <div
          className={`flex items-center justify-between border-b border-white/5 bg-white/5 ${
            compact ? 'px-3 py-2.5' : 'px-4 py-4'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600">
              <div className="flex h-4 items-center gap-[3px]">
                <div
                  className="w-1 animate-[equalizer_1s_ease-in-out_infinite] rounded-full bg-white"
                  style={{ animationDelay: '0ms' }}
                />
                <div
                  className="w-1 animate-[equalizer_1.2s_ease-in-out_infinite] rounded-full bg-white"
                  style={{ animationDelay: '200ms' }}
                />
                <div
                  className="w-1 animate-[equalizer_0.8s_ease-in-out_infinite] rounded-full bg-white"
                  style={{ animationDelay: '400ms' }}
                />
                <div
                  className="w-1 animate-[equalizer_1.1s_ease-in-out_infinite] rounded-full bg-white"
                  style={{ animationDelay: '100ms' }}
                />
              </div>
            </div>
            <span className="text-sm font-black tracking-widest text-white">
              RYFT
            </span>
          </div>
          <button
            type="button"
            tabIndex={-1}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
            aria-hidden
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div
          className={`min-h-0 flex-1 overflow-y-auto py-2 pr-1 pl-2 ${
            compact ? '' : 'max-h-[200px] py-3 md:max-h-[min(320px,42vh)]'
          }`}
        >
          {HERO_CHAPTER_EDITOR_CHAPTERS.map((chapter, index) => (
            <button
              key={chapter.id}
              type="button"
              tabIndex={interactive ? 0 : -1}
              onClick={
                interactive ? () => onSelectChapter(index) : undefined
              }
              className={`mb-2 w-full rounded-xl text-left transition-all ${
                compact ? 'px-2 py-1.5' : 'px-3 py-2.5'
              } ${
                index === activeIndex
                  ? 'glass-panel border-l-4 border-purple-500 text-white'
                  : 'border-l-4 border-transparent bg-white/5 text-gray-200 hover:bg-white/10'
              }`}
            >
              <div
                className={`relative z-10 flex ${
                  compact ? 'items-start gap-2' : 'items-center gap-3'
                }`}
              >
                <div
                  className="cursor-move shrink-0 text-gray-400"
                  onClick={(e) => e.stopPropagation()}
                  aria-hidden
                >
                  <GripVertical className={compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
                </div>
                <div
                  className={`flex shrink-0 items-center justify-center rounded-xl ${
                    compact ? 'h-8 w-8' : 'h-10 w-10'
                  } ${
                    index === activeIndex
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'bg-white/10 text-gray-300'
                  }`}
                >
                  <FileText className={compact ? 'h-4 w-4' : 'h-5 w-5'} />
                </div>
                <div className="min-w-0 flex-1">
                  <div
                    className={`font-semibold ${
                      compact
                        ? 'line-clamp-2 text-left text-[11px] leading-snug sm:text-xs'
                        : 'truncate text-sm'
                    } ${
                      index === activeIndex ? 'text-white' : 'text-gray-200'
                    }`}
                  >
                    {chapter.title}
                  </div>
                  <div
                    className={`mt-0.5 font-medium ${
                      compact ? 'text-[10px]' : 'text-xs'
                    } ${
                      index === activeIndex ? 'text-white/80' : 'text-gray-400'
                    }`}
                  >
                    Chapter {index + 1}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div
          className={`shrink-0 border-t border-white/10 ${
            compact ? 'grid grid-cols-2 gap-2 p-2' : 'space-y-2 p-3'
          }`}
        >
          <div
            className={`flex w-full items-center rounded-xl border border-white/10 bg-white/5 font-medium text-gray-300 ${
              compact
                ? 'gap-2 px-2 py-2 text-[10px] leading-tight sm:text-[11px]'
                : 'gap-3 px-3 py-2.5 text-sm'
            }`}
          >
            <div
              className={`flex shrink-0 items-center justify-center rounded-lg bg-purple-500/20 ${
                compact ? 'h-7 w-7' : 'h-8 w-8'
              }`}
            >
              <Plus
                className={`text-purple-400 ${compact ? 'h-3.5 w-3.5' : 'h-4 w-4'}`}
              />
            </div>
            <span className="min-w-0">{compact ? 'Add chapter' : 'Add New Chapter'}</span>
          </div>
          <div
            className={`flex w-full items-center rounded-xl border border-white/10 bg-white/5 font-medium text-gray-300 ${
              compact
                ? 'gap-2 px-2 py-2 text-[10px] leading-tight sm:text-[11px]'
                : 'gap-3 px-3 py-2.5 text-sm'
            }`}
          >
            <div
              className={`flex shrink-0 items-center justify-center rounded-lg bg-blue-500/20 ${
                compact ? 'h-7 w-7' : 'h-8 w-8'
              }`}
            >
              <Upload
                className={`text-blue-400 ${compact ? 'h-3.5 w-3.5' : 'h-4 w-4'}`}
              />
            </div>
            <span className="min-w-0">{compact ? 'Upload' : 'Upload Files'}</span>
          </div>
        </div>
      </div>

      {/* Right — editor panel */}
      <div
        className={`flex min-h-0 min-w-0 flex-1 flex-col bg-[#0B0B0F] ${
          compact ? 'h-full' : ''
        }`}
      >
        <div
          className={`glass-panel flex shrink-0 items-center gap-3 border-b border-white/5 px-4 md:gap-4 md:px-6 ${
            compact ? 'h-12 min-h-12' : 'h-[4.25rem]'
          }`}
        >
          {/* Three equal columns — same balance as desktop overlay (title | File Preview | close) */}
          <div
            className={`min-w-0 flex-[1_1_0%] truncate font-bold text-white ${
              compact ? 'text-sm md:text-base' : 'text-base md:text-xl'
            }`}
          >
            {HERO_EDITOR_BOOK_TITLE}
          </div>
          <div className="flex min-w-0 flex-[1_1_0%] items-center justify-center px-1">
            <span
              className={`whitespace-nowrap tracking-wide text-gray-400 ${
                compact ? 'text-xs md:text-sm' : 'text-sm md:text-[0.9375rem]'
              }`}
            >
              File Preview
            </span>
          </div>
          <div className="flex flex-[1_1_0%] items-center justify-end">
            <button
              type="button"
              tabIndex={-1}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition hover:bg-white/5"
              aria-hidden
            >
              <X className="h-5 w-5 text-red-400/90" />
            </button>
          </div>
        </div>

        <div
          className={`custom-scrollbar-editor flex min-h-0 flex-1 flex-col overflow-y-auto ${
            compact ? 'p-4 md:p-5' : 'p-4 md:p-6'
          }`}
        >
          {active ? (
            <div
              className={`mx-auto flex w-full max-w-3xl flex-col ${
                compact ? 'min-h-0 flex-1 space-y-3' : 'space-y-4'
              }`}
            >
              <h3
                className={`shrink-0 font-bold leading-tight text-white ${
                  compact ? 'text-lg md:text-xl' : 'text-xl md:text-2xl'
                }`}
              >
                {active.title}
              </h3>
              <div
                className={`shrink-0 font-medium text-gray-300 ${
                  compact ? 'text-xs' : 'text-sm'
                }`}
              >
                {countWords(active.preview).toLocaleString()} words
              </div>
              <p
                className={`leading-relaxed text-gray-300 font-serif whitespace-pre-wrap ${
                  compact ? 'text-sm md:text-[0.9375rem]' : 'text-base'
                }`}
              >
                {active.preview}
              </p>
            </div>
          ) : null}
        </div>

        <div
          className={`glass-panel shrink-0 border-t border-white/10 ${
            compact ? 'px-3 py-2 md:px-4' : 'px-4 py-2.5 md:px-6'
          }`}
        >
          <div
            className={`font-medium text-gray-300 ${
              compact ? 'text-[11px] md:text-xs' : 'text-xs md:text-sm'
            }`}
          >
            Total: {totalWords.toLocaleString()} words •{' '}
            {HERO_CHAPTER_EDITOR_CHAPTERS.length} chapters
          </div>
        </div>

        {/* Floating command dock — voice & format live here in ChapterEditorOverlay (not RightSidebar) */}
        <div
          className={`flex shrink-0 flex-wrap items-center justify-center border-t border-white/10 bg-[#0a0a0c]/95 backdrop-blur-sm ${
            compact
              ? 'gap-2 px-3 py-2.5 md:gap-3 md:px-4'
              : 'gap-2 px-2 py-2.5 md:gap-4 md:px-4 md:py-3'
          }`}
        >
          <div className="flex items-center rounded-xl bg-white/5 p-1">
            <span className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-white shadow-sm">
              <Music className="h-3.5 w-3.5" />
              Individual
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-400">
              <Music2 className="h-3.5 w-3.5" />
              Combined
            </span>
          </div>
          <div className="hidden h-6 w-px bg-white/20 sm:block" />
          <button
            type="button"
            tabIndex={-1}
            className="flex max-w-[11rem] items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-300"
            aria-hidden
          >
            <span className="truncate text-left">Heart (Female)</span>
            <ChevronDown className="h-3 w-3 shrink-0 text-gray-400" />
          </button>
          <div className="hidden h-6 w-px bg-white/20 sm:block" />
          <button
            type="button"
            tabIndex={-1}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-300"
            aria-hidden
          >
            <span className="rounded border border-purple-500/30 bg-purple-500/20 px-1.5 py-0.5 text-[9px] font-bold text-purple-400">
              WAV
            </span>
            <ChevronDown className="h-3 w-3 text-gray-400" />
          </button>
          <div className="hidden h-6 w-px bg-white/20 md:block" />
          <div className="flex w-full items-center justify-center md:w-auto">
            <span
              className={`flex items-center rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 font-bold text-white shadow-lg shadow-purple-500/20 ${
                compact
                  ? 'gap-1.5 px-3 py-1.5 text-xs'
                  : 'gap-2 px-4 py-2 text-sm'
              }`}
            >
              <Play className={compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
              Generate audio
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function LandingPage() {
  const { user, loading: authLoading, signOut } = useAuth()
  const manifestVoices = useVoiceManifest()
  const castVoiceRomeo = manifestVoices[0]?.name ?? 'Voice 1'
  const castVoiceJuliet = manifestVoices[1]?.name ?? 'Voice 2'

  const reducedMotion = useReducedMotion()
  const sectionReveal = landingSectionReveal(reducedMotion)
  const { scrollY } = useScroll()
  const heroBlobPrimaryY = useTransform(scrollY, [0, 520], [0, reducedMotion ? 0 : 90])
  const heroBlobSecondaryY = useTransform(scrollY, [0, 520], [0, reducedMotion ? 0 : -65])
  const unlimitedOrbLeftY = useTransform(scrollY, [400, 1200], [0, reducedMotion ? 0 : 40])
  const unlimitedOrbRightY = useTransform(scrollY, [400, 1200], [0, reducedMotion ? 0 : -32])

  const [showModal, setShowModal] = useState(false)
  const [modalKind, setModalKind] = useState<InterestKind>('login')
  const [subscriptionBilling, setSubscriptionBilling] = useState<
    'monthly' | 'yearly'
  >('monthly')
  const [scannerPosition, setScannerPosition] = useState(0)
  const [showJuliet, setShowJuliet] = useState(false)
  const [showRomeo, setShowRomeo] = useState(false)
  const [heroEditorChapterIndex, setHeroEditorChapterIndex] = useState(0)
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const accountMenuRef = useRef<HTMLDivElement>(null)
  const [showContactSupportModal, setShowContactSupportModal] = useState(false)

  useEffect(() => {
    document.body.classList.add('landing-page')
    return () => {
      document.body.classList.remove('landing-page')
    }
  }, [])

  useEffect(() => {
    const runScan = () => {
      setScannerPosition(0)
      setShowRomeo(false)
      setShowJuliet(false)

      setTimeout(() => {
        setScannerPosition(25)
      }, 500)

      setTimeout(() => {
        setShowRomeo(true)
        setScannerPosition(50)
      }, 1500)

      setTimeout(() => {
        setShowJuliet(true)
        setScannerPosition(100)
      }, 3000)

      setTimeout(() => {
        setScannerPosition(0)
      }, 4000)
    }

    runScan()
    const interval = setInterval(runScan, 6000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!accountMenuOpen) return
    const onPointerDown = (e: MouseEvent) => {
      const el = accountMenuRef.current
      if (el && !el.contains(e.target as Node)) {
        setAccountMenuOpen(false)
      }
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAccountMenuOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [accountMenuOpen])

  const openModal = (kind: InterestKind) => {
    setModalKind(kind)
    setShowModal(true)
  }

  const scrollLandingToTop = useCallback(() => {
    setAccountMenuOpen(false)
    window.scrollTo({
      top: 0,
      behavior: reducedMotion ? 'auto' : 'smooth',
    })
  }, [reducedMotion])

  const scrollToSection = useCallback(
    (e: ReactMouseEvent<HTMLButtonElement>, id: string) => {
      e.preventDefault()
      document.getElementById(id)?.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
      })
    },
    [reducedMotion],
  )

  const betaLifetimeSoldOut =
    BETA_LIFETIME_SEATS_CLAIMED >= BETA_LIFETIME_SEATS_TOTAL
  const betaLifetimeSeatsRemaining = Math.max(
    0,
    BETA_LIFETIME_SEATS_TOTAL - BETA_LIFETIME_SEATS_CLAIMED,
  )
  const betaLifetimeFillPercent =
    BETA_LIFETIME_SEATS_TOTAL > 0
      ? Math.min(
          100,
          (BETA_LIFETIME_SEATS_CLAIMED / BETA_LIFETIME_SEATS_TOTAL) * 100,
        )
      : 0

  const showSeatSocialProof =
    BETA_LIFETIME_SEATS_CLAIMED >= BETA_SEATS_SOCIAL_PROOF_THRESHOLD

  const navUser = user ? landingNavUserProfile(user) : null

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0B0B0F] text-white">
      <InterestModal
        isOpen={showModal}
        kind={modalKind}
        onClose={() => setShowModal(false)}
        subscriptionBilling={subscriptionBilling}
      />
      <ContactSupportModal
        isOpen={showContactSupportModal}
        onClose={() => setShowContactSupportModal(false)}
        defaultEmail={user?.email ?? ''}
      />

      <LandingScrollProgress />

      <nav className="glass fixed top-0 z-50 w-full transition-all duration-300 pt-[env(safe-area-inset-top,0px)]">
        <div className="mx-auto flex min-h-[3.25rem] max-w-7xl items-center justify-between gap-2 px-4 py-2 sm:h-20 sm:gap-3 sm:px-6 sm:py-0">
          <button
            type="button"
            onClick={scrollLandingToTop}
            aria-label="Scroll to top"
            className="group flex min-w-0 cursor-pointer items-center gap-2 border-0 bg-transparent p-0 text-lg font-black tracking-widest text-inherit transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F] min-[400px]:gap-3 min-[400px]:text-xl sm:text-2xl"
          >
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-primary to-secondary shadow-lg transition duration-300 group-hover:shadow-violet-500/50">
              <div className="flex h-5 items-center gap-[3px]">
                <div
                  className="w-1 animate-[equalizer_1s_ease-in-out_infinite] rounded-full bg-white"
                  style={{ animationDelay: '0ms' }}
                />
                <div
                  className="w-1 animate-[equalizer_1.2s_ease-in-out_infinite] rounded-full bg-white"
                  style={{ animationDelay: '200ms' }}
                />
                <div
                  className="w-1 animate-[equalizer_0.8s_ease-in-out_infinite] rounded-full bg-white"
                  style={{ animationDelay: '400ms' }}
                />
                <div
                  className="w-1 animate-[equalizer_1.1s_ease-in-out_infinite] rounded-full bg-white"
                  style={{ animationDelay: '100ms' }}
                />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
            </div>
            <span className="truncate transition duration-300 group-hover:text-white">
              RYFT
            </span>
          </button>

          <div className="hidden gap-8 text-sm font-medium text-gray-400 md:flex">
            <button
              type="button"
              onClick={(e) => scrollToSection(e, 'voices')}
              className="cursor-pointer border-0 bg-transparent p-0 font-medium text-gray-400 transition hover:text-white"
            >
              Voices
            </button>
            <button
              type="button"
              onClick={(e) => scrollToSection(e, 'unlimited-tts')}
              className="cursor-pointer border-0 bg-transparent p-0 font-medium text-gray-400 transition hover:text-white"
            >
              Features
            </button>
            <button
              type="button"
              onClick={(e) => scrollToSection(e, 'pricing')}
              className="cursor-pointer border-0 bg-transparent p-0 font-medium text-gray-400 transition hover:text-white"
            >
              Pricing
            </button>
            <button
              type="button"
              onClick={() => setShowContactSupportModal(true)}
              className="cursor-pointer border-0 bg-transparent p-0 text-left font-medium transition hover:text-white"
            >
              Support
            </button>
          </div>

          <div className="flex min-w-0 shrink-0 items-center gap-1.5 sm:gap-4">
            <button
              type="button"
              onClick={() => setShowContactSupportModal(true)}
              className="shrink-0 text-xs font-medium text-gray-400 transition hover:text-white sm:text-sm md:hidden"
            >
              Support
            </button>
            {user && navUser ? (
              <div className="relative shrink-0" ref={accountMenuRef}>
                <button
                  type="button"
                  onClick={() => setAccountMenuOpen((o) => !o)}
                  aria-expanded={accountMenuOpen}
                  aria-haspopup="menu"
                  aria-label="Account menu"
                  className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/10 ring-2 ring-transparent transition hover:border-white/25 hover:bg-white/15 focus:outline-none focus-visible:ring-primary/50"
                >
                  {navUser.avatarUrl ? (
                    <img
                      src={navUser.avatarUrl}
                      alt=""
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="text-sm font-bold text-white">
                      {navUser.initial}
                    </span>
                  )}
                </button>
                {accountMenuOpen ? (
                  <div
                    className="absolute right-0 z-[60] mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-[#14141c]/95 py-1 shadow-xl shadow-black/40 backdrop-blur-md"
                    role="menu"
                  >
                    {navUser.displayName ? (
                      <p className="border-b border-white/10 px-3 py-2 text-sm font-medium text-white">
                        {navUser.displayName}
                      </p>
                    ) : null}
                    <button
                      type="button"
                      role="menuitem"
                      className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-gray-300 transition hover:bg-white/10 hover:text-white"
                      onClick={() => {
                        setAccountMenuOpen(false)
                        setShowContactSupportModal(true)
                      }}
                    >
                      <Mail className="h-4 w-4 shrink-0 opacity-70" />
                      Contact support
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setAccountMenuOpen(false)
                        void signOut()
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-gray-300 transition hover:bg-white/10 hover:text-white"
                    >
                      <LogOut className="h-4 w-4 shrink-0 opacity-70" />
                      Sign out
                    </button>
                  </div>
                ) : null}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => openModal('login')}
                disabled={authLoading}
                className="shrink-0 px-2 py-1.5 text-xs font-medium text-gray-300 transition hover:text-white disabled:opacity-50 sm:px-3 sm:py-2 sm:text-sm md:px-4"
              >
                Login
              </button>
            )}
            <button
              type="button"
              onClick={(e) => scrollToSection(e, 'download')}
              aria-label="Download browser extension"
              className="flex cursor-pointer items-center gap-1.5 rounded-full border border-white/10 bg-primary px-3 py-2 text-xs font-bold text-white shadow-lg shadow-violet-500/20 transition active:scale-[0.98] sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm md:hover:-translate-y-0.5 md:hover:bg-violet-600"
            >
              <Puzzle className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
              <span className="hidden min-[360px]:inline">Extension</span>
            </button>
          </div>
        </div>
      </nav>

      <section className="relative overflow-x-hidden px-4 pb-12 pt-[calc(5rem+env(safe-area-inset-top,0px))] sm:px-6 sm:pb-14 sm:pt-24">
        <motion.div
          className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[600px] w-[1000px] -translate-x-1/2 animate-pulse-slow rounded-full bg-primary/10 blur-[120px]"
          style={{ y: heroBlobPrimaryY }}
        />
        <motion.div
          className="pointer-events-none absolute right-0 bottom-0 -z-10 h-[600px] w-[800px] rounded-full bg-secondary/5 blur-[100px]"
          style={{ y: heroBlobSecondaryY }}
        />

        <div className="relative z-10 mx-auto max-w-7xl text-center">
          <h1 className="mb-5 text-[clamp(2rem,9.2vw,3.45rem)] leading-[1.02] font-black tracking-tighter sm:mb-6 sm:text-5xl sm:leading-none md:text-8xl">
            Text{' '}
            <span className="inline-block -translate-y-1 transform text-gray-600">
              →
            </span>{' '}
            <span className="glow-text animate-gradient-x bg-gradient-to-r from-primary via-white to-secondary bg-clip-text text-transparent">
              Audio
            </span>
          </h1>

          <p className="mx-auto mb-6 max-w-3xl px-1 text-base leading-relaxed font-medium text-gray-300 sm:px-0 sm:text-lg md:text-2xl">
            Turn any webnovel or text into a{' '}
            <span className="border-b border-primary/50 pb-0.5 text-white">
              high quality audiobook
            </span>
            .
          </p>

          <div className="perspective-1000 relative mx-auto max-w-5xl">
            <div className="relative flex min-h-[min(26rem,72svh)] flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0B0B0F] shadow-2xl shadow-black/40 sm:min-h-[min(30rem,78svh)] md:min-h-[min(42rem,85vh)] md:rounded-[2rem] md:transition-transform md:duration-500 md:hover:-translate-y-2 md:hover:scale-[1.01]">
              {/* ChapterEditorOverlay-style preview: chapter list + editor + bottom dock (voice/format live in dock, not RightSidebar) */}
              <div className="relative flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden border-b border-white/5 bg-white/[0.02] md:min-h-[min(38rem,70vh)] md:border-b-0">
                <p className="shrink-0 border-b border-white/5 px-4 py-2 text-center text-[10px] font-medium tracking-wide text-gray-500 uppercase md:text-left md:px-5">
                  Demo · Analyze Site → send → editor → generate
                </p>
                <HeroScrapePipeline interactive={false}>
                  <HeroChapterEditorPreview
                    compact
                    interactive={false}
                    activeIndex={heroEditorChapterIndex}
                    onSelectChapter={setHeroEditorChapterIndex}
                  />
                </HeroScrapePipeline>
              </div>
            </div>

            <div className="relative z-20 -mt-2 flex justify-center px-2 sm:-mt-3 sm:px-0">
              <button
                type="button"
                onClick={(e) => scrollToSection(e, 'download')}
                className="group inline-flex w-full max-w-sm cursor-pointer items-center justify-center gap-2 rounded-full border border-primary/25 bg-primary/80 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-black/35 transition duration-500 sm:w-auto sm:max-w-none sm:px-8 sm:py-3 sm:text-base md:hover:-translate-y-0.5 md:hover:border-primary/40 md:hover:bg-primary"
              >
                <DownloadCloud className="h-5 w-5 shrink-0 text-white transition duration-500 group-hover:-translate-y-0.5" />
                Download the app
              </button>
            </div>
          </div>
        </div>
      </section>

      <motion.section
        id="voices"
        className="relative overflow-x-hidden border-y border-white/5 bg-black/50 py-10 sm:py-14"
        {...sectionReveal}
      >
        <div className="relative z-10 mb-8 px-4 text-center sm:mb-10 sm:px-6">
          <h2 className="mb-3 text-2xl font-black sm:mb-4 sm:text-3xl md:text-5xl">
            Listen to Any Voice.
          </h2>
          <div className="inline-flex max-w-[95vw] flex-wrap items-center justify-center gap-2 text-xs font-semibold tracking-widest text-gray-400 uppercase sm:text-sm">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span>Official Community Presets</span>
          </div>
        </div>

        <VoiceMarquee />
      </motion.section>

      <motion.section
        id="unlimited-tts"
        className="relative overflow-x-hidden overflow-y-visible border-y border-white/5 bg-[#08080c] py-12 sm:py-14 md:py-16"
        {...sectionReveal}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:48px_48px] opacity-60"
          style={{
            maskImage:
              'radial-gradient(ellipse 75% 70% at 50% 45%, #000 55%, transparent 100%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 75% 70% at 50% 45%, #000 55%, transparent 100%)',
          }}
        />
        <motion.div
          className="pointer-events-none absolute top-1/2 left-0 -z-10 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-primary/15 blur-[100px] unlimited-tts-orb-a"
          style={{ y: unlimitedOrbLeftY }}
        />
        <motion.div
          className="pointer-events-none absolute top-1/2 right-0 -z-10 h-[380px] w-[380px] -translate-y-1/2 rounded-full bg-violet-600/10 blur-[90px] unlimited-tts-orb-b"
          style={{ y: unlimitedOrbRightY }}
        />
        <div className="pointer-events-none absolute top-[18%] right-[12%] -z-10 h-32 w-32 rounded-full bg-secondary/20 blur-[48px] unlimited-tts-orb-a" />
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[min(95vw,24rem)] w-[min(95vw,24rem)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-primary/15 animate-[spin_55s_linear_infinite]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[min(78vw,19rem)] w-[min(78vw,19rem)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.04] animate-[spin_40s_linear_infinite_reverse]"
          aria-hidden
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 text-center md:mb-10">
            <div className="unlimited-tts-intro mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-bold tracking-widest text-primary uppercase shadow-[0_0_24px_rgba(139,92,246,0.2)]">
              <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-primary/20">
                <Infinity className="h-3.5 w-3.5 animate-pulse" />
              </span>
              Unlimited synthesis
            </div>

            <div
              className="unlimited-tts-intro-delay mx-auto mb-5 flex h-16 max-w-lg items-end justify-center gap-[3px] sm:gap-1 md:max-w-2xl md:gap-1.5"
              aria-hidden
            >
              {Array.from({ length: 24 }, (_, i) => (
                <div
                  key={i}
                  className="min-h-[6px] w-1 rounded-full bg-gradient-to-t from-primary to-secondary/80 sm:w-1.5"
                  style={{
                    height: `${14 + ((i * 7) % 44)}px`,
                    animation: `equalizer ${0.75 + (i % 6) * 0.11}s ease-in-out infinite`,
                    animationDelay: `${i * 42}ms`,
                  }}
                />
              ))}
            </div>

            <h2 className="unlimited-tts-intro-delay mb-3 text-2xl font-black sm:text-3xl md:text-5xl">
              Generate{' '}
              <span className="glow-text animate-gradient-x bg-gradient-to-r from-primary via-violet-300 to-secondary bg-clip-text text-transparent">
                infinite TTS audio.
              </span>
            </h2>
            <p className="unlimited-tts-intro-body mx-auto max-w-2xl px-1 text-base leading-relaxed text-gray-400 sm:px-0 sm:text-lg">
              Turn as much text as you want into
              audio. No Limits.
            </p>
          </div>

          {/* Full-bleed on small screens so the library mock isn’t squeezed by px-4 */}
          <div className="-mx-4 w-[calc(100%+2rem)] max-w-[100vw] sm:mx-0 sm:w-full sm:max-w-none">
            <LocalLibraryPreview />
          </div>
        </div>
      </motion.section>

      <motion.section
        id="features"
        className="relative overflow-x-hidden px-4 py-14 sm:px-6 sm:py-20"
        {...sectionReveal}
      >
        <div className="pointer-events-none absolute top-1/2 right-0 -z-10 h-[800px] w-[800px] -translate-y-1/2 rounded-full bg-gradient-to-b from-primary/10 to-transparent blur-[120px]" />

        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div className="order-1 lg:order-1">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-xs font-bold tracking-widest text-green-400 uppercase">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
              100% Offline Ready
            </div>

            <h2 className="mb-4 text-3xl leading-tight font-black sm:text-4xl md:text-6xl">
              Batch Export <br />
              <span className="bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
                in any format.
              </span>
            </h2>

            <p className="mb-5 text-base leading-relaxed text-gray-400 sm:text-lg">
              Convert entire webnovels into audiobooks. Export batches as{' '}
              <span className="font-bold text-white">
                MP3, WAV, M4A, FLAC, and more
              </span>
              —pick the file type that fits your library or workflow.{' '}
              <span className="font-bold text-white">Listen anywhere</span>, any
              time and any device.
            </p>

            <ul className="mb-6 space-y-4">
              <li className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-surface">
                  <Layers className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-bold text-white">Entire Books at Once</div>
                  <div className="text-sm text-gray-500">
                    Don&apos;t click 50 times. Grab the whole arc.
                  </div>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-surface">
                  <Smartphone className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <div className="font-bold text-white">
                    Universal Compatibility
                  </div>
                  <div className="text-sm text-gray-500">
                    Phones, desktops, DAWs—your files, your ecosystem.
                  </div>
                </div>
              </li>
            </ul>

            <button
              type="button"
              className="group flex items-center gap-3 border-b border-transparent pb-1 font-semibold text-white transition hover:border-white"
            >
              View Supported Devices{' '}
              <ArrowRight className="h-4 w-4 transform transition group-hover:translate-x-1" />
            </button>
          </div>

          <div className="perspective-1000 relative order-2 lg:order-2">
            <div className="absolute -top-1 right-0 z-20 max-w-[min(100%,13rem)] animate-[bounce_3s_infinite] sm:-top-6 sm:-right-6 sm:max-w-none">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#1A1A1A] p-4 shadow-2xl">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/20">
                  <Music className="h-5 w-5 text-red-500" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-gray-400">
                    OUTPUT FORMATS
                  </div>
                  <div className="text-sm font-bold leading-snug text-white">
                    MP3 · WAV · M4A · FLAC+
                  </div>
                </div>
              </div>
            </div>

            <div className="relative rotate-y-[-5deg] overflow-hidden rounded-2xl border border-white/10 bg-[#0B0B0F]/90 p-4 shadow-2xl backdrop-blur-xl transition duration-500 sm:rounded-[2rem] sm:p-8 md:hover:rotate-y-0">
              <div className="mb-8 flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <DownloadCloud className="h-5 w-5 text-primary" />
                  <span className="text-sm font-bold tracking-widest">
                    DOWNLOAD QUEUE
                  </span>
                </div>
                <div className="flex gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-gray-600" />
                  <div className="h-2 w-2 rounded-full bg-gray-600" />
                </div>
              </div>

              <div className="group relative mb-6 overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4">
                <div
                  className="absolute top-0 left-0 z-0 h-full animate-[loadwidth_4s_ease-in-out_infinite] bg-primary/10"
                  style={{ width: '65%' }}
                />
                <div className="relative z-10 mb-2 flex items-start justify-between">
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-800 text-xs font-bold text-gray-500">
                      PP
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">
                        Pride &amp; Prejudice (Batch 1)
                      </div>
                      <div className="text-xs text-gray-400">Ch 1 - 12</div>
                    </div>
                  </div>
                  <div className="animate-pulse text-xs font-bold text-primary">
                    SYNTHESIZING...
                  </div>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-700">
                  <div
                    className="h-full animate-[loadwidth_4s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-primary to-secondary"
                    style={{ width: '65%' }}
                  />
                </div>
                <div className="mt-2 flex justify-between font-mono text-[10px] text-gray-500">
                  <span>124.5 MB</span>
                  <span>64%</span>
                </div>
              </div>

              <div className="mb-2 rounded-xl border border-white/5 p-4 opacity-50 transition hover:opacity-100">
                <div className="flex items-center justify-between">
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-800 text-xs font-bold text-gray-500">
                      SH
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">
                        Sherlock Holmes — Vol. 1
                      </div>
                      <div className="text-xs text-gray-400">Ch 3 - 6</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[10px] font-bold text-gray-400">
                    <Clock className="h-3 w-3" /> QUEUED
                  </div>
                </div>
              </div>

              <div className="group cursor-pointer rounded-xl border border-white/5 p-4 transition hover:bg-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-green-900/20 text-xs font-bold text-green-500">
                      <Check className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">
                        The Art of War — Complete
                      </div>
                      <div className="text-xs text-green-400">
                        Ready to Download
                      </div>
                    </div>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black transition hover:scale-110">
                    <ArrowDown className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="relative overflow-x-hidden border-t border-white/5 bg-[#0B0B0F] py-14 sm:py-20"
        {...sectionReveal}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"
          style={{
            maskImage:
              'radial-gradient(ellipse 60% 60% at 50% 50%, #000 70%, transparent 100%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 60% 60% at 50% 50%, #000 70%, transparent 100%)',
          }}
        />
        <div className="pointer-events-none absolute top-0 left-0 -z-10 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="pointer-events-none absolute right-0 bottom-0 -z-10 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 text-center sm:mb-10">
            <div className="mb-4 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-bold tracking-widest text-cyan-400 uppercase">
                <ScanFace className="h-4 w-4" /> Multi-Cast Mode
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/[0.08] px-3 py-1.5 text-xs font-semibold text-amber-100/95">
                <Clock className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                Coming soon — not available yet
              </div>
            </div>
            <h2 className="mb-4 text-3xl font-black sm:text-4xl md:text-6xl">
              Custom Voice <br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                for each Character.
              </span>
            </h2>
            <p className="mx-auto max-w-2xl px-1 text-base text-gray-400 sm:px-0 sm:text-lg">
              The RYFT engine automatically identifies the characters in your text
              and assigns custom voices to them based on your preference.
            </p>
            <div
              className="mx-auto mt-5 max-w-2xl rounded-xl border border-amber-500/20 bg-amber-500/[0.06] px-4 py-3 text-sm leading-relaxed text-amber-100/90"
              role="status"
            >
              <span className="font-semibold text-amber-50">
                Multi-Cast mode is coming soon.
              </span>{' '}
              It is not available in the current RYFT build yet—this section is a
              preview of what we&apos;re working toward.
            </div>
          </div>

          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            <div className="relative lg:col-span-7">
              <div className="relative h-[min(26rem,70svh)] overflow-hidden rounded-2xl border border-white/10 bg-[#121215] shadow-2xl sm:h-[500px]">
                <div className="flex h-10 items-center gap-2 border-b border-white/5 bg-white/[0.02] px-4">
                  <div className="h-3 w-3 rounded-full bg-red-500/20" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/20" />
                  <div className="h-3 w-3 rounded-full bg-green-500/20" />
                  <span className="ml-4 font-mono text-[10px] text-gray-500">
                    source_text.txt
                  </span>
                </div>

                <div className="relative space-y-4 p-4 font-mono text-xs leading-loose text-gray-500 sm:space-y-6 sm:p-8 sm:text-sm md:text-base">
                  <div
                    className="absolute left-0 z-20 h-px w-full bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.8)] transition-all duration-300"
                    style={{
                      top: `${scannerPosition}%`,
                      opacity:
                        scannerPosition > 0 && scannerPosition < 100 ? 1 : 0,
                    }}
                  />
                  <p>The orchard was still; the moonlight caught the stone.</p>
                  <p>
                    <span className="rounded bg-purple-400/10 px-1 font-bold text-purple-400">
                      Romeo
                    </span>{' '}
                    <span className="text-white">
                      &quot;But soft! what light through yonder window breaks? It is the east,
                      and Juliet is the sun.&quot;
                    </span>
                  </p>
                  <p>A voice above answered the night.</p>
                  <p>
                    <span className="rounded bg-cyan-400/10 px-1 font-bold text-cyan-400">
                      Juliet
                    </span>{' '}
                    <span className="text-white">
                      &quot;O Romeo, Romeo! wherefore art thou Romeo? Deny thy father and refuse
                      thy name.&quot;
                    </span>
                  </p>
                  <p>He stood below, listening.</p>
                  <p>
                    <span className="rounded bg-purple-400/10 px-1 font-bold text-purple-400">
                      Romeo
                    </span>{' '}
                    <span className="text-white">
                      &quot;Shall I hear more, or shall I speak at this?&quot;
                    </span>
                  </p>
                </div>
                <div className="pointer-events-none absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-[#121215] to-transparent" />
              </div>
            </div>

            <div className="relative min-h-0 space-y-3 sm:space-y-4 lg:col-span-5 lg:h-[500px]">
              <div className="mb-2 flex items-end justify-between px-2">
                <span className="text-xs font-bold tracking-widest text-gray-500 uppercase">
                  Detected Cast
                </span>
                <span className="animate-pulse font-mono text-[10px] text-cyan-400">
                  SCANNING...
                </span>
              </div>

              <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-[#1A1A1A] p-4 transition-all duration-500">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800">
                  <BookOpen className="h-5 w-5 text-gray-400" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-white">Narrator</div>
                  <div className="text-[10px] text-gray-500">Standard Text</div>
                </div>
                <div className="rounded border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] text-gray-400">
                  Adam (Default)
                </div>
              </div>

              <div
                className={`relative flex transform items-center gap-4 overflow-hidden rounded-xl border border-purple-500/30 bg-purple-900/10 p-4 transition-all duration-700 ${
                  showRomeo
                    ? 'translate-x-0 opacity-100'
                    : 'translate-x-10 opacity-0'
                }`}
              >
                <div className="absolute top-0 bottom-0 left-0 w-1 bg-purple-500" />
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/20">
                  <span className="font-bold text-purple-400">R</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-white">Romeo</div>
                  <div className="text-[10px] text-purple-400">
                    Detected Speaker
                  </div>
                </div>
                <div className="flex cursor-pointer items-center gap-2 rounded border border-purple-500/30 bg-purple-500/20 px-3 py-1.5 transition hover:bg-purple-500/30">
                  <span className="text-[10px] font-bold text-purple-300">
                    {castVoiceRomeo}
                  </span>
                  <ChevronDown className="h-3 w-3 text-purple-300" />
                </div>
              </div>

              <div
                className={`relative flex transform items-center gap-4 overflow-hidden rounded-xl border border-cyan-500/30 bg-cyan-900/10 p-4 transition-all duration-700 ${
                  showJuliet
                    ? 'translate-x-0 opacity-100'
                    : 'translate-x-10 opacity-0'
                }`}
              >
                <div className="absolute top-0 bottom-0 left-0 w-1 bg-cyan-500" />
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/20">
                  <span className="font-bold text-cyan-400">J</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-white">Juliet</div>
                  <div className="text-[10px] text-cyan-400">Detected Speaker</div>
                </div>
                <div className="flex cursor-pointer items-center gap-2 rounded border border-cyan-500/30 bg-cyan-500/20 px-3 py-1.5 transition hover:bg-cyan-500/30">
                  <span className="text-[10px] font-bold text-cyan-300">
                    {castVoiceJuliet}
                  </span>
                  <ChevronDown className="h-3 w-3 text-cyan-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        id="pricing"
        className="relative px-4 py-14 sm:px-6 sm:py-20"
        {...sectionReveal}
      >
        <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[500px] w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />

        <div className="mx-auto max-w-7xl">
          {!betaLifetimeSoldOut ? (
            <>
              <div className="mb-8 text-center">
                <div className="mb-4 inline-flex flex-wrap items-center justify-center gap-2">
                  <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-bold tracking-widest text-violet-300 uppercase">
                    Beta launch
                  </span>
                  <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-100/95">
                    <Ticket className="mr-1 inline h-3.5 w-3.5 -translate-y-px" />
                    {BETA_LIFETIME_SEATS_TOTAL} seats only
                  </span>
                </div>
                <h2 className="mb-4 text-3xl font-black sm:text-4xl md:text-5xl">
                  Founding{' '}
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    lifetime access.
                  </span>
                </h2>
                <p className="mx-auto max-w-2xl px-1 text-base text-gray-400 sm:px-0 sm:text-lg">
                  Help shape RYFT during the beta. Pay once—no subscription—
                  and keep the software for life. When the last seat is gone,
                  this offer ends and we switch to recurring plans.
                </p>
              </div>

              <div className="mx-auto max-w-5xl">
                <div className="group relative">
                  <div className="pointer-events-none absolute -inset-[1px] rounded-[28px] bg-gradient-to-b from-primary via-violet-500 to-cyan-500 opacity-80 blur-sm transition duration-500 group-hover:opacity-100" />
                  <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0B0B0F] p-5 md:p-6 lg:p-8">
                    <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-2 lg:gap-6 xl:gap-8">
                      {/* Column 1 — offer, scarcity, included features, then CTA */}
                      <div className="flex min-w-0 flex-col space-y-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h3 className="mb-1 text-sm font-black tracking-widest text-primary uppercase">
                              Lifetime Founding Member
                            </h3>
                            <div className="flex flex-wrap items-baseline gap-2">
                              <span className="text-5xl font-black text-white md:text-6xl">
                                ${BETA_LIFETIME_PRICE_USD}
                              </span>
                              <span className="text-lg text-gray-500">
                                one-time
                              </span>
                            </div>
                            <p className="mt-2 text-sm text-gray-400">
                              Lifetime license to the RYFT desktop app during beta
                              and beyond—while we ship updates you help test.
                            </p>
                          </div>
                          {showSeatSocialProof ? (
                            <div className="flex w-fit shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-300 sm:ml-auto">
                              <Users className="h-4 w-4 text-cyan-400" />
                              <span>
                                <span className="font-bold text-white">
                                  {betaLifetimeSeatsRemaining}
                                </span>{' '}
                                / {BETA_LIFETIME_SEATS_TOTAL} left
                              </span>
                            </div>
                          ) : null}
                        </div>

                        {showSeatSocialProof ? (
                          <div>
                            <div className="mb-2 flex justify-between text-xs font-medium text-gray-500">
                              <span>Founding seats claimed</span>
                              <span>
                                {BETA_LIFETIME_SEATS_CLAIMED} /{' '}
                                {BETA_LIFETIME_SEATS_TOTAL}
                              </span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-white/10">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-primary to-cyan-400 transition-[width] duration-500"
                                style={{ width: `${betaLifetimeFillPercent}%` }}
                              />
                            </div>
                          </div>
                        ) : null}

                        <div className="rounded-xl border border-white/[0.06] bg-[#16161a] p-4 md:p-5">
                          <ul className="space-y-3 text-sm text-gray-300">
                            <li className="flex items-start gap-2.5">
                              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-violet-600 text-white shadow-[0_0_16px_rgba(139,92,246,0.55)] ring-1 ring-white/25">
                                <Check
                                  className="h-4 w-4"
                                  strokeWidth={3}
                                  aria-hidden
                                />
                              </div>
                              <span>
                                Full access to the software for lifetime, including
                                every new future update.
                              </span>
                            </li>
                            <li className="flex items-start gap-2.5">
                              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-violet-600 text-white shadow-[0_0_16px_rgba(139,92,246,0.55)] ring-1 ring-white/25">
                                <Check
                                  className="h-4 w-4"
                                  strokeWidth={3}
                                  aria-hidden
                                />
                              </div>
                              <span>
                                Unlimited Text-to-Speech generation with all voices.
                              </span>
                            </li>
                            <li className="flex items-start gap-2.5">
                              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-violet-600 text-white shadow-[0_0_16px_rgba(139,92,246,0.55)] ring-1 ring-white/25">
                                <Check
                                  className="h-4 w-4"
                                  strokeWidth={3}
                                  aria-hidden
                                />
                              </div>
                              <span>
                                Full access to the extension that allows you to
                                analyze any webnovel site and bring it into RYFT.
                              </span>
                            </li>
                            <li className="flex items-start gap-2.5">
                              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-violet-600 text-white shadow-[0_0_16px_rgba(139,92,246,0.55)] ring-1 ring-white/25">
                                <Check
                                  className="h-4 w-4"
                                  strokeWidth={3}
                                  aria-hidden
                                />
                              </div>
                              <span>
                                Priority support—founding members move to the front
                                of the queue when you need help.
                              </span>
                            </li>
                          </ul>
                        </div>

                        <button
                          type="button"
                          onClick={() => openModal('beta-lifetime')}
                          className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-primary to-violet-600 py-4 text-base font-bold text-white shadow-lg shadow-violet-500/25 transition-all duration-300 hover:scale-[1.01] hover:shadow-violet-500/40"
                        >
                          <span
                            aria-hidden
                            className="landing-cta-sheen pointer-events-none absolute inset-y-0 -left-[25%] z-0 w-[55%] bg-gradient-to-r from-transparent via-white/[0.18] to-transparent opacity-80"
                          />
                          <span className="relative z-10">Claim a founding seat</span>
                        </button>
                      </div>

                      {/* Column 2 — roadmap */}
                      <div className="flex w-full min-w-0 max-w-full flex-col gap-3">
                    <div>
                      <h3 className="mb-2 text-base font-black tracking-tight text-white md:text-lg">
                        Included in your{' '}
                        <span className="bg-gradient-to-r from-violet-300 via-primary to-violet-400 bg-clip-text text-transparent">
                          Lifetime Access
                        </span>
                      </h3>
                      <p className="mb-3 text-sm leading-relaxed text-gray-400">
                        Founding members get every major update we ship. Here is
                        what we are building next:
                      </p>
                      <div className="flex flex-col gap-2">
                        <div className="rounded-lg border border-white/[0.06] bg-[#16161a] px-3 py-2.5">
                          <div className="flex items-start gap-2 text-gray-300">
                            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/15">
                              <Mic2 className="h-3 w-3 text-amber-400" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-sm font-medium text-white">
                                Custom Voices
                              </span>
                              <span className="mt-0.5 block text-[11px] leading-snug text-gray-400">
                                Clone or import the exact voice you want for your
                                narration.
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="rounded-lg border border-white/[0.06] bg-[#16161a] px-3 py-2.5">
                          <div className="flex items-start gap-2 text-gray-300">
                            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20">
                              <Phone className="h-3 w-3 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-sm font-medium text-white">
                                Phone Support
                              </span>
                              <span className="mt-0.5 block text-[11px] leading-snug text-gray-400">
                                A custom app on your phone that allows you to listen
                                to your audio books.
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="rounded-lg border border-white/[0.06] bg-[#16161a] px-3 py-2.5">
                          <div className="flex items-start gap-2 text-gray-300">
                            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/15">
                              <Users className="h-3 w-3 text-amber-400" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-sm font-medium text-white">
                                Multi-Cast mode
                              </span>
                              <span className="mt-0.5 block text-[11px] leading-snug text-gray-400">
                                Assign unique, distinct voices to different
                                characters.
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="rounded-lg border border-white/[0.06] bg-[#16161a] px-3 py-2.5">
                          <div className="flex items-start gap-2 text-gray-300">
                            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/15">
                              <Languages className="h-3 w-3 text-amber-400" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-sm font-medium text-white">
                                Multilingual support
                              </span>
                              <span className="mt-0.5 block text-[11px] leading-snug text-gray-400">
                                Narrate and listen in the languages your readers
                                actually use.
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="rounded-lg border border-white/[0.06] bg-[#16161a] px-3 py-2.5">
                          <div className="flex items-start gap-2 text-gray-300">
                            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20">
                              <Sparkles className="h-3 w-3 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-sm font-medium text-white">
                                Emotional Voices
                              </span>
                              <span className="mt-0.5 block text-[11px] leading-snug text-gray-400">
                                Voices that encompass a full range of human emotions.
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                      </div>
                    </div>

                    <p className="mt-6 border-t border-white/10 pt-4 text-center text-xs leading-relaxed text-gray-500">
                      Strictly limited to {BETA_LIFETIME_SEATS_TOTAL} purchases.
                      When they sell out, the lifetime deal is removed and
                      pricing moves to subscriptions only.
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="mb-8 text-center">
                <div className="mb-4 inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-bold tracking-widest text-gray-300 uppercase">
                  Lifetime Founding Member — sold out
                </div>
                <h2 className="mb-4 text-3xl font-black sm:text-4xl md:text-5xl">
                  Subscribe to{' '}
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    RYFT.
                  </span>
                </h2>
                <p className="mx-auto max-w-2xl px-1 text-base text-gray-400 sm:px-0 sm:text-lg">
                  The founding {BETA_LIFETIME_SEATS_TOTAL} lifetime licenses are
                  gone. Ongoing access is now on a subscription—pick monthly or
                  annual billing.
                </p>
              </div>

              <div className="mx-auto flex max-w-xl flex-col items-center">
                <div className="mb-8 flex items-center justify-center gap-4">
                  <div className="relative flex cursor-pointer items-center rounded-full border border-white/10 bg-white/5 p-1">
                    <div
                      className="absolute h-[36px] w-[100px] rounded-full bg-primary transition-all duration-300 ease-out"
                      style={{
                        left: subscriptionBilling === 'monthly' ? '4px' : '106px',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setSubscriptionBilling('monthly')}
                      className={`relative z-10 w-[100px] py-2 text-sm font-bold transition-colors duration-300 ${
                        subscriptionBilling === 'monthly'
                          ? 'text-white'
                          : 'text-gray-400'
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubscriptionBilling('yearly')}
                      className={`relative z-10 w-[100px] py-2 text-sm font-bold transition-colors duration-300 ${
                        subscriptionBilling === 'yearly'
                          ? 'text-white'
                          : 'text-gray-400'
                      }`}
                    >
                      Yearly
                    </button>
                  </div>
                  <span className="rounded-lg border border-green-400/20 bg-green-400/10 px-2 py-1 text-xs font-bold text-green-400">
                    Save on annual
                  </span>
                </div>

                <div className="w-full rounded-3xl border border-white/10 bg-[#121215] p-8 md:p-10">
                  <div className="mb-8">
                    <h3 className="mb-2 text-sm font-bold tracking-widest text-primary uppercase">
                      RYFT Pro
                    </h3>
                    <div className="flex flex-col">
                      <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-black text-white">
                          {subscriptionBilling === 'monthly' ? '$24' : '$19'}
                        </span>
                        <span className="text-gray-500">/mo</span>
                      </div>
                      <span className="mt-1 font-mono text-xs text-gray-500">
                        {subscriptionBilling === 'monthly'
                          ? 'Billed monthly'
                          : '$228 billed annually'}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-gray-500">
                      Example subscription pricing—set your real numbers in the
                      product when checkout is wired up.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => openModal('subscribe')}
                    className="mb-8 w-full rounded-xl bg-gradient-to-r from-secondary to-blue-600 py-4 font-bold text-white shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-cyan-500/50"
                  >
                    Subscribe
                  </button>

                  <ul className="space-y-4 text-sm text-gray-300">
                    <li className="flex items-center gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary/20">
                        <Check className="h-3.5 w-3.5 text-secondary" />
                      </div>
                      <span>Full generation limits per your plan tier</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary/20">
                        <Check className="h-3.5 w-3.5 text-secondary" />
                      </div>
                      <span>Batch export &amp; custom voices</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/15">
                        <Clock className="h-3.5 w-3.5 text-amber-400" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-white">Multi-Cast</span>
                        <span className="mt-0.5 block text-xs text-gray-500">
                          Roadmap feature—availability announced separately.
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.section>

      <DownloadSection reveal={sectionReveal} />

      <motion.footer
        className="border-t border-white/5 bg-black py-8 pb-[max(2rem,env(safe-area-inset-bottom,0px))]"
        {...sectionReveal}
      >
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 sm:px-6 md:flex-row">
          <button
            type="button"
            onClick={scrollLandingToTop}
            aria-label="Scroll to top"
            className="group flex cursor-pointer items-center gap-3 border-0 bg-transparent p-0 text-2xl font-black tracking-widest text-inherit transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-primary to-secondary shadow-lg transition duration-300 group-hover:shadow-violet-500/50">
              <div className="flex h-5 items-center gap-[3px]">
                <div
                  className="w-1 animate-[equalizer_1s_ease-in-out_infinite] rounded-full bg-white"
                  style={{ animationDelay: '0ms' }}
                />
                <div
                  className="w-1 animate-[equalizer_1.2s_ease-in-out_infinite] rounded-full bg-white"
                  style={{ animationDelay: '200ms' }}
                />
                <div
                  className="w-1 animate-[equalizer_0.8s_ease-in-out_infinite] rounded-full bg-white"
                  style={{ animationDelay: '400ms' }}
                />
                <div
                  className="w-1 animate-[equalizer_1.1s_ease-in-out_infinite] rounded-full bg-white"
                  style={{ animationDelay: '100ms' }}
                />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
            </div>
            <span className="transition duration-300 group-hover:text-white">
              RYFT
            </span>
          </button>
          <div className="flex flex-col items-center gap-2 text-center text-sm text-gray-500">
            <span className="w-full">&copy; 2026 Ryft.us. All rights reserved.</span>
            <nav
              className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1"
              aria-label="Legal and support"
            >
              <Link
                to="/privacy"
                onClick={rememberLandingScrollPosition}
                className="text-gray-500 underline-offset-4 transition hover:text-white hover:underline"
              >
                Privacy Policy
              </Link>
              <span className="text-gray-600" aria-hidden>
                ·
              </span>
              <Link
                to="/terms"
                onClick={rememberLandingScrollPosition}
                className="text-gray-500 underline-offset-4 transition hover:text-white hover:underline"
              >
                Terms of Service
              </Link>
              <span className="text-gray-600" aria-hidden>
                ·
              </span>
              <Link
                to="/refunds"
                onClick={rememberLandingScrollPosition}
                className="text-gray-500 underline-offset-4 transition hover:text-white hover:underline"
              >
                Refund Policy
              </Link>
              <span className="text-gray-600" aria-hidden>
                ·
              </span>
              <button
                type="button"
                onClick={() => setShowContactSupportModal(true)}
                className="text-gray-500 underline-offset-4 transition hover:text-white hover:underline"
              >
                Contact support
              </button>
            </nav>
          </div>
          <SocialFooterLinks />
        </div>
      </motion.footer>
    </div>
  )
}
