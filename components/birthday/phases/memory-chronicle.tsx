"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import { ArrowRight, X } from "lucide-react"
import { useAudio } from "../audio-provider"
import { popAt } from "@/lib/confetti"

type Memory = { year: string; src: string; caption: string }

const MEMORIES: Memory[] = [
  { year: "2023", src: "/memories/cafe.png", caption: "Where it all began ☕" },
  { year: "2024", src: "/memories/roadtrip.png", caption: "Chasing sunsets 🚗" },
  { year: "2025", src: "/memories/concert.png", caption: "Loudest nights 🎶" },
  { year: "2026", src: "/memories/trip-beach.png", caption: "Our best year yet ☀️" },
]

const FLOATERS = [
  { id: 1, x: 6, color: "#f6a5c0", delay: 0 },
  { id: 2, x: 90, color: "#a0e7c6", delay: 2.5 },
  { id: 3, x: 3, color: "#b8a6f0", delay: 5 },
]

export function MemoryChronicle({ onComplete }: { onComplete: () => void }) {
  const { playSfx } = useAudio()
  const [active, setActive] = useState(0)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [secretOpen, setSecretOpen] = useState(false)

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: -py * 14, y: px * 14 })
  }

  const popFloater = (e: React.MouseEvent | React.TouchEvent) => {
    playSfx("pop")
    let cx = 0.5
    let cy = 0.3
    if ("clientX" in e) {
      cx = e.clientX / window.innerWidth
      cy = e.clientY / window.innerHeight
    }
    popAt(cx, cy, "#b8a6f0")
    setSecretOpen(true)
  }

  return (
    <div className="flex w-full max-w-3xl flex-col items-center text-center">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 text-balance font-serif text-3xl font-bold leading-tight text-foreground sm:text-4xl"
      >
        Our Memory Chronicle 📸
      </motion.h2>
      <p className="z-10 mt-2 text-sm font-semibold text-muted-foreground">
        Swipe through the years — and catch a floating balloon for a secret.
      </p>

      {/* Floating memory balloons */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {FLOATERS.map((f) => (
          <motion.button
            key={f.id}
            type="button"
            aria-label="Pop secret balloon"
            className="pointer-events-auto absolute cursor-pointer"
            style={{ left: `${f.x}%`, width: 42 }}
            initial={{ y: "110vh" }}
            animate={{ y: "-120vh", x: [0, 18, -18, 0] }}
            transition={{
              y: { duration: 14, delay: f.delay, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
              x: { duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
            }}
            onClick={popFloater}
            onTouchStart={popFloater}
          >
            <svg width="42" height="52" viewBox="0 0 60 75" className="drop-shadow-lg">
              <ellipse cx="30" cy="30" rx="26" ry="30" fill={f.color} />
              <ellipse cx="22" cy="20" rx="7" ry="10" fill="rgba(255,255,255,0.35)" />
              <polygon points="26,58 34,58 30,64" fill={f.color} />
            </svg>
          </motion.button>
        ))}
      </div>

      {/* Cover flow */}
      <div
        className="relative z-10 mt-12 flex h-72 w-full items-center justify-center"
        style={{ perspective: 1000 }}
      >
        {MEMORIES.map((m, i) => {
          const offset = i - active
          const isActive = offset === 0
          return (
            <motion.div
              key={m.year}
              className="absolute w-52 cursor-pointer"
              onClick={() => setActive(i)}
              onMouseMove={isActive ? onMove : undefined}
              onMouseLeave={isActive ? () => setTilt({ x: 0, y: 0 }) : undefined}
              animate={{
                x: offset * 140,
                scale: isActive ? 1 : 0.78,
                rotateY: isActive ? tilt.y : offset > 0 ? -32 : 32,
                rotateX: isActive ? tilt.x : 0,
                zIndex: 10 - Math.abs(offset),
                opacity: Math.abs(offset) > 2 ? 0 : 1,
                filter: isActive ? "brightness(1)" : "brightness(0.82)",
              }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="rounded-sm bg-card p-2.5 pb-9 shadow-2xl">
                <div className="relative aspect-square w-full overflow-hidden bg-muted">
                  <Image src={m.src || "/placeholder.svg"} alt={m.caption} fill className="object-cover" sizes="208px" />
                </div>
                <p className="absolute inset-x-0 bottom-2.5 text-center font-serif text-sm font-semibold text-foreground">
                  {m.caption}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Timeline */}
      <div className="z-10 mt-10 flex w-full max-w-md items-center justify-between">
        <div className="absolute left-0 right-0 -z-0 mx-auto h-0.5 w-[min(28rem,80%)] bg-border" aria-hidden />
        {MEMORIES.map((m, i) => (
          <button
            key={m.year}
            type="button"
            onClick={() => setActive(i)}
            className="relative flex flex-col items-center gap-1.5"
          >
            <span
              className={`size-4 rounded-full border-2 transition-all ${
                i === active ? "scale-125 border-primary bg-primary" : "border-border bg-card"
              }`}
            />
            <span
              className={`text-xs font-bold transition-colors ${
                i === active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {m.year}
            </span>
          </button>
        ))}
      </div>

      <motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onComplete}
        className="z-10 mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-lg font-bold text-primary-foreground shadow-xl"
      >
        Open Your Final Gift <ArrowRight className="size-5" />
      </motion.button>

      {/* Secret polaroid */}
      <AnimatePresence>
        {secretOpen && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSecretOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: -2 }}
              exit={{ opacity: 0, scale: 0.85 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xs rounded-sm bg-card p-3 pb-12 shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setSecretOpen(false)}
                aria-label="Close"
                className="absolute -right-3 -top-3 flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
              >
                <X className="size-4" />
              </button>
              <div className="relative aspect-square w-full overflow-hidden bg-muted">
                <Image src="/memories/secret.png" alt="A secret memory" fill className="object-cover" sizes="320px" />
              </div>
              <p className="absolute inset-x-0 bottom-3 text-center font-serif text-lg font-semibold text-foreground">
                A secret one, just for you 💝
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
