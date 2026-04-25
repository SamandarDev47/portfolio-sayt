"use server";

import { getCurrentUser } from "@/lib/auth/session";
import { verifyPassword, hashPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/db";
import { changePasswordSchema } from "@/lib/validators/auth";
import { errorResponse, successResponse, zodFieldErrors } from "@/lib/action-helpers";

export async function changePasswordAction(input: unknown) {
  const user = await getCurrentUser();

  if (!user) {
    return errorResponse("You need to be signed in to change your password.");
  }

  const parsed = changePasswordSchema.safeParse(input);

  if (!parsed.success) {
    return errorResponse("Please correct the form errors.", zodFieldErrors(parsed.error));
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!dbUser?.passwordHash) {
    return errorResponse(
      "This account uses social login only. Add a password later if you enable credentials access.",
    );
  }

  const matches = await verifyPassword(
    parsed.data.currentPassword,
    dbUser.passwordHash,
  );

  if (!matches) {
    return errorResponse("Your current password is incorrect.", {
      currentPassword: ["Your current password is incorrect."],
    });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: await hashPassword(parsed.data.newPassword),
    },
  });

  return successResponse("Password updated successfully.");
}

export async function deleteAccountAction(input: { confirmation: string }) {
  const user = await getCurrentUser();

  if (!user) {
    return errorResponse("You need to be signed in to delete your account.");
  }

  if (input.confirmation !== "DELETE") {
    return errorResponse("Type DELETE to confirm account deletion.", {
      confirmation: ["Type DELETE to confirm account deletion."],
    });
  }

  await prisma.user.delete({
    where: { id: user.id },
  });

  return successResponse("Your account has been removed.");
}
