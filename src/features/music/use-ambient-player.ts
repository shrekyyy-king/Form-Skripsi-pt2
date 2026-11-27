"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { defaultTrackId, musicConfig } from "@/config/music";
import { AmbientAudioError, AmbientEngine, isAmbientAudioSupported } from "./ambient-engine";

export type PlayerError = "blocked" | "unsupported" | null;

function clampVolume(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function readStoredVolume(): number | null {
  try {
    const raw = window.localStorage.getItem(musicConfig.storageKey);
    if (raw === null) return null;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? clampVolume(parsed) : null;
  } catch {
    return null; // localStorage bisa diblokir
  }
}

function storeVolume(volume: number): void {
  try {
    window.localStorage.setItem(musicConfig.storageKey, String(volume));
  } catch {
    // abaikan: penyimpanan hanya kenyamanan
  }
}

/** Status dan kendali pemutar. Audio TIDAK pernah dimulai tanpa panggilan toggle() dari tindakan pengguna. */
export function useAmbientPlayer() {
  const engineRef = useRef<AmbientEngine | null>(null);
  const busyRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolumeState] = useState<number>(musicConfig.defaultVolume);
  const [muted, setMutedState] = useState(false);
  const [trackId, setTrackIdState] = useState<string>(defaultTrackId);
  const [error, setError] = useState<PlayerError>(null);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    setSupported(isAmbientAudioSupported());
    const stored = readStoredVolume();
    if (stored !== null) setVolumeState(stored);
    return () => {
      engineRef.current?.dispose();
      engineRef.current = null;
    };
  }, []);

  const toggle = useCallback(async () => {
    if (busyRef.current) return;
    if (playing) {
      engineRef.current?.pause();
      setPlaying(false);
      return;
    }
    busyRef.current = true;
    try {
      const engine = engineRef.current ?? new AmbientEngine({ trackId, volume, muted });
      engineRef.current = engine;
      await engine.start();
      setPlaying(true);
      setError(null);
    } catch (caught) {
      setPlaying(false);
      setError(caught instanceof AmbientAudioError && caught.code === "unsupported" ? "unsupported" : "blocked");
    } finally {
      busyRef.current = false;
    }
  }, [playing, trackId, volume, muted]);

  const setVolume = useCallback((next: number) => {
    const value = clampVolume(next);
    setVolumeState(value);
    storeVolume(value);
    engineRef.current?.setVolume(value);
    if (value > 0) {
      setMutedState(false);
      engineRef.current?.setMuted(false);
    }
  }, []);

  const toggleMuted = useCallback(() => {
    const next = !muted;
    setMutedState(next);
    engineRef.current?.setMuted(next);
  }, [muted]);

  const selectTrack = useCallback((id: string) => {
    setTrackIdState(id);
    engineRef.current?.setTrack(id);
  }, []);

  return { playing, volume, muted, trackId, error, supported, toggle, setVolume, toggleMuted, selectTrack };
}
