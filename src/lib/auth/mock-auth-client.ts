import type { AuthClient } from "./auth-client";

/**
 * Implementasi Tahap 1: selalu menolak. Tanpa jaringan, tanpa menyimpan kredensial
 * (argumen sengaja tidak dibaca, dicatat, atau disimpan).
 */
export function createMockAuthClient(): AuthClient {
  return {
    async signIn() {
      return { ok: false, reason: "notActive" };
    },
  };
}
