"use client";

import { LogIn, LogOut, Settings, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { routes } from "@/config/routes";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const itemClass =
  "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

/**
 * Menu profil (demo). Tanpa library tambahan: aria-expanded, Escape, klik luar,
 * navigasi panah/Home/End, dan Tab menutup menu. Item "Keluar" nonaktif pada Tahap 1.
 */
export function ProfileMenu() {
  const t = useTranslations("profile");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const items = (): HTMLElement[] =>
    menuRef.current ? Array.from(menuRef.current.querySelectorAll<HTMLElement>('[role="menuitem"]')) : [];

  // Fokus ke item pertama setelah menu terbuka.
  useEffect(() => {
    if (open) items()[0]?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const close = (restoreFocus: boolean) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  };

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
    }
  };

  const onMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const list = items();
    const current = list.findIndex((el) => el === document.activeElement);
    const move = (index: number) => {
      event.preventDefault();
      list[(index + list.length) % list.length]?.focus();
    };
    switch (event.key) {
      case "ArrowDown": return move(current + 1);
      case "ArrowUp": return move(current - 1);
      case "Home": return move(0);
      case "End": return move(list.length - 1);
      case "Escape":
        event.preventDefault();
        return close(true);
      case "Tab":
        event.preventDefault();
        return close(true);
    }
  };

  return (
    <div ref={rootRef} className="relative ml-2">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={onTriggerKeyDown}
        className="flex items-center gap-2 rounded-full border px-3 py-1 text-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <User className="h-4 w-4" aria-hidden />
        {t("button")}
      </button>

      {open && (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-label={t("menuLabel")}
          onKeyDown={onMenuKeyDown}
          className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border bg-card p-1 text-card-foreground shadow-soft"
        >
          <Link href={routes.dashboard.settings} role="menuitem" tabIndex={-1} onClick={() => close(false)} className={cn(itemClass, "hover:bg-muted")}>
            <Settings className="h-4 w-4" aria-hidden />
            {t("settings")}
          </Link>
          <Link href={routes.login} role="menuitem" tabIndex={-1} onClick={() => close(false)} className={cn(itemClass, "hover:bg-muted")}>
            <LogIn className="h-4 w-4" aria-hidden />
            {t("login")}
          </Link>
          <div role="separator" className="my-1 h-px bg-border" />
          <button type="button" role="menuitem" tabIndex={-1} aria-disabled="true" onClick={(event) => event.preventDefault()}
            className={cn(itemClass, "cursor-not-allowed text-muted-foreground")}>
            <LogOut className="h-4 w-4" aria-hidden />
            {t("logout")}
            <span className="ml-auto text-xs">{t("demo")}</span>
          </button>
        </div>
      )}
    </div>
  );
}
