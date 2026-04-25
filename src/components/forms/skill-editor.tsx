"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { deleteSkillAction, upsertSkillAction } from "@/actions/portfolio";
import { FormFeedback } from "@/components/forms/form-feedback";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePersistentObjectState } from "@/hooks/use-persistent-object-state";
import type { DashboardData } from "@/features/dashboard/queries";

type SkillEditorProps = {
  skill?: NonNullable<DashboardData["profile"]>["skills"][number];
  categories: DashboardData["categories"];
};

export function SkillEditor({ skill, categories }: SkillEditorProps) {
  const router = useRouter();
  const t = useTranslations("forms");
  const buttonsT = useTranslations("buttons");
  const commonT = useTranslations("common");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const draft = usePersistentObjectState(`skill:${skill?.id ?? "new"}`, {
    name: skill?.name ?? "",
    categoryId: skill?.categoryId ?? "",
    proficiency: skill?.proficiency ?? "",
    yearsOfExperience: String(skill?.yearsOfExperience ?? ""),
    isCore: skill?.isCore ?? false,
    sortOrder: String(skill?.sortOrder ?? 0),
  });

  return (
    <Card className="rounded-[2rem]">
      <CardContent className="p-6">
        <form
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-5"
          onSubmit={(event) => {
            event.preventDefault();
            setMessage(null);

            startTransition(async () => {
              const result = await upsertSkillAction({
                id: skill?.id,
                name: draft.state.name,
                categoryId: draft.state.categoryId,
                proficiency: draft.state.proficiency,
                yearsOfExperience: draft.state.yearsOfExperience,
                isCore: draft.state.isCore,
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
          <div>
            <Label htmlFor={`skill-name-${skill?.id ?? "new"}`}>{t("name")}</Label>
            <Input
              id={`skill-name-${skill?.id ?? "new"}`}
              name="name"
              value={draft.state.name}
              onChange={(event) => draft.setField("name", event.target.value)}
            />
          </div>
          <div>
            <Label htmlFor={`skill-category-${skill?.id ?? "new"}`}>{t("category")}</Label>
            <select
              id={`skill-category-${skill?.id ?? "new"}`}
              name="categoryId"
              value={draft.state.categoryId}
              onChange={(event) => draft.setField("categoryId", event.target.value)}
              className="h-12 w-full rounded-2xl border border-surface-border bg-surface px-4 text-sm text-foreground outline-none"
            >
              <option value="">{t("uncategorized")}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor={`skill-level-${skill?.id ?? "new"}`}>{t("proficiency")}</Label>
            <Input
              id={`skill-level-${skill?.id ?? "new"}`}
              name="proficiency"
              value={draft.state.proficiency}
              onChange={(event) => draft.setField("proficiency", event.target.value)}
            />
          </div>
          <div>
            <Label htmlFor={`skill-years-${skill?.id ?? "new"}`}>{t("yearsExperience")}</Label>
            <Input
              id={`skill-years-${skill?.id ?? "new"}`}
              name="yearsOfExperience"
              type="number"
              value={draft.state.yearsOfExperience}
              onChange={(event) => draft.setField("yearsOfExperience", event.target.value)}
            />
          </div>
          <div>
            <Label htmlFor={`skill-order-${skill?.id ?? "new"}`}>{t("sortOrder")}</Label>
            <Input
              id={`skill-order-${skill?.id ?? "new"}`}
              name="sortOrder"
              type="number"
              value={draft.state.sortOrder}
              onChange={(event) => draft.setField("sortOrder", event.target.value)}
            />
          </div>
          <label className="flex items-center gap-3 text-sm text-muted-foreground">
            <input
              type="checkbox"
              name="isCore"
              checked={draft.state.isCore}
              onChange={(event) => draft.setField("isCore", event.target.checked)}
              className="h-4 w-4 rounded border-surface-border"
            />
            {t("markAsCore")}
          </label>
          <div className="md:col-span-2 xl:col-span-4 space-y-3">
            <FormFeedback message={message} />
            <p className="text-sm text-muted-foreground">{commonT("draftSavedHint")}</p>
          </div>
          <div className="flex gap-3">
            <Button type="submit" disabled={isPending}>
              {skill ? buttonsT("update") : buttonsT("add")}
            </Button>
            {skill ? (
              <Button
                type="button"
                variant="ghost"
                disabled={isPending}
                onClick={() =>
                  startTransition(async () => {
                    const result = await deleteSkillAction(skill.id);
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
