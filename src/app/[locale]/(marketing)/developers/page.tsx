import { getTranslations } from "next-intl/server";

import { MarketingListPage } from "@/components/marketing/marketing-list-page";

export default async function DevelopersPage() {
  const t = await getTranslations();
  const items = (t.raw("marketing.developerReasons") as string[]).map((reason) => ({
    description: reason,
  }));

  return (
    <MarketingListPage
      eyebrow={t("pages.developersEyebrow")}
      title={t("marketing.whyDevelopersTitle")}
      description={t("marketing.whatDescription")}
      items={items}
      ctaLabel={t("common.createPortfolio")}
    />
  );
}
