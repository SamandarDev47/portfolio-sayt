import { getTranslations } from "next-intl/server";

import { MarketingListPage } from "@/components/marketing/marketing-list-page";

export default async function CompaniesPage() {
  const t = await getTranslations();
  const items = (t.raw("marketing.companyReasons") as string[]).map((reason) => ({
    description: reason,
  }));

  return (
    <MarketingListPage
      eyebrow={t("pages.companiesEyebrow")}
      title={t("marketing.whyCompaniesTitle")}
      description={t("marketing.whatDescription")}
      items={items}
      ctaLabel={t("common.createPortfolio")}
    />
  );
}
