import { getTranslations } from "next-intl/server";

import { DeveloperCard } from "@/components/discover/developer-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionHeading } from "@/components/ui/section-heading";
import { getDiscoverDevelopers } from "@/features/discover/queries";

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    role?: string;
    skill?: string;
    stack?: string;
  }>;
}) {
  const t = await getTranslations();
  const filters = await searchParams;
  const result = await getDiscoverDevelopers(filters);

  return (
    <div className="page-container space-y-12 py-16 sm:py-24">
      <SectionHeading
        eyebrow={t("pages.discoverEyebrow")}
        title={t("discover.title")}
        description={t("discover.description")}
      />

      <Card className="rounded-[2rem]">
        <CardContent className="p-6">
          <form className="grid gap-4 lg:grid-cols-4">
            <div>
              <Label htmlFor="q">{t("pages.search")}</Label>
              <Input id="q" name="q" defaultValue={filters.q ?? ""} />
            </div>
            <div>
              <Label htmlFor="role">{t("pages.filterRole")}</Label>
              <Input id="role" name="role" defaultValue={filters.role ?? ""} />
            </div>
            <div>
              <Label htmlFor="stack">{t("pages.filterStack")}</Label>
              <select
                id="stack"
                name="stack"
                defaultValue={filters.stack ?? ""}
                className="h-12 w-full rounded-2xl border border-surface-border bg-surface px-4 text-sm text-foreground outline-none"
              >
                <option value="">{t("pages.allStacks")}</option>
                {result.filters.stacks.map((stack) => (
                  <option key={stack} value={stack}>
                    {stack}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="skill">{t("pages.filterSkill")}</Label>
              <select
                id="skill"
                name="skill"
                defaultValue={filters.skill ?? ""}
                className="h-12 w-full rounded-2xl border border-surface-border bg-surface px-4 text-sm text-foreground outline-none"
              >
                <option value="">{t("pages.allSkills")}</option>
                {result.filters.skills.map((skill: string) => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
            </div>
            <div className="lg:col-span-4">
              <Button type="submit">{t("pages.search")}</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {result.developers.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {result.developers.map((developer) => (
            <DeveloperCard
              key={developer.id}
              developer={developer}
              ctaLabel={t("portfolio.viewPortfolio")}
            />
          ))}
        </div>
      ) : (
        <Card className="rounded-[2rem]">
          <CardContent className="p-8 text-center text-muted-foreground">
            {t("discover.empty")}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
