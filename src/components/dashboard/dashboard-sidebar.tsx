"use client";

import { useTransition } from "react";
import {
  BrushCleaning,
  Eye,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Settings,
  Share2,
  Sparkles,
  UserRound,
  Wrench,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Link, usePathname } from "@/i18n/routing";
import { cn, localizedHref } from "@/lib/utils";

type DashboardSidebarProps = {
  locale: string;
  username: string;
};

const navIconMap = {
  overview: LayoutDashboard,
  profile: UserRound,
  skills: Wrench,
  projects: FolderKanban,
  experience: Sparkles,
  education: GraduationCap,
  socialLinks: Share2,
  appearance: BrushCleaning,
  preview: Eye,
  publish: Share2,
  account: Settings,
} as const;

export function DashboardSidebar({ locale, username }: DashboardSidebarProps) {
  const t = useTranslations("dashboard");
  const commonT = useTranslations("common");
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const items = [
    { key: "overview", href: "/dashboard" },
    { key: "profile", href: "/dashboard/profile" },
    { key: "skills", href: "/dashboard/skills" },
    { key: "projects", href: "/dashboard/projects" },
    { key: "experience", href: "/dashboard/experience" },
    { key: "education", href: "/dashboard/education" },
    { key: "socialLinks", href: "/dashboard/social-links" },
    { key: "appearance", href: "/dashboard/appearance" },
    { key: "preview", href: "/dashboard/preview" },
    { key: "publish", href: "/dashboard/publish" },
    { key: "account", href: "/dashboard/account" },
  ] as const;

  return (
    <aside className="glass-card h-fit rounded-[2rem] p-5">
      <div className="space-y-2 border-b border-surface-border pb-5">
        <div className="text-sm text-muted-foreground">{t("title")}</div>
        <div className="font-semibold">@{username}</div>
      </div>

      <nav className="mt-5 space-y-2">
        {items.map((item) => {
          const Icon = navIconMap[item.key];
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm",
                isActive
                  ? "bg-primary text-slate-950"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              {t(item.key)}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 space-y-3 border-t border-surface-border pt-5">
        <Button asChild variant="secondary" className="w-full justify-start">
          <Link href={`/u/${username}`}>{commonT("discover")}</Link>
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="w-full justify-start"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              await signOut({
                callbackUrl: localizedHref(locale as never, "/"),
              });
            })
          }
        >
          <LogOut className="size-4" />
          {commonT("signOut")}
        </Button>
      </div>
    </aside>
  );
}
