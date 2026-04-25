import { PortfolioStatus, type Profile, type Skill } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

import type { AppLocale } from "@/i18n/routing";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getBaseUrl() {
  return process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
}

export function localizedHref(locale: AppLocale, path: string) {
  return `/${locale}${path}`;
}

export function parseTechnologies(value: string | null | undefined) {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function serializeTechnologies(values: string[]) {
  return values.join(", ");
}

export function formatMonthYear(date: Date | null | undefined) {
  if (!date) {
    return null;
  }

  return format(date, "MMM yyyy");
}

export function normalizeOptionalString(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function optionalUrl(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function computePortfolioCompletion(params: {
  profile: Profile | null;
  skills: Skill[];
  projectsCount: number;
  experienceCount: number;
  educationCount: number;
  certificateCount: number;
  socialLinksCount: number;
  status?: PortfolioStatus | null;
}) {
  const checkpoints = [
    Boolean(params.profile?.fullName),
    Boolean(params.profile?.title),
    Boolean(params.profile?.shortBio),
    Boolean(params.profile?.about),
    Boolean(params.profile?.photoUrl),
    params.skills.length > 0,
    params.projectsCount > 0,
    params.experienceCount > 0,
    params.educationCount + params.certificateCount > 0,
    params.socialLinksCount > 0,
    params.status === PortfolioStatus.PUBLISHED,
  ];

  const completed = checkpoints.filter(Boolean).length;
  return Math.round((completed / checkpoints.length) * 100);
}
