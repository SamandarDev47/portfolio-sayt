import { getTranslations } from "next-intl/server";

import { MarketingListPage } from "@/components/marketing/marketing-list-page";

export default async function HowItWorksPage() {
  const t = await getTranslations();
  const items = (t.raw("marketing.steps") as string[]).map((step) => ({
    description: step,
  }));

  return (
    <MarketingListPage
      eyebrow={t("pages.workflowEyebrow")}
      title={t("marketing.howTitle")}
      description={t("marketing.heroDescription")}
      items={items}
      ctaLabel={t("common.createPortfolio")}
    />
  );
}
