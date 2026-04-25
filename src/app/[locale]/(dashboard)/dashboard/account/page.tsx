import { getTranslations } from "next-intl/server";

import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { AccountSettingsForm } from "@/components/forms/account-settings-form";

export default async function DashboardAccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dashboard" });

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow={t("account")}
        title={t("account")}
        description={t("accountDescription")}
      />
      <AccountSettingsForm locale={locale} />
    </div>
  );
}
