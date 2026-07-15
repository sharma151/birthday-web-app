"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import { X } from "lucide-react"

type PolaroidModalProps = {
  open: boolean
  src: string
  caption: string
  onClose: () => void
}

export function PolaroidModal({ open, src, caption, onClose }: PolaroidModalProps) {
  const [seconds, setSeconds] = useState(5)
  const [remaining, setRemaining] = useState(5)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!open) return
    setRemaining(seconds)
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          onClose()
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    // Restart timer whenever it (re)opens or the chosen duration changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, seconds])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -6, y: 30 }}
            animate={{ opacity: 1, scale: 1, rotate: -2, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xs rounded-sm bg-card p-3 pb-16 shadow-2xl"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close photo"
              className="absolute -right-3 -top-3 flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
            >
              <X className="size-4" />
            </button>

            <div className="relative aspect-square w-full overflow-hidden bg-muted">
              <Image src={src || "/placeholder.svg"} alt={caption} fill className="object-cover" sizes="320px" />
            </div>

            <p className="absolute inset-x-0 bottom-6 text-center font-serif text-lg font-semibold text-foreground">
              {caption}
            </p>

            {/* Duration slider */}
            <div className="absolute inset-x-3 bottom-1.5 flex items-center gap-2">
              <span className="text-[10px] font-bold tabular-nums text-muted-foreground">{remaining}s</span>
              <input
                type="range"
                min={3}
                max={10}
                value={seconds}
                onChange={(e) => setSeconds(Number(e.target.value))}
                aria-label="Seconds the photo stays visible"
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-primary"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
