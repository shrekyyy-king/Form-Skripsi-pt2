import { setRequestLocale } from "next-intl/server";
import { BrandMark } from "@/components/layout/brand-mark";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ProfileMenu } from "@/components/layout/profile-menu";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { ThemeSwitcher } from "@/components/layout/theme-switcher";

export default async function DashboardLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 shrink-0 flex-col gap-6 border-r bg-card p-4 md:flex">
        <BrandMark />
        <SidebarNav orientation="vertical" />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b px-4">
          <div className="min-w-0 md:hidden"><BrandMark /></div>
          <div className="ml-auto flex shrink-0 items-center gap-1">
            <LanguageSwitcher />
            <ThemeSwitcher />
            <ProfileMenu />
          </div>
        </header>
        <div className="border-b md:hidden"><SidebarNav orientation="horizontal" /></div>
        <main className="mx-auto w-full max-w-5xl flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
