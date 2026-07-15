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
import { PreCakeWishes } from "./phases/pre-cake-wishes"
import { MatrixLoader } from "./phases/matrix-loader"

const TOTAL_STEPS = 8

const BACKGROUND_EMOJIS = [
  { emoji: '💖', top: '10%', left: '10%', delay: 0 },
  { emoji: '🎉', top: '15%', left: '80%', delay: 1 },
  { emoji: '✨', top: '40%', left: '8%', delay: 0.5 },
  { emoji: '🌟', top: '35%', left: '88%', delay: 2 },
  { emoji: '🎈', top: '75%', left: '12%', delay: 1.5 },
  { emoji: '🥰', top: '80%', left: '85%', delay: 0.2 },
  { emoji: '👯‍♀️', top: '25%', left: '30%', delay: 2.5 },
  { emoji: '💝', top: '20%', left: '60%', delay: 0.8 },
  { emoji: '🎂', top: '85%', left: '40%', delay: 1.2 },
  { emoji: '🥳', top: '60%', left: '82%', delay: 1.8 },
  { emoji: '🥂', top: '5%', left: '45%', delay: 0.4 },
  { emoji: '💐', top: '65%', left: '25%', delay: 0.9 },
]

function Flow() {
  const [showLoader, setShowLoader] = useState(true)
  const [step, setStep] = useState(1)
  const { startMusic } = useAudio()

  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS))

  const handleUnlock = () => {
    startMusic()
    next()
  }

  if (showLoader) {
    return <MatrixLoader onComplete={() => setShowLoader(false)} />
  }

  return (
    <main className="relative min-h-dvh overflow-hidden">
      {/* Ambient gradient wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(circle at 15% 20%, oklch(0.9 0.08 350 / 0.55), transparent 45%)," +
            "radial-gradient(circle at 85% 15%, oklch(0.9 0.09 90 / 0.5), transparent 45%)," +
            "radial-gradient(circle at 75% 85%, oklch(0.88 0.09 165 / 0.5), transparent 45%)," +
            "radial-gradient(circle at 20% 90%, oklch(0.88 0.1 300 / 0.4), transparent 45%)",
        }}
      />

      {/* Floating background emojis */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-40">
        {BACKGROUND_EMOJIS.map((item, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl sm:text-5xl drop-shadow-md grayscale-[20%]"
            style={{ top: item.top, left: item.left }}
            animate={{ 
              y: [0, -20, 0],
              rotate: [-5, 5, -5]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: item.delay
            }}
          >
            {item.emoji}
          </motion.div>
        ))}
      </div>

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
          {step === 5 && <PreCakeWishes onNext={next} />}
          {step === 6 && <CakeCeremony onComplete={next} />}
          {step === 7 && <MemoryChronicle onComplete={next} />}
          {step === 8 && <GiftScratchCard />}
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
