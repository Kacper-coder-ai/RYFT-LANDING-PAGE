import { useCallback, useEffect, useRef, useState } from 'react'
import { Play } from 'lucide-react'
import { useVoiceManifest } from '../hooks/useVoiceManifest'
import { type ResolvedVoice } from '../lib/voiceManifest'

const MARQUEE_STRIP_KEYS = ['a', 'b', 'c', 'd', 'e', 'f'] as const

function useSamplePlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playingId, setPlayingId] = useState<string | null>(null)

  const playSample = useCallback((voice: ResolvedVoice) => {
    const src = voice.audioUrl
    if (!src) return

    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }

    const a = new Audio(src)
    audioRef.current = a

    const clear = () => {
      setPlayingId(null)
      if (audioRef.current === a) audioRef.current = null
    }

    setPlayingId(voice.id)
    a.addEventListener('ended', clear)
    a.addEventListener('error', clear)
    a.play().catch(clear)
  }, [])

  return { playSample, playingId }
}

function VoiceMarqueeCard({
  voice,
  ariaHidden,
  isPlaying,
  onPlaySample,
}: {
  voice: ResolvedVoice
  ariaHidden?: boolean
  isPlaying: boolean
  onPlaySample: (v: ResolvedVoice) => void
}) {
  const [imgFailed, setImgFailed] = useState(() => !voice.imageUrl)
  const showEmoji = !voice.imageUrl || imgFailed

  useEffect(() => {
    setImgFailed(!voice.imageUrl)
  }, [voice.imageUrl])

  return (
    <button
      type="button"
      tabIndex={ariaHidden ? -1 : 0}
      className="group flex w-[120px] shrink-0 cursor-pointer flex-col items-center gap-4 outline-none"
      onClick={() => onPlaySample(voice)}
      aria-label={
        voice.audioUrl
          ? `Play sample: ${voice.name}`
          : `Voice preset: ${voice.name}`
      }
    >
      <div
        className={`relative flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-blue-500/30 bg-gray-900 shadow-[0_0_40px_rgba(59,130,246,0.3)] transition-all duration-300 group-hover:scale-110 group-hover:border-blue-400 group-hover:shadow-[0_0_60px_rgba(59,130,246,0.5)] ${isPlaying ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#0B0B0F]' : ''}`}
      >
        {showEmoji ? (
          <span className="z-10 scale-110 text-6xl drop-shadow-lg filter">
            {voice.emoji ?? '🔊'}
          </span>
        ) : (
          <img
            src={voice.imageUrl}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
            onError={() => setImgFailed(true)}
          />
        )}
        <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay" />
        <div className="absolute right-2 bottom-2 z-20 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-black bg-white shadow-lg">
          <Play
            className="relative left-px h-4 w-4 text-black"
            strokeWidth={2.25}
            aria-hidden
          />
        </div>
      </div>
      <div className="flex h-8 min-h-8 w-full items-center justify-center px-1">
        <span className="truncate text-center text-xl font-bold text-white transition group-hover:text-blue-400">
          {voice.name}
        </span>
      </div>
    </button>
  )
}

function VoiceMarqueeStrip({
  stripKey,
  voices,
  ariaHidden,
  playingId,
  onPlaySample,
}: {
  stripKey: string
  voices: ResolvedVoice[]
  ariaHidden?: boolean
  playingId: string | null
  onPlaySample: (v: ResolvedVoice) => void
}) {
  return (
    <div
      className="flex shrink-0 items-start gap-16 pr-16 md:gap-24 md:pr-24"
      aria-hidden={ariaHidden}
    >
      {voices.map((voice) => (
        <VoiceMarqueeCard
          key={`${stripKey}-${voice.id}`}
          voice={voice}
          ariaHidden={ariaHidden}
          isPlaying={playingId === voice.id}
          onPlaySample={onPlaySample}
        />
      ))}
    </div>
  )
}

export function VoiceMarquee() {
  const voices = useVoiceManifest()
  const { playSample, playingId } = useSamplePlayer()

  return (
    <>
      <div className="pointer-events-none absolute top-0 left-0 z-20 h-full w-24 bg-gradient-to-r from-[#0B0B0F] to-transparent md:w-48" />
      <div className="pointer-events-none absolute top-0 right-0 z-20 h-full w-24 bg-gradient-to-l from-[#0B0B0F] to-transparent md:w-48" />

      <div className="relative w-full overflow-hidden py-2">
        <div className="animate-scroll">
          {MARQUEE_STRIP_KEYS.map((key, i) => (
            <VoiceMarqueeStrip
              key={key}
              stripKey={key}
              voices={voices}
              ariaHidden={i !== 0}
              playingId={playingId}
              onPlaySample={playSample}
            />
          ))}
        </div>
      </div>
    </>
  )
}
