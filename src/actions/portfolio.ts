"use server";

import { PortfolioStatus, SocialPlatform } from "@prisma/client";

import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { revalidatePlatformPaths } from "@/lib/revalidate";
import { serializeTechnologies, slugify } from "@/lib/utils";
import {
  certificateSchema,
  educationSchema,
  experienceSchema,
  profileSchema,
  projectSchema,
  publishSettingsSchema,
  skillSchema,
  socialLinksSchema,
  socialPlatformMap,
} from "@/lib/validators/portfolio";
import { errorResponse, successResponse, zodFieldErrors } from "@/lib/action-helpers";

async function getOwnerContext() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
    include: {
      portfolioSettings: true,
      contactSettings: true,
    },
  });

  if (!profile) {
    return null;
  }

  return { user, profile };
}

export async function updateProfileAction(input: unknown) {
  const owner = await getOwnerContext();

  if (!owner) {
    return errorResponse("You need to be signed in to update your profile.");
  }

  const parsed = profileSchema.safeParse(input);

  if (!parsed.success) {
    return errorResponse("Please check the form for missing details.", zodFieldErrors(parsed.error));
  }

  const email = parsed.data.email.toLowerCase();
  const username = parsed.data.username.toLowerCase();

  const [emailExists, usernameExists] = await Promise.all([
    prisma.user.findFirst({
      where: {
        email,
        NOT: { id: owner.user.id },
      },
    }),
    prisma.user.findFirst({
      where: {
        username,
        NOT: { id: owner.user.id },
      },
    }),
  ]);

  if (emailExists) {
    return errorResponse("This email is already in use by another account.", {
      email: ["This email is already in use by another account."],
    });
  }

  if (usernameExists) {
    return errorResponse("This username is already taken.", {
      username: ["This username is already taken."],
    });
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: owner.user.id },
      data: {
        name: parsed.data.fullName,
        username,
        email,
        image: parsed.data.photoUrl || null,
      },
    }),
    prisma.profile.update({
      where: { userId: owner.user.id },
      data: {
        fullName: parsed.data.fullName,
        title: parsed.data.title,
        shortBio: parsed.data.shortBio,
        about: parsed.data.about,
        location: parsed.data.location || null,
        mainStack: parsed.data.mainStack,
        email,
        phone: parsed.data.phone || null,
        telegram: parsed.data.telegram || null,
        github: parsed.data.github || null,
        linkedIn: parsed.data.linkedIn || null,
        website: parsed.data.website || null,
        photoUrl: parsed.data.photoUrl || null,
        availability: parsed.data.availability || null,
      },
    }),
  ]);

  revalidatePlatformPaths(username);
  return successResponse("Profile updated successfully.");
}

export async function upsertSkillAction(input: unknown) {
  const owner = await getOwnerContext();
  if (!owner) {
    return errorResponse("You need to be signed in to manage skills.");
  }

  const parsed = skillSchema.safeParse(input);
  if (!parsed.success) {
    return errorResponse("Please correct the skill details.", zodFieldErrors(parsed.error));
  }

  const data = {
    name: parsed.data.name,
    categoryId: parsed.data.categoryId || null,
    proficiency: parsed.data.proficiency || null,
    yearsOfExperience: parsed.data.yearsOfExperience ?? null,
    isCore: parsed.data.isCore,
    sortOrder: parsed.data.sortOrder,
  };

  if (parsed.data.id) {
    await prisma.skill.updateMany({
      where: {
        id: parsed.data.id,
        profileId: owner.profile.id,
      },
      data,
    });
  } else {
    await prisma.skill.create({
      data: {
        profileId: owner.profile.id,
        ...data,
      },
    });
  }

  revalidatePlatformPaths(owner.user.username);
  return successResponse("Skill saved successfully.");
}

export async function deleteSkillAction(id: string) {
  const owner = await getOwnerContext();
  if (!owner) {
    return errorResponse("You need to be signed in to manage skills.");
  }

  await prisma.skill.deleteMany({
    where: {
      id,
      profileId: owner.profile.id,
    },
  });

  revalidatePlatformPaths(owner.user.username);
  return successResponse("Skill removed.");
}

export async function upsertProjectAction(input: unknown) {
  const owner = await getOwnerContext();
  if (!owner) {
    return errorResponse("You need to be signed in to manage projects.");
  }

  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) {
    return errorResponse("Please correct the project details.", zodFieldErrors(parsed.error));
  }

  const technologies = parsed.data.technologies
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const data = {
    title: parsed.data.title,
    slug: slugify(parsed.data.title),
    shortDescription: parsed.data.shortDescription,
    fullDescription: parsed.data.fullDescription || null,
    technologies: serializeTechnologies(technologies),
    imageUrl: parsed.data.imageUrl || null,
    githubUrl: parsed.data.githubUrl || null,
    liveUrl: parsed.data.liveUrl || null,
    playStoreUrl: parsed.data.playStoreUrl || null,
    appStoreUrl: parsed.data.appStoreUrl || null,
    featured: parsed.data.featured,
    sortOrder: parsed.data.sortOrder,
  };

  const galleryUrls = [
    parsed.data.imageUrl,
    ...((parsed.data.galleryUrls ?? "")
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean) as string[]),
  ].filter(Boolean);

  if (parsed.data.id) {
    await prisma.$transaction([
      prisma.project.updateMany({
        where: {
          id: parsed.data.id,
          profileId: owner.profile.id,
        },
        data,
      }),
      prisma.projectImage.deleteMany({
        where: { projectId: parsed.data.id },
      }),
      ...galleryUrls.map((imageUrl, index) =>
        prisma.projectImage.create({
          data: {
            projectId: parsed.data.id!,
            imageUrl,
            altText: `${parsed.data.title} screenshot ${index + 1}`,
            sortOrder: index,
          },
        }),
      ),
    ]);
  } else {
    const project = await prisma.project.create({
      data: {
        profileId: owner.profile.id,
        ...data,
      },
    });

    if (galleryUrls.length > 0) {
      await prisma.projectImage.createMany({
        data: galleryUrls.map((imageUrl, index) => ({
          projectId: project.id,
          imageUrl,
          altText: `${parsed.data.title} screenshot ${index + 1}`,
          sortOrder: index,
        })),
      });
    }
  }

  revalidatePlatformPaths(owner.user.username);
  return successResponse("Project saved successfully.");
}

export async function deleteProjectAction(id: string) {
  const owner = await getOwnerContext();
  if (!owner) {
    return errorResponse("You need to be signed in to manage projects.");
  }

  await prisma.project.deleteMany({
    where: {
      id,
      profileId: owner.profile.id,
    },
  });

  revalidatePlatformPaths(owner.user.username);
  return successResponse("Project removed.");
}

export async function upsertExperienceAction(input: unknown) {
  const owner = await getOwnerContext();
  if (!owner) {
    return errorResponse("You need to be signed in to manage experience.");
  }

  const parsed = experienceSchema.safeParse(input);
  if (!parsed.success) {
    return errorResponse("Please correct the experience details.", zodFieldErrors(parsed.error));
  }

  const data = {
    company: parsed.data.company,
    role: parsed.data.role,
    location: parsed.data.location || null,
    startDate: new Date(parsed.data.startDate),
    endDate: parsed.data.currentRole || !parsed.data.endDate ? null : new Date(parsed.data.endDate),
    currentRole: parsed.data.currentRole,
    description: parsed.data.description,
    sortOrder: parsed.data.sortOrder,
  };

  if (parsed.data.id) {
    await prisma.experience.updateMany({
      where: {
        id: parsed.data.id,
        profileId: owner.profile.id,
      },
      data,
    });
  } else {
    await prisma.experience.create({
      data: {
        profileId: owner.profile.id,
        ...data,
      },
    });
  }

  revalidatePlatformPaths(owner.user.username);
  return successResponse("Experience saved successfully.");
}

export async function deleteExperienceAction(id: string) {
  const owner = await getOwnerContext();
  if (!owner) {
    return errorResponse("You need to be signed in to manage experience.");
  }

  await prisma.experience.deleteMany({
    where: {
      id,
      profileId: owner.profile.id,
    },
  });

  revalidatePlatformPaths(owner.user.username);
  return successResponse("Experience removed.");
}

export async function upsertEducationAction(input: unknown) {
  const owner = await getOwnerContext();
  if (!owner) {
    return errorResponse("You need to be signed in to manage education.");
  }

  const parsed = educationSchema.safeParse(input);
  if (!parsed.success) {
    return errorResponse("Please correct the education details.", zodFieldErrors(parsed.error));
  }

  const data = {
    institution: parsed.data.institution,
    title: parsed.data.title,
    yearLabel: parsed.data.yearLabel || null,
    description: parsed.data.description || null,
    sortOrder: parsed.data.sortOrder,
  };

  if (parsed.data.id) {
    await prisma.education.updateMany({
      where: {
        id: parsed.data.id,
        profileId: owner.profile.id,
      },
      data,
    });
  } else {
    await prisma.education.create({
      data: {
        profileId: owner.profile.id,
        ...data,
      },
    });
  }

  revalidatePlatformPaths(owner.user.username);
  return successResponse("Education item saved successfully.");
}

export async function deleteEducationAction(id: string) {
  const owner = await getOwnerContext();
  if (!owner) {
    return errorResponse("You need to be signed in to manage education.");
  }

  await prisma.education.deleteMany({
    where: {
      id,
      profileId: owner.profile.id,
    },
  });

  revalidatePlatformPaths(owner.user.username);
  return successResponse("Education item removed.");
}

export async function upsertCertificateAction(input: unknown) {
  const owner = await getOwnerContext();
  if (!owner) {
    return errorResponse("You need to be signed in to manage certificates.");
  }

  const parsed = certificateSchema.safeParse(input);
  if (!parsed.success) {
    return errorResponse("Please correct the certificate details.", zodFieldErrors(parsed.error));
  }

  const data = {
    title: parsed.data.title,
    issuer: parsed.data.issuer,
    yearLabel: parsed.data.yearLabel || null,
    description: parsed.data.description || null,
    credentialUrl: parsed.data.credentialUrl || null,
    sortOrder: parsed.data.sortOrder,
  };

  if (parsed.data.id) {
    await prisma.certificate.updateMany({
      where: {
        id: parsed.data.id,
        profileId: owner.profile.id,
      },
      data,
    });
  } else {
    await prisma.certificate.create({
      data: {
        profileId: owner.profile.id,
        ...data,
      },
    });
  }

  revalidatePlatformPaths(owner.user.username);
  return successResponse("Certificate saved successfully.");
}

export async function deleteCertificateAction(id: string) {
  const owner = await getOwnerContext();
  if (!owner) {
    return errorResponse("You need to be signed in to manage certificates.");
  }

  await prisma.certificate.deleteMany({
    where: {
      id,
      profileId: owner.profile.id,
    },
  });

  revalidatePlatformPaths(owner.user.username);
  return successResponse("Certificate removed.");
}

export async function upsertSocialLinksAction(input: unknown) {
  const owner = await getOwnerContext();
  if (!owner) {
    return errorResponse("You need to be signed in to manage social links.");
  }

  const parsed = socialLinksSchema.safeParse(input);
  if (!parsed.success) {
    return errorResponse("Please correct the social link details.", zodFieldErrors(parsed.error));
  }

  const entries = Object.entries(parsed.data).filter(([, value]) => Boolean(value));

  await prisma.$transaction([
    prisma.socialLink.deleteMany({
      where: {
        profileId: owner.profile.id,
        platform: {
          in: Object.values(socialPlatformMap) as SocialPlatform[],
        },
      },
    }),
    prisma.profile.update({
      where: { id: owner.profile.id },
      data: {
        telegram: parsed.data.telegram || null,
        github: parsed.data.github || null,
        linkedIn: parsed.data.linkedIn || null,
        website: parsed.data.website || null,
      },
    }),
    ...entries.map(([key, value], index) =>
      prisma.socialLink.create({
        data: {
          profileId: owner.profile.id,
          platform: socialPlatformMap[key as keyof typeof socialPlatformMap],
          label: key,
          url: value as string,
          sortOrder: index,
        },
      }),
    ),
  ]);

  revalidatePlatformPaths(owner.user.username);
  return successResponse("Social links updated.");
}

export async function updatePublishSettingsAction(input: unknown) {
  const owner = await getOwnerContext();
  if (!owner) {
    return errorResponse("You need to be signed in to manage publish settings.");
  }

  const parsed = publishSettingsSchema.safeParse(input);
  if (!parsed.success) {
    return errorResponse("Please correct the publish settings.", zodFieldErrors(parsed.error));
  }

  await prisma.$transaction([
    prisma.portfolioSettings.upsert({
      where: { profileId: owner.profile.id },
      update: {
        status: parsed.data.status,
        theme: parsed.data.theme,
        accent: parsed.data.accent,
        seoTitle: parsed.data.seoTitle || null,
        seoDescription: parsed.data.seoDescription || null,
        showDiscover: parsed.data.showDiscover,
        showContactForm: parsed.data.showContactForm,
        spotlightText: parsed.data.spotlightText || null,
      },
      create: {
        profileId: owner.profile.id,
        status: parsed.data.status,
        theme: parsed.data.theme,
        accent: parsed.data.accent,
        seoTitle: parsed.data.seoTitle || null,
        seoDescription: parsed.data.seoDescription || null,
        showDiscover: parsed.data.showDiscover,
        showContactForm: parsed.data.showContactForm,
        spotlightText: parsed.data.spotlightText || null,
      },
    }),
    prisma.contactSettings.upsert({
      where: { profileId: owner.profile.id },
      update: {
        publicEmail: parsed.data.publicEmail,
        publicPhone: parsed.data.publicPhone,
        publicTelegram: parsed.data.publicTelegram,
        allowContactForm: parsed.data.allowContactForm,
        preferredLocale: parsed.data.preferredLocale,
        responseTime: parsed.data.responseTime || null,
      },
      create: {
        profileId: owner.profile.id,
        publicEmail: parsed.data.publicEmail,
        publicPhone: parsed.data.publicPhone,
        publicTelegram: parsed.data.publicTelegram,
        allowContactForm: parsed.data.allowContactForm,
        preferredLocale: parsed.data.preferredLocale,
        responseTime: parsed.data.responseTime || null,
      },
    }),
  ]);

  revalidatePlatformPaths(owner.user.username);

  const nextStateMessage =
    parsed.data.status === PortfolioStatus.PUBLISHED
      ? "Portfolio published successfully."
      : parsed.data.status === PortfolioStatus.UNPUBLISHED
        ? "Portfolio has been unpublished."
        : "Draft settings saved.";

  return successResponse(nextStateMessage);
}
