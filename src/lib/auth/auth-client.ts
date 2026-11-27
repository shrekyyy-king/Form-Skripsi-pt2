export interface LoginCredentials {
  email: string;
  password: string;
}

/** Alasan gagal berupa kode, diterjemahkan di UI (login.errors.*). */
export type LoginFailureReason = "notActive" | "invalidCredentials";

export type LoginResult = { ok: true } | { ok: false; reason: LoginFailureReason };

/**
 * Antarmuka autentikasi. UI hanya memakai antarmuka ini, sehingga implementasi
 * mock bisa diganti implementasi backend (Tahap 2) tanpa mengubah komponen.
 */
export interface AuthClient {
  signIn(credentials: LoginCredentials): Promise<LoginResult>;
}
