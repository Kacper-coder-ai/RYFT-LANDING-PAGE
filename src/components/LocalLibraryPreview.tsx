import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ChevronLeft,
  Clock,
  FileText,
  Files,
  Filter,
  FolderInput,
  FolderOpen,
  FolderPlus,
  Layers,
  ListMusic,
  Music2,
  Play,
  Plus,
  Search,
  Settings,
  SkipForward,
  Trash2,
  Zap,
} from 'lucide-react'

/** Mirrors desktop `LocalLibrary` folder grid (Collections). */
const MOCK_FOLDERS: { id: string; name: string; count: number }[] = [
  { id: '1', name: 'Webnovels', count: 518 },
  { id: '2', name: 'Classics', count: 206 },
  { id: '3', name: 'Nonfiction', count: 94 },
  { id: '4', name: 'Short fiction', count: 42 },
]

/**
 * Files inside Webnovels — readable novel titles (still show MB • date + format).
 */
const WEBNOVEL_FILES: {
  id: string
  displayName: string
  sizeMb: number
  dateLabel: string
  book: string
  chapter: string
  duration: string
  fmt: string
}[] = [
  {
    id: 'wn1',
    displayName: "Omniscient Reader's Viewpoint — Ch. 142.wav",
    sizeMb: 41.2,
    dateLabel: 'Apr 12, 2026',
    book: "Omniscient Reader's Viewpoint",
    chapter: 'Ch. 142',
    duration: '12:04',
    fmt: 'wav',
  },
  {
    id: 'wn2',
    displayName: 'Solo Leveling — Ch. 3.wav',
    sizeMb: 62.8,
    dateLabel: 'Apr 11, 2026',
    book: 'Solo Leveling',
    chapter: 'Ch. 3',
    duration: '18:22',
    fmt: 'wav',
  },
  {
    id: 'wn3',
    displayName: 'The Wandering Inn — Vol. 8, Ch. 24.mp3',
    sizeMb: 28.4,
    dateLabel: 'Apr 9, 2026',
    book: 'The Wandering Inn',
    chapter: 'Vol. 8, Ch. 24',
    duration: '9:51',
    fmt: 'mp3',
  },
  {
    id: 'wn4',
    displayName: "Trash of the Count's Family — Ch. 89.wav",
    sizeMb: 51.0,
    dateLabel: 'Apr 8, 2026',
    book: "Trash of the Count's Family",
    chapter: 'Ch. 89',
    duration: '15:03',
    fmt: 'wav',
  },
  {
    id: 'wn5',
    displayName: 'Lord of the Mysteries — Vol. 2, Ch. 14.wav',
    sizeMb: 44.6,
    dateLabel: 'Apr 7, 2026',
    book: 'Lord of the Mysteries',
    chapter: 'Vol. 2, Ch. 14',
    duration: '11:20',
    fmt: 'wav',
  },
  {
    id: 'wn6',
    displayName: 'Mother of Learning — Ch. 55.mp3',
    sizeMb: 33.1,
    dateLabel: 'Apr 6, 2026',
    book: 'Mother of Learning',
    chapter: 'Ch. 55',
    duration: '8:42',
    fmt: 'mp3',
  },
  {
    id: 'wn7',
    displayName: 'He Who Fights With Monsters — Ch. 201.wav',
    sizeMb: 58.3,
    dateLabel: 'Apr 5, 2026',
    book: 'He Who Fights With Monsters',
    chapter: 'Ch. 201',
    duration: '16:05',
    fmt: 'wav',
  },
  {
    id: 'wn8',
    displayName: 'The Beginning After The End — Vol. 8, Ch. 12.wav',
    sizeMb: 47.9,
    dateLabel: 'Apr 4, 2026',
    book: 'The Beginning After The End',
    chapter: 'Vol. 8, Ch. 12',
    duration: '13:18',
    fmt: 'wav',
  },
  {
    id: 'wn9',
    displayName: 'Release That Witch — Ch. 450.mp3',
    sizeMb: 31.7,
    dateLabel: 'Apr 3, 2026',
    book: 'Release That Witch',
    chapter: 'Ch. 450',
    duration: '10:02',
    fmt: 'mp3',
  },
  {
    id: 'wn10',
    displayName: 'Mage Errant — Aching God — Ch. 7.wav',
    sizeMb: 39.4,
    dateLabel: 'Apr 1, 2026',
    book: 'Mage Errant',
    chapter: 'Aching God, Ch. 7',
    duration: '12:51',
    fmt: 'wav',
  },
]

const DEMO_QUEUE_IDS = ['wn1', 'wn2'] as const

/** Mirrors desktop drafts grid (amber / FileText). */
const MOCK_DRAFTS: { id: string; title: string; chapters: number; date: string }[] =
  [
    {
      id: 'd1',
      title: 'Pride & Prejudice — TTS draft',
      chapters: 12,
      date: 'Apr 2, 2026',
    },
    {
      id: 'd2',
      title: 'Worm — Arc 12',
      chapters: 8,
      date: 'Apr 5, 2026',
    },
    {
      id: 'd3',
      title: 'New Draft',
      chapters: 1,
      date: 'Apr 9, 2026',
    },
  ]

/** Unsorted list: readable chapter titles (no generated filenames). */
const UNSORTED_CHAPTERS: {
  id: string
  book: string
  chapter: string
  meta: string
  fmt: string
}[] = [
  {
    id: 'u1',
    book: 'Pride and Prejudice',
    chapter: 'Chapter 12',
    meta: '4.2 hr · 1.1 GB',
    fmt: 'WAV',
  },
]

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

function durationToSeconds(label: string): number {
  const [m, s] = label.split(':').map((x) => Number.parseInt(x, 10))
  if (Number.isNaN(m) || Number.isNaN(s)) return 0
  return m * 60 + s
}

/** Track seconds advanced per wall-clock second (compressed so the demo stays watchable). */
const DEMO_PLAYBACK_RATE = 30

/**
 * Progress advances in real-time proportion to the file duration but stops at this
 * fraction of the track (never fills to the end). It stays there until the next
 * track or until the whole library demo restarts from the grid.
 */
const DEMO_PROGRESS_CAP = 0.88

/** How long the player stays visible before the full library demo restarts. */
const DEMO_PLAYER_VISIBLE_MS = 4000

/**
 * Mock of the desktop library with a short looping demo: open Webnovels,
 * multi-select files, play selection, in-app player advances through the queue.
 * `pointer-events-none` so wheel scroll reaches the page.
 */
export function LocalLibraryPreview() {
  const diskGb = '35.6'
  /** Bumped on unmount so Strict Mode / remounts never leave a stale async cycle driving state. */
  const libraryCycleRunRef = useRef(0)

  const [demoView, setDemoView] = useState<'grid' | 'folder'>('grid')
  const [webnovelsActive, setWebnovelsActive] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [playPressed, setPlayPressed] = useState(false)
  const [playerOpen, setPlayerOpen] = useState(false)
  const [queueIndex, setQueueIndex] = useState(0)
  const [trackProgress, setTrackProgress] = useState(0)

  const navBtn =
    'flex w-full items-center gap-2 rounded-lg border border-transparent px-2 py-1.5 text-left text-[11px] font-semibold sm:text-xs'

  const currentTrack = WEBNOVEL_FILES.find((f) => f.id === DEMO_QUEUE_IDS[queueIndex])

  useEffect(() => {
    if (!playerOpen || !currentTrack) return

    const trackT = Math.max(1, durationToSeconds(currentTrack.duration))
    const capElapsed = trackT * DEMO_PROGRESS_CAP
    let logicalElapsed = 0
    let last = performance.now()
    let raf = 0

    let lastPosted = -1
    const tick = (now: number) => {
      const dt = (now - last) / 1000
      last = now
      if (logicalElapsed < capElapsed) {
        logicalElapsed = Math.min(
          logicalElapsed + dt * DEMO_PLAYBACK_RATE,
          capElapsed,
        )
      }
      const pct = Math.min((logicalElapsed / trackT) * 100, 100 * DEMO_PROGRESS_CAP)
      // Fewer React commits — smooth motion reads fine at ~25 steps/sec for this slow bar.
      const stepped = Math.round(pct * 40) / 40
      if (Math.abs(stepped - lastPosted) >= 0.12) {
        lastPosted = stepped
        setTrackProgress(stepped)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playerOpen, queueIndex, currentTrack?.id])

  useEffect(() => {
    const runId = ++libraryCycleRunRef.current
    const alive = () => libraryCycleRunRef.current === runId

    async function cycle() {
      for (;;) {
        if (!alive()) return

        setDemoView('grid')
        setWebnovelsActive(false)
        setSelectedIds([])
        setPlayPressed(false)
        setPlayerOpen(false)
        setQueueIndex(0)
        setTrackProgress(0)

        await sleep(2200)
        if (!alive()) return

        setWebnovelsActive(true)
        await sleep(650)
        if (!alive()) return

        setDemoView('folder')
        setWebnovelsActive(false)
        await sleep(700)
        if (!alive()) return

        setSelectedIds([DEMO_QUEUE_IDS[0]])
        await sleep(450)
        if (!alive()) return

        setSelectedIds([...DEMO_QUEUE_IDS])
        await sleep(900)
        if (!alive()) return

        setPlayPressed(true)
        await sleep(520)
        if (!alive()) return

        setPlayerOpen(true)
        setPlayPressed(false)
        setQueueIndex(0)
        setTrackProgress(0)

        // Always close after exactly this wall time — independent of progress bar / rAF.
        await sleep(DEMO_PLAYER_VISIBLE_MS)
        if (!alive()) return

        setPlayerOpen(false)
        setSelectedIds([])
        setPlayPressed(false)
        setQueueIndex(0)
        setTrackProgress(0)
        setDemoView('grid')

        await sleep(800)
        if (!alive()) return

        await sleep(2000)
        if (!alive()) return
      }
    }

    void cycle()
    return () => {
      libraryCycleRunRef.current++
    }
  }, [])

  const nextTrack =
    queueIndex + 1 < DEMO_QUEUE_IDS.length
      ? WEBNOVEL_FILES.find((f) => f.id === DEMO_QUEUE_IDS[queueIndex + 1])
      : undefined

  return (
    <div className="pointer-events-none mt-6 select-none lg:mt-8">
      <div className="flex flex-col overflow-visible rounded-xl border border-white/10 bg-[#0B0B0F] shadow-[0_24px_80px_-20px_rgba(0,0,0,0.8)]">
        {/* Window title bar */}
        <div className="flex shrink-0 items-center gap-2 border-b border-white/10 bg-[#12121a] px-2.5 py-1.5 sm:px-3">
          <div className="flex items-center gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <span className="font-mono text-[10px] font-medium tracking-wide text-gray-500 sm:text-xs">
            RYFT — Local
          </span>
        </div>

        <div className="flex bg-[#0B0B0F]">
          <aside className="flex w-[7.75rem] shrink-0 flex-col border-r border-white/10 bg-[#0e0e11]/95 sm:w-[10.5rem]">
            <div className="flex items-center gap-1.5 border-b border-white/5 px-2 py-2 sm:px-2.5 sm:py-2.5">
              <div className="relative flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-md bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg sm:h-8 sm:w-8">
                <div className="relative flex h-3 items-center gap-px sm:h-4 sm:gap-0.5">
                  <span
                    className="w-0.5 rounded-full bg-white animate-[equalizer_1s_ease-in-out_infinite] sm:w-1"
                    style={{ animationDelay: '0ms' }}
                  />
                  <span
                    className="w-0.5 rounded-full bg-white animate-[equalizer_1.2s_ease-in-out_infinite] sm:w-1"
                    style={{ animationDelay: '200ms' }}
                  />
                  <span
                    className="w-0.5 rounded-full bg-white animate-[equalizer_0.8s_ease-in-out_infinite] sm:w-1"
                    style={{ animationDelay: '400ms' }}
                  />
                  <span
                    className="w-0.5 rounded-full bg-white animate-[equalizer_1.1s_ease-in-out_infinite] sm:w-1"
                    style={{ animationDelay: '100ms' }}
                  />
                </div>
              </div>
              <div className="min-w-0 leading-tight">
                <div className="truncate text-[11px] font-black tracking-widest text-white sm:text-xs">
                  RYFT
                </div>
                <div className="text-[8px] font-mono font-bold tracking-wide text-purple-400 sm:text-[9px]">
                  LOCAL
                </div>
              </div>
            </div>
            <nav className="flex flex-col gap-1 p-1.5 sm:p-2">
              <div className={`${navBtn} text-gray-400`}>
                <Zap className="h-3.5 w-3.5 shrink-0 opacity-80 sm:h-4 sm:w-4" />
                <span className="truncate">Text-to-Speech</span>
              </div>
              <div
                className={`${navBtn} border-purple-500/30 bg-purple-600/20 text-purple-300 shadow-[0_0_10px_rgba(139,92,246,0.08)]`}
              >
                <Layers className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                <span className="truncate">Local Library</span>
              </div>
              <div className={`${navBtn} text-gray-400`}>
                <Settings className="h-3.5 w-3.5 shrink-0 opacity-80 sm:h-4 sm:w-4" />
                <span className="truncate">Settings</span>
              </div>
            </nav>
          </aside>

          <div className="relative flex min-w-0 flex-1 flex-col">
            {/* Matches desktop `LocalLibrary` header: back + folder icon + title + search/tools */}
            <div className="flex shrink-0 flex-col gap-2 border-b border-white/5 p-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:p-3">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-gray-400 transition-[border-color,background-color] duration-300 ease-out motion-reduce:transition-none ${
                    demoView === 'folder'
                      ? 'border-white/10 bg-white/5'
                      : 'border-transparent bg-transparent'
                  }`}
                  aria-hidden
                >
                  <ChevronLeft
                    className={`h-4 w-4 transition-opacity duration-300 ease-out motion-reduce:transition-none ${
                      demoView === 'folder' ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </div>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-600/20 sm:h-8 sm:w-8">
                  <FolderOpen className="h-4 w-4 text-purple-400" />
                </div>
                <div className="grid grid-cols-1">
                  <div
                    className={`col-start-1 row-start-1 min-w-0 transition-opacity duration-300 ease-out motion-reduce:transition-none ${
                      demoView === 'grid'
                        ? 'opacity-100'
                        : 'pointer-events-none z-0 opacity-0'
                    }`}
                    aria-hidden={demoView !== 'grid'}
                  >
                    <h3 className="text-sm leading-snug font-bold tracking-wide text-white uppercase sm:text-base">
                      Local Library
                    </h3>
                    <p className="mt-0.5 text-xs leading-snug text-gray-500">
                      {diskGb} GB local
                    </p>
                  </div>
                  <div
                    className={`col-start-1 row-start-1 min-w-0 transition-opacity duration-300 ease-out motion-reduce:transition-none ${
                      demoView === 'folder'
                        ? 'z-[1] opacity-100'
                        : 'pointer-events-none z-0 opacity-0'
                    }`}
                    aria-hidden={demoView !== 'folder'}
                  >
                    <h3 className="text-sm leading-snug font-bold tracking-wide text-white uppercase sm:text-base">
                      Webnovels
                    </h3>
                    <p className="mt-0.5 text-xs leading-snug text-gray-500">
                      {WEBNOVEL_FILES.length} files
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <div className="relative min-w-[7rem] flex-1 sm:max-w-[16rem]">
                  <Search className="absolute top-1/2 left-2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500 sm:left-2.5 sm:h-4 sm:w-4" />
                  <div
                    className="rounded-md border border-white/10 bg-white/5 py-1.5 pr-2.5 pl-8 text-[11px] text-gray-500 sm:py-2 sm:pl-9 sm:text-xs"
                    aria-hidden
                  >
                    Search local files...
                  </div>
                </div>
                <div
                  className="rounded-md border border-white/10 bg-white/5 p-1.5 text-gray-400 sm:p-2"
                  aria-hidden
                >
                  <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
                <div
                  className="rounded-md border border-white/10 bg-white/5 p-1.5 text-gray-400 sm:p-2"
                  aria-hidden
                >
                  <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
              </div>
            </div>

            {/* Always occupies space (like hero chrome) — visibility only toggles so the page does not reflow. */}
            <div
              className={`shrink-0 border-b border-white/5 bg-gradient-to-r from-purple-600/10 via-transparent to-emerald-600/5 px-2.5 py-1 transition-opacity duration-300 ease-out motion-reduce:transition-none sm:px-3 sm:py-1.5 ${
                demoView === 'folder'
                  ? 'pointer-events-none opacity-0'
                  : 'opacity-100'
              }`}
              aria-hidden={demoView === 'folder'}
            >
              <div className="flex flex-col gap-0 sm:flex-row sm:items-end sm:justify-between sm:gap-2">
                <div>
                  <p className="text-[9px] font-bold tracking-wider text-gray-500 uppercase sm:text-[10px]">
                    Total audio in library
                  </p>
                  <p className="text-lg leading-none font-black tracking-tight text-white sm:text-xl md:text-2xl">
                    <span className="bg-gradient-to-r from-white via-violet-200 to-emerald-300/90 bg-clip-text text-transparent">
                      3,284.7
                    </span>
                    <span className="ml-1 text-sm font-bold text-gray-400 sm:text-base">
                      hours
                    </span>
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-[9px] font-bold tracking-wider text-gray-500 uppercase sm:text-[10px]">
                    Disk space used
                  </p>
                  <p className="font-mono text-sm text-gray-300 sm:text-base">
                    {diskGb} GB
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`relative flex h-[2.875rem] shrink-0 items-center border-b transition-[border-color] duration-300 ease-out motion-reduce:transition-none sm:h-[2.75rem] ${
                demoView === 'grid' ? 'border-transparent' : 'border-white/5'
              }`}
            >
              <div
                className={`absolute inset-0 flex min-h-0 min-w-0 items-center transition-opacity duration-300 ease-out motion-reduce:transition-none ${
                  demoView === 'folder' && selectedIds.length > 0
                    ? 'opacity-100'
                    : 'pointer-events-none opacity-0'
                }`}
                aria-hidden={
                  demoView !== 'folder' || selectedIds.length === 0
                }
              >
                <div className="flex min-h-0 w-full min-w-0 flex-nowrap items-center gap-1.5 overflow-x-auto overflow-y-hidden bg-purple-600/10 px-2.5 py-1 [scrollbar-width:none] [-ms-overflow-style:none] sm:gap-2 sm:px-4 sm:py-1 [&::-webkit-scrollbar]:hidden">
                  <span className="shrink-0 text-xs font-medium text-purple-300 sm:text-sm">
                    {selectedIds.length} selected
                  </span>
                  <div className="h-4 w-px shrink-0 bg-white/10" />
                  <div className="flex shrink-0 items-center gap-1 rounded-md border border-transparent bg-white/5 px-2 py-1 text-[11px] font-medium text-gray-300">
                    <FolderInput className="h-3 w-3 shrink-0" />
                    Move to Folder
                  </div>
                  <div className="flex shrink-0 items-center gap-1 rounded-md border border-transparent bg-white/5 px-2 py-1 text-[11px] font-medium text-gray-300">
                    Remove from Folder
                  </div>
                  <div
                    className={`flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-[11px] font-bold transition-[background-color,box-shadow] duration-200 ease-out sm:text-xs ${
                      selectedIds.length >= 2
                        ? playPressed
                          ? 'bg-primary text-white shadow-[0_0_20px_rgba(139,92,246,0.45)]'
                          : 'bg-primary/90 text-white'
                        : 'cursor-not-allowed bg-white/5 text-gray-500'
                    }`}
                  >
                    <Play className="h-3 w-3 shrink-0 fill-current" />
                    Play {selectedIds.length} items
                  </div>
                  <div className="flex shrink-0 items-center gap-1 rounded-md bg-red-500/10 px-2 py-1 text-[11px] font-medium text-red-400">
                    <Trash2 className="h-3 w-3 shrink-0" />
                    Delete Selected
                  </div>
                  <span className="ml-auto shrink-0 text-[11px] text-gray-400 sm:text-xs">
                    Clear Selection
                  </span>
                </div>
              </div>
            </div>

            <div
              className={`relative grid grid-cols-1 overflow-x-hidden px-2 pb-2 pt-0 transition-[background-color] duration-300 ease-out motion-reduce:transition-none sm:px-3 sm:pb-2 ${playerOpen ? 'bg-black/25' : 'bg-transparent'}`}
            >
              {/*
                Grid layer sets row height (collections → unsorted). Folder is position:absolute
                inset-0 so extra file rows scroll inside the same box — overall preview height
                stays unchanged when WEBNOVEL_FILES grows.
              */}
              <div
                role="img"
                aria-label="Library collections, drafts, and unsorted files"
                className={`col-start-1 row-start-1 space-y-1.5 transition-opacity duration-300 ease-out motion-reduce:transition-none sm:space-y-2 ${
                  demoView === 'folder'
                    ? 'pointer-events-none z-0 opacity-0'
                    : 'z-0 opacity-100'
                }`}
              >
                <div>
                  <div className="mb-1 flex items-center justify-between sm:mb-1.5">
                    <h4 className="text-[11px] font-bold tracking-wider text-gray-400 uppercase sm:text-xs">
                      Collections
                    </h4>
                    <span className="inline-flex items-center gap-1 rounded-md border border-purple-500/30 bg-purple-600/20 px-1.5 py-0.5 text-[9px] font-bold text-purple-400 sm:px-2 sm:py-1 sm:text-[10px]">
                      <FolderPlus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      New Folder
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:grid-cols-3 lg:grid-cols-4">
                    {MOCK_FOLDERS.map((f) => {
                      const isWebnovels = f.id === '1'
                      const pulse = isWebnovels && webnovelsActive
                      return (
                        <div
                          key={f.id}
                          className={`rounded-xl border p-2.5 transition-[box-shadow,background-color,border-color] duration-500 ease-out motion-reduce:transition-none sm:p-3 ${
                            pulse
                              ? 'border-primary bg-gradient-to-br from-primary/25 via-violet-600/20 to-[#0B0B0F] shadow-[0_0_28px_rgba(139,92,246,0.4)]'
                              : 'border-white/10 bg-white/[0.03]'
                          }`}
                        >
                          <div
                            className={`mb-1.5 flex h-9 w-9 items-center justify-center rounded-lg transition-[box-shadow,border-color,background] duration-500 ease-out motion-reduce:transition-none sm:mb-2 sm:h-10 sm:w-10 ${
                              pulse
                                ? 'border border-primary/90 bg-gradient-to-br from-primary/40 to-violet-700/35 shadow-[0_0_16px_rgba(167,139,250,0.55)]'
                                : 'border border-purple-500/30 bg-gradient-to-br from-purple-600/30 to-blue-600/30'
                            }`}
                          >
                            <FolderOpen
                              className={`h-4 w-4 transition-colors duration-500 ease-out motion-reduce:transition-none sm:h-5 sm:w-5 ${
                                pulse
                                  ? 'text-white drop-shadow-[0_0_6px_rgba(192,132,252,0.85)]'
                                  : 'text-purple-400'
                              }`}
                            />
                          </div>
                          <h4 className="truncate text-[11px] font-semibold text-white sm:text-xs">
                            {f.name}
                          </h4>
                          <p className="mt-0.5 min-h-[2rem] text-[9px] leading-snug sm:min-h-[2.25rem] sm:text-[10px]">
                            {pulse ? (
                              <span className="font-bold tracking-wide text-primary uppercase">
                                Opening folder…
                              </span>
                            ) : (
                              <span className="text-gray-500">
                                {f.count} file{f.count !== 1 ? 's' : ''}
                              </span>
                            )}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <div className="mb-1 flex items-center justify-between sm:mb-1.5">
                    <h4 className="text-[11px] font-bold tracking-wider text-gray-400 uppercase sm:text-xs">
                      Drafts
                    </h4>
                    <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-bold text-amber-400 sm:px-2 sm:py-1 sm:text-[10px]">
                      <Plus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      New Draft
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:grid-cols-3 lg:grid-cols-4">
                    {MOCK_DRAFTS.map((d) => (
                      <div
                        key={d.id}
                        className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5 sm:p-3"
                      >
                        <div className="mb-1.5 flex h-9 w-9 items-center justify-center rounded-lg border border-amber-500/30 bg-gradient-to-br from-amber-500/30 to-orange-600/30 sm:mb-2 sm:h-10 sm:w-10">
                          <FileText className="h-4 w-4 text-amber-400 sm:h-5 sm:w-5" />
                        </div>
                        <h4 className="truncate text-[11px] font-semibold text-white sm:text-xs">
                          {d.title}
                        </h4>
                        <p className="mt-0.5 text-[9px] text-gray-500 sm:text-[10px]">
                          {d.chapters} chapter{d.chapters !== 1 ? 's' : ''} • {d.date}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pb-1">
                  <h4 className="mb-1 text-[11px] font-bold tracking-wider text-gray-400 uppercase sm:mb-1.5 sm:text-xs">
                    Unsorted Files
                  </h4>
                  <div className="rounded-lg border border-white/10 bg-black/20 p-1.5 sm:p-2">
                    {UNSORTED_CHAPTERS.map((row) => (
                      <div
                        key={row.id}
                        className="mb-1.5 flex items-center gap-2 rounded-lg border border-transparent bg-white/[0.02] px-2 py-2 last:mb-0 sm:gap-2.5 sm:px-2.5 sm:py-2"
                      >
                        <div
                          className="h-3 w-3 shrink-0 rounded border border-white/20 bg-black/40 sm:h-3.5 sm:w-3.5"
                          aria-hidden
                        />
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-purple-500/30 bg-gradient-to-br from-purple-600/20 to-blue-600/20 sm:h-9 sm:w-9">
                          <Files className="h-3.5 w-3.5 text-purple-400 sm:h-4 sm:w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-[11px] font-medium text-white sm:text-xs">
                            {row.book} — {row.chapter}
                          </div>
                          <div className="text-[9px] text-gray-500 sm:text-[10px]">
                            {row.meta}
                          </div>
                        </div>
                        <span className="shrink-0 rounded-md border border-purple-500/30 bg-purple-500/15 px-1.5 py-px text-[8px] font-bold text-purple-400 sm:px-2 sm:py-0.5 sm:text-[9px]">
                          {row.fmt}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div
                role="img"
                aria-label="Webnovels folder: files selected and playing"
                className={`pointer-events-none absolute inset-0 z-[1] flex flex-col overflow-hidden px-2 pb-1 pt-0 transition-[opacity,background-color] duration-300 ease-out motion-reduce:transition-none sm:px-3 ${
                  demoView === 'grid'
                    ? 'bg-transparent opacity-0'
                    : 'bg-[#0B0B0F]/95 opacity-100'
                }`}
              >
                <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  {WEBNOVEL_FILES.map((row, idx) => {
                    const sel = selectedIds.includes(row.id)
                    return (
                      <div
                        key={row.id}
                        className={`group flex cursor-pointer select-none items-center gap-2 rounded-lg border px-2.5 py-2 transition-[border-color,background-color] duration-300 ease-out motion-reduce:transition-none sm:gap-2.5 sm:px-3 ${
                          idx < WEBNOVEL_FILES.length - 1 ? 'mb-1' : ''
                        } ${
                          sel
                            ? 'border-purple-500/30 bg-purple-600/15'
                            : 'border-transparent bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.05]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={sel}
                          readOnly
                          tabIndex={-1}
                          className="pointer-events-none h-3.5 w-3.5 shrink-0 rounded border-white/20 bg-black/40 text-purple-500 sm:h-4 sm:w-4"
                          aria-hidden
                        />
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-purple-500/30 bg-gradient-to-br from-purple-600/20 to-blue-600/20 sm:h-9 sm:w-9">
                          <Files className="h-4 w-4 text-purple-400 sm:h-[18px] sm:w-[18px]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-xs font-medium text-white sm:text-sm">
                            {row.displayName}
                          </div>
                          <div className="text-[11px] text-gray-500 sm:text-xs">
                            {row.sizeMb.toFixed(1)} MB • {row.dateLabel}
                          </div>
                        </div>
                        <span className="shrink-0 rounded-md border border-purple-500/30 bg-purple-500/20 px-1.5 py-0.5 text-[9px] font-bold text-purple-400 sm:px-2 sm:py-1 sm:text-[10px]">
                          {row.fmt.toUpperCase()}
                        </span>
                        <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white/5 text-gray-400 sm:h-8 sm:w-8">
                            <FolderOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </div>
                          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white/5 text-gray-400 sm:h-8 sm:w-8">
                            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <AnimatePresence>
                {playerOpen && currentTrack ? (
                  <motion.div
                    key="player"
                    role="img"
                    aria-label="Now playing queue"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute right-1.5 bottom-1.5 left-1.5 z-20 overflow-hidden rounded-xl border border-white/15 bg-[#14141c]/95 shadow-[0_20px_50px_rgba(0,0,0,0.55)] backdrop-blur-md sm:right-3 sm:bottom-3 sm:left-3"
                  >
                    <div className="flex items-start gap-2 border-b border-white/10 p-2 sm:gap-3 sm:p-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/40 to-violet-600/30 sm:h-10 sm:w-10">
                        <Music2 className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[9px] font-bold tracking-wider text-primary uppercase sm:text-[10px]">
                          Now playing
                        </p>
                        <p className="truncate text-xs font-bold text-white sm:text-sm">
                          {currentTrack.book} — {currentTrack.chapter}
                        </p>
                        <div className="mt-1.5 flex h-7 items-end gap-0.5 sm:mt-2 sm:h-8 sm:gap-1">
                          {Array.from({ length: 14 }, (_, i) => (
                            <span
                              key={i}
                              className="w-1 rounded-full bg-gradient-to-t from-primary/40 to-cyan-400/90 sm:w-1.5"
                              style={{
                                height: `${10 + ((i * 5 + queueIndex * 7) % 22)}px`,
                                animation: `equalizer ${0.65 + (i % 5) * 0.09}s ease-in-out infinite`,
                                animationDelay: `${i * 35}ms`,
                              }}
                            />
                          ))}
                        </div>
                        <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-white/10 sm:mt-2 sm:h-1.5">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-primary to-cyan-400"
                            style={{ width: `${trackProgress}%` }}
                          />
                        </div>
                        <div className="mt-1 flex justify-between font-mono text-[8px] text-gray-500 sm:text-[9px]">
                          <span>
                            {(() => {
                              const total = durationToSeconds(currentTrack.duration)
                              const el = Math.min(
                                Math.round((trackProgress / 100) * total),
                                Math.floor(total * DEMO_PROGRESS_CAP),
                              )
                              const mm = Math.floor(el / 60)
                              const ss = el % 60
                              return `${mm}:${String(ss).padStart(2, '0')}`
                            })()}
                          </span>
                          <span>{currentTrack.duration}</span>
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-0.5">
                        <span className="inline-flex items-center gap-0.5 rounded-full border border-white/10 bg-white/5 px-1.5 py-px text-[8px] font-bold text-gray-400 sm:gap-1 sm:px-2 sm:py-0.5 sm:text-[9px]">
                          <ListMusic className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                          {queueIndex + 1}/{DEMO_QUEUE_IDS.length}
                        </span>
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-gray-500 sm:gap-1 sm:text-[10px]">
                          <SkipForward className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          Next
                        </span>
                      </div>
                    </div>
                    {nextTrack ? (
                      <div className="flex items-center gap-2 border-t border-white/5 bg-black/30 px-2 py-1.5 sm:gap-3 sm:px-3 sm:py-2">
                        <span className="shrink-0 text-[8px] font-bold tracking-wider text-gray-500 uppercase sm:text-[9px]">
                          Up next
                        </span>
                        <span className="truncate text-[11px] text-gray-300 sm:text-xs">
                          {nextTrack.book} — {nextTrack.chapter}
                        </span>
                      </div>
                    ) : (
                      <div className="border-t border-white/5 bg-black/30 px-2 py-1.5 text-center text-[9px] text-gray-500 sm:px-3 sm:py-2 sm:text-[10px]">
                        End of queue
                      </div>
                    )}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
