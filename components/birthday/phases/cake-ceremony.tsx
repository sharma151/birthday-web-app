"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Cake, Scissors, Wind } from "lucide-react"
import { useAudio } from "../audio-provider"
import { confettiShower } from "@/lib/confetti"

type Stage = "blow" | "cut" | "done"

export function CakeCeremony({ onComplete }: { onComplete: () => void }) {
  const { playSfx } = useAudio()
  const [lit, setLit] = useState(true)
  const [stage, setStage] = useState<Stage>("blow")
  const [cut, setCut] = useState(false)

  const blow = () => {
    setLit(false)
    playSfx("cheer")
    confettiShower(2800)
    setTimeout(() => setStage("cut"), 900)
  }

  const cutCake = () => {
    setCut(true)
    playSfx("pop")
    setStage("done")
    setTimeout(onComplete, 1500)
  }

  return (
    <div className="flex w-full max-w-xl flex-col items-center text-center">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-balance font-serif text-3xl font-bold leading-tight text-foreground sm:text-4xl"
      >
        {stage === "blow" ? "Make a wish and blow! 🌬️" : stage === "cut" ? "Now cut the cake! 🎂" : "Yum! 🍰"}
      </motion.h2>
      <p className="mt-2 text-sm font-semibold text-muted-foreground">
        {stage === "blow"
          ? "Close your eyes, think of something wonderful."
          : stage === "cut"
            ? "First slice is always yours."
            : "Sharing the sweetness…"}
      </p>

      {/* Cake stage */}
      <div className="relative mt-10 flex h-64 w-72 items-end justify-center">
        <CakeHalf side="left" lit={lit} cut={cut} />
        <CakeHalf side="right" lit={lit} cut={cut} />
      </div>

      <div className="mt-10">
        {stage === "blow" && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={blow}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-lg font-bold text-primary-foreground shadow-xl"
          >
            <Wind className="size-5" /> Blow Candles
          </motion.button>
        )}
        {stage === "cut" && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={cutCake}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-lg font-bold text-primary-foreground shadow-xl"
          >
            <Scissors className="size-5" /> Cut Cake
          </motion.button>
        )}
        {stage === "done" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-base font-bold text-accent-foreground"
          >
            <Cake className="size-5" /> Delicious!
          </motion.div>
        )}
      </div>
    </div>
  )
}

function CakeHalf({ side, lit, cut }: { side: "left" | "right"; lit: boolean; cut: boolean }) {
  const isLeft = side === "left"
  return (
    <motion.div
      className="absolute bottom-0"
      style={{
        clipPath: isLeft ? "inset(0 50% 0 0)" : "inset(0 0 0 50%)",
      }}
      animate={cut ? { x: isLeft ? -46 : 46, rotate: isLeft ? -8 : 8, y: 6 } : { x: 0, rotate: 0, y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 14 }}
    >
      <CakeArt lit={lit} />
    </motion.div>
  )
}

function CakeArt({ lit }: { lit: boolean }) {
  return (
    <svg width="240" height="256" viewBox="0 0 240 256" aria-hidden>
      {/* Candles */}
      {[80, 120, 160].map((cx) => (
        <g key={cx}>
          <rect x={cx - 4} y={70} width={8} height={34} rx={2} fill="#f6a5c0" />
          <rect x={cx - 4} y={70} width={8} height={34} rx={2} fill="url(#stripe)" opacity="0.5" />
          {/* wick */}
          <rect x={cx - 1} y={62} width={2} height={10} fill="#5a4632" />
          {/* flame */}
          <motion.g
            animate={
              lit
                ? { opacity: 1, scaleY: [1, 1.18, 0.92, 1], scaleX: [1, 0.9, 1.05, 1] }
                : { opacity: 0, scaleY: 0.3 }
            }
            transition={
              lit
                ? { duration: 0.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }
                : { duration: 0.4 }
            }
            style={{ transformOrigin: `${cx}px 60px` }}
          >
            <ellipse cx={cx} cy={54} rx={5} ry={9} fill="#f7b267" />
            <ellipse cx={cx} cy={56} rx={2.6} ry={5} fill="#fff3c4" />
          </motion.g>
        </g>
      ))}

      {/* Top tier */}
      <rect x={64} y={104} width={112} height={48} rx={12} fill="#ffd9e6" stroke="#f6a5c0" strokeWidth="2" />
      {/* frosting drips */}
      <path d="M64 118 q14 20 28 0 q14 20 28 0 q14 20 28 0 q14 20 28 0 L176 104 L64 104 Z" fill="#fff0f5" />
      {/* Middle tier */}
      <rect x={44} y={152} width={152} height={52} rx={14} fill="#c9f2df" stroke="#a0e7c6" strokeWidth="2" />
      <path d="M44 168 q19 22 38 0 q19 22 38 0 q19 22 38 0 q19 22 38 0 L196 152 L44 152 Z" fill="#e4faf0" />
      {/* Bottom tier */}
      <rect x={24} y={204} width={192} height={48} rx={14} fill="#fde3b8" stroke="#f7b267" strokeWidth="2" />
      {/* dots */}
      {[60, 100, 140, 180].map((x) => (
        <circle key={x} cx={x} cy={228} r={5} fill="#f6a5c0" />
      ))}

      <defs>
        <linearGradient id="stripe" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0.8" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.8" />
        </linearGradient>
      </defs>
    </svg>
  )
}
