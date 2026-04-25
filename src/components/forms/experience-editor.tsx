"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { format } from "date-fns";

import { deleteExperienceAction, upsertExperienceAction } from "@/actions/portfolio";
import { FormFeedback } from "@/components/forms/form-feedback";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePersistentObjectState } from "@/hooks/use-persistent-object-state";
import type { DashboardData } from "@/features/dashboard/queries";

type ExperienceEditorProps = {
  experience?: NonNullable<DashboardData["profile"]>["experiences"][number];
};

export function ExperienceEditor({ experience }: ExperienceEditorProps) {
  const router = useRouter();
  const t = useTranslations("forms");
  const buttonsT = useTranslations("buttons");
  const commonT = useTranslations("common");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const draft = usePersistentObjectState(`experience:${experience?.id ?? "new"}`, {
    company: experience?.company ?? "",
    role: experience?.role ?? "",
    location: experience?.location ?? "",
    sortOrder: String(experience?.sortOrder ?? 0),
    startDate: experience?.startDate ? format(experience.startDate, "yyyy-MM-dd") : "",
    endDate: experience?.endDate ? format(experience.endDate, "yyyy-MM-dd") : "",
    currentRole: experience?.currentRole ?? false,
    description: experience?.description ?? "",
  });

  return (
    <Card className="rounded-[2rem]">
      <CardContent className="p-6">
        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();

            startTransition(async () => {
              const result = await upsertExperienceAction({
                id: experience?.id,
                company: draft.state.company,
                role: draft.state.role,
                location: draft.state.location,
                startDate: draft.state.startDate,
                endDate: draft.state.endDate,
                currentRole: draft.state.currentRole,
                description: draft.state.description,
                sortOrder: draft.state.sortOrder,
              });

              setMessage(result.message);
              if (result.success) {
                draft.clear();
                toast.success(result.message);
                router.refresh();
              }
            });
          }}
        >
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <Label htmlFor={`company-${experience?.id ?? "new"}`}>{t("company")}</Label>
              <Input
                id={`company-${experience?.id ?? "new"}`}
                name="company"
                value={draft.state.company}
                onChange={(event) => draft.setField("company", event.target.value)}
              />
            </div>
            <div>
              <Label htmlFor={`role-${experience?.id ?? "new"}`}>{t("role")}</Label>
              <Input
                id={`role-${experience?.id ?? "new"}`}
                name="role"
                value={draft.state.role}
                onChange={(event) => draft.setField("role", event.target.value)}
              />
            </div>
            <div>
              <Label htmlFor={`location-${experience?.id ?? "new"}`}>{t("location")}</Label>
              <Input
                id={`location-${experience?.id ?? "new"}`}
                name="location"
                value={draft.state.location}
                onChange={(event) => draft.setField("location", event.target.value)}
              />
            </div>
            <div>
              <Label htmlFor={`sort-${experience?.id ?? "new"}`}>{t("sortOrder")}</Label>
              <Input
                id={`sort-${experience?.id ?? "new"}`}
                type="number"
                name="sortOrder"
                value={draft.state.sortOrder}
                onChange={(event) => draft.setField("sortOrder", event.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <Label htmlFor={`start-${experience?.id ?? "new"}`}>{t("startDate")}</Label>
              <Input
                id={`start-${experience?.id ?? "new"}`}
                type="date"
                name="startDate"
                value={draft.state.startDate}
                onChange={(event) => draft.setField("startDate", event.target.value)}
              />
            </div>
            <div>
              <Label htmlFor={`end-${experience?.id ?? "new"}`}>{t("endDate")}</Label>
              <Input
                id={`end-${experience?.id ?? "new"}`}
                type="date"
                name="endDate"
                value={draft.state.endDate}
                onChange={(event) => draft.setField("endDate", event.target.value)}
              />
            </div>
          </div>

          <label className="flex items-center gap-3 text-sm text-muted-foreground">
            <input
              type="checkbox"
              name="currentRole"
              checked={draft.state.currentRole}
              onChange={(event) => draft.setField("currentRole", event.target.checked)}
              className="h-4 w-4 rounded border-surface-border"
            />
            {t("currentRole")}
          </label>

          <div>
            <Label htmlFor={`desc-${experience?.id ?? "new"}`}>{t("fullDescription")}</Label>
            <Textarea
              id={`desc-${experience?.id ?? "new"}`}
              name="description"
              className="min-h-[140px]"
              value={draft.state.description}
              onChange={(event) => draft.setField("description", event.target.value)}
            />
          </div>

          <FormFeedback message={message} />

          <div className="flex flex-wrap items-center gap-4">
            <p className="text-sm text-muted-foreground">{commonT("draftSavedHint")}</p>
            <Button type="submit" disabled={isPending}>
              {experience ? buttonsT("update") : buttonsT("add")}
            </Button>
            {experience ? (
              <Button
                type="button"
                variant="ghost"
                disabled={isPending}
                onClick={() =>
                  startTransition(async () => {
                    const result = await deleteExperienceAction(experience.id);
                    setMessage(result.message);
                    if (result.success) {
                      draft.clear();
                      toast.success(result.message);
                      router.refresh();
                    }
                  })
                }
              >
                {buttonsT("delete")}
              </Button>
            ) : null}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
