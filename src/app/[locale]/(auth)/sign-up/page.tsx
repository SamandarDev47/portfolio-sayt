import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { SignUpForm } from "@/components/forms/auth-forms";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });

  return {
    title: t("signUpTitle"),
    description: t("signUpDescription"),
  };
}

export default async function SignUpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="page-container py-16 sm:py-24">
      <SignUpForm
        locale={locale}
        enableGithub={Boolean(process.env.GITHUB_ID && process.env.GITHUB_SECRET)}
        enableGoogle={Boolean(
          process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
        )}
      />
    </div>
  );
}
