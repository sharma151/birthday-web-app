"use client"

import { useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useAudio } from "../audio-provider"
import { popAt } from "@/lib/confetti"
import { PolaroidModal } from "./polaroid-modal"

const BALLOON_COLORS = ["#f6a5c0", "#f7b267", "#a0e7c6", "#b8a6f0", "#8ecae6", "#ffb3c6"]

const PHOTOS = [
  { src: "/memories/trip-beach.png", caption: "That beach day ☀️" },
  { src: "/memories/roadtrip.png", caption: "Endless road trips 🚗" },
  { src: "/memories/picnic.png", caption: "Sunny picnics 🧺" },
  { src: "/memories/concert.png", caption: "Dancing all night 🎶" },
  { src: "/memories/cafe.png", caption: "Coffee talks ☕" },
  { src: "/memories/birthday-cake.png", caption: "Cake, always 🎂" },
]

const GOAL = 5

type Balloon = {
  id: number
  x: number
  color: string
  size: number
  duration: number
  delay: number
}

let counter = 0
function makeBalloon(): Balloon {
  counter += 1
  return {
    id: counter,
    x: 6 + Math.random() * 86,
    color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
    size: 52 + Math.random() * 34,
    duration: 7 + Math.random() * 6,
    delay: Math.random() * 3,
  }
}

export function BalloonGame({ onComplete }: { onComplete: () => void }) {
  const { playSfx } = useAudio()
  const [balloons, setBalloons] = useState<Balloon[]>(() =>
    Array.from({ length: 8 }, makeBalloon),
  )
  const [popped, setPopped] = useState(0)
  const [modal, setModal] = useState<{ src: string; caption: string } | null>(null)
  const photoOrder = useMemo(() => PHOTOS, [])

  const handlePop = (b: Balloon, e: React.MouseEvent | React.TouchEvent) => {
    playSfx("pop")
    let cx = 0.5
    let cy = 0.5
    if ("clientX" in e) {
      cx = e.clientX / window.innerWidth
      cy = e.clientY / window.innerHeight
    } else if (e.touches?.[0]) {
      cx = e.touches[0].clientX / window.innerWidth
      cy = e.touches[0].clientY / window.innerHeight
    }
    popAt(cx, cy, b.color)

    const nextCount = popped + 1
    setPopped(nextCount)
    const photo = photoOrder[(nextCount - 1) % photoOrder.length]
    setModal(photo)

    // respawn a fresh balloon in place of the popped one
    setBalloons((prev) => prev.map((x) => (x.id === b.id ? makeBalloon() : x)))
  }

  const reached = popped >= GOAL

  return (
    <div className="relative flex w-full max-w-2xl flex-col items-center text-center">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 text-balance font-serif text-3xl font-bold leading-tight text-foreground sm:text-4xl"
      >
        Pop the balloons! 🎈
      </motion.h2>
      <p className="z-10 mt-2 text-sm font-semibold text-muted-foreground">
        Each pop hides a little memory. Pop {GOAL} to reveal your gift.
      </p>

      <div className="z-10 mt-4 rounded-full border border-border/60 bg-card/70 px-4 py-1.5 text-sm font-bold text-primary shadow-md backdrop-blur">
        {Math.min(popped, GOAL)} / {GOAL} popped
      </div>

      {/* Balloon canvas */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {balloons.map((b) => (
          <motion.button
            key={b.id}
            type="button"
            aria-label="Pop balloon"
            className="pointer-events-auto absolute bottom-0 cursor-pointer"
            style={{ left: `${b.x}%`, width: b.size }}
            initial={{ y: "20vh" }}
            animate={{ y: "-120vh", x: [0, 14, -14, 0] }}
            transition={{
              y: { duration: b.duration, delay: b.delay, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
              x: { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
            }}
            onClick={(e) => handlePop(b, e)}
            onTouchStart={(e) => handlePop(b, e)}
          >
            <Balloon color={b.color} size={b.size} />
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {reached && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.7, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onComplete}
            className="z-10 mt-10 rounded-full bg-primary px-8 py-4 text-lg font-bold text-primary-foreground shadow-xl"
          >
            Reveal My Gift 🎁
          </motion.button>
        )}
      </AnimatePresence>

      <PolaroidModal
        open={modal !== null}
        src={modal?.src ?? ""}
        caption={modal?.caption ?? ""}
        onClose={() => setModal(null)}
      />
    </div>
  )
}

function Balloon({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size * 1.25} viewBox="0 0 60 75" className="drop-shadow-lg">
      <ellipse cx="30" cy="30" rx="26" ry="30" fill={color} />
      <ellipse cx="22" cy="20" rx="7" ry="10" fill="rgba(255,255,255,0.35)" />
      <polygon points="26,58 34,58 30,64" fill={color} />
      <path d="M30 64 q6 6 0 11" stroke={color} strokeWidth="1.5" fill="none" opacity="0.7" />
    </svg>
  )
}
