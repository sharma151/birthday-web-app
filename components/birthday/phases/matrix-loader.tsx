"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

// 💡 UPDATE THIS NAME TO THE BIRTHDAY PERSON'S NAME
const USER_NAME = "ALICE" 
const MATRIX_TEXT = `HAPPYBIRTHDAY${USER_NAME}`

export function MatrixLoader({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [count, setCount] = useState(4)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let lastTime = 0

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const fontSize = 18
    const columns = Math.floor(canvas.width / fontSize) + 1
    const drops: number[] = Array(columns).fill(0).map(() => Math.random() * -100)

    const draw = (time: number) => {
      // Target ~30 fps
      if (time - lastTime < 33) {
        animationFrameId = requestAnimationFrame(draw)
        return
      }
      lastTime = time

      // Translucent dark background creates the trailing effect
      ctx.fillStyle = "rgba(10, 5, 10, 0.15)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Matrix text color (Pink to match theme)
      ctx.fillStyle = "#ff2d9a"
      ctx.font = `bold ${fontSize}px monospace`
      ctx.textAlign = "center"

      for (let i = 0; i < drops.length; i++) {
        const text = MATRIX_TEXT.charAt(Math.floor(Math.random() * MATRIX_TEXT.length))
        const x = i * fontSize
        const y = drops[i] * fontSize

        ctx.fillText(text, x, y)

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
      animationFrameId = requestAnimationFrame(draw)
    }

    animationFrameId = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setTimeout(onComplete, 400) // slight delay before switching
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a050a]">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <AnimatePresence mode="wait">
        {count > 0 && (
          <motion.div
            key={count}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 font-mono text-[10rem] md:text-[18rem] font-bold text-[#ff2d9a]"
            style={{ textShadow: "0 0 20px #ff2d9a, 0 0 40px #ff2d9a" }}
          >
            {count}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
