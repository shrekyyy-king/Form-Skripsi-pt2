import { findTrack, musicConfig, type AmbientTrack } from "@/config/music";

type AudioContextConstructor = typeof AudioContext;

export type AmbientAudioErrorCode = "unsupported" | "blocked";

export class AmbientAudioError extends Error {
  constructor(public readonly code: AmbientAudioErrorCode) {
    super(code);
    this.name = "AmbientAudioError";
  }
}

function resolveContextConstructor(): AudioContextConstructor | undefined {
  if (typeof window === "undefined") return undefined;
  // Safari lama masih memakai awalan webkit.
  const legacy = window as unknown as { webkitAudioContext?: AudioContextConstructor };
  return window.AudioContext ?? legacy.webkitAudioContext;
}

export function isAmbientAudioSupported(): boolean {
  return resolveContextConstructor() !== undefined;
}

interface ActiveTrack {
  output: GainNode;
  nodes: AudioScheduledSourceNode[];
}

/** Membangun satu "pad" ambient: beberapa nada sinus/segitiga ber-detune, dengan napas volume sangat lambat. */
function buildTrack(context: AudioContext, destination: AudioNode, track: AmbientTrack): ActiveTrack {
  const output = context.createGain();
  output.gain.value = 0;
  output.connect(destination);

  const filter = context.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = track.filterHz;
  filter.Q.value = 0.4;
  filter.connect(output);

  const nodes: AudioScheduledSourceNode[] = [];
  const base = 1 / (track.frequencies.length * 2);

  track.frequencies.forEach((frequency, index) => {
    const voice = context.createGain();
    voice.gain.value = base;
    voice.connect(filter);

    for (const detune of [-5, 5]) {
      const oscillator = context.createOscillator();
      oscillator.type = track.waveform;
      oscillator.frequency.value = frequency;
      oscillator.detune.value = detune;
      oscillator.connect(voice);
      oscillator.start();
      nodes.push(oscillator);
    }

    // LFO sangat lambat; kecepatan tiap nada dibuat berbeda agar akor terasa "bernapas".
    const lfo = context.createOscillator();
    lfo.frequency.value = track.swellHz * (0.8 + index * 0.13);
    const depth = context.createGain();
    depth.gain.value = base * 0.6;
    lfo.connect(depth);
    depth.connect(voice.gain);
    lfo.start();
    nodes.push(lfo);
  });

  return { output, nodes };
}

interface EngineOptions {
  trackId: string;
  volume: number;
  muted: boolean;
}

/**
 * Mesin audio ambient berbasis Web Audio API.
 * AudioContext baru dibuat saat start() dipanggil dari gestur pengguna; tidak pernah autoplay.
 */
export class AmbientEngine {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private active: ActiveTrack | null = null;
  private trackId: string;
  private volume: number;
  private muted: boolean;
  private timers = new Set<ReturnType<typeof setTimeout>>();
  private suspendTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(options: EngineOptions) {
    this.trackId = options.trackId;
    this.volume = options.volume;
    this.muted = options.muted;
  }

  /** Memulai/melanjutkan pemutaran. Melempar AmbientAudioError jika tidak didukung atau diblokir browser. */
  async start(): Promise<void> {
    const context = this.ensureContext();
    this.cancelSuspend();
    try {
      await context.resume();
    } catch {
      throw new AmbientAudioError("blocked");
    }
    if (context.state !== "running") throw new AmbientAudioError("blocked");
    if (!this.active) this.mount();
  }

  pause(): void {
    if (this.active) {
      this.release(this.active);
      this.active = null;
    }
    this.cancelSuspend();
    const context = this.context;
    if (!context) return;
    this.suspendTimer = setTimeout(() => {
      this.suspendTimer = null;
      void context.suspend().catch(() => undefined);
    }, musicConfig.fadeSeconds * 1000 + 200);
  }

  setTrack(id: string): void {
    this.trackId = id;
    if (!this.active) return;
    this.release(this.active); // crossfade: lagu lama memudar sementara yang baru masuk
    this.active = null;
    this.mount();
  }

  setVolume(volume: number): void {
    this.volume = volume;
    this.applyMaster();
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    this.applyMaster();
  }

  dispose(): void {
    this.timers.forEach((timer) => clearTimeout(timer));
    this.timers.clear();
    this.cancelSuspend();
    if (this.active) this.stopNodes(this.active);
    this.active = null;
    const context = this.context;
    this.context = null;
    this.master = null;
    if (context && context.state !== "closed") void context.close().catch(() => undefined);
  }

  private ensureContext(): AudioContext {
    if (this.context) return this.context;
    const Constructor = resolveContextConstructor();
    if (!Constructor) throw new AmbientAudioError("unsupported");
    const context = new Constructor();
    const master = context.createGain();
    master.gain.value = this.masterTarget();
    master.connect(context.destination);
    this.context = context;
    this.master = master;
    return context;
  }

  private masterTarget(): number {
    // Kurva kuadrat: perubahan volume terasa lebih wajar di telinga.
    return this.muted ? 0 : this.volume * this.volume * musicConfig.masterCeiling;
  }

  private applyMaster(): void {
    if (!this.context || !this.master) return;
    this.master.gain.setTargetAtTime(this.masterTarget(), this.context.currentTime, 0.05);
  }

  private mount(): void {
    const { context, master } = this;
    if (!context || !master) return;
    const track = findTrack(this.trackId);
    if (!track) return;
    const active = buildTrack(context, master, track);
    const now = context.currentTime;
    active.output.gain.setValueAtTime(0, now);
    active.output.gain.linearRampToValueAtTime(1, now + musicConfig.fadeSeconds);
    this.active = active;
  }

  private release(track: ActiveTrack): void {
    const context = this.context;
    if (!context) return;
    const now = context.currentTime;
    track.output.gain.cancelScheduledValues(now);
    track.output.gain.setValueAtTime(track.output.gain.value, now);
    track.output.gain.linearRampToValueAtTime(0, now + musicConfig.fadeSeconds);
    this.later(() => this.stopNodes(track), musicConfig.fadeSeconds * 1000 + 100);
  }

  private stopNodes(track: ActiveTrack): void {
    for (const node of track.nodes) {
      try {
        node.stop();
      } catch {
        // sudah berhenti
      }
    }
    track.output.disconnect();
  }

  private later(callback: () => void, ms: number): void {
    const timer = setTimeout(() => {
      this.timers.delete(timer);
      callback();
    }, ms);
    this.timers.add(timer);
  }

  private cancelSuspend(): void {
    if (this.suspendTimer !== null) {
      clearTimeout(this.suspendTimer);
      this.suspendTimer = null;
    }
  }
}
