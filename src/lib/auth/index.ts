import { createMockAuthClient } from "./mock-auth-client";

export type { AuthClient, LoginCredentials, LoginFailureReason, LoginResult } from "./auth-client";

/** Satu-satunya tempat memilih implementasi autentikasi. */
export const authClient = createMockAuthClient();
