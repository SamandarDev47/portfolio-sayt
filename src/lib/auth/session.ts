import type { UserRole } from "@prisma/client";
import { cookies, headers } from "next/headers";
import { getToken } from "next-auth/jwt";

export type AuthenticatedUser = {
  id: string;
  role: UserRole;
  username: string;
  name: string | null;
  email: string | null;
  image: string | null;
};

export async function getCurrentSession() {
  const user = await getCurrentUser();

  return user ? { user } : null;
}

export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const token = await getToken({
    req: {
      cookies: await cookies(),
      headers: await headers(),
    } as never,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token?.id || !token.username || !token.role) {
    return null;
  }

  return {
    id: token.id as string,
    role: token.role as UserRole,
    username: token.username as string,
    name: typeof token.name === "string" ? token.name : null,
    email: typeof token.email === "string" ? token.email : null,
    image: typeof token.picture === "string" ? token.picture : null,
  };
}
