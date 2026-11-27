import { z } from "zod";

// Pesan galat berupa kunci terjemahan (login.errors.*), bukan teks.
export const loginSchema = z.object({
  email: z.string().trim().min(1, "emailRequired").email("emailInvalid"),
  password: z.string().min(1, "passwordRequired"),
});
export type LoginFormValues = z.infer<typeof loginSchema>;
