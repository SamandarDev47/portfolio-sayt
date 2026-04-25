"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { deleteProjectAction, upsertProjectAction } from "@/actions/portfolio";
import { FormFeedback } from "@/components/forms/form-feedback";
import { ImageUploadField } from "@/components/forms/image-upload-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePersistentObjectState } from "@/hooks/use-persistent-object-state";
import type { DashboardData } from "@/features/dashboard/queries";
import { parseTechnologies } from "@/lib/utils";

type ProjectEditorProps = {
  project?: NonNullable<DashboardData["profile"]>["projects"][number];
};

export function ProjectEditor({ project }: ProjectEditorProps) {
  const router = useRouter();
  const t = useTranslations("forms");
  const buttonsT = useTranslations("buttons");
  const commonT = useTranslations("common");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const draft = usePersistentObjectState(`project:${project?.id ?? "new"}`, {
    title: project?.title ?? "",
    shortDescription: project?.shortDescription ?? "",
    fullDescription: project?.fullDescription ?? "",
    technologies: project ? parseTechnologies(project.technologies).join(", ") : "",
    imageUrl: project?.imageUrl ?? "",
    galleryUrls:
      project?.gallery.map((image: { imageUrl: string }) => image.imageUrl).join("\n") ?? "",
    githubUrl: project?.githubUrl ?? "",
    liveUrl: project?.liveUrl ?? "",
    playStoreUrl: project?.playStoreUrl ?? "",
    appStoreUrl: project?.appStoreUrl ?? "",
    featured: project?.featured ?? false,
    sortOrder: String(project?.sortOrder ?? 0),
  });

  return (
    <Card className="rounded-[2rem]">
      <CardContent className="space-y-6 p-6">
        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault();
            setMessage(null);

            startTransition(async () => {
              const result = await upsertProjectAction({
                id: project?.id,
                title: draft.state.title,
                shortDescription: draft.state.shortDescription,
                fullDescription: draft.state.fullDescription,
                technologies: draft.state.technologies,
                imageUrl: draft.state.imageUrl,
                galleryUrls: draft.state.galleryUrls,
                githubUrl: draft.state.githubUrl,
                liveUrl: draft.state.liveUrl,
                playStoreUrl: draft.state.playStoreUrl,
                appStoreUrl: draft.state.appStoreUrl,
                featured: draft.state.featured,
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
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <Label htmlFor={`project-title-${project?.id ?? "new"}`}>{t("name")}</Label>
              <Input
                id={`project-title-${project?.id ?? "new"}`}
                name="title"
                value={draft.state.title}
                onChange={(event) => draft.setField("title", event.target.value)}
              />
            </div>
            <div>
              <Label htmlFor={`project-sort-${project?.id ?? "new"}`}>{t("sortOrder")}</Label>
              <Input
                id={`project-sort-${project?.id ?? "new"}`}
                type="number"
                name="sortOrder"
                value={draft.state.sortOrder}
                onChange={(event) => draft.setField("sortOrder", event.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor={`project-short-${project?.id ?? "new"}`}>{t("shortDescription")}</Label>
            <Textarea
              id={`project-short-${project?.id ?? "new"}`}
              name="shortDescription"
              className="min-h-[110px]"
              value={draft.state.shortDescription}
              onChange={(event) => draft.setField("shortDescription", event.target.value)}
            />
          </div>

          <div>
            <Label htmlFor={`project-full-${project?.id ?? "new"}`}>{t("fullDescription")}</Label>
            <Textarea
              id={`project-full-${project?.id ?? "new"}`}
              name="fullDescription"
              className="min-h-[160px]"
              value={draft.state.fullDescription}
              onChange={(event) => draft.setField("fullDescription", event.target.value)}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <ImageUploadField
              label={t("projectImage")}
              folder="projects"
              value={draft.state.imageUrl}
              onChange={(value) => draft.setField("imageUrl", value)}
              onRemove={() => draft.setField("imageUrl", "")}
              hint={t("projectImageHint")}
            />
            <div className="space-y-3">
              <Label htmlFor={`project-gallery-${project?.id ?? "new"}`}>{t("projectScreenshots")}</Label>
              <Textarea
                id={`project-gallery-${project?.id ?? "new"}`}
                value={draft.state.galleryUrls}
                onChange={(event) => draft.setField("galleryUrls", event.target.value)}
                className="min-h-[240px]"
              />
              <p className="text-sm text-muted-foreground">{t("projectScreenshotsHint")}</p>
            </div>
          </div>

          <div>
            <Label htmlFor={`project-tech-${project?.id ?? "new"}`}>{t("technologies")}</Label>
            <Input
              id={`project-tech-${project?.id ?? "new"}`}
              name="technologies"
              value={draft.state.technologies}
              onChange={(event) => draft.setField("technologies", event.target.value)}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {[
              ["githubUrl", t("github")],
              ["liveUrl", t("liveDemoLabel")],
              ["playStoreUrl", t("playStore")],
              ["appStoreUrl", t("appStore")],
            ].map(([name, label]) => (
              <div key={name}>
                <Label htmlFor={`${name}-${project?.id ?? "new"}`}>{label}</Label>
                <Input
                  id={`${name}-${project?.id ?? "new"}`}
                  name={name}
                  type="url"
                  value={draft.state[name as keyof typeof draft.state] as string}
                  onChange={(event) =>
                    draft.setField(name as keyof typeof draft.state, event.target.value)
                  }
                />
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-3 text-sm text-muted-foreground">
              <input
                type="checkbox"
                name="featured"
                checked={draft.state.featured}
                onChange={(event) => draft.setField("featured", event.target.checked)}
                className="h-4 w-4 rounded border-surface-border"
              />
              {t("featureProject")}
            </label>
          </div>

          <FormFeedback message={message} />

          <div className="flex flex-wrap items-center gap-4">
            <p className="text-sm text-muted-foreground">{commonT("draftSavedHint")}</p>
            <Button type="submit" disabled={isPending}>
              {project ? buttonsT("update") : buttonsT("add")}
            </Button>
            {project ? (
              <Button
                type="button"
                variant="ghost"
                disabled={isPending}
                onClick={() =>
                  startTransition(async () => {
                    const result = await deleteProjectAction(project.id);
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
