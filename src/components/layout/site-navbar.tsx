import { getTranslations } from "next-intl/server";

import { SiteNavbarClient } from "@/components/layout/site-navbar-client";
import { getCurrentUser } from "@/lib/auth/session";

type SiteNavbarProps = {
  locale: string;
};

export async function SiteNavbar({ locale }: SiteNavbarProps) {
  const [commonT, navT, user] = await Promise.all([
    getTranslations({ locale, namespace: "common" }),
    getTranslations({ locale, namespace: "nav" }),
    getCurrentUser(),
  ]);

  return (
    <SiteNavbarClient
      isAuthenticated={Boolean(user)}
      navItems={[
        { href: "/features", label: navT("features") },
        { href: "/how-it-works", label: navT("howItWorks") },
        { href: "/developers", label: navT("forDevelopers") },
        { href: "/companies", label: navT("forCompanies") },
        { href: "/discover", label: commonT("discover") },
        { href: "/pricing", label: navT("pricing") },
        { href: "/contact", label: navT("contact") },
        { href: "/faq", label: navT("faq") },
      ]}
      labels={{
        brand: commonT("brand"),
        productTagline: commonT("productTagline"),
        createPortfolio: commonT("createPortfolio"),
        signIn: commonT("signIn"),
        dashboard: commonT("dashboard"),
        openMenu: commonT("openMenu"),
        closeMenu: commonT("closeMenu"),
      }}
    />
  );
}
