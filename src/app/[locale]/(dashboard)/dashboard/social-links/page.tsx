import { getTranslations } from "next-intl/server";

import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { SocialLinksForm } from "@/components/forms/social-links-form";
import { getDashboardData } from "@/features/dashboard/queries";
import { getCurrentUser } from "@/lib/auth/session";

export default async function DashboardSocialLinksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const user = await getCurrentUser();
  const t = await getTranslations({ locale, namespace: "dashboard" });

  if (!user) {
    return null;
  }

  const data = await getDashboardData(user.id);
  if (!data?.profile) {
    return null;
  }

  const getLink = (platform: string) =>
    data.profile?.socialLinks.find((link) => link.label?.toLowerCase() === platform)?.url ?? "";

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow={t("socialLinks")}
        title={t("socialLinks")}
        description={t("socialDescription")}
      />
      <SocialLinksForm
        defaultValues={{
          telegram: data.profile.telegram ?? getLink("telegram"),
          github: data.profile.github ?? getLink("github"),
          linkedIn: data.profile.linkedIn ?? getLink("linkedin"),
          website: data.profile.website ?? getLink("website"),
          instagram: getLink("instagram"),
          x: getLink("x"),
        }}
      />
    </div>
  );
}
