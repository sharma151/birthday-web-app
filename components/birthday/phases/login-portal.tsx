"use client"

import { useRef, useState } from "react"
import { motion, useAnimationControls } from "framer-motion"
import { Lock, Sparkles } from "lucide-react"

const CORRECT_CODE = "1234"

export function LoginPortal({ onSuccess }: { onSuccess: () => void }) {
  const [code, setCode] = useState("")
  const [error, setError] = useState(false)
  const controls = useAnimationControls()
  const inputRef = useRef<HTMLInputElement>(null)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (code === CORRECT_CODE) {
      setError(false)
      onSuccess()
    } else {
      setError(true)
      setCode("")
      controls.start({
        x: [0, -12, 12, -10, 10, -6, 6, 0],
        transition: { duration: 0.5 },
      })
      inputRef.current?.focus()
    }
  }

  return (
    <motion.div
      animate={controls}
      className="w-full max-w-sm md:max-w-3xl rounded-4xl border border-border/60 bg-card/70 p-8 md:p-10 text-center md:text-left shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-center gap-8 md:gap-12"
    >
      <motion.div
        animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className="mx-auto md:mx-0 flex shrink-0 size-32 md:size-64 items-center justify-center overflow-hidden rounded-full border-4 border-primary/20 bg-primary/10 shadow-lg"
      >
        {/* 💡 UPDATE THE src BELOW TO CHANGE THE TOP IMAGE */}
        <img
          src="https://images.unsplash.com/photo-1530103862676-de8892b12a15?w=600&auto=format&fit=crop&q=80"
          alt="Birthday Celebration"
          className="size-full object-cover"
        />
      </motion.div>

      <div className="w-full flex-1">
        <h1 className="text-balance font-serif text-3xl md:text-4xl font-bold leading-tight text-foreground">
          HAPPY BIRTHDAY <span className="inline-block">✨</span>
        </h1>
        <p className="mt-2 text-sm md:text-base font-semibold text-muted-foreground text-pretty">
          Enter your secret 4-digit code to unlock your surprise.
        </p>

        <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={inputRef}
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              value={code}
              autoFocus
              onChange={(e) => {
                setError(false)
                setCode(e.target.value.replace(/\D/g, ""))
              }}
              placeholder="••••"
              aria-label="4 digit code"
              aria-invalid={error}
              className={`w-full rounded-2xl border-2 bg-background/70 py-3.5 pl-12 pr-4 text-center md:text-left text-2xl font-bold tracking-[0.5em] text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 ${
                error ? "border-destructive" : "border-border focus:border-primary"
              }`}
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center md:items-start gap-3"
            >
              <p className="text-sm font-bold text-destructive">
                Oops! That&apos;s not the magic code. Try again 💫
              </p>
              {/* 💡 UPDATE THE src BELOW TO CHANGE THE SAD GIF */}
              <img 
                src="https://media.giphy.com/media/OPU6wzx8JlNyc/giphy.gif" 
                alt="Sad face" 
                className="h-24 md:h-28 w-auto rounded-xl shadow-sm border border-border/50"
              />
            </motion.div>
          )}

          <button
            type="submit"
            className="rounded-2xl bg-primary py-3.5 md:py-4 text-base font-bold text-primary-foreground shadow-lg transition-transform hover:scale-[1.02] active:scale-95"
          >
            Unlock the magic
          </button>
          <p className="text-xs font-semibold text-muted-foreground/70">psst… the code is 1234</p>
        </form>
      </div>
    </motion.div>
  )
}
