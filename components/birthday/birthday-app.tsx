"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { AudioProvider, useAudio } from "./audio-provider"
import { ControlTray } from "./control-tray"
import { LoginPortal } from "./phases/login-portal"
import { EvasiveInquiry } from "./phases/evasive-inquiry"
import { BalloonGame } from "./phases/balloon-game"
import { NostalgiaQuiz } from "./phases/nostalgia-quiz"
import { CakeCeremony } from "./phases/cake-ceremony"
import { MemoryChronicle } from "./phases/memory-chronicle"
import { GiftScratchCard } from "./phases/gift-scratch-card"

const TOTAL_STEPS = 7

function Flow() {
  const [step, setStep] = useState(1)
  const { startMusic } = useAudio()

  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS))

  const handleUnlock = () => {
    startMusic()
    next()
  }

  return (
    <main className="relative min-h-dvh overflow-hidden">
      {/* Ambient gradient wash */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at 15% 20%, oklch(0.9 0.08 350 / 0.55), transparent 45%)," +
            "radial-gradient(circle at 85% 15%, oklch(0.9 0.09 90 / 0.5), transparent 45%)," +
            "radial-gradient(circle at 75% 85%, oklch(0.88 0.09 165 / 0.5), transparent 45%)," +
            "radial-gradient(circle at 20% 90%, oklch(0.88 0.1 300 / 0.4), transparent 45%)",
        }}
      />

      <ControlTray />

      {/* Step progress dots */}
      <div className="fixed left-1/2 top-3 z-40 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-border/50 bg-card/60 px-3 py-1.5 shadow-md backdrop-blur-md sm:top-5">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <span
            key={i}
            className={`block size-2 rounded-full transition-all duration-500 ${
              i + 1 === step
                ? "w-5 bg-primary"
                : i + 1 < step
                  ? "bg-primary/50"
                  : "bg-muted-foreground/25"
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.02, y: -16 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 flex min-h-dvh w-full items-center justify-center px-4 py-20"
        >
          {step === 1 && <LoginPortal onSuccess={handleUnlock} />}
          {step === 2 && <EvasiveInquiry onYes={next} />}
          {step === 3 && <BalloonGame onComplete={next} />}
          {step === 4 && <NostalgiaQuiz onComplete={next} />}
          {step === 5 && <CakeCeremony onComplete={next} />}
          {step === 6 && <MemoryChronicle onComplete={next} />}
          {step === 7 && <GiftScratchCard />}
        </motion.div>
      </AnimatePresence>
    </main>
  )
}

export function BirthdayApp() {
  return (
    <AudioProvider>
      <Flow />
    </AudioProvider>
  )
}
