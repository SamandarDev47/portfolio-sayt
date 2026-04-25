import { getTranslations } from "next-intl/server";

import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { PublishSettingsForm } from "@/components/forms/publish-settings-form";
import { Card, CardContent } from "@/components/ui/card";
import { getDashboardData } from "@/features/dashboard/queries";
import { getCurrentUser } from "@/lib/auth/session";

export default async function DashboardAppearancePage({
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
  if (!data?.profile) {
    return null;
  }

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow={t("appearance")}
        title={t("appearance")}
        description={t("appearanceDescription")}
      />
      <Card className="rounded-[2rem]">
        <CardContent className="p-6 text-sm text-muted-foreground">
          Tune the feel of your public page with a premium dark theme, accent color, and
          spotlight messaging.
        </CardContent>
      </Card>
      <PublishSettingsForm profile={data.profile} appearanceOnly />
    </div>
  );
}
