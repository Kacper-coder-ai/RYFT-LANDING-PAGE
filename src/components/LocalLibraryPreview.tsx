import {
  Clock,
  FileText,
  Files,
  Filter,
  FolderOpen,
  FolderPlus,
  Layers,
  Plus,
  Search,
  Settings,
  Zap,
} from 'lucide-react'

/** Mirrors desktop `LocalLibrary` folder grid (Collections). */
const MOCK_FOLDERS: { id: string; name: string; count: number }[] = [
  { id: '1', name: 'Webnovels', count: 518 },
  { id: '2', name: 'Classics', count: 206 },
  { id: '3', name: 'Nonfiction', count: 94 },
  { id: '4', name: 'Short fiction', count: 42 },
]

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
  {
    id: 'u2',
    book: 'The Hound of the Baskervilles',
    chapter: 'Chapter 3',
    meta: '6.8 hr · 412 MB',
    fmt: 'MP3',
  },
  {
    id: 'u3',
    book: 'Moby-Dick',
    chapter: 'Chapter 36',
    meta: '18.4 hr · 2.4 GB',
    fmt: 'FLAC',
  },
  {
    id: 'u4',
    book: 'Worm',
    chapter: 'Arc 12, Chapter 5',
    meta: '142.6 hr · 8.9 GB',
    fmt: 'M4A',
  },
]

/**
 * Static, non-interactive mock of the desktop library: window chrome, sidebar,
 * Collections → Drafts → Unsorted Files; full height so page scroll reveals all.
 */
export function LocalLibraryPreview() {
  const diskGb = '35.6'

  const navBtn =
    'flex w-full items-center gap-2.5 rounded-xl border border-transparent px-3 py-2.5 text-left text-xs font-semibold sm:text-sm'

  return (
    <div className="mt-8 select-none lg:mt-10">
      <div className="flex flex-col overflow-visible rounded-2xl border border-white/10 bg-[#0B0B0F] shadow-[0_24px_80px_-20px_rgba(0,0,0,0.8)]">
        {/* Window title bar */}
        <div className="flex shrink-0 items-center gap-3 border-b border-white/10 bg-[#12121a] px-3 py-2 sm:px-4">
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
          <aside className="flex w-[8.5rem] shrink-0 flex-col border-r border-white/10 bg-[#0e0e11]/95 sm:w-44">
            <div className="flex items-center gap-2 border-b border-white/5 px-3 py-3 sm:px-3.5 sm:py-4">
              <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg sm:h-9 sm:w-9">
                <div className="relative flex h-3.5 items-center gap-[2px] sm:h-5 sm:gap-[3px]">
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
            <nav className="flex flex-col gap-1.5 p-2 sm:p-2.5">
              <div className={`${navBtn} text-gray-400`}>
                <Zap className="h-4 w-4 shrink-0 opacity-80" />
                <span className="truncate">Text-to-Speech</span>
              </div>
              <div
                className={`${navBtn} border-purple-500/30 bg-purple-600/20 text-purple-300 shadow-[0_0_10px_rgba(139,92,246,0.08)]`}
              >
                <Layers className="h-4 w-4 shrink-0" />
                <span className="truncate">Local Library</span>
              </div>
              <div className={`${navBtn} text-gray-400`}>
                <Settings className="h-4 w-4 shrink-0 opacity-80" />
                <span className="truncate">Settings</span>
              </div>
            </nav>
          </aside>

          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex shrink-0 flex-col gap-4 border-b border-white/5 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-600/20 sm:h-10 sm:w-10">
                  <FolderOpen className="h-4 w-4 text-purple-400 sm:h-5 sm:w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold tracking-wider text-white uppercase sm:text-lg">
                    Local Library
                  </h3>
                  <p className="text-xs text-gray-500">{diskGb} GB local</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <div className="relative min-w-[8rem] flex-1 sm:max-w-xs">
                  <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-gray-500 sm:left-3" />
                  <div
                    className="rounded-lg border border-white/10 bg-white/5 py-2 pr-3 pl-9 text-xs text-gray-500 sm:text-sm sm:pl-10"
                    aria-hidden
                  >
                    Search local files…
                  </div>
                </div>
                <div
                  className="rounded-lg border border-white/10 bg-white/5 p-2 text-gray-400"
                  aria-hidden
                >
                  <Filter className="h-4 w-4" />
                </div>
                <div
                  className="rounded-lg border border-white/10 bg-white/5 p-2 text-gray-400"
                  aria-hidden
                >
                  <Clock className="h-4 w-4" />
                </div>
              </div>
            </div>

            <div className="shrink-0 border-b border-white/5 bg-gradient-to-r from-purple-600/10 via-transparent to-emerald-600/5 px-3 py-3 sm:px-5 sm:py-4">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                    Total audio in library
                  </p>
                  <p className="text-2xl font-black tracking-tight text-white sm:text-3xl md:text-4xl">
                    <span className="bg-gradient-to-r from-white via-violet-200 to-emerald-300/90 bg-clip-text text-transparent">
                      3,284.7
                    </span>
                    <span className="ml-1.5 text-base font-bold text-gray-400 sm:text-lg">
                      hours
                    </span>
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                    Disk space used
                  </p>
                  <p className="font-mono text-base text-gray-300 sm:text-lg">
                    {diskGb} GB
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6 p-3 sm:space-y-8 sm:p-5 sm:pt-4">
              <div>
                <div className="mb-3 flex items-center justify-between sm:mb-4">
                  <h4 className="text-xs font-bold tracking-wider text-gray-400 uppercase sm:text-sm">
                    Collections
                  </h4>
                  <span className="inline-flex items-center gap-1 rounded-lg border border-purple-500/30 bg-purple-600/20 px-2 py-1 text-[10px] font-bold text-purple-400 sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs">
                    <FolderPlus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    New Folder
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4">
                  {MOCK_FOLDERS.map((f) => (
                    <div
                      key={f.id}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 sm:p-5"
                    >
                      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-600/30 to-blue-600/30 sm:mb-3 sm:h-12 sm:w-12">
                        <FolderOpen className="h-5 w-5 text-purple-400 sm:h-6 sm:w-6" />
                      </div>
                      <h4 className="truncate text-xs font-semibold text-white sm:text-sm">
                        {f.name}
                      </h4>
                      <p className="mt-0.5 text-[10px] text-gray-500 sm:mt-1 sm:text-xs">
                        {f.count} file{f.count !== 1 ? 's' : ''}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between sm:mb-4">
                  <h4 className="text-xs font-bold tracking-wider text-gray-400 uppercase sm:text-sm">
                    Drafts
                  </h4>
                  <span className="inline-flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/20 px-2 py-1 text-[10px] font-bold text-amber-400 sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs">
                    <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    New Draft
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4">
                  {MOCK_DRAFTS.map((d) => (
                    <div
                      key={d.id}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 sm:p-5"
                    >
                      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/30 to-orange-600/30 sm:mb-3 sm:h-12 sm:w-12">
                        <FileText className="h-5 w-5 text-amber-400 sm:h-6 sm:w-6" />
                      </div>
                      <h4 className="truncate text-xs font-semibold text-white sm:text-sm">
                        {d.title}
                      </h4>
                      <p className="mt-0.5 text-[10px] text-gray-500 sm:mt-1 sm:text-xs">
                        {d.chapters} chapter{d.chapters !== 1 ? 's' : ''} • {d.date}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pb-2">
                <h4 className="mb-3 text-xs font-bold tracking-wider text-gray-400 uppercase sm:mb-4 sm:text-sm">
                  Unsorted Files
                </h4>
                <div className="rounded-xl border border-white/10 bg-black/20 p-2 sm:p-3">
                  {UNSORTED_CHAPTERS.map((row) => (
                    <div
                      key={row.id}
                      className="mb-2 flex items-center gap-3 rounded-xl border border-transparent bg-white/[0.02] px-3 py-2.5 last:mb-0 sm:gap-4 sm:px-4 sm:py-3"
                    >
                      <div
                        className="h-3.5 w-3.5 shrink-0 rounded border border-white/20 bg-black/40 sm:h-4 sm:w-4"
                        aria-hidden
                      />
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-600/20 to-blue-600/20 sm:h-10 sm:w-10">
                        <Files className="h-4 w-4 text-purple-400 sm:h-5 sm:w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-xs font-medium text-white sm:text-sm">
                          {row.book} — {row.chapter}
                        </div>
                        <div className="text-[10px] text-gray-500 sm:text-xs">
                          {row.meta}
                        </div>
                      </div>
                      <span className="shrink-0 rounded-lg border border-purple-500/30 bg-purple-500/15 px-2 py-0.5 text-[9px] font-bold text-purple-400 sm:px-2.5 sm:py-1 sm:text-[10px]">
                        {row.fmt}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
