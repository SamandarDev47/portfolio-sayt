import { getTranslations } from "next-intl/server";

import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { SkillEditor } from "@/components/forms/skill-editor";
import { getDashboardData } from "@/features/dashboard/queries";
import { getCurrentUser } from "@/lib/auth/session";

export default async function DashboardSkillsPage({
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
        eyebrow={t("skills")}
        title={t("skills")}
        description={t("skillsDescription")}
      />
      <SkillEditor categories={data.categories} />
      <div className="space-y-4">
        {data.profile.skills.map((skill) => (
          <SkillEditor key={skill.id} skill={skill} categories={data.categories} />
        ))}
      </div>
    </div>
  );
}
