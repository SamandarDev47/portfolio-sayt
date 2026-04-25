import { getTranslations } from "next-intl/server";

import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";

type FaqItem = {
  question: string;
  answer: string;
};

export default async function FaqPage() {
  const t = await getTranslations();
  const faqs = t.raw("marketing.faqs") as FaqItem[];

  return (
    <div className="page-container space-y-12 py-16 sm:py-24">
      <SectionHeading
        eyebrow={t("marketing.faqEyebrow")}
        title={t("marketing.faqTitle")}
        description={t("marketing.heroDescription")}
      />
      <div className="grid gap-6 lg:grid-cols-3">
        {faqs.map((faq) => (
          <Card key={faq.question} className="rounded-[2rem]">
            <CardContent className="space-y-4 p-6">
              <h3 className="text-lg font-semibold">{faq.question}</h3>
              <p className="text-sm leading-7 text-muted-foreground">{faq.answer}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
