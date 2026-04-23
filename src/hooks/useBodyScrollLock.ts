import { useEffect } from 'react'

let lockCount = 0
let savedHtmlOverflow = ''
let savedBodyOverflow = ''

function applyBodyScrollLock() {
  const html = document.documentElement
  const body = document.body
  if (lockCount === 0) {
    savedHtmlOverflow = html.style.overflow
    savedBodyOverflow = body.style.overflow
    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
  }
  lockCount += 1
}

function releaseBodyScrollLock() {
  const html = document.documentElement
  const body = document.body
  lockCount = Math.max(0, lockCount - 1)
  if (lockCount === 0) {
    html.style.overflow = savedHtmlOverflow
    body.style.overflow = savedBodyOverflow
  }
}

/**
 * Locks document scroll while `locked` is true. Supports nested locks (e.g. two
 * modals); scroll is restored only when the last lock releases. Always restores
 * previous inline `overflow` on `html` / `body` on cleanup.
 */
export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return
    applyBodyScrollLock()
    return () => {
      releaseBodyScrollLock()
    }
  }, [locked])
}
