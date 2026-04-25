import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/routing";
import { siteContact } from "@/lib/site-config";

export async function SiteFooter() {
  const [commonT, navT] = await Promise.all([
    getTranslations("common"),
    getTranslations("nav"),
  ]);

  return (
    <footer className="px-3 pb-8 pt-6 sm:px-4 sm:pb-10">
      <div className="page-container">
        <div className="glass-card rounded-[2rem] px-6 py-8 sm:px-8">
          <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
            <div className="space-y-3">
              <div className="font-semibold tracking-[0.18em] text-foreground/90">
                {commonT("brand")}
              </div>
              <p className="max-w-xl text-sm leading-7 text-muted-foreground">
                {commonT("footerDescription")}
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <a href={`tel:${siteContact.phone}`} className="hover:text-foreground">
                  {siteContact.phone}
                </a>
                <a href={`mailto:${siteContact.email}`} className="hover:text-foreground">
                  {siteContact.email}
                </a>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <Link href="/features" className="hover:text-foreground">
                {navT("features")}
              </Link>
              <Link href="/how-it-works" className="hover:text-foreground">
                {navT("howItWorks")}
              </Link>
              <Link href="/pricing" className="hover:text-foreground">
                {navT("pricing")}
              </Link>
              <Link href="/discover" className="hover:text-foreground">
                {commonT("discover")}
              </Link>
              <Link href="/contact" className="hover:text-foreground">
                {navT("contact")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
