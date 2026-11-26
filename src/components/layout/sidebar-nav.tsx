"use client";

import { BarChart3, Database, FolderKanban, LayoutDashboard, MessageSquareText, Plug, Settings, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routes } from "@/config/routes";
import { cn } from "@/lib/utils";

const items: { key: string; href: string; icon: LucideIcon }[] = [
  { key: "overview", href: routes.dashboard.root, icon: LayoutDashboard },
  { key: "projects", href: routes.dashboard.projects, icon: FolderKanban },
  { key: "responses", href: routes.dashboard.responses, icon: MessageSquareText },
  { key: "data", href: routes.dashboard.data, icon: Database },
  { key: "analysis", href: routes.dashboard.analysis, icon: BarChart3 },
  { key: "integrations", href: routes.dashboard.integrations, icon: Plug },
  { key: "settings", href: routes.dashboard.settings, icon: Settings },
];

export function SidebarNav({ orientation }: { orientation: "vertical" | "horizontal" }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  return (
    <nav aria-label={t("label")} className={cn("flex gap-1", orientation === "vertical" ? "flex-col" : "overflow-x-auto px-3 py-2")}>
      {items.map(({ key, href, icon: Icon }) => {
        const active = href === routes.dashboard.root ? pathname === href : pathname.startsWith(href);
        return (
          <Link key={key} href={href} aria-current={active ? "page" : undefined}
            className={cn("flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors", active ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
            <Icon className="h-4 w-4" aria-hidden />
            {t(key)}
          </Link>
        );
      })}
    </nav>
  );
}
