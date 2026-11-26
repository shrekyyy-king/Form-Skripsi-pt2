import { FolderKanban, Users, Send } from "lucide-react";
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
  const format = await getFormatter();
  const [projects, activities] = await Promise.all([projectRepository.list(), activityRepository.listRecent(5)]);

  const stats = [
    { label: t("totalProjects"), value: projects.length, icon: FolderKanban },
    { label: t("totalRespondents"), value: projects.reduce((n, p) => n + p.respondentCount, 0), icon: Users },
    { label: t("activeQuestionnaires"), value: projects.filter((p) => p.questionnaireStatus === "published").length, icon: Send },
  ];

  return (
    <div className="space-y-8">
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
            {projects.slice(0, 3).map((p) => (
              <div key={p.id} className="rounded-md p-2">
                <p className="text-sm font-medium">{p.title}</p>
                <p className="text-xs text-muted-foreground">{format.dateTime(new Date(p.createdAt), { dateStyle: "medium" })}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><h2 className="font-medium">{t("recentActivities")}</h2></CardHeader>
          <CardContent className="space-y-3">
            {activities.map((a) => (
              <div key={a.id} className="text-sm">
                <p>{a.text}</p>
                <p className="text-xs text-muted-foreground">{format.dateTime(new Date(a.at), { dateStyle: "medium" })}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link href={routes.dashboard.projects} className={buttonVariants()}>{t("goToProjects")}</Link>
      </div>
    </div>
  );
}
