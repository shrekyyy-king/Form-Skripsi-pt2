import { BarChart3, FolderKanban, MessageSquareText, Pencil, Plus, Send, Users } from "lucide-react";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { routes } from "@/config/routes";
import { activityRepository, projectRepository } from "@/lib/data";

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("dashboard");
  const tn = await getTranslations("projectDetail");
  const format = await getFormatter();
  const [projects, activities] = await Promise.all([projectRepository.list(), activityRepository.listRecent(5)]);

  // Terbaru dulu (urutan repository tidak dijamin menurut tanggal).
  const recent = [...projects].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const latest = recent[0];

  const stats = [
    { label: t("totalProjects"), value: projects.length, icon: FolderKanban },
    { label: t("totalRespondents"), value: projects.reduce((n, p) => n + p.respondentCount, 0), icon: Users },
    { label: t("activeQuestionnaires"), value: projects.filter((p) => p.questionnaireStatus === "published").length, icon: Send },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{t("greeting")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Badge>{t("demoNotice")}</Badge>
      </div>

      <section aria-label={t("totalProjects")} className="grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label}><CardContent className="flex items-center justify-between pt-5">
            <div><p className="text-sm text-muted-foreground">{label}</p><p className="text-3xl font-semibold">{value}</p></div>
            <Icon className="h-6 w-6 text-primary" aria-hidden />
          </CardContent></Card>
        ))}
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><h2 className="font-medium">{t("recentProjects")}</h2></CardHeader>
          <CardContent className="space-y-2">
            {recent.length === 0 && <p className="text-sm text-muted-foreground">{t("emptyProjects")}</p>}
            {recent.slice(0, 3).map((p) => (
              <Link key={p.id} href={routes.dashboard.project(p.id)} className="block rounded-md p-2 hover:bg-muted">
                <p className="text-sm font-medium">{p.title}</p>
                <p className="text-xs text-muted-foreground">{format.dateTime(new Date(p.createdAt), { dateStyle: "medium" })}</p>
              </Link>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><h2 className="font-medium">{t("recentActivities")}</h2></CardHeader>
          <CardContent className="space-y-3">
            {activities.length === 0 && <p className="text-sm text-muted-foreground">{t("emptyActivities")}</p>}
            {activities.map((a) => (
              <div key={a.id} className="text-sm">
                <p>{a.text}</p>
                <p className="text-xs text-muted-foreground">{format.dateTime(new Date(a.at), { dateStyle: "medium" })}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <section aria-labelledby="quick-actions-title" className="space-y-3">
        <h2 id="quick-actions-title" className="font-medium">{t("quickActions")}</h2>
        <div className="flex flex-wrap gap-2">
          <Link href={routes.dashboard.newProject} className={buttonVariants()}><Plus className="h-4 w-4" aria-hidden />{tn("newProject")}</Link>
          {latest && (
            <Link href={routes.dashboard.builder(latest.id)} className={buttonVariants({ variant: "outline", className: "max-w-full" })}>
              <Pencil className="h-4 w-4 shrink-0" aria-hidden /><span className="truncate">{t("quickOpenBuilder", { title: latest.title })}</span>
            </Link>
          )}
          <Link href={routes.dashboard.responses} className={buttonVariants({ variant: "outline" })}><MessageSquareText className="h-4 w-4" aria-hidden />{t("quickViewResponses")}</Link>
          <Link href={routes.dashboard.analysis} className={buttonVariants({ variant: "outline" })}><BarChart3 className="h-4 w-4" aria-hidden />{t("quickViewAnalysis")}</Link>
          <Link href={routes.dashboard.projects} className={buttonVariants({ variant: "ghost" })}>{t("goToProjects")}</Link>
        </div>
      </section>
    </div>
  );
}
