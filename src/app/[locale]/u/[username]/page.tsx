import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicPortfolioView } from "@/components/portfolio/public-portfolio-view";
import { getPublicPortfolioByUsername } from "@/features/portfolio/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const portfolio = await getPublicPortfolioByUsername(username);

  if (!portfolio?.profile) {
    return {};
  }

  const profile = portfolio.profile;

  return {
    title:
      profile.portfolioSettings?.seoTitle ??
      `${profile.fullName ?? portfolio.username} | ${profile.title ?? "Developer portfolio"}`,
    description:
      profile.portfolioSettings?.seoDescription ??
      profile.shortBio ??
      "Public developer portfolio",
    openGraph: {
      title:
        profile.portfolioSettings?.seoTitle ??
        `${profile.fullName ?? portfolio.username} | ${profile.title ?? "Developer portfolio"}`,
      description:
        profile.portfolioSettings?.seoDescription ??
        profile.shortBio ??
        "Public developer portfolio",
      images: profile.photoUrl ? [{ url: profile.photoUrl }] : undefined,
    },
  };
}

export default async function PublicPortfolioPage({
  params,
}: {
  params: Promise<{ locale: string; username: string }>;
}) {
  const { locale, username } = await params;
  const portfolio = await getPublicPortfolioByUsername(username);

  if (!portfolio) {
    notFound();
  }

  return <PublicPortfolioView portfolio={portfolio} locale={locale} />;
}
