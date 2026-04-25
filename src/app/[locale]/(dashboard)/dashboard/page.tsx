import { getTranslations } from "next-intl/server";

import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import { getDashboardData } from "@/features/dashboard/queries";
import { getCurrentUser } from "@/lib/auth/session";

export default async function DashboardOverviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const user = await getCurrentUser();
  const t = await getTranslations({ locale, namespace: "dashboard" });

  if (!user) {
    return null;
  }

  const data = await getDashboardData(user.id);

  if (!data) {
    return null;
  }

  const status = data.profile?.portfolioSettings?.status ?? "DRAFT";
  const stats = [
    { label: t("completionStat"), value: `${data.completion}%` },
    { label: t("projectsStat"), value: String(data.profile?.projects.length ?? 0) },
    { label: t("skillsStat"), value: String(data.profile?.skills.length ?? 0) },
    { label: t("experienceStat"), value: String(data.profile?.experiences.length ?? 0) },
  ];

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow={t("overview")}
        title={t("overview")}
        description={t("overviewDescription")}
      />
      <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <Card className="rounded-[2rem]">
          <CardContent className="space-y-6 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">{t("completion")}</div>
                <div className="mt-2 text-4xl font-semibold">{data.completion}%</div>
              </div>
              <Badge>{status}</Badge>
            </div>
            <div className="h-3 rounded-full bg-white/6">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                style={{ width: `${data.completion}%` }}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-[1.5rem] border border-surface-border p-4">
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                  <div className="mt-2 text-2xl font-semibold">{stat.value}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem]">
          <CardContent className="space-y-5 p-6">
            <div>
              <div className="text-sm text-muted-foreground">{t("quickActions")}</div>
              <h2 className="mt-2 text-2xl font-semibold">{t("quickActionsTitle")}</h2>
            </div>
            <div className="grid gap-3">
              <Button asChild variant="secondary" className="justify-start">
                <Link href="/dashboard/profile">{t("completeProfileAction")}</Link>
              </Button>
              <Button asChild variant="secondary" className="justify-start">
                <Link href="/dashboard/projects">{t("addProjectsAction")}</Link>
              </Button>
              <Button asChild variant="secondary" className="justify-start">
                <Link href="/dashboard/preview">{t("previewAction")}</Link>
              </Button>
              <Button asChild className="justify-start">
                <Link href="/dashboard/publish">{t("publishAction")}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
