import { getTranslations } from "next-intl/server";

import { MarketingListPage } from "@/components/marketing/marketing-list-page";

export default async function FeaturesPage() {
  const t = await getTranslations();
  const items = t.raw("marketing.featureCards") as Array<{ title: string; description: string }>;

  return (
    <MarketingListPage
      eyebrow={t("pages.featuresEyebrow")}
      title={t("marketing.featuresTitle")}
      description={t("marketing.whatDescription")}
      items={items}
      ctaLabel={t("common.createPortfolio")}
    />
  );
}
