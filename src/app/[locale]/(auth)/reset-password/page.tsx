import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { ResetPasswordForm } from "@/components/forms/auth-forms";
import { Card, CardContent } from "@/components/ui/card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });

  return {
    title: t("resetTitle"),
    description: t("resetDescription"),
  };
}

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <div className="page-container py-16 sm:py-24">
      {token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <Card className="mx-auto max-w-xl rounded-[2rem]">
          <CardContent className="p-8 text-center text-muted-foreground">
            This reset link is incomplete. Request a fresh password reset from the sign-in
            page.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
