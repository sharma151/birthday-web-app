"use client"

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { AudioEngine } from "@/lib/audio-engine"

type SfxName = "horn" | "cheer" | "pop"

type AudioContextValue = {
  muted: boolean
  musicStarted: boolean
  startMusic: () => void
  toggleMute: () => void
  playSfx: (name: SfxName) => void
}

const AudioCtx = createContext<AudioContextValue | null>(null)

export function AudioProvider({ children }: { children: ReactNode }) {
  const engineRef = useRef<AudioEngine | null>(null)
  const [muted, setMuted] = useState(false)
  const [musicStarted, setMusicStarted] = useState(false)

  useEffect(() => {
    engineRef.current = new AudioEngine()
    return () => {
      engineRef.current?.dispose()
      engineRef.current = null
    }
  }, [])

  const value = useMemo<AudioContextValue>(
    () => ({
      muted,
      musicStarted,
      startMusic: () => {
        engineRef.current?.startMusic()
        setMusicStarted(true)
      },
      toggleMute: () => {
        const next = engineRef.current?.toggleMute() ?? false
        setMuted(next)
      },
      playSfx: (name: SfxName) => engineRef.current?.playSfx(name),
    }),
    [muted, musicStarted],
  )

  return <AudioCtx.Provider value={value}>{children}</AudioCtx.Provider>
}

export function useAudio() {
  const ctx = useContext(AudioCtx)
  if (!ctx) throw new Error("useAudio must be used within AudioProvider")
  return ctx
}
