"use client";

import { Music2, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ambientTracks } from "@/config/music";
import { useAmbientPlayer } from "./use-ambient-player";

/**
 * Pemutar musik latar opsional. Tombol ikon kecil di header; panel kendali muncul
 * hanya saat dibuka (melayang di bawah header), sehingga tidak menutupi soal.
 * Tidak pernah autoplay.
 */
export function MusicPlayer() {
  const t = useTranslations("music");
  const player = useAmbientPlayer();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const volumePercent = Math.round(player.volume * 100);
  const errorKey = player.error ?? (!player.supported ? "unsupported" : null);

  return (
    <div ref={rootRef} className="relative">
      <Button
        ref={toggleRef}
        variant="ghost"
        size="icon"
        aria-label={t("toggle")}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="relative">
          <Music2 className="h-4 w-4" aria-hidden />
          {player.playing && (
            <span aria-hidden className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-primary motion-safe:animate-pulse" />
          )}
        </span>
      </Button>

      {open && (
        <div
          id={panelId}
          role="group"
          aria-label={t("panelTitle")}
          className="absolute right-0 top-full z-50 mt-2 w-72 max-w-[calc(100vw-2rem)] space-y-3 rounded-lg border bg-card p-4 text-card-foreground shadow-soft"
        >
          <div className="space-y-1">
            <h2 className="text-sm font-semibold">{t("panelTitle")}</h2>
            <p className="text-xs text-muted-foreground">{t("description")}</p>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => void player.toggle()} disabled={!player.supported}>
              {player.playing ? <Pause className="h-4 w-4" aria-hidden /> : <Play className="h-4 w-4" aria-hidden />}
              {player.playing ? t("pause") : t("play")}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              aria-label={t("mute")}
              aria-pressed={player.muted}
              onClick={player.toggleMuted}
            >
              {player.muted ? <VolumeX className="h-4 w-4" aria-hidden /> : <Volume2 className="h-4 w-4" aria-hidden />}
            </Button>
          </div>

          <label className="block space-y-1 text-sm">
            <span className="text-xs font-medium">{t("volume")}</span>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={volumePercent}
              aria-valuetext={`${volumePercent}%`}
              onChange={(event) => player.setVolume(Number(event.target.value) / 100)}
              className="w-full accent-primary"
            />
          </label>

          <label className="block space-y-1 text-sm">
            <span className="text-xs font-medium">{t("track")}</span>
            <select
              value={player.trackId}
              onChange={(event) => player.selectTrack(event.target.value)}
              className="h-9 w-full rounded-md border bg-card px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {ambientTracks.map((track) => (
                <option key={track.id} value={track.id}>{t(`tracks.${track.id}`)}</option>
              ))}
            </select>
          </label>

          <p role="status" className={errorKey ? "text-xs text-destructive" : "text-xs text-muted-foreground"}>
            {errorKey ? t(`errors.${errorKey}`) : player.playing ? t("statusPlaying") : t("statusIdle")}
          </p>
          <p className="text-xs text-muted-foreground">{t("trackNote")}</p>
        </div>
      )}
    </div>
  );
}
