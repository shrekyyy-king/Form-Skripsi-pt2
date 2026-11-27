/**
 * Konfigurasi pemutar musik latar.
 * Semua audio disintesis langsung di browser lewat Web Audio API (nada ambient orisinal).
 * DILARANG menambahkan berkas audio atau URL musik komersial/tanpa lisensi di sini.
 */
export interface AmbientTrack {
  /** Dipakai juga sebagai kunci terjemahan: music.tracks.<id>. */
  id: string;
  /** Frekuensi nada akor (Hz). */
  frequencies: readonly number[];
  waveform: OscillatorType;
  /** Frekuensi potong low-pass (Hz): makin kecil makin lembut. */
  filterHz: number;
  /** Kecepatan "napas" volume tiap nada (Hz, sangat lambat). */
  swellHz: number;
}

/** Placeholder pemilih lagu: tiga preset akor sintetis. */
export const ambientTracks: readonly AmbientTrack[] = [
  { id: "calm", frequencies: [130.81, 196.0, 261.63, 329.63], waveform: "sine", filterHz: 900, swellHz: 0.06 },
  { id: "drift", frequencies: [110.0, 164.81, 220.0, 261.63], waveform: "triangle", filterHz: 700, swellHz: 0.05 },
  { id: "light", frequencies: [146.83, 220.0, 293.66, 369.99], waveform: "sine", filterHz: 1200, swellHz: 0.08 },
];

export const defaultTrackId = "calm";

export function findTrack(id: string): AmbientTrack | undefined {
  return ambientTracks.find((track) => track.id === id) ?? ambientTracks[0];
}

export const musicConfig = {
  /** Kunci localStorage untuk volume (0-1). */
  storageKey: "rp.music.volume",
  defaultVolume: 0.4,
  /** Batas gain master agar musik tetap pelan walau volume 100%. */
  masterCeiling: 0.2,
  /** Durasi fade masuk/keluar (detik). */
  fadeSeconds: 1.5,
} as const;
