import Image from "next/image";
import {
  BriefcaseBusiness,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Send,
  Smartphone,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { PortfolioRecord } from "@/features/portfolio/queries";
import { formatMonthYear, parseTechnologies } from "@/lib/utils";

type PublicPortfolioViewProps = {
  portfolio: PortfolioRecord;
  locale: string;
  preview?: boolean;
};

const socialIconMap = {
  GITHUB: Globe,
  LINKEDIN: BriefcaseBusiness,
  WEBSITE: Globe,
  TELEGRAM: Send,
  EMAIL: Mail,
  PHONE: Smartphone,
  X: Globe,
  INSTAGRAM: Globe,
} as const;

export async function PublicPortfolioView({
  portfolio,
  locale,
  preview = false,
}: PublicPortfolioViewProps) {
  const t = await getTranslations({ locale, namespace: "portfolio" });
  const profile = portfolio.profile;

  if (!profile) {
    return null;
  }

  const contactActions = [
    profile.contactSettings?.publicEmail && profile.email
      ? {
          label: profile.email,
          href: `mailto:${profile.email}`,
          icon: Mail,
        }
      : null,
    profile.contactSettings?.publicTelegram && profile.telegram
      ? {
          label: "Telegram",
          href: profile.telegram,
          icon: Send,
        }
      : null,
    profile.contactSettings?.publicPhone && profile.phone
      ? {
          label: profile.phone,
          href: `tel:${profile.phone}`,
          icon: Smartphone,
        }
      : null,
  ].filter(Boolean) as Array<{ label: string; href: string; icon: React.ComponentType<{ className?: string }> }>;

  const socialLinks: Array<{
    id: string;
    platform: string;
    label: string | null;
    url: string;
  }> =
    profile.socialLinks.length > 0
      ? profile.socialLinks.map((link) => ({
          id: link.id,
          platform: String(link.platform),
          label: link.label ?? null,
          url: link.url,
        }))
      : [
          profile.github
            ? { id: "github", platform: "GITHUB", label: "GitHub", url: profile.github }
            : null,
          profile.linkedIn
            ? { id: "linkedin", platform: "LINKEDIN", label: "LinkedIn", url: profile.linkedIn }
            : null,
          profile.website
            ? { id: "website", platform: "WEBSITE", label: "Website", url: profile.website }
            : null,
        ].filter((link): link is { id: string; platform: string; label: string; url: string } => Boolean(link));

  return (
    <div className="page-container space-y-10 py-12 sm:py-16">
      {preview ? (
        <div className="glass-card rounded-full px-5 py-3 text-sm text-primary">
          {t("previewMode")}
        </div>
      ) : null}

      <section className="glass-card overflow-hidden rounded-[2.5rem]">
        <div className="relative grid gap-8 p-8 sm:p-10 lg:grid-cols-[1.35fr,0.85fr] lg:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(94,234,212,0.12),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(125,211,252,0.1),transparent_32%)]" />
          <div className="relative space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge>{profile.mainStack ?? t("fallbackStack")}</Badge>
              {profile.portfolioSettings?.spotlightText ? (
                <Badge variant="outline">{profile.portfolioSettings.spotlightText}</Badge>
              ) : null}
            </div>

            <div className="space-y-4">
              <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
                {profile.fullName ?? portfolio.name ?? portfolio.username}
              </h1>
              <p className="text-xl text-primary">{profile.title}</p>
              <p className="max-w-2xl text-balance text-base leading-8 text-muted-foreground sm:text-lg">
                {profile.shortBio}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {profile.location ? (
                <div className="inline-flex items-center gap-2 rounded-full border border-surface-border px-4 py-2">
                  <MapPin className="size-4" />
                  {profile.location}
                </div>
              ) : null}
              {profile.availability ? (
                <div className="inline-flex items-center gap-2 rounded-full border border-surface-border px-4 py-2">
                  {profile.availability}
                </div>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-3">
              {contactActions.map((item) => {
                const Icon = item.icon;

                return (
                  <Button key={item.href} asChild>
                    <a href={item.href} target="_blank" rel="noreferrer">
                      <Icon className="size-4" />
                      {item.label}
                    </a>
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="relative">
            <div className="relative mx-auto aspect-[4/4.3] max-w-sm overflow-hidden rounded-[2rem] border border-surface-border">
              <Image
                src={profile.photoUrl ?? "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80"}
                alt={profile.fullName ?? portfolio.username}
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
        <section className="space-y-8">
          <Card className="rounded-[2rem]">
            <CardHeader>
              <CardTitle>{t("about")}</CardTitle>
            </CardHeader>
            <CardContent className="text-base leading-8 text-muted-foreground">
              {profile.about}
            </CardContent>
          </Card>

          <Card className="rounded-[2rem]">
            <CardHeader>
              <CardTitle>{t("featuredProjects")}</CardTitle>
              <CardDescription>{t("featuredProjectsDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {profile.projects.map((project) => (
                <div
                  key={project.id}
                  className="overflow-hidden rounded-[1.75rem] border border-surface-border"
                >
                  {project.imageUrl ? (
                    <div className="relative h-52 w-full">
                      <Image
                        src={project.imageUrl}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                  <div className="space-y-4 p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold">{project.title}</h3>
                        <p className="mt-2 text-sm leading-7 text-muted-foreground">
                          {project.shortDescription}
                        </p>
                      </div>
                      {project.featured ? <Badge>{t("featuredBadge")}</Badge> : null}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {parseTechnologies(project.technologies).map((tech) => (
                        <Badge key={tech} variant="outline">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {project.liveUrl ? (
                        <Button asChild variant="secondary">
                          <a href={project.liveUrl} target="_blank" rel="noreferrer">
                            <ExternalLink className="size-4" />
                            {t("liveDemo")}
                          </a>
                        </Button>
                      ) : null}
                      {project.githubUrl ? (
                        <Button asChild variant="outline">
                          <a href={project.githubUrl} target="_blank" rel="noreferrer">
                            <Globe className="size-4" />
                            {t("sourceCode")}
                          </a>
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <aside className="space-y-8">
          <Card className="rounded-[2rem]">
            <CardHeader>
              <CardTitle>{t("skills")}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <Badge key={skill.id} variant={skill.isCore ? "default" : "outline"}>
                  {skill.name}
                </Badge>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-[2rem]">
            <CardHeader>
              <CardTitle>{t("experience")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {profile.experiences.map((experience) => (
                <div key={experience.id} className="rounded-2xl border border-surface-border p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-semibold">{experience.role}</div>
                      <div className="text-sm text-muted-foreground">{experience.company}</div>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      {formatMonthYear(experience.startDate)} -{" "}
                      {experience.currentRole ? t("present") : formatMonthYear(experience.endDate)}
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {experience.description}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-[2rem]">
            <CardHeader>
              <CardTitle>{t("education")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.educations.map((education) => (
                <div key={education.id} className="rounded-2xl border border-surface-border p-4">
                  <div className="font-semibold">{education.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {education.institution}
                    {education.yearLabel ? ` - ${education.yearLabel}` : ""}
                  </div>
                </div>
              ))}
              {profile.certificates.length > 0 ? (
                <div className="pt-2">
                  <div className="mb-3 text-sm font-semibold text-foreground">
                    {t("certificates")}
                  </div>
                  <div className="space-y-3">
                    {profile.certificates.map((certificate) => (
                      <div
                        key={certificate.id}
                        className="rounded-2xl border border-surface-border p-4"
                      >
                        <div className="font-semibold">{certificate.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {certificate.issuer}
                          {certificate.yearLabel ? ` - ${certificate.yearLabel}` : ""}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card className="rounded-[2rem]">
            <CardHeader>
              <CardTitle>{t("connect")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {socialLinks.map((link) => {
                const Icon =
                  socialIconMap[link.platform as keyof typeof socialIconMap] ?? Globe;

                return (
                  <Button key={link.id} asChild variant="secondary" className="w-full justify-start">
                    <a href={link.url} target="_blank" rel="noreferrer">
                      <Icon className="size-4" />
                      {link.label ?? link.url}
                    </a>
                  </Button>
                );
              })}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
