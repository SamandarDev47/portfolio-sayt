"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Languages } from "lucide-react";

import { Button } from "@/components/ui/button";
import { routing, usePathname, useRouter } from "@/i18n/routing";

export function LanguageSwitcher() {
  const t = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-1 rounded-full border border-surface-border bg-surface p-1">
      <div className="hidden items-center gap-2 px-3 text-xs text-muted-foreground lg:flex">
        <Languages className="size-3.5" />
        <span>{t("language")}</span>
      </div>
      {routing.locales.map((item) => (
        <Button
          key={item}
          type="button"
          variant={locale === item ? "primary" : "ghost"}
          size="sm"
          className="min-w-11 uppercase"
          disabled={isPending}
          onClick={() =>
            startTransition(() => {
              const queryString = searchParams.toString();
              const targetPath = queryString ? `${pathname}?${queryString}` : pathname;
              router.replace(targetPath as never, { locale: item });
            })
          }
        >
          {item}
        </Button>
      ))}
    </div>
  );
}
