import Image from "next/image";
import { ArrowRight, CheckCircle2, Globe2, Search, ShieldCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { HeroPreview } from "@/components/marketing/hero-preview";
import { Reveal } from "@/components/marketing/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { Link } from "@/i18n/routing";
import { getFeaturedPortfolio } from "@/features/portfolio/queries";

type RichTextCard = {
  title: string;
  description: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const featured = await getFeaturedPortfolio();

  const featureCards = t.raw("marketing.featureCards") as RichTextCard[];
  const developerReasons = t.raw("marketing.developerReasons") as string[];
  const companyReasons = t.raw("marketing.companyReasons") as string[];
  const steps = t.raw("marketing.steps") as string[];
  const faqs = t.raw("marketing.faqs") as FaqItem[];

  return (
    <div className="space-y-24 pb-20 pt-10 sm:space-y-28 sm:pt-16">
      <section className="page-container">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr,0.9fr]">
          <Reveal className="space-y-8">
            <Badge variant="secondary">{t("marketing.heroBadge")}</Badge>
            <div className="space-y-5">
              <h1 className="text-balance text-5xl font-semibold tracking-tight sm:text-7xl">
                {t("marketing.heroTitle")}
              </h1>
              <p className="max-w-2xl text-balance text-lg leading-8 text-muted-foreground">
                {t("marketing.heroDescription")}
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href="/sign-up">
                  {t("common.createPortfolio")}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/how-it-works">{t("marketing.secondaryCta")}</Link>
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[t("marketing.statOne"), t("marketing.statTwo"), t("marketing.statThree")].map(
                (item) => (
                  <div key={item} className="glass-card rounded-3xl px-4 py-4 text-sm text-muted-foreground">
                    {item}
                  </div>
                ),
              )}
            </div>
          </Reveal>
          <HeroPreview />
        </div>
      </section>

      <section className="page-container grid gap-6 md:grid-cols-3">
        {[
          {
            icon: ShieldCheck,
            title: t("marketing.whatTitle"),
            description: t("marketing.whatDescription"),
          },
          {
            icon: Globe2,
            title: t("marketing.whyDevelopersTitle"),
            description: developerReasons[0],
          },
          {
            icon: Search,
            title: t("marketing.whyCompaniesTitle"),
            description: companyReasons[0],
          },
        ].map((item, index) => {
          const Icon = item.icon;

          return (
            <Reveal key={item.title} delay={index * 0.07}>
              <Card className="h-full rounded-[2rem]">
                <CardContent className="space-y-5 p-6">
                  <div className="inline-flex rounded-2xl bg-primary/10 p-3 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <h2 className="text-2xl font-semibold">{item.title}</h2>
                  <p className="text-base leading-8 text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            </Reveal>
          );
        })}
      </section>

      <section className="page-container grid gap-8 lg:grid-cols-2">
        <Reveal>
          <SectionHeading
            eyebrow={t("marketing.developersEyebrow")}
            title={t("marketing.whyDevelopersTitle")}
            description={t("marketing.whatDescription")}
          />
          <div className="mt-8 space-y-4">
            {developerReasons.map((reason) => (
              <div key={reason} className="glass-card flex items-start gap-3 rounded-3xl p-5">
                <CheckCircle2 className="mt-1 size-5 text-primary" />
                <p className="text-base leading-8 text-muted-foreground">{reason}</p>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <SectionHeading
            eyebrow={t("marketing.companiesEyebrow")}
            title={t("marketing.whyCompaniesTitle")}
            description={t("marketing.whatDescription")}
          />
          <div className="mt-8 space-y-4">
            {companyReasons.map((reason) => (
              <div key={reason} className="glass-card flex items-start gap-3 rounded-3xl p-5">
                <CheckCircle2 className="mt-1 size-5 text-secondary" />
                <p className="text-base leading-8 text-muted-foreground">{reason}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="page-container space-y-10">
        <SectionHeading
          eyebrow={t("marketing.productEyebrow")}
          title={t("marketing.featuresTitle")}
          description={t("marketing.whatDescription")}
          align="center"
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featureCards.map((card, index) => (
            <Reveal key={card.title} delay={index * 0.06}>
              <Card className="h-full rounded-[2rem]">
                <CardContent className="space-y-4 p-6">
                  <Badge>{card.title}</Badge>
                  <p className="text-base leading-8 text-muted-foreground">{card.description}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="page-container space-y-10">
        <SectionHeading
          eyebrow={t("marketing.workflowEyebrow")}
          title={t("marketing.howTitle")}
          description={t("marketing.heroDescription")}
          align="center"
        />
        <div className="grid gap-4 md:grid-cols-5">
          {steps.map((step, index) => (
            <Reveal key={step} delay={index * 0.05}>
              <Card className="h-full rounded-[2rem]">
                <CardContent className="space-y-4 p-6">
                  <div className="font-mono text-sm text-primary">0{index + 1}</div>
                  <p className="text-base leading-8 text-muted-foreground">{step}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      {featured?.profile ? (
        <section className="page-container space-y-10">
          <SectionHeading
            eyebrow={t("marketing.showcaseEyebrow")}
            title={t("marketing.showcaseTitle")}
            description={t("marketing.showcaseDescription")}
          />
          <Card className="overflow-hidden rounded-[2.5rem]">
            <div className="grid gap-8 p-8 lg:grid-cols-[0.8fr,1.2fr] lg:p-10">
              <div className="relative overflow-hidden rounded-[2rem] border border-surface-border">
                <Image
                  src={featured.profile.photoUrl ?? "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80"}
                  alt={featured.profile.fullName ?? featured.username}
                  width={800}
                  height={900}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Badge>{featured.profile.mainStack ?? t("marketing.featuredDeveloperFallback")}</Badge>
                  <h3 className="text-3xl font-semibold">
                    {featured.profile.fullName ?? featured.username}
                  </h3>
                  <p className="text-lg text-primary">{featured.profile.title}</p>
                </div>
                <p className="text-base leading-8 text-muted-foreground">
                  {featured.profile.shortBio}
                </p>
                <div className="flex flex-wrap gap-2">
                  {featured.profile.skills.slice(0, 6).map((skill: { id: string; name: string }) => (
                    <Badge key={skill.id} variant="outline">
                      {skill.name}
                    </Badge>
                  ))}
                </div>
                <Button asChild size="lg">
                  <Link href={`/u/${featured.username}`}>
                    {t("portfolio.viewPortfolio")}
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </section>
      ) : null}

      <section className="page-container space-y-10">
        <SectionHeading
          eyebrow={t("marketing.faqEyebrow")}
          title={t("marketing.faqTitle")}
          description={t("marketing.heroDescription")}
          align="center"
        />
        <div className="grid gap-6 md:grid-cols-3">
          {faqs.map((faq, index) => (
            <Reveal key={faq.question} delay={index * 0.05}>
              <Card className="h-full rounded-[2rem]">
                <CardContent className="space-y-4 p-6">
                  <h3 className="text-lg font-semibold">{faq.question}</h3>
                  <p className="text-sm leading-7 text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="page-container">
        <Card className="overflow-hidden rounded-[2.75rem]">
          <CardContent className="grid gap-8 p-8 sm:p-10 lg:grid-cols-[1.1fr,0.9fr] lg:p-14">
            <div className="space-y-5">
              <Badge variant="secondary">{t("marketing.finalBadge")}</Badge>
              <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                {t("marketing.finalTitle")}
              </h2>
              <p className="max-w-2xl text-base leading-8 text-muted-foreground">
                {t("marketing.finalDescription")}
              </p>
            </div>
            <div className="flex items-center justify-start lg:justify-end">
              <Button asChild size="lg">
                <Link href="/sign-up">
                  {t("marketing.finalCta")}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
