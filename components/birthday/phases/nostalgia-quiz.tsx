"use client"

import { useState } from "react"
import { AnimatePresence, motion, useAnimationControls } from "framer-motion"
import { Check } from "lucide-react"
import { useAudio } from "../audio-provider"
import { greenBurst } from "@/lib/confetti"

type Question = {
  q: string
  options: string[]
  answer: number
  wrongTease: string
}

const QUESTIONS: Question[] = [
  {
    q: "Where did we go on our very first trip together?",
    options: ["The beach 🏖️", "The mountains ⛰️", "Paris 🗼", "Grandma's house 🏡"],
    answer: 0,
    wrongTease: "Nope! You clearly need a vacation 😂",
  },
  {
    q: "What's our go-to comfort food on lazy days?",
    options: ["Sushi 🍣", "Pizza 🍕", "Tacos 🌮", "Ice cream 🍦"],
    answer: 1,
    wrongTease: "Really? After all those cheesy nights?! 🍕",
  },
  {
    q: "What song do we ALWAYS scream in the car?",
    options: ["A sad ballad 😢", "Something classical 🎻", "Our hype anthem 🎤", "Total silence 🤫"],
    answer: 2,
    wrongTease: "Wrong! You know you sing the loudest 🎶",
  },
]

export function NostalgiaQuiz({ onComplete }: { onComplete: () => void }) {
  const { playSfx } = useAudio()
  const [index, setIndex] = useState(0)
  const [locked, setLocked] = useState(false)
  const [tease, setTease] = useState<string | null>(null)
  const [wrongPick, setWrongPick] = useState<number | null>(null)
  const controls = useAnimationControls()

  const current = QUESTIONS[index]

  const choose = (i: number, e: React.MouseEvent<HTMLButtonElement>) => {
    if (locked) return
    if (i === current.answer) {
      setLocked(true)
      setTease(null)
      setWrongPick(null)
      playSfx("cheer")
      const rect = e.currentTarget.getBoundingClientRect()
      greenBurst((rect.left + rect.width / 2) / window.innerWidth, (rect.top + rect.height / 2) / window.innerHeight)
      setTimeout(() => {
        if (index + 1 >= QUESTIONS.length) {
          onComplete()
        } else {
          setIndex((n) => n + 1)
          setLocked(false)
        }
      }, 900)
    } else {
      setWrongPick(i)
      setTease(current.wrongTease)
      playSfx("pop")
      controls.start({ x: [0, -10, 10, -8, 8, 0], transition: { duration: 0.4 } })
    }
  }

  return (
    <motion.div
      animate={controls}
      className="w-full max-w-md rounded-4xl border border-border/60 bg-card/70 p-7 text-center shadow-2xl backdrop-blur-xl"
    >
      <p className="text-xs font-bold uppercase tracking-widest text-primary">
        Nostalgia Quiz · {index + 1} / {QUESTIONS.length}
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.35 }}
        >
          <h2 className="mt-3 text-balance font-serif text-2xl font-bold leading-snug text-foreground">
            {current.q}
          </h2>

          <div className="mt-6 flex flex-col gap-3">
            {current.options.map((opt, i) => {
              const isWrong = wrongPick === i
              return (
                <motion.button
                  key={opt}
                  type="button"
                  onClick={(e) => choose(i, e)}
                  whileTap={{ scale: 0.97 }}
                  animate={isWrong ? { x: [0, -6, 6, -6, 6, 0] } : {}}
                  transition={{ duration: 0.35 }}
                  className={`rounded-2xl border-2 px-5 py-3.5 text-left text-base font-bold transition-colors ${
                    isWrong
                      ? "border-destructive bg-destructive/10 text-destructive"
                      : "border-border bg-background/60 text-foreground hover:border-primary hover:bg-secondary/60"
                  }`}
                >
                  {opt}
                </motion.button>
              )
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {tease && (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 text-sm font-bold text-destructive"
        >
          {tease}
        </motion.p>
      )}

      {locked && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-1.5 text-sm font-bold text-accent-foreground"
        >
          <Check className="size-4" /> Correct!
        </motion.div>
      )}
    </motion.div>
  )
}
