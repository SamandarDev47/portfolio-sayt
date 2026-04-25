import { getTranslations } from "next-intl/server";

import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { PublicPortfolioView } from "@/components/portfolio/public-portfolio-view";
import { getPreviewPortfolioByUserId } from "@/features/portfolio/queries";
import { getCurrentUser } from "@/lib/auth/session";

export default async function DashboardPreviewPage({
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

  const portfolio = await getPreviewPortfolioByUserId(user.id);
  if (!portfolio) {
    return null;
  }

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow={t("preview")}
        title={t("preview")}
        description={t("previewDescription")}
      />
      <PublicPortfolioView portfolio={portfolio} locale={locale} preview />
    </div>
  );
}
