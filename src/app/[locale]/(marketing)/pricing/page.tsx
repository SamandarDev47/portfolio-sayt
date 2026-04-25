import { CheckCircle2, ShieldCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { Link } from "@/i18n/routing";
import { pricingCheckout, siteContact } from "@/lib/site-config";

type PricingPlan = {
  name: string;
  price: string;
  description: string;
  cta: string;
  bullets: string[];
  featured?: boolean;
};

export default async function PricingPage() {
  const t = await getTranslations();
  const plans = t.raw("pages.pricingPlans") as PricingPlan[];

  return (
    <div className="page-container space-y-12 py-16 sm:py-24">
      <SectionHeading
        eyebrow={t("pages.pricingEyebrow")}
        title={t("pages.pricingTitle")}
        description={t("pages.pricingDescription")}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.name} className="rounded-[2rem]">
            <CardContent className="space-y-6 p-6">
              <div className="flex items-center justify-between gap-3">
                <Badge variant={plan.featured ? "secondary" : "outline"}>{plan.name}</Badge>
                {plan.featured ? <Badge>{t("pages.mostPopular")}</Badge> : null}
              </div>

              <div className="space-y-2">
                <div className="text-4xl font-semibold">{plan.price}</div>
                <p className="text-sm leading-7 text-muted-foreground">{plan.description}</p>
              </div>

              <div className="space-y-3">
                {plan.bullets.map((bullet) => (
                  <div key={bullet} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 size-4 text-primary" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>

              <Button asChild className="w-full" variant={plan.featured ? "primary" : "secondary"}>
                <a href={`mailto:${siteContact.email}?subject=${encodeURIComponent(plan.cta)}`}>
                  {plan.cta}
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-[2rem] border-primary/20">
        <CardContent className="space-y-5 p-6">
          <div className="inline-flex rounded-2xl bg-primary/10 p-3 text-primary">
            <ShieldCheck className="size-5" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">{t("pages.paymentSecurityTitle")}</h2>
            <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
              {t("pages.paymentSecurityDescription", {
                providers: pricingCheckout.providers.join(", "),
              })}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="secondary">
              <a href={`mailto:${siteContact.email}`}>{siteContact.email}</a>
            </Button>
            <Button asChild variant="outline">
              <a href={`tel:${siteContact.phone}`}>{siteContact.phone}</a>
            </Button>
            <Button asChild>
              <Link href="/contact">{t("pages.contactForCheckout")}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
