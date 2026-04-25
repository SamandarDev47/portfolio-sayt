import { PortfolioStatus, SocialPlatform } from "@prisma/client";
import { z } from "zod";

const optionalUrl = z
  .union([z.url("Please enter a valid URL."), z.literal("")])
  .optional()
  .transform((value) => value ?? "");

export const profileSchema = z.object({
  fullName: z.string().min(2).max(80),
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only."),
  title: z.string().min(2).max(120),
  shortBio: z.string().min(20).max(220),
  about: z.string().min(40).max(2000),
  location: z.string().max(120).optional().or(z.literal("")),
  mainStack: z.string().min(2).max(120),
  email: z.email(),
  phone: z.string().max(40).optional().or(z.literal("")),
  telegram: optionalUrl,
  github: optionalUrl,
  linkedIn: optionalUrl,
  website: optionalUrl,
  photoUrl: optionalUrl,
  availability: z.string().max(140).optional().or(z.literal("")),
});

export const skillSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2).max(60),
  categoryId: z.string().optional().or(z.literal("")),
  proficiency: z.string().max(40).optional().or(z.literal("")),
  yearsOfExperience: z.coerce.number().int().min(0).max(50).optional(),
  isCore: z.boolean().default(false),
  sortOrder: z.coerce.number().int().min(0).max(1000).default(0),
});

export const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2).max(120),
  shortDescription: z.string().min(10).max(220),
  fullDescription: z.string().max(2000).optional().or(z.literal("")),
  technologies: z.string().min(2).max(400),
  imageUrl: optionalUrl,
  galleryUrls: z.string().max(3000).optional().or(z.literal("")),
  githubUrl: optionalUrl,
  liveUrl: optionalUrl,
  playStoreUrl: optionalUrl,
  appStoreUrl: optionalUrl,
  featured: z.boolean().default(false),
  sortOrder: z.coerce.number().int().min(0).max(1000).default(0),
});

export const experienceSchema = z.object({
  id: z.string().optional(),
  company: z.string().min(2).max(120),
  role: z.string().min(2).max(120),
  location: z.string().max(120).optional().or(z.literal("")),
  startDate: z.string().min(1),
  endDate: z.string().optional().or(z.literal("")),
  currentRole: z.boolean().default(false),
  description: z.string().min(10).max(1000),
  sortOrder: z.coerce.number().int().min(0).max(1000).default(0),
});

export const educationSchema = z.object({
  id: z.string().optional(),
  institution: z.string().min(2).max(120),
  title: z.string().min(2).max(120),
  yearLabel: z.string().max(40).optional().or(z.literal("")),
  description: z.string().max(500).optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().min(0).max(1000).default(0),
});

export const certificateSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2).max(120),
  issuer: z.string().min(2).max(120),
  yearLabel: z.string().max(40).optional().or(z.literal("")),
  description: z.string().max(500).optional().or(z.literal("")),
  credentialUrl: optionalUrl,
  sortOrder: z.coerce.number().int().min(0).max(1000).default(0),
});

export const socialLinksSchema = z.object({
  telegram: optionalUrl,
  github: optionalUrl,
  linkedIn: optionalUrl,
  website: optionalUrl,
  instagram: optionalUrl,
  x: optionalUrl,
});

export const publishSettingsSchema = z.object({
  status: z.nativeEnum(PortfolioStatus),
  theme: z.string().min(2).max(40),
  accent: z.string().min(2).max(40),
  seoTitle: z.string().max(120).optional().or(z.literal("")),
  seoDescription: z.string().max(240).optional().or(z.literal("")),
  showDiscover: z.boolean().default(true),
  showContactForm: z.boolean().default(true),
  spotlightText: z.string().max(120).optional().or(z.literal("")),
  publicEmail: z.boolean().default(true),
  publicPhone: z.boolean().default(false),
  publicTelegram: z.boolean().default(true),
  allowContactForm: z.boolean().default(true),
  preferredLocale: z.enum(["en", "uz", "ru"]),
  responseTime: z.string().max(120).optional().or(z.literal("")),
});

export const socialPlatformMap = {
  telegram: SocialPlatform.TELEGRAM,
  github: SocialPlatform.GITHUB,
  linkedIn: SocialPlatform.LINKEDIN,
  website: SocialPlatform.WEBSITE,
  instagram: SocialPlatform.INSTAGRAM,
  x: SocialPlatform.X,
} as const;

export type ProfileInput = z.infer<typeof profileSchema>;
export type SkillInput = z.infer<typeof skillSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type ExperienceInput = z.infer<typeof experienceSchema>;
export type EducationInput = z.infer<typeof educationSchema>;
export type CertificateInput = z.infer<typeof certificateSchema>;
export type SocialLinksInput = z.infer<typeof socialLinksSchema>;
export type PublishSettingsInput = z.infer<typeof publishSettingsSchema>;
