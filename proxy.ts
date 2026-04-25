import createMiddleware from "next-intl/middleware";
import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);
const dashboardRoutePattern = new RegExp(
  `^/(${routing.locales.join("|")})/dashboard(?:/.*)?$`,
);

export default async function proxy(request: NextRequest) {
  if (dashboardRoutePattern.test(request.nextUrl.pathname)) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      const locale = request.nextUrl.pathname.split("/")[1] ?? routing.defaultLocale;
      const signInUrl = new URL(`/${locale}/sign-in`, request.url);
      signInUrl.searchParams.set(
        "callbackUrl",
        `${request.nextUrl.pathname}${request.nextUrl.search}`,
      );

      return NextResponse.redirect(signInUrl);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
