import { getTranslations } from "next-intl/server";

import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { ProjectEditor } from "@/components/forms/project-editor";
import { getDashboardData } from "@/features/dashboard/queries";
import { getCurrentUser } from "@/lib/auth/session";

export default async function DashboardProjectsPage({
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
        eyebrow={t("projects")}
        title={t("projects")}
        description={t("projectsDescription")}
      />
      <ProjectEditor />
      <div className="space-y-4">
        {data.profile.projects.map((project) => (
          <ProjectEditor key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
