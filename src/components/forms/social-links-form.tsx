"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { upsertSocialLinksAction } from "@/actions/portfolio";
import { FormFeedback } from "@/components/forms/form-feedback";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePersistentObjectState } from "@/hooks/use-persistent-object-state";

type SocialLinksFormProps = {
  defaultValues: {
    telegram?: string | null;
    github?: string | null;
    linkedIn?: string | null;
    website?: string | null;
    instagram?: string | null;
    x?: string | null;
  };
};

export function SocialLinksForm({ defaultValues }: SocialLinksFormProps) {
  const router = useRouter();
  const t = useTranslations("forms");
  const buttonsT = useTranslations("buttons");
  const commonT = useTranslations("common");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const draft = usePersistentObjectState("social-links", {
    telegram: defaultValues.telegram ?? "",
    github: defaultValues.github ?? "",
    linkedIn: defaultValues.linkedIn ?? "",
    website: defaultValues.website ?? "",
    instagram: defaultValues.instagram ?? "",
    x: defaultValues.x ?? "",
  });

  return (
    <Card className="rounded-[2rem]">
      <CardContent className="p-6">
        <form
          className="grid gap-5 md:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();

            startTransition(async () => {
              const result = await upsertSocialLinksAction(draft.state);

              setMessage(result.message);
              if (result.success) {
                draft.clear();
                toast.success(result.message);
                router.refresh();
              }
            });
          }}
        >
          {[
            ["telegram", t("telegram")],
            ["github", t("github")],
            ["linkedIn", t("linkedIn")],
            ["website", t("website")],
            ["instagram", t("instagram")],
            ["x", t("x")],
          ].map(([name, label]) => (
            <div key={name}>
              <Label htmlFor={name}>{label}</Label>
              <Input
                id={name}
                name={name}
                value={draft.state[name as keyof typeof draft.state]}
                onChange={(event) =>
                  draft.setField(name as keyof typeof draft.state, event.target.value)
                }
              />
            </div>
          ))}
          <div className="space-y-4 md:col-span-2">
            <FormFeedback message={message} />
            <div className="flex flex-wrap items-center gap-4">
              <p className="text-sm text-muted-foreground">{commonT("draftSavedHint")}</p>
              <Button type="submit" disabled={isPending}>
                {buttonsT("save")}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
