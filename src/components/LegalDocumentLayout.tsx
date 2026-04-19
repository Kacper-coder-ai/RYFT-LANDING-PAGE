import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

export function LegalDocumentLayout({
  title,
  lastUpdated,
  children,
}: {
  title: string
  lastUpdated: string
  children: ReactNode
}) {
  useEffect(() => {
    document.body.classList.add('allow-body-scroll')
    return () => {
      document.body.classList.remove('allow-body-scroll')
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white">
      <header className="border-b border-white/10 bg-black/40 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link
            to="/"
            className="text-sm font-medium text-gray-400 transition hover:text-white"
          >
            ← Back to RYFT
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="mb-2 text-3xl font-black tracking-tight">{title}</h1>
        <p className="mb-10 text-sm text-gray-500">Last updated: {lastUpdated}</p>
        <div className="space-y-8 text-sm leading-relaxed text-gray-300">
          {children}
        </div>
      </main>
    </div>
  )
}
