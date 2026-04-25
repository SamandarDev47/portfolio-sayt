"use server";

import { createHash, randomBytes } from "crypto";

import { prisma } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email/reset-password";
import {
  forgotPasswordSchema,
  registerSchema,
  resetPasswordSchema,
} from "@/lib/validators/auth";
import { errorResponse, successResponse, zodFieldErrors } from "@/lib/action-helpers";
import { hashPassword } from "@/lib/auth/password";
import { getBaseUrl, localizedHref } from "@/lib/utils";
import type { AppLocale } from "@/i18n/routing";

export async function registerAction(input: unknown) {
  const parsed = registerSchema.safeParse(input);

  if (!parsed.success) {
    return errorResponse("Please check the highlighted fields.", zodFieldErrors(parsed.error));
  }

  const email = parsed.data.email.toLowerCase();
  const username = parsed.data.username.toLowerCase();

  const [emailExists, usernameExists] = await Promise.all([
    prisma.user.findUnique({ where: { email } }),
    prisma.user.findUnique({ where: { username } }),
  ]);

  if (emailExists) {
    return errorResponse("An account with this email already exists.", {
      email: ["An account with this email already exists."],
    });
  }

  if (usernameExists) {
    return errorResponse("This username is already taken.", {
      username: ["This username is already taken."],
    });
  }

  const passwordHash = await hashPassword(parsed.data.password);

  await prisma.user.create({
    data: {
      name: parsed.data.fullName,
      username,
      email,
      locale: parsed.data.locale,
      passwordHash,
      profile: {
        create: {
          fullName: parsed.data.fullName,
          email,
          portfolioSettings: {
            create: {},
          },
          contactSettings: {
            create: {
              preferredLocale: parsed.data.locale,
            },
          },
        },
      },
    },
  });

  return successResponse("Account created successfully.");
}

export async function requestPasswordResetAction(input: unknown, locale: AppLocale) {
  const parsed = forgotPasswordSchema.safeParse(input);

  if (!parsed.success) {
    return errorResponse("Please enter a valid email address.", zodFieldErrors(parsed.error));
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });

  if (!user) {
    return successResponse("If the account exists, a reset link has been generated.");
  }

  await prisma.passwordResetToken.deleteMany({
    where: { userId: user.id },
  });

  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(rawToken).digest("hex");

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    },
  });

  const resetPath = localizedHref(locale, `/reset-password?token=${rawToken}`);
  const resetUrl = `${getBaseUrl()}${resetPath}`;

  await sendPasswordResetEmail({
    email: user.email,
    resetUrl,
  });

  return successResponse("Password reset instructions have been generated.", {
    resetUrl:
      process.env.NODE_ENV === "development" ? resetUrl : undefined,
  });
}

export async function resetPasswordAction(input: unknown) {
  const parsed = resetPasswordSchema.safeParse(input);

  if (!parsed.success) {
    return errorResponse("Please correct the form errors.", zodFieldErrors(parsed.error));
  }

  const tokenHash = createHash("sha256")
    .update(parsed.data.token)
    .digest("hex");

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!resetToken || resetToken.expiresAt < new Date()) {
    return errorResponse("This password reset link is invalid or has expired.");
  }

  const passwordHash = await hashPassword(parsed.data.password);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.delete({
      where: { tokenHash },
    }),
  ]);

  return successResponse("Password updated successfully.");
}
