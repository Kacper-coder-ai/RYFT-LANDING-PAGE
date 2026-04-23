import { useCallback, useEffect, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'
import { useVoiceManifest } from '../hooks/useVoiceManifest'
import { type ResolvedVoice } from '../lib/voiceManifest'

const MARQUEE_STRIP_KEYS = ['a', 'b', 'c', 'd', 'e', 'f'] as const

function useSamplePlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [activeVoiceId, setActiveVoiceId] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const playSample = useCallback((voice: ResolvedVoice) => {
    const src = voice.audioUrl
    if (!src) return

    // Same voice: toggle play / pause (use element state, not stale React state)
    if (activeVoiceId === voice.id && audioRef.current) {
      if (!audioRef.current.paused) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            setIsPlaying(false)
            setActiveVoiceId(null)
            if (audioRef.current) audioRef.current = null
          })
      }
      return
    }

    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }

    const a = new Audio(src)
    audioRef.current = a

    const clear = () => {
      setIsPlaying(false)
      setActiveVoiceId(null)
      if (audioRef.current === a) audioRef.current = null
    }

    setActiveVoiceId(voice.id)
    a.addEventListener('ended', clear)
    a.addEventListener('error', clear)
    a.play()
      .then(() => setIsPlaying(true))
      .catch(clear)
  }, [activeVoiceId])

  return { playSample, activeVoiceId, isPlaying }
}

function VoiceMarqueeCard({
  voice,
  ariaHidden,
  activeVoiceId,
  isPlaying,
  onPlaySample,
}: {
  voice: ResolvedVoice
  ariaHidden?: boolean
  activeVoiceId: string | null
  isPlaying: boolean
  onPlaySample: (v: ResolvedVoice) => void
}) {
  const [imgFailed, setImgFailed] = useState(() => !voice.imageUrl)
  const showEmoji = !voice.imageUrl || imgFailed
  const isThisVoice = activeVoiceId === voice.id
  const showPause = isThisVoice && isPlaying && !!voice.audioUrl
  const hasAudio = !!voice.audioUrl

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
        hasAudio
          ? showPause
            ? `Pause sample: ${voice.name}`
            : isThisVoice && !isPlaying
              ? `Resume sample: ${voice.name}`
              : `Play sample: ${voice.name}`
          : `Voice preset: ${voice.name}`
      }
    >
      <div
        className={`relative h-32 w-32 shrink-0 transition-all duration-300 group-hover:scale-110 ${isThisVoice && isPlaying ? 'drop-shadow-[0_0_12px_rgba(34,211,238,0.45)]' : ''} ${isThisVoice && !isPlaying && hasAudio ? 'drop-shadow-[0_0_10px_rgba(251,191,36,0.35)]' : ''}`}
      >
        <div
          className={`relative flex h-full w-full items-center justify-center overflow-hidden rounded-full border-4 border-blue-500/30 bg-gray-900 shadow-[0_0_40px_rgba(59,130,246,0.3)] transition-all duration-300 group-hover:border-blue-400 group-hover:shadow-[0_0_60px_rgba(59,130,246,0.5)] ${isThisVoice && isPlaying ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#0B0B0F]' : ''} ${isThisVoice && !isPlaying && hasAudio ? 'ring-2 ring-amber-400/80 ring-offset-2 ring-offset-[#0B0B0F]' : ''}`}
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
          <div className="pointer-events-none absolute inset-0 bg-blue-500/10 mix-blend-overlay" />
        </div>
        {/* Outside overflow-hidden so the control is never clipped by the circle */}
        <div className="absolute -right-0.5 -bottom-0.5 z-30 flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-[#0B0B0F] bg-white shadow-[0_4px_14px_rgba(0,0,0,0.45)] ring-1 ring-white/40">
          {showPause ? (
            <Pause
              className="relative h-[18px] w-[18px] text-black"
              strokeWidth={2.5}
              aria-hidden
            />
          ) : (
            <Play
              className="relative left-0.5 h-[18px] w-[18px] text-black"
              strokeWidth={2.5}
              aria-hidden
            />
          )}
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
  activeVoiceId,
  isPlaying,
  onPlaySample,
}: {
  stripKey: string
  voices: ResolvedVoice[]
  ariaHidden?: boolean
  activeVoiceId: string | null
  isPlaying: boolean
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
          activeVoiceId={activeVoiceId}
          isPlaying={isPlaying}
          onPlaySample={onPlaySample}
        />
      ))}
    </div>
  )
}

export function VoiceMarquee() {
  const voices = useVoiceManifest()
  const { playSample, activeVoiceId, isPlaying } = useSamplePlayer()

  return (
    <>
      <div className="pointer-events-none absolute top-0 left-0 z-20 h-full w-12 bg-gradient-to-r from-[#0B0B0F] to-transparent sm:w-20 md:w-48" />
      <div className="pointer-events-none absolute top-0 right-0 z-20 h-full w-12 bg-gradient-to-l from-[#0B0B0F] to-transparent sm:w-20 md:w-48" />

      <div className="relative w-full overflow-hidden py-2">
        <div className="animate-scroll">
          {MARQUEE_STRIP_KEYS.map((key, i) => (
            <VoiceMarqueeStrip
              key={key}
              stripKey={key}
              voices={voices}
              ariaHidden={i !== 0}
              activeVoiceId={activeVoiceId}
              isPlaying={isPlaying}
              onPlaySample={playSample}
            />
          ))}
        </div>
      </div>
    </>
  )
}
