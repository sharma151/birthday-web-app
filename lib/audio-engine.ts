"use client"

// A lightweight Web Audio engine that synthesizes a gentle looping melody
// plus short celebration sound effects. This avoids depending on external
// audio URLs that may be unavailable.

type SfxName = "horn" | "cheer" | "pop"

export class AudioEngine {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private musicGain: GainNode | null = null
  private melodyTimer: ReturnType<typeof setInterval> | null = null
  private started = false
  private _muted = false

  private ensureContext() {
    if (typeof window === "undefined") return null
    if (!this.ctx) {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.ctx = new Ctor()
      this.master = this.ctx.createGain()
      this.master.gain.value = 0.9
      this.master.connect(this.ctx.destination)
      this.musicGain = this.ctx.createGain()
      this.musicGain.gain.value = 0.4
      this.musicGain.connect(this.master)
    }
    return this.ctx
  }

  get muted() {
    return this._muted
  }

  async startMusic() {
    const ctx = this.ensureContext()
    if (!ctx || !this.musicGain) return
    if (ctx.state === "suspended") await ctx.resume()
    if (this.started) return
    this.started = true

    // A soft, cheerful major-key loop (C, E, G, A, G, E patterns).
    const scale = [523.25, 587.33, 659.25, 783.99, 880.0, 659.25, 587.33, 523.25]
    let step = 0
    const beat = 420 // ms

    const playNote = () => {
      if (!this.ctx || !this.musicGain) return
      const now = this.ctx.currentTime
      const freq = scale[step % scale.length]

      // Bell-like tone (two oscillators)
      const osc = this.ctx.createOscillator()
      const osc2 = this.ctx.createOscillator()
      const g = this.ctx.createGain()
      osc.type = "triangle"
      osc2.type = "sine"
      osc.frequency.value = freq
      osc2.frequency.value = freq * 2
      g.gain.setValueAtTime(0, now)
      g.gain.linearRampToValueAtTime(0.22, now + 0.04)
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.9)
      osc.connect(g)
      osc2.connect(g)
      g.connect(this.musicGain)
      osc.start(now)
      osc2.start(now)
      osc.stop(now + 0.95)
      osc2.stop(now + 0.95)

      // soft bass every other beat
      if (step % 2 === 0) {
        const bass = this.ctx.createOscillator()
        const bg = this.ctx.createGain()
        bass.type = "sine"
        bass.frequency.value = freq / 4
        bg.gain.setValueAtTime(0, now)
        bg.gain.linearRampToValueAtTime(0.18, now + 0.05)
        bg.gain.exponentialRampToValueAtTime(0.001, now + 0.7)
        bass.connect(bg)
        bg.connect(this.musicGain)
        bass.start(now)
        bass.stop(now + 0.75)
      }
      step++
    }

    playNote()
    this.melodyTimer = setInterval(playNote, beat)
  }

  setMuted(muted: boolean) {
    this._muted = muted
    if (this.master && this.ctx) {
      const now = this.ctx.currentTime
      this.master.gain.cancelScheduledValues(now)
      this.master.gain.linearRampToValueAtTime(muted ? 0 : 0.9, now + 0.15)
    }
  }

  toggleMute() {
    this.setMuted(!this._muted)
    return this._muted
  }

  playSfx(name: SfxName) {
    const ctx = this.ensureContext()
    if (!ctx || !this.master) return
    if (ctx.state === "suspended") ctx.resume()
    const now = ctx.currentTime

    if (name === "pop") {
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.type = "sine"
      osc.frequency.setValueAtTime(880, now)
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.12)
      g.gain.setValueAtTime(0.001, now)
      g.gain.linearRampToValueAtTime(0.5, now + 0.01)
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.16)
      osc.connect(g)
      g.connect(this.master)
      osc.start(now)
      osc.stop(now + 0.18)
      return
    }

    if (name === "horn") {
      const notes = [392, 523.25, 659.25]
      notes.forEach((f, i) => {
        const t = now + i * 0.09
        const osc = ctx.createOscillator()
        const g = ctx.createGain()
        osc.type = "sawtooth"
        osc.frequency.value = f
        g.gain.setValueAtTime(0.001, t)
        g.gain.linearRampToValueAtTime(0.35, t + 0.03)
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.35)
        osc.connect(g)
        g.connect(this.master!)
        osc.start(t)
        osc.stop(t + 0.4)
      })
      return
    }

    if (name === "cheer") {
      // white-noise burst shaped like a crowd cheer
      const duration = 1.1
      const bufferSize = ctx.sampleRate * duration
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        const env = Math.min(1, i / (ctx.sampleRate * 0.25)) * (1 - i / bufferSize)
        data[i] = (Math.random() * 2 - 1) * env
      }
      const src = ctx.createBufferSource()
      src.buffer = buffer
      const filter = ctx.createBiquadFilter()
      filter.type = "bandpass"
      filter.frequency.value = 1200
      filter.Q.value = 0.7
      const g = ctx.createGain()
      g.gain.value = 0.5
      src.connect(filter)
      filter.connect(g)
      g.connect(this.master)
      src.start(now)
      src.stop(now + duration)
      return
    }
  }

  dispose() {
    if (this.melodyTimer) clearInterval(this.melodyTimer)
    this.melodyTimer = null
    this.started = false
    if (this.ctx) {
      this.ctx.close()
      this.ctx = null
    }
  }
}
