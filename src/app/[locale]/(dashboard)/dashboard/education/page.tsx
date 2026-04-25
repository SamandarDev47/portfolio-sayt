import { getTranslations } from "next-intl/server";

import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { CertificateEditor, EducationEditor } from "@/components/forms/education-editor";
import { Card, CardContent } from "@/components/ui/card";
import { getDashboardData } from "@/features/dashboard/queries";
import { getCurrentUser } from "@/lib/auth/session";

export default async function DashboardEducationPage({
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
        eyebrow={t("education")}
        title={t("education")}
        description={t("educationDescription")}
      />

      <div className="space-y-4">
        <Card className="rounded-[2rem]">
          <CardContent className="p-6 text-sm text-muted-foreground">
            Education history
          </CardContent>
        </Card>
        <EducationEditor />
        {data.profile.educations.map((education) => (
          <EducationEditor key={education.id} education={education} />
        ))}
      </div>

      <div className="space-y-4">
        <Card className="rounded-[2rem]">
          <CardContent className="p-6 text-sm text-muted-foreground">
            Certificates and credentials
          </CardContent>
        </Card>
        <CertificateEditor />
        {data.profile.certificates.map((certificate) => (
          <CertificateEditor key={certificate.id} certificate={certificate} />
        ))}
      </div>
    </div>
  );
}
