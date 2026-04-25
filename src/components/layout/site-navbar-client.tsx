"use client";

import { useState } from "react";
import { Menu, Sparkles, X } from "lucide-react";

import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type SiteNavbarClientProps = {
  isAuthenticated: boolean;
  navItems: Array<{ href: string; label: string }>;
  labels: {
    brand: string;
    productTagline: string;
    createPortfolio: string;
    signIn: string;
    dashboard: string;
    openMenu: string;
    closeMenu: string;
  };
};

export function SiteNavbarClient({
  isAuthenticated,
  navItems,
  labels,
}: SiteNavbarClientProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="page-container">
        <div className="glass-card rounded-[2rem] border border-white/8 px-4 py-3 shadow-[0_20px_80px_-44px_rgba(2,8,23,0.85)] sm:px-5">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex min-w-0 items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.35rem] bg-[linear-gradient(145deg,rgba(94,234,212,1),rgba(125,211,252,1))] text-sm font-black tracking-[0.16em] text-slate-950 shadow-[0_16px_40px_-20px_rgba(94,234,212,0.9)]">
                DF
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold tracking-[0.18em] text-foreground/90">
                  {labels.brand}
                </div>
                <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
                  <Sparkles className="size-3.5 text-primary" />
                  <span className="truncate">{labels.productTagline}</span>
                </div>
              </div>
            </Link>

            <nav className="hidden items-center gap-2 rounded-full border border-white/6 bg-white/4 p-1.5 lg:flex">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "rounded-full px-4 py-2.5 text-sm font-medium transition",
                      isActive
                        ? "bg-white/10 text-foreground"
                        : "text-muted-foreground hover:bg-white/6 hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden items-center gap-2 lg:flex">
              <LanguageSwitcher />
              <ThemeToggle />
              {isAuthenticated ? (
                <Button asChild variant="secondary">
                  <Link href="/dashboard">{labels.dashboard}</Link>
                </Button>
              ) : (
                <Button asChild variant="ghost">
                  <Link href="/sign-in">{labels.signIn}</Link>
                </Button>
              )}
              <Button asChild>
                <Link href={isAuthenticated ? "/dashboard" : "/sign-up"}>
                  {labels.createPortfolio}
                </Link>
              </Button>
            </div>

            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="lg:hidden"
              aria-label={isOpen ? labels.closeMenu : labels.openMenu}
              onClick={() => setIsOpen((current) => !current)}
            >
              {isOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </Button>
          </div>

          {isOpen ? (
            <div className="mt-4 space-y-4 border-t border-white/8 pt-4 lg:hidden">
              <div className="grid gap-2">
                {navItems.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(item.href));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "rounded-[1.25rem] px-4 py-3 text-sm font-medium transition",
                        isActive
                          ? "bg-white/10 text-foreground"
                          : "text-muted-foreground hover:bg-white/6 hover:text-foreground",
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>

              <div className="grid gap-2">
                {isAuthenticated ? (
                  <Button asChild variant="secondary" className="w-full">
                    <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                      {labels.dashboard}
                    </Link>
                  </Button>
                ) : (
                  <Button asChild variant="ghost" className="w-full">
                    <Link href="/sign-in" onClick={() => setIsOpen(false)}>
                      {labels.signIn}
                    </Link>
                  </Button>
                )}
                <Button asChild className="w-full">
                  <Link
                    href={isAuthenticated ? "/dashboard" : "/sign-up"}
                    onClick={() => setIsOpen(false)}
                  >
                    {labels.createPortfolio}
                  </Link>
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
