type PasswordResetEmailInput = {
  email: string;
  resetUrl: string;
};

export async function sendPasswordResetEmail({
  email,
  resetUrl,
}: PasswordResetEmailInput) {
  console.info(`[auth] Password reset requested for ${email}: ${resetUrl}`);
}
