"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Music, PartyPopper, Volume2, VolumeX } from "lucide-react"
import { useAudio } from "./audio-provider"
import { burstConfetti } from "@/lib/confetti"

export function ControlTray() {
  const { muted, toggleMute, playSfx } = useAudio()
  const [open, setOpen] = useState(false)

  const soundboard = [
    { label: "Party Horn", emoji: "🎺", action: () => playSfx("horn") },
    { label: "Crowd Cheer", emoji: "👏", action: () => playSfx("cheer") },
    {
      label: "Confetti Pop",
      emoji: "🎉",
      action: () => {
        playSfx("pop")
        burstConfetti({ origin: { x: 0.85, y: 0.15 } })
      },
    },
  ]

  return (
    <div className="fixed right-3 top-3 z-50 flex flex-col items-end gap-2 sm:right-5 sm:top-5">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Unmute music" : "Mute music"}
          className="flex size-11 items-center justify-center rounded-full border border-border/60 bg-card/70 text-foreground shadow-lg backdrop-blur-md transition-transform hover:scale-105 active:scale-95"
        >
          {muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
        </button>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle DJ soundboard"
          aria-expanded={open}
          className="flex size-11 items-center justify-center rounded-full border border-border/60 bg-card/70 text-primary shadow-lg backdrop-blur-md transition-transform hover:scale-105 active:scale-95"
        >
          <Music className="size-5" />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="flex w-48 flex-col gap-1.5 rounded-2xl border border-border/60 bg-card/80 p-2 shadow-xl backdrop-blur-md"
          >
            <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">
              <PartyPopper className="size-3.5 text-primary" />
              DJ Soundboard
            </div>
            {soundboard.map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={s.action}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-foreground transition-colors hover:bg-secondary/70"
              >
                <span aria-hidden className="text-base">
                  {s.emoji}
                </span>
                {s.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
