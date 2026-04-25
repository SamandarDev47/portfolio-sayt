import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { getCurrentUser } from "@/lib/auth/session";
import { localizedHref } from "@/lib/utils";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const user = await getCurrentUser();
  const t = await getTranslations({ locale, namespace: "dashboard" });

  if (!user) {
    redirect(
      localizedHref(
        locale as never,
        `/sign-in?callbackUrl=${encodeURIComponent(localizedHref(locale as never, "/dashboard"))}`,
      ),
    );
  }

  return (
    <div className="page-container grid gap-6 py-10 xl:grid-cols-[290px,1fr]">
      <DashboardSidebar locale={locale} username={user.username} />
      <div className="space-y-6">
        <div className="glass-card rounded-[2rem] px-6 py-5 text-sm text-muted-foreground">
          {t("title")}
        </div>
        {children}
      </div>
    </div>
  );
}
