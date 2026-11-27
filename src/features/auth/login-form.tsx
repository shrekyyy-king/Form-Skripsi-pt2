"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient, type AuthClient, type LoginFailureReason } from "@/lib/auth";
import { loginSchema, type LoginFormValues } from "./login-schema";

export function LoginForm({ client = authClient }: { client?: AuthClient }) {
  const t = useTranslations("login");
  const [failure, setFailure] = useState<LoginFailureReason | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setFailure(null);
    const result = await client.signIn(values);
    if (!result.ok) {
      setFailure(result.reason);
      resetField("password"); // kata sandi tidak dipertahankan di form
    }
  };

  return (
    <form noValidate className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <label className="block space-y-1 text-sm">
        <span className="font-medium">{t("email")}</span>
        <Input
          type="email"
          autoComplete="username"
          inputMode="email"
          aria-invalid={errors.email ? true : undefined}
          {...register("email")}
        />
        {errors.email?.message && <span role="alert" className="text-destructive">{t(`errors.${errors.email.message}`)}</span>}
      </label>

      <div className="space-y-1 text-sm">
        <label htmlFor="login-password" className="font-medium">{t("password")}</label>
        <div className="relative">
          <Input
            id="login-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            className="pr-11"
            aria-invalid={errors.password ? true : undefined}
            {...register("password")}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0.5 top-0.5 h-9 w-9"
            aria-label={t("togglePassword")}
            aria-pressed={showPassword}
            onClick={() => setShowPassword((value) => !value)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
          </Button>
        </div>
        {errors.password?.message && <span role="alert" className="text-destructive">{t(`errors.${errors.password.message}`)}</span>}
      </div>

      {failure && <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">{t(`errors.${failure}`)}</p>}

      <Button type="submit" className="w-full" disabled={isSubmitting}>{t("submit")}</Button>
    </form>
  );
}
