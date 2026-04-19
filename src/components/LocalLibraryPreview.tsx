import {
  Files,
  Filter,
  FolderOpen,
  HardDrive,
  RefreshCw,
  Search,
} from 'lucide-react'

const FOLDERS: {
  id: string
  name: string
  files: number
  active: boolean
}[] = [
  { id: 'all', name: 'All audio', files: 1240, active: false },
  { id: 'web', name: 'Webnovels', files: 518, active: true },
  { id: 'classic', name: 'Classics', files: 206, active: false },
  { id: 'exp', name: 'Exports', files: 94, active: false },
  { id: 'extra', name: 'Other drives', files: 412, active: false },
]

const COLLECTIONS = [
  { name: 'Pride & Prejudice', files: 24 },
  { name: 'Sci-Fi queue', files: 18 },
  { name: 'Imported', files: 112 },
  { name: 'Archive', files: 340 },
] as const

const FILE_ROWS = [
  {
    name: 'pride_prejudice_batch_01-12.wav',
    meta: '4.2 hr · 1.1 GB',
    fmt: 'WAV',
  },
  {
    name: 'sherlock_vol1_master_norm.mp3',
    meta: '6.8 hr · 412 MB',
    fmt: 'MP3',
  },
  {
    name: 'moby_dick_full_audiobook.flac',
    meta: '18.4 hr · 2.4 GB',
    fmt: 'FLAC',
  },
  {
    name: 'worm_arc12_combined.m4a',
    meta: '142.6 hr · 8.9 GB',
    fmt: 'M4A',
  },
] as const

type LocalLibraryPreviewProps = {
  /** When false, the mock is view-only (no clicks, no text selection). */
  interactive?: boolean
}

/** Static mockup aligned with RYFT Desktop `LocalLibrary` — folders, collections, file rows. */
export function LocalLibraryPreview({
  interactive = true,
}: LocalLibraryPreviewProps) {
  const rowHover = interactive
    ? 'hover:border-white/10 hover:bg-white/[0.04]'
    : ''
  const collectionHover = interactive
    ? 'hover:border-purple-500/30 hover:bg-white/[0.05]'
    : ''

  return (
    <div
      className={`mt-8 lg:mt-10 ${
        interactive ? '' : 'pointer-events-none select-none'
      }`}
    >
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0B0B0F] shadow-[0_24px_80px_-20px_rgba(0,0,0,0.8)]">
        <div className="flex flex-col md:flex-row md:items-stretch">
          {/* Sidebar — folders */}
          <aside className="shrink-0 border-b border-white/5 bg-black/30 md:w-52 md:border-r md:border-b-0">
            <div className="border-b border-white/5 px-4 py-3">
              <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                <HardDrive className="h-3.5 w-3.5" />
                Folders
              </div>
            </div>
            <nav className="p-2">
              {FOLDERS.map((f) => {
                const rowClass = `mb-1 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                  f.active
                    ? 'bg-purple-600/20 text-white ring-1 ring-purple-500/35'
                    : `text-gray-400 ${
                        interactive
                          ? 'hover:bg-white/[0.04] hover:text-gray-200'
                          : ''
                      }`
                }`
                return interactive ? (
                  <button
                    key={f.id}
                    type="button"
                    tabIndex={-1}
                    className={rowClass}
                    aria-hidden
                  >
                    <FolderOpen className="h-4 w-4 shrink-0 text-purple-400/90" />
                    <span className="min-w-0 flex-1 truncate font-medium">
                      {f.name}
                    </span>
                    <span className="shrink-0 text-[10px] text-gray-500">
                      {f.files}
                    </span>
                  </button>
                ) : (
                  <div key={f.id} className={rowClass} aria-hidden>
                    <FolderOpen className="h-4 w-4 shrink-0 text-purple-400/90" />
                    <span className="min-w-0 flex-1 truncate font-medium">
                      {f.name}
                    </span>
                    <span className="shrink-0 text-[10px] text-gray-500">
                      {f.files}
                    </span>
                  </div>
                )
              })}
            </nav>
          </aside>

          {/* Main panel */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-4 border-b border-white/5 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600/20">
                  <FolderOpen className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold tracking-wider text-white uppercase">
                      Local Library
                    </h3>
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                      <HardDrive className="h-3 w-3" />
                      On disk
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Thousands of hours—search, filter, and manage in one place.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative min-w-[10rem] flex-1 sm:max-w-xs">
                  <Search className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-gray-500" />
                  <div className="rounded-lg border border-white/10 bg-white/5 py-2 pr-3 pl-9 text-xs text-gray-500">
                    Search audio…
                  </div>
                </div>
                {interactive ? (
                  <>
                    <button
                      type="button"
                      tabIndex={-1}
                      className="rounded-lg border border-white/10 bg-white/5 p-2 text-gray-400"
                      aria-hidden
                    >
                      <Filter className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      tabIndex={-1}
                      className="rounded-lg border border-white/10 bg-white/5 p-2 text-gray-400"
                      aria-hidden
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <>
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
                      <RefreshCw className="h-4 w-4" />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Hero stats */}
            <div className="border-b border-white/5 bg-gradient-to-r from-purple-600/10 via-transparent to-emerald-600/5 px-4 py-4 sm:px-5">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                    Total audio in library
                  </p>
                  <p className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                    <span className="bg-gradient-to-r from-white via-violet-200 to-emerald-300/90 bg-clip-text text-transparent">
                      3,284.7
                    </span>
                    <span className="ml-1.5 text-lg font-bold text-gray-400">
                      hours
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                    Disk space used
                  </p>
                  <p className="font-mono text-lg text-gray-300">35.6 GB</p>
                </div>
              </div>
            </div>

            {/* Collections grid — matches desktop “Collections” */}
            <div className="border-b border-white/5 px-4 py-4 sm:px-5">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                  Collections
                </h4>
                <span className="rounded-lg border border-purple-500/30 bg-purple-600/15 px-2 py-1 text-[10px] font-bold text-purple-300">
                  New folder
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
                {COLLECTIONS.map((c) => (
                  <div
                    key={c.name}
                    className={`rounded-xl border border-white/10 bg-white/[0.03] p-3 transition ${collectionHover}`}
                  >
                    <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600/30 to-blue-600/30 border border-purple-500/30">
                      <FolderOpen className="h-4 w-4 text-purple-400" />
                    </div>
                    <div className="truncate text-xs font-semibold text-white">
                      {c.name}
                    </div>
                    <div className="text-[10px] text-gray-500">
                      {c.files} files
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* File rows — matches desktop file cards */}
            <div className="max-h-[220px] overflow-y-auto p-3 sm:p-4">
              {FILE_ROWS.map((row) => (
                <div
                  key={row.name}
                  className={`mb-2 flex cursor-default items-center gap-3 rounded-xl border border-transparent bg-white/[0.02] px-3 py-2.5 last:mb-0 ${rowHover}`}
                >
                  <div className="h-4 w-4 shrink-0 rounded border border-white/20 bg-black/40" />
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-600/20 to-blue-600/20">
                    <Files className="h-4 w-4 text-purple-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-medium text-white sm:text-sm">
                      {row.name}
                    </div>
                    <div className="text-[10px] text-gray-500 sm:text-xs">
                      {row.meta}
                    </div>
                  </div>
                  <span className="shrink-0 rounded-lg border border-purple-500/30 bg-purple-500/15 px-2 py-0.5 text-[9px] font-bold text-purple-300">
                    {row.fmt}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
