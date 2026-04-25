import { getTranslations } from "next-intl/server";

import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { ProfileForm } from "@/components/forms/profile-form";
import { getDashboardData } from "@/features/dashboard/queries";
import { getCurrentUser } from "@/lib/auth/session";

export default async function DashboardProfilePage({
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
  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow={t("profile")}
        title={t("profile")}
        description={t("profileDescription")}
      />
      <ProfileForm
        defaultValues={{
          fullName: data.profile?.fullName ?? data.user.name ?? "",
          username: data.user.username,
          title: data.profile?.title ?? "",
          shortBio: data.profile?.shortBio ?? "",
          about: data.profile?.about ?? "",
          location: data.profile?.location ?? "",
          mainStack: data.profile?.mainStack ?? "",
          email: data.profile?.email ?? data.user.email,
          phone: data.profile?.phone ?? "",
          telegram: data.profile?.telegram ?? "",
          github: data.profile?.github ?? "",
          linkedIn: data.profile?.linkedIn ?? "",
          website: data.profile?.website ?? "",
          photoUrl: data.profile?.photoUrl ?? "",
          availability: data.profile?.availability ?? "",
        }}
      />
    </div>
  );
}
