"use client";

import { useState, useEffect, useCallback } from "react";

export type PixelSoundName =
  | "click"
  | "hover"
  | "crank"
  | "coin"
  | "powerup"
  | "laser"
  | "jump"
  | "hit"
  | "dialogBlip"
  | "cartridgeInsert"
  | "achievement"
  | "toggleOn"
  | "toggleOff";

export interface PixelSoundOptions {
  pitchMultiplier?: number;
  volume?: number;
}

class PixelSoundSynthesizer {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private masterVolume: number = 0.28;
  private listeners: Set<(enabled: boolean) => void> = new Set();

  constructor() {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem("mixiuh_pixel_sfx");
      if (saved !== null) {
        this.enabled = saved === "1";
      }
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setEnabled(val: boolean): void {
    this.enabled = val;
    if (typeof window !== "undefined") {
      window.localStorage.setItem("mixiuh_pixel_sfx", val ? "1" : "0");
    }
    this.listeners.forEach((fn) => fn(this.enabled));
    if (val) {
      this.play("toggleOn");
    }
  }

  public toggle(): boolean {
    this.setEnabled(!this.enabled);
    return this.enabled;
  }

  public subscribe(fn: (enabled: boolean) => void): () => void {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  public play(name: PixelSoundName, opts?: PixelSoundOptions): void {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const pitch = opts?.pitchMultiplier ?? 1.0;
    const vol = Math.min(1, Math.max(0.02, (opts?.volume ?? 1.0) * this.masterVolume));

    try {
      switch (name) {
        case "click": {
          // Crisp Playdate micro-switch click
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "square";
          osc.frequency.setValueAtTime(1950 * pitch, now);
          osc.frequency.exponentialRampToValueAtTime(620 * pitch, now + 0.022);
          gain.gain.setValueAtTime(vol * 0.65, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.024);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.025);
          break;
        }

        case "hover": {
          // Subtle 1-bit tick
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(1320 * pitch, now);
          gain.gain.setValueAtTime(vol * 0.22, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.01);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.012);
          break;
        }

        case "crank": {
          // Mechanical rotary ratchet tick
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(980 * pitch, now);
          osc.frequency.exponentialRampToValueAtTime(420 * pitch, now + 0.014);
          gain.gain.setValueAtTime(vol * 0.45, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.016);
          break;
        }

        case "toggleOn": {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "square";
          osc.frequency.setValueAtTime(523.25 * pitch, now);
          osc.frequency.setValueAtTime(783.99 * pitch, now + 0.035);
          gain.gain.setValueAtTime(vol * 0.5, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.085);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.09);
          break;
        }

        case "toggleOff": {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "square";
          osc.frequency.setValueAtTime(783.99 * pitch, now);
          osc.frequency.setValueAtTime(440 * pitch, now + 0.035);
          gain.gain.setValueAtTime(vol * 0.45, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.085);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.09);
          break;
        }

        case "coin": {
          // Classic B5 -> E6 arcade coin chime
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "square";
          osc.frequency.setValueAtTime(987.77 * pitch, now);
          osc.frequency.setValueAtTime(1318.51 * pitch, now + 0.065);
          gain.gain.setValueAtTime(vol * 0.6, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.29);
          break;
        }

        case "powerup": {
          // 6-note 8-bit arpeggio
          const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
          notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const start = now + idx * 0.042;
            osc.type = "square";
            osc.frequency.setValueAtTime(freq * pitch, start);
            gain.gain.setValueAtTime(vol * 0.5, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.055);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(start);
            osc.stop(start + 0.06);
          });
          break;
        }

        case "laser": {
          // Sci-fi pitch sweep
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(1480 * pitch, now);
          osc.frequency.exponentialRampToValueAtTime(140 * pitch, now + 0.14);
          gain.gain.setValueAtTime(vol * 0.55, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.16);
          break;
        }

        case "jump": {
          // Classic platformer upward sweep
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "square";
          osc.frequency.setValueAtTime(210 * pitch, now);
          osc.frequency.exponentialRampToValueAtTime(680 * pitch, now + 0.13);
          gain.gain.setValueAtTime(vol * 0.5, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.15);
          break;
        }

        case "hit": {
          // Crunch damage / error thud
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(160 * pitch, now);
          osc.frequency.exponentialRampToValueAtTime(48 * pitch, now + 0.12);
          gain.gain.setValueAtTime(vol * 0.65, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.14);
          break;
        }

        case "dialogBlip": {
          // RPG character typewriter voice blip
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "square";
          osc.frequency.setValueAtTime(640 * pitch, now);
          osc.frequency.setValueAtTime(720 * pitch, now + 0.012);
          gain.gain.setValueAtTime(vol * 0.32, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.026);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.028);
          break;
        }

        case "cartridgeInsert": {
          // Mechanical lock-in clack + dual harmonic boot chime
          const clack = ctx.createOscillator();
          const clackGain = ctx.createGain();
          clack.type = "triangle";
          clack.frequency.setValueAtTime(280, now);
          clack.frequency.exponentialRampToValueAtTime(85, now + 0.035);
          clackGain.gain.setValueAtTime(vol * 0.75, now);
          clackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
          clack.connect(clackGain);
          clackGain.connect(ctx.destination);
          clack.start(now);
          clack.stop(now + 0.042);

          const chimeNotes = [587.33, 880, 1174.66];
          chimeNotes.forEach((f, idx) => {
            const osc = ctx.createOscillator();
            const g = ctx.createGain();
            const t = now + 0.05 + idx * 0.045;
            osc.type = "square";
            osc.frequency.setValueAtTime(f * pitch, t);
            g.gain.setValueAtTime(vol * 0.42, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
            osc.connect(g);
            g.connect(ctx.destination);
            osc.start(t);
            osc.stop(t + 0.15);
          });
          break;
        }

        case "achievement": {
          // 4-step arcade fanfare
          const steps = [
            { f: 523.25, t: 0, d: 0.07 },
            { f: 659.25, t: 0.07, d: 0.07 },
            { f: 783.99, t: 0.14, d: 0.07 },
            { f: 1046.5, t: 0.21, d: 0.22 },
          ];
          steps.forEach((s) => {
            const osc = ctx.createOscillator();
            const g = ctx.createGain();
            osc.type = "square";
            osc.frequency.setValueAtTime(s.f * pitch, now + s.t);
            g.gain.setValueAtTime(vol * 0.55, now + s.t);
            g.gain.exponentialRampToValueAtTime(0.001, now + s.t + s.d);
            osc.connect(g);
            g.connect(ctx.destination);
            osc.start(now + s.t);
            osc.stop(now + s.t + s.d + 0.01);
          });
          break;
        }
      }
    } catch {
      // Ignore WebAudio autoplay restrictions before first user gesture
    }
  }
}

export const pixelSound = new PixelSoundSynthesizer();

export function usePixelSound() {
  const [enabled, setEnabledState] = useState<boolean>(true);

  useEffect(() => {
    setEnabledState(pixelSound.isEnabled());
    return pixelSound.subscribe((val) => setEnabledState(val));
  }, []);

  const play = useCallback(
    (name: PixelSoundName, opts?: PixelSoundOptions) => {
      pixelSound.play(name, opts);
    },
    []
  );

  const toggle = useCallback(() => {
    return pixelSound.toggle();
  }, []);

  return {
    enabled,
    play,
    toggle,
    setEnabled: (v: boolean) => pixelSound.setEnabled(v),
  };
}
