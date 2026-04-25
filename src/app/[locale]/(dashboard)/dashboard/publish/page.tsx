import { getTranslations } from "next-intl/server";

import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { PublishSettingsForm } from "@/components/forms/publish-settings-form";
import { getDashboardData } from "@/features/dashboard/queries";
import { getCurrentUser } from "@/lib/auth/session";

export default async function DashboardPublishPage({
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
        eyebrow={t("publish")}
        title={t("publish")}
        description={t("publishDescription")}
      />
      <PublishSettingsForm profile={data.profile} />
    </div>
  );
}
