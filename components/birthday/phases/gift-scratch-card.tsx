"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Heart, Sparkles } from "lucide-react"
import { useAudio } from "../audio-provider"
import { confettiShower } from "@/lib/confetti"

export function GiftScratchCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { playSfx } = useAudio()
  const [revealed, setRevealed] = useState(false)
  const drawing = useRef(false)
  const revealedRef = useRef(false)

  const setup = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.scale(dpr, dpr)

    // Silver scratch layer
    const grad = ctx.createLinearGradient(0, 0, rect.width, rect.height)
    grad.addColorStop(0, "#c7cdd6")
    grad.addColorStop(0.5, "#eaeef3")
    grad.addColorStop(1, "#b9c0cb")
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, rect.width, rect.height)

    ctx.fillStyle = "#6b7280"
    ctx.font = "bold 20px system-ui, sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("Scratch here ✨", rect.width / 2, rect.height / 2)
  }, [])

  useEffect(() => {
    setup()
    window.addEventListener("resize", setup)
    return () => window.removeEventListener("resize", setup)
  }, [setup])

  const clearedPct = () => {
    const canvas = canvasRef.current
    if (!canvas) return 0
    const ctx = canvas.getContext("2d")
    if (!ctx) return 0
    const { width, height } = canvas
    const img = ctx.getImageData(0, 0, width, height).data
    let clear = 0
    // sample every 40th pixel for speed
    for (let i = 3; i < img.length; i += 160) {
      if (img[i] === 0) clear++
    }
    const total = img.length / 160
    return clear / total
  }

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current
    if (!canvas || revealedRef.current) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top
    ctx.globalCompositeOperation = "destination-out"
    ctx.beginPath()
    ctx.arc(x, y, 24, 0, Math.PI * 2)
    ctx.fill()

    if (clearedPct() >= 0.6) {
      revealedRef.current = true
      setRevealed(true)
      playSfx("cheer")
      confettiShower(3200)
    }
  }

  const onDown = (e: React.PointerEvent) => {
    drawing.current = true
    ;(e.target as HTMLCanvasElement).setPointerCapture?.(e.pointerId)
    scratch(e.clientX, e.clientY)
  }
  const onMove = (e: React.PointerEvent) => {
    if (!drawing.current) return
    scratch(e.clientX, e.clientY)
  }
  const onUp = () => {
    drawing.current = false
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center text-center">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 text-balance font-serif text-3xl font-bold leading-tight text-foreground sm:text-4xl"
      >
        {revealed ? "Happy Birthday, love 💖" : "Your Digital Gift Voucher 🎫"}
      </motion.h2>
      <p className="z-10 mt-2 text-sm font-semibold text-muted-foreground">
        {revealed ? "This one's real — I can't wait." : "Scratch the silver panel to reveal your gift."}
      </p>

      {/* Voucher */}
      <div className="relative mt-8 w-full">
        <div className="relative overflow-hidden rounded-3xl border-2 border-dashed border-primary/50 bg-card p-8 shadow-xl">
          <div className="flex flex-col items-center gap-2">
            <Sparkles className="size-8 text-primary" />
            <p className="font-serif text-2xl font-bold text-foreground text-balance">
              Good for one free dinner 🍝
            </p>
            <p className="text-sm font-semibold text-muted-foreground">
              Redeemable any night, with hugs included.
            </p>
          </div>

          {/* Scratch canvas overlay */}
          <AnimatePresence>
            {!revealed && (
              <motion.canvas
                ref={canvasRef}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                onPointerDown={onDown}
                onPointerMove={onMove}
                onPointerUp={onUp}
                onPointerLeave={onUp}
                className="absolute inset-0 h-full w-full touch-none rounded-3xl"
                style={{ cursor: "grab" }}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Outro */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="z-10 mt-8"
          >
            <p className="mx-auto max-w-sm text-pretty text-base font-semibold leading-relaxed text-foreground">
              Every balloon, every candle, every photo — they&apos;re all just tiny ways of saying
              how grateful I am you were born. Here&apos;s to another year of laughing too loud and
              making memories worth scratching for. I love you. 🎂✨
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating hearts */}
      {revealed && <FloatingHearts />}
    </div>
  )
}

function FloatingHearts() {
  const hearts = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    size: 16 + Math.random() * 24,
    duration: 6 + Math.random() * 6,
    delay: Math.random() * 5,
  }))
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          className="absolute text-primary/70"
          style={{ left: `${h.x}%` }}
          initial={{ y: "110vh", opacity: 0 }}
          animate={{ y: "-20vh", opacity: [0, 1, 1, 0], x: [0, 20, -20, 0] }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <Heart className="fill-current" style={{ width: h.size, height: h.size }} />
        </motion.div>
      ))}
    </div>
  )
}
