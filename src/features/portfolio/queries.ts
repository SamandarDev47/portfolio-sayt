import { PortfolioStatus, Prisma } from "@prisma/client";
import { unstable_noStore as noStore } from "next/cache";

import { prisma } from "@/lib/db";

const portfolioInclude = Prisma.validator<Prisma.UserInclude>()({
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
        orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
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
});

export type PortfolioRecord = Prisma.UserGetPayload<{
  include: typeof portfolioInclude;
}>;

export async function getFeaturedPortfolio() {
  noStore();

  return prisma.user.findFirst({
    where: {
      profile: {
        is: {
          isFeatured: true,
          portfolioSettings: {
            is: {
              status: PortfolioStatus.PUBLISHED,
            },
          },
        },
      },
    },
    include: portfolioInclude,
  });
}

export async function getPublicPortfolioByUsername(username: string) {
  noStore();

  const user = await prisma.user.findUnique({
    where: { username },
    include: portfolioInclude,
  });

  if (
    !user?.profile?.portfolioSettings ||
    user.profile.portfolioSettings.status !== PortfolioStatus.PUBLISHED
  ) {
    return null;
  }

  return user;
}

export async function getPreviewPortfolioByUserId(userId: string) {
  noStore();

  return prisma.user.findUnique({
    where: { id: userId },
    include: portfolioInclude,
  });
}
