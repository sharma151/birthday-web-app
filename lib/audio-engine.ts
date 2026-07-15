"use client";

// A lightweight Web Audio engine that synthesizes a gentle looping melody
// plus short celebration sound effects. This avoids depending on external
// audio URLs that may be unavailable.

type SfxName = "horn" | "cheer" | "pop";

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private bgAudio: HTMLAudioElement | null = null;
  private started = false;
  private _muted = false;

  private ensureContext() {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.ctx = new Ctor();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.9;
      this.master.connect(this.ctx.destination);
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = 0.4;
      this.musicGain.connect(this.master);
    }
    return this.ctx;
  }

  get muted() {
    return this._muted;
  }

  async startMusic() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    if (ctx.state === "suspended") await ctx.resume();
    if (this.started) return;
    this.started = true;

    // 💡 UPDATE THIS URL TO YOUR CUSTOM AUDIO FILE
    // Example: "/my-song.mp3" (if you put my-song.mp3 in the public folder)
    // const MUSIC_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    const MUSIC_URL = "/babylaugh.mp3";

    this.bgAudio = new Audio(MUSIC_URL);
    this.bgAudio.loop = true;
    this.bgAudio.volume = 0.4;
    this.bgAudio.muted = this._muted;

    this.bgAudio.play().catch((e) => console.log("Audio playback failed:", e));
  }

  setMuted(muted: boolean) {
    this._muted = muted;

    // Mute sound effects
    if (this.master && this.ctx) {
      const now = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(now);
      this.master.gain.linearRampToValueAtTime(muted ? 0 : 0.9, now + 0.15);
    }

    // Mute background music
    if (this.bgAudio) {
      this.bgAudio.muted = muted;
    }
  }

  toggleMute() {
    this.setMuted(!this._muted);
    return this._muted;
  }

  playSfx(name: SfxName) {
    const ctx = this.ensureContext();
    if (!ctx || !this.master) return;
    if (ctx.state === "suspended") ctx.resume();
    const now = ctx.currentTime;

    if (name === "pop") {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.12);
      g.gain.setValueAtTime(0.001, now);
      g.gain.linearRampToValueAtTime(0.5, now + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc.connect(g);
      g.connect(this.master);
      osc.start(now);
      osc.stop(now + 0.18);
      return;
    }

    if (name === "horn") {
      const notes = [392, 523.25, 659.25];
      notes.forEach((f, i) => {
        const t = now + i * 0.09;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.value = f;
        g.gain.setValueAtTime(0.001, t);
        g.gain.linearRampToValueAtTime(0.35, t + 0.03);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        osc.connect(g);
        g.connect(this.master!);
        osc.start(t);
        osc.stop(t + 0.4);
      });
      return;
    }

    if (name === "cheer") {
      const duration = 1.1;
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const env =
          Math.min(1, i / (ctx.sampleRate * 0.25)) * (1 - i / bufferSize);
        data[i] = (Math.random() * 2 - 1) * env;
      }
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 1200;
      filter.Q.value = 0.7;
      const g = ctx.createGain();
      g.gain.value = 0.5;
      src.connect(filter);
      filter.connect(g);
      g.connect(this.master);
      src.start(now);
      src.stop(now + duration);
      return;
    }
  }

  dispose() {
    if (this.bgAudio) {
      this.bgAudio.pause();
      this.bgAudio.src = "";
      this.bgAudio = null;
    }
    this.started = false;
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }
}
