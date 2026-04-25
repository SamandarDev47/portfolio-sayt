import { Mail, Phone, ShieldCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { pricingCheckout, siteContact } from "@/lib/site-config";

export default async function ContactPage() {
  const t = await getTranslations();

  const items = [
    {
      icon: Phone,
      title: t("pages.contactPhoneTitle"),
      value: siteContact.phone,
      href: `tel:${siteContact.phone}`,
      action: t("pages.callNow"),
    },
    {
      icon: Mail,
      title: t("pages.contactEmailTitle"),
      value: siteContact.email,
      href: `mailto:${siteContact.email}`,
      action: t("pages.sendEmail"),
    },
    {
      icon: ShieldCheck,
      title: t("pages.contactPaymentsTitle"),
      value: t("pages.contactPaymentsDescription", {
        providers: pricingCheckout.providers.join(", "),
      }),
      href: `mailto:${siteContact.email}?subject=${encodeURIComponent("Payment integration request")}`,
      action: t("pages.contactPaymentsAction"),
    },
  ];

  return (
    <div className="page-container space-y-12 py-16 sm:py-24">
      <SectionHeading
        eyebrow={t("pages.contactEyebrow")}
        title={t("pages.contactTitle")}
        description={t("pages.contactDescription")}
      />
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <Card key={item.title} className="rounded-[2rem]">
              <CardContent className="space-y-5 p-6">
                <div className="inline-flex rounded-2xl bg-primary/10 p-3 text-primary">
                  <Icon className="size-5" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-sm leading-7 text-muted-foreground">{item.value}</p>
                </div>
                <Button asChild variant="secondary">
                  <a href={item.href} target="_blank" rel="noreferrer">
                    {item.action}
                  </a>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
