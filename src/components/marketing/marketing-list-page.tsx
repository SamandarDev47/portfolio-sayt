import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/marketing/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { Link } from "@/i18n/routing";

type MarketingListPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  items: Array<{ title?: string; description: string }>;
  ctaLabel: string;
  ctaHref?: string;
};

export function MarketingListPage({
  eyebrow,
  title,
  description,
  items,
  ctaLabel,
  ctaHref = "/sign-up",
}: MarketingListPageProps) {
  return (
    <div className="page-container space-y-14 py-16 sm:py-24">
      <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      <div className="grid gap-6 md:grid-cols-2">
        {items.map((item, index) => (
          <Reveal key={`${item.title ?? "item"}-${index}`} delay={index * 0.06}>
            <Card className="h-full rounded-[2rem]">
              <CardContent className="space-y-4 p-6">
                {item.title ? <Badge>{item.title}</Badge> : null}
                <p className="text-base leading-8 text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>
      <div className="flex">
        <Button asChild size="lg">
          <Link href={ctaHref}>
            {ctaLabel}
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
