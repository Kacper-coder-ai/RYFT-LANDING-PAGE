export type VoiceManifestEntry = {
  id: string
  name: string
  /** Shown if image is missing or fails to load */
  emoji?: string
  /**
   * Image path: `images/photo.webp` → served from `/voices/images/photo.webp`,
   * or an absolute URL/path starting with `/` or `http(s)://`.
   */
  image?: string
  /**
   * Sample clip: `audio/clip.mp3` → `/voices/audio/clip.mp3`,
   * or absolute `/…` / full URL.
   */
  sampleAudio?: string
}

export type ResolvedVoice = VoiceManifestEntry & {
  imageUrl?: string
  audioUrl?: string
}

const DEFAULT_VOICES: VoiceManifestEntry[] = [
  { id: 'v1', name: 'Voice 1', emoji: '🤞' },
  { id: 'v2', name: 'Voice 2', emoji: '🗡️' },
  { id: 'v3', name: 'Voice 3', emoji: '🎭' },
  { id: 'v4', name: 'Voice 4', emoji: '👹' },
  { id: 'v5', name: 'Voice 5', emoji: '🔥' },
  { id: 'v6', name: 'Voice 6', emoji: '⚔️' },
]

/** Paths in manifest are relative to `/voices/` unless already absolute. */
export function resolveVoiceAssetUrl(
  path: string | undefined | null,
): string | undefined {
  if (path == null || String(path).trim() === '') return undefined
  const p = String(path).trim()
  if (p.startsWith('http://') || p.startsWith('https://') || p.startsWith('/')) {
    return p
  }
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/')
  return `${base}voices/${p.replace(/^\//, '')}`
}

export function normalizeVoices(raw: unknown): VoiceManifestEntry[] {
  if (!raw || typeof raw !== 'object') return DEFAULT_VOICES
  const voices = (raw as { voices?: unknown }).voices
  if (!Array.isArray(voices) || voices.length === 0) return DEFAULT_VOICES
  const out: VoiceManifestEntry[] = []
  for (const item of voices) {
    if (!item || typeof item !== 'object') continue
    const v = item as Record<string, unknown>
    const id = typeof v.id === 'string' ? v.id : ''
    const name = typeof v.name === 'string' ? v.name : ''
    if (!id || !name) continue
    out.push({
      id,
      name,
      emoji: typeof v.emoji === 'string' ? v.emoji : undefined,
      image: typeof v.image === 'string' ? v.image : undefined,
      sampleAudio:
        typeof v.sampleAudio === 'string' ? v.sampleAudio : undefined,
    })
  }
  return out.length > 0 ? out : DEFAULT_VOICES
}

export function resolveVoices(list: VoiceManifestEntry[]): ResolvedVoice[] {
  return list.map((v) => ({
    ...v,
    imageUrl: resolveVoiceAssetUrl(v.image),
    audioUrl: resolveVoiceAssetUrl(v.sampleAudio),
  }))
}

export { DEFAULT_VOICES }
