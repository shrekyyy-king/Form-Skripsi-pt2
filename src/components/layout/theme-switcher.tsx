"use client";

import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations("common");
  return (
    <Button variant="ghost" size="icon" aria-label={t("toggleTheme")} onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
      <Sun className="h-4 w-4 dark:hidden" aria-hidden />
      <Moon className="hidden h-4 w-4 dark:block" aria-hidden />
    </Button>
  );
}
