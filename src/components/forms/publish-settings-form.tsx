"use client";

import { PortfolioStatus } from "@prisma/client";
import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { updatePublishSettingsAction } from "@/actions/portfolio";
import { FormFeedback } from "@/components/forms/form-feedback";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePersistentObjectState } from "@/hooks/use-persistent-object-state";
import type { DashboardData } from "@/features/dashboard/queries";

type PublishSettingsFormProps = {
  profile: DashboardData["profile"];
  appearanceOnly?: boolean;
};

export function PublishSettingsForm({
  profile,
  appearanceOnly = false,
}: PublishSettingsFormProps) {
  const router = useRouter();
  const t = useTranslations("forms");
  const buttonsT = useTranslations("buttons");
  const commonT = useTranslations("common");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const draft = usePersistentObjectState(
    appearanceOnly ? "appearance-settings" : "publish-settings",
    {
      theme: profile?.portfolioSettings?.theme ?? "nocturne",
      accent: profile?.portfolioSettings?.accent ?? "cyan",
      status: profile?.portfolioSettings?.status ?? PortfolioStatus.DRAFT,
      seoTitle: profile?.portfolioSettings?.seoTitle ?? "",
      seoDescription: profile?.portfolioSettings?.seoDescription ?? "",
      spotlightText: profile?.portfolioSettings?.spotlightText ?? "",
      showDiscover: profile?.portfolioSettings?.showDiscover ?? true,
      showContactForm: profile?.portfolioSettings?.showContactForm ?? true,
      publicEmail: profile?.contactSettings?.publicEmail ?? true,
      publicPhone: profile?.contactSettings?.publicPhone ?? false,
      publicTelegram: profile?.contactSettings?.publicTelegram ?? true,
      allowContactForm: profile?.contactSettings?.allowContactForm ?? true,
      preferredLocale: profile?.contactSettings?.preferredLocale ?? "en",
      responseTime: profile?.contactSettings?.responseTime ?? "",
    },
  );

  function submit() {
    startTransition(async () => {
      const result = await updatePublishSettingsAction(draft.state);

      setMessage(result.message);
      if (result.success) {
        draft.clear();
        toast.success(result.message);
        router.refresh();
      }
    });
  }

  return (
    <Card className="rounded-[2rem]">
      <CardContent className="space-y-6 p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <Label htmlFor="theme">{t("theme")}</Label>
            <select
              id="theme"
              value={draft.state.theme}
              onChange={(event) => draft.setField("theme", event.target.value)}
              className="h-12 w-full rounded-2xl border border-surface-border bg-surface px-4 text-sm text-foreground outline-none"
            >
              <option value="nocturne">{t("themeNocturne")}</option>
              <option value="aurora">{t("themeAurora")}</option>
              <option value="editorial">{t("themeEditorial")}</option>
            </select>
          </div>
          <div>
            <Label htmlFor="accent">{t("accent")}</Label>
            <select
              id="accent"
              value={draft.state.accent}
              onChange={(event) => draft.setField("accent", event.target.value)}
              className="h-12 w-full rounded-2xl border border-surface-border bg-surface px-4 text-sm text-foreground outline-none"
            >
              <option value="cyan">{t("accentCyan")}</option>
              <option value="amber">{t("accentAmber")}</option>
              <option value="sky">{t("accentSky")}</option>
            </select>
          </div>
        </div>

        {!appearanceOnly ? (
          <>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <Label htmlFor="status">{t("status")}</Label>
                <select
                  id="status"
                  value={draft.state.status}
                  onChange={(event) => draft.setField("status", event.target.value as PortfolioStatus)}
                  className="h-12 w-full rounded-2xl border border-surface-border bg-surface px-4 text-sm text-foreground outline-none"
                >
                  <option value={PortfolioStatus.DRAFT}>{t("statusDraft")}</option>
                  <option value={PortfolioStatus.PUBLISHED}>{t("statusPublished")}</option>
                  <option value={PortfolioStatus.UNPUBLISHED}>{t("statusUnpublished")}</option>
                </select>
              </div>
              <div>
                <Label htmlFor="preferredLocale">{t("preferredLocale")}</Label>
                <select
                  id="preferredLocale"
                  value={draft.state.preferredLocale}
                  onChange={(event) => draft.setField("preferredLocale", event.target.value)}
                  className="h-12 w-full rounded-2xl border border-surface-border bg-surface px-4 text-sm text-foreground outline-none"
                >
                  <option value="en">{commonT("english")}</option>
                  <option value="uz">{commonT("uzbek")}</option>
                  <option value="ru">{commonT("russian")}</option>
                </select>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <Label htmlFor="seoTitle">{t("seoTitle")}</Label>
                <Input
                  id="seoTitle"
                  value={draft.state.seoTitle}
                  onChange={(event) => draft.setField("seoTitle", event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="responseTime">{t("responseTime")}</Label>
                <Input
                  id="responseTime"
                  value={draft.state.responseTime}
                  onChange={(event) => draft.setField("responseTime", event.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="seoDescription">{t("seoDescription")}</Label>
              <Textarea
                id="seoDescription"
                value={draft.state.seoDescription}
                onChange={(event) => draft.setField("seoDescription", event.target.value)}
                className="min-h-[120px]"
              />
            </div>
          </>
        ) : null}

        <div>
          <Label htmlFor="spotlightText">{t("spotlightText")}</Label>
          <Input
            id="spotlightText"
            value={draft.state.spotlightText}
            onChange={(event) => draft.setField("spotlightText", event.target.value)}
          />
        </div>

        {!appearanceOnly ? (
          <div className="grid gap-3 rounded-[1.75rem] border border-surface-border p-5">
            {[
              { label: t("showInDiscover"), checked: draft.state.showDiscover, key: "showDiscover" as const },
              { label: t("showContactSection"), checked: draft.state.showContactForm, key: "showContactForm" as const },
              { label: t("publicEmail"), checked: draft.state.publicEmail, key: "publicEmail" as const },
              { label: t("publicPhone"), checked: draft.state.publicPhone, key: "publicPhone" as const },
              { label: t("publicTelegram"), checked: draft.state.publicTelegram, key: "publicTelegram" as const },
              { label: t("allowContactSubmission"), checked: draft.state.allowContactForm, key: "allowContactForm" as const },
            ].map((item) => (
              <label key={item.label} className="flex items-center gap-3 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={(event) => draft.setField(item.key, event.target.checked)}
                  className="h-4 w-4 rounded border-surface-border"
                />
                {item.label}
              </label>
            ))}
          </div>
        ) : null}

        <FormFeedback message={message} />

        <div className="flex flex-wrap items-center gap-4">
          <p className="text-sm text-muted-foreground">{commonT("draftSavedHint")}</p>
          <Button type="button" disabled={isPending} onClick={submit}>
            {appearanceOnly ? buttonsT("save") : buttonsT("publishPortfolio")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
