import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { SignInForm } from "@/components/forms/auth-forms";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });

  return {
    title: t("signInTitle"),
    description: t("signInDescription"),
  };
}

export default async function SignInPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { locale } = await params;
  const { callbackUrl } = await searchParams;

  return (
    <div className="page-container py-16 sm:py-24">
      <SignInForm
        locale={locale}
        callbackUrl={callbackUrl}
        enableGithub={Boolean(process.env.GITHUB_ID && process.env.GITHUB_SECRET)}
        enableGoogle={Boolean(
          process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
        )}
      />
    </div>
  );
}
