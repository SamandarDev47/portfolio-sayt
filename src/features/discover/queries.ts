import { PortfolioStatus } from "@prisma/client";
import { unstable_noStore as noStore } from "next/cache";

import { prisma } from "@/lib/db";

export type DiscoverFilters = {
  q?: string;
  role?: string;
  skill?: string;
  stack?: string;
};

const publishedWhere = {
  portfolioSettings: {
    is: {
      status: PortfolioStatus.PUBLISHED,
      showDiscover: true,
    },
  },
} as const;

export async function getDiscoverDevelopers(filters: DiscoverFilters) {
  noStore();

  const where = {
    ...publishedWhere,
    ...(filters.q
      ? {
          OR: [
            { fullName: { contains: filters.q } },
            { title: { contains: filters.q } },
            {
              user: {
                username: { contains: filters.q },
              },
            },
          ],
        }
      : {}),
    ...(filters.role
      ? {
          title: { contains: filters.role },
        }
      : {}),
    ...(filters.stack
      ? {
          mainStack: { contains: filters.stack },
        }
      : {}),
    ...(filters.skill
      ? {
          skills: {
            some: {
              name: { equals: filters.skill },
            },
          },
        }
      : {}),
  };

  const [developers, stacks, skills] = await Promise.all([
    prisma.profile.findMany({
      where,
      include: {
        user: true,
        portfolioSettings: true,
        skills: {
          where: { isCore: true },
          orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
          take: 6,
        },
      },
      orderBy: [{ isFeatured: "desc" }, { updatedAt: "desc" }],
    }),
    prisma.profile.findMany({
      where: publishedWhere,
      distinct: ["mainStack"],
      select: { mainStack: true },
      orderBy: { mainStack: "asc" },
    }),
    prisma.skill.findMany({
      where: {
        profile: publishedWhere,
      },
      distinct: ["name"],
      select: { name: true },
      orderBy: { name: "asc" },
      take: 20,
    }),
  ]);

  return {
    developers,
    filters: {
      stacks: stacks.map((item) => item.mainStack).filter(Boolean) as string[],
      skills: skills.map((item) => item.name),
    },
  };
}
