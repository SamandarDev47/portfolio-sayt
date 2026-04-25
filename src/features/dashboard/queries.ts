import { unstable_noStore as noStore } from "next/cache";

import { prisma } from "@/lib/db";
import { computePortfolioCompletion } from "@/lib/utils";

export async function getDashboardData(userId: string) {
  noStore();

  const [user, categories] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: {
          include: {
            skills: {
              include: { category: true },
              orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
            },
            projects: {
              include: {
                gallery: {
                  orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
                },
              },
              orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
            },
            experiences: {
              orderBy: [{ sortOrder: "asc" }, { startDate: "desc" }],
            },
            educations: {
              orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
            },
            certificates: {
              orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
            },
            socialLinks: {
              orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
            },
            portfolioSettings: true,
            contactSettings: true,
          },
        },
      },
    }),
    prisma.skillCategory.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    }),
  ]);

  if (!user) {
    return null;
  }

  const completion = computePortfolioCompletion({
    profile: user.profile,
    skills: user.profile?.skills ?? [],
    projectsCount: user.profile?.projects.length ?? 0,
    experienceCount: user.profile?.experiences.length ?? 0,
    educationCount: user.profile?.educations.length ?? 0,
    certificateCount: user.profile?.certificates.length ?? 0,
    socialLinksCount: user.profile?.socialLinks.length ?? 0,
    status: user.profile?.portfolioSettings?.status ?? null,
  });

  return {
    user,
    profile: user.profile,
    categories,
    completion,
  };
}

export type DashboardData = NonNullable<Awaited<ReturnType<typeof getDashboardData>>>;
