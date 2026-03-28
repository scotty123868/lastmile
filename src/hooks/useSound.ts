import { useCallback, useSyncExternalStore } from 'react';

// ── Persistent mute state (muted by default) ────────────────────────────────

const STORAGE_KEY = 'lm-sound-muted';

let muted = true;
const listeners = new Set<() => void>();

function getMuted() {
  return muted;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => { listeners.delete(cb); };
}

function setMuted(value: boolean) {
  muted = value;
  try { localStorage.setItem(STORAGE_KEY, String(value)); } catch { /* noop */ }
  listeners.forEach((cb) => cb());
}

// Initialize from localStorage
try {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored !== null) muted = stored === 'true';
} catch { /* noop */ }

// ── Web Audio API sound generators ──────────────────────────────────────────

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

function playTone(frequency: number, duration: number, volume: number = 0.08, _type: OscillatorType = 'sine') {
  if (muted) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = _type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration / 1000);
  } catch {
    // Audio not available
  }
}

// ── Sound presets ───────────────────────────────────────────────────────────

/** Soft chime — for toast notifications */
export function playChime() {
  if (muted) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Two-note chime: fundamental + fifth above
    [800, 1200].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0, now + i * 0.04);
      gain.gain.linearRampToValueAtTime(0.06, now + i * 0.04 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.04);
      osc.stop(now + i * 0.04 + 0.12);
    });
  } catch { /* noop */ }
}

/** Subtle click — for PDF complete, toggles */
export function playClick() {
  playTone(1200, 50, 0.05);
}

/** Low tone — for warnings, Cost of Inaction */
export function playLowTone() {
  playTone(200, 200, 0.06);
}

// ── React hook ──────────────────────────────────────────────────────────────

export function useSound() {
  const isMuted = useSyncExternalStore(subscribe, getMuted);

  const toggleMute = useCallback(() => {
    setMuted(!getMuted());
  }, []);

  return {
    isMuted,
    toggleMute,
    playChime,
    playClick,
    playLowTone,
  };
}
