"use client"

import confetti from "canvas-confetti"

const PARTY = ["#f6a5c0", "#f7b267", "#f9e07f", "#a0e7c6", "#b8a6f0", "#ffffff"]

export function burstConfetti(opts?: confetti.Options) {
  confetti({
    particleCount: 120,
    spread: 80,
    origin: { y: 0.6 },
    colors: PARTY,
    ...opts,
  })
}

export function confettiShower(durationMs = 2500) {
  const end = Date.now() + durationMs
  const frame = () => {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: PARTY,
    })
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: PARTY,
    })
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  frame()
}

export function popAt(x: number, y: number, color?: string) {
  confetti({
    particleCount: 30,
    spread: 60,
    startVelocity: 28,
    scalar: 0.8,
    origin: { x, y },
    colors: color ? [color, "#ffffff"] : PARTY,
  })
}

export function greenBurst(x: number, y: number) {
  confetti({
    particleCount: 40,
    spread: 70,
    startVelocity: 30,
    origin: { x, y },
    colors: ["#a0e7c6", "#5fce9b", "#d7f8e8", "#ffffff"],
  })
}
