import { getTranslations } from "next-intl/server";

import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { ExperienceEditor } from "@/components/forms/experience-editor";
import { getDashboardData } from "@/features/dashboard/queries";
import { getCurrentUser } from "@/lib/auth/session";

export default async function DashboardExperiencePage({
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

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow={t("experience")}
        title={t("experience")}
        description={t("experienceDescription")}
      />
      <ExperienceEditor />
      <div className="space-y-4">
        {data.profile.experiences.map((experience) => (
          <ExperienceEditor key={experience.id} experience={experience} />
        ))}
      </div>
    </div>
  );
}
