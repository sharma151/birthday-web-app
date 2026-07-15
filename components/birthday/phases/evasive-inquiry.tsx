"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useAudio } from "../audio-provider"

export function EvasiveInquiry({ onYes }: { onYes: () => void }) {
  const { playSfx } = useAudio()
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [dodges, setDodges] = useState(0)

  const dodge = () => {
    // Keep within safe boundaries relative to its container.
    const range = 130 + Math.min(dodges * 8, 90)
    const x = (Math.random() * 2 - 1) * range
    const y = (Math.random() * 2 - 1) * (range * 0.7)
    setPos({ x, y })
    setDodges((d) => d + 1)
    playSfx("pop")
  }

  const teases = [
    "Nope, come back! 😆",
    "Too slow! 🏃",
    "Not today! 🙈",
    "Nice try! 😜",
    "Catch me! 🎈",
  ]

  return (
    <div className="flex w-full max-w-xl flex-col items-center text-center">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-balance font-serif text-3xl font-bold leading-tight text-foreground sm:text-4xl"
      >
        Are you excited to see your surprise? 😏
      </motion.h2>

      <p className="mt-3 text-sm font-semibold text-muted-foreground">
        {dodges > 0 ? teases[dodges % teases.length] : "Go on, pick an answer…"}
      </p>

      <div className="relative mt-10 flex h-40 w-full items-center justify-center gap-5">
        <motion.button
          type="button"
          onClick={onYes}
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 1.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.95 }}
          className="rounded-full bg-primary px-10 py-4 text-lg font-bold text-primary-foreground shadow-xl"
        >
          YES! 🎉
        </motion.button>

        <motion.button
          type="button"
          layout
          animate={pos}
          transition={{ type: "spring", stiffness: 350, damping: 18 }}
          onMouseEnter={dodge}
          onTouchStart={(e) => {
            e.preventDefault()
            dodge()
          }}
          onClick={dodge}
          className="rounded-full border-2 border-border bg-card px-9 py-4 text-lg font-bold text-muted-foreground shadow-lg"
        >
          No 🙃
        </motion.button>
      </div>
    </div>
  )
}
