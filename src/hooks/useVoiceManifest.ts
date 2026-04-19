import { useEffect, useState } from 'react'
import {
  DEFAULT_VOICES,
  normalizeVoices,
  resolveVoices,
  type ResolvedVoice,
} from '../lib/voiceManifest'

/** Loads `/voices/manifest.json` (falls back to defaults). */
export function useVoiceManifest(): ResolvedVoice[] {
  const [voices, setVoices] = useState<ResolvedVoice[]>(() =>
    resolveVoices(DEFAULT_VOICES),
  )

  useEffect(() => {
    const url = `${import.meta.env.BASE_URL.replace(/\/?$/, '/')}voices/manifest.json`
    let cancelled = false
    fetch(url, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('manifest'))))
      .then((data) => {
        if (cancelled) return
        setVoices(resolveVoices(normalizeVoices(data)))
      })
      .catch(() => {
        if (cancelled) return
        setVoices(resolveVoices(DEFAULT_VOICES))
      })
    return () => {
      cancelled = true
    }
  }, [])

  return voices
}
