"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  deleteCertificateAction,
  deleteEducationAction,
  upsertCertificateAction,
  upsertEducationAction,
} from "@/actions/portfolio";
import { FormFeedback } from "@/components/forms/form-feedback";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePersistentObjectState } from "@/hooks/use-persistent-object-state";
import type { DashboardData } from "@/features/dashboard/queries";

type EducationEditorProps = {
  education?: NonNullable<DashboardData["profile"]>["educations"][number];
};

type CertificateEditorProps = {
  certificate?: NonNullable<DashboardData["profile"]>["certificates"][number];
};

export function EducationEditor({ education }: EducationEditorProps) {
  const router = useRouter();
  const t = useTranslations("forms");
  const buttonsT = useTranslations("buttons");
  const commonT = useTranslations("common");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const draft = usePersistentObjectState(`education:${education?.id ?? "new"}`, {
    institution: education?.institution ?? "",
    title: education?.title ?? "",
    yearLabel: education?.yearLabel ?? "",
    description: education?.description ?? "",
    sortOrder: String(education?.sortOrder ?? 0),
  });

  return (
    <Card className="rounded-[2rem]">
      <CardContent className="p-6">
        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();

            startTransition(async () => {
              const result = await upsertEducationAction({
                id: education?.id,
                institution: draft.state.institution,
                title: draft.state.title,
                yearLabel: draft.state.yearLabel,
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
              <Label htmlFor={`institution-${education?.id ?? "new"}`}>{t("institution")}</Label>
              <Input
                id={`institution-${education?.id ?? "new"}`}
                name="institution"
                value={draft.state.institution}
                onChange={(event) => draft.setField("institution", event.target.value)}
              />
            </div>
            <div>
              <Label htmlFor={`education-title-${education?.id ?? "new"}`}>{t("title")}</Label>
              <Input
                id={`education-title-${education?.id ?? "new"}`}
                name="title"
                value={draft.state.title}
                onChange={(event) => draft.setField("title", event.target.value)}
              />
            </div>
            <div>
              <Label htmlFor={`education-year-${education?.id ?? "new"}`}>{t("year")}</Label>
              <Input
                id={`education-year-${education?.id ?? "new"}`}
                name="yearLabel"
                value={draft.state.yearLabel}
                onChange={(event) => draft.setField("yearLabel", event.target.value)}
              />
            </div>
            <div>
              <Label htmlFor={`education-sort-${education?.id ?? "new"}`}>{t("sortOrder")}</Label>
              <Input
                id={`education-sort-${education?.id ?? "new"}`}
                type="number"
                name="sortOrder"
                value={draft.state.sortOrder}
                onChange={(event) => draft.setField("sortOrder", event.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor={`education-desc-${education?.id ?? "new"}`}>{t("shortDescription")}</Label>
            <Textarea
              id={`education-desc-${education?.id ?? "new"}`}
              name="description"
              className="min-h-[120px]"
              value={draft.state.description}
              onChange={(event) => draft.setField("description", event.target.value)}
            />
          </div>

          <FormFeedback message={message} />
          <div className="flex flex-wrap items-center gap-4">
            <p className="text-sm text-muted-foreground">{commonT("draftSavedHint")}</p>
            <Button type="submit" disabled={isPending}>
              {education ? buttonsT("update") : buttonsT("add")}
            </Button>
            {education ? (
              <Button
                type="button"
                variant="ghost"
                disabled={isPending}
                onClick={() =>
                  startTransition(async () => {
                    const result = await deleteEducationAction(education.id);
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

export function CertificateEditor({ certificate }: CertificateEditorProps) {
  const router = useRouter();
  const t = useTranslations("forms");
  const buttonsT = useTranslations("buttons");
  const commonT = useTranslations("common");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const draft = usePersistentObjectState(`certificate:${certificate?.id ?? "new"}`, {
    title: certificate?.title ?? "",
    issuer: certificate?.issuer ?? "",
    yearLabel: certificate?.yearLabel ?? "",
    description: certificate?.description ?? "",
    credentialUrl: certificate?.credentialUrl ?? "",
    sortOrder: String(certificate?.sortOrder ?? 0),
  });

  return (
    <Card className="rounded-[2rem]">
      <CardContent className="p-6">
        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();

            startTransition(async () => {
              const result = await upsertCertificateAction({
                id: certificate?.id,
                title: draft.state.title,
                issuer: draft.state.issuer,
                yearLabel: draft.state.yearLabel,
                description: draft.state.description,
                credentialUrl: draft.state.credentialUrl,
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
              <Label htmlFor={`certificate-title-${certificate?.id ?? "new"}`}>{t("title")}</Label>
              <Input
                id={`certificate-title-${certificate?.id ?? "new"}`}
                name="title"
                value={draft.state.title}
                onChange={(event) => draft.setField("title", event.target.value)}
              />
            </div>
            <div>
              <Label htmlFor={`certificate-issuer-${certificate?.id ?? "new"}`}>{t("issuer")}</Label>
              <Input
                id={`certificate-issuer-${certificate?.id ?? "new"}`}
                name="issuer"
                value={draft.state.issuer}
                onChange={(event) => draft.setField("issuer", event.target.value)}
              />
            </div>
            <div>
              <Label htmlFor={`certificate-year-${certificate?.id ?? "new"}`}>{t("year")}</Label>
              <Input
                id={`certificate-year-${certificate?.id ?? "new"}`}
                name="yearLabel"
                value={draft.state.yearLabel}
                onChange={(event) => draft.setField("yearLabel", event.target.value)}
              />
            </div>
            <div>
              <Label htmlFor={`certificate-sort-${certificate?.id ?? "new"}`}>{t("sortOrder")}</Label>
              <Input
                id={`certificate-sort-${certificate?.id ?? "new"}`}
                type="number"
                name="sortOrder"
                value={draft.state.sortOrder}
                onChange={(event) => draft.setField("sortOrder", event.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <Label htmlFor={`credential-url-${certificate?.id ?? "new"}`}>{t("credentialUrl")}</Label>
              <Input
                id={`credential-url-${certificate?.id ?? "new"}`}
                name="credentialUrl"
                value={draft.state.credentialUrl}
                onChange={(event) => draft.setField("credentialUrl", event.target.value)}
              />
            </div>
            <div>
              <Label htmlFor={`certificate-desc-${certificate?.id ?? "new"}`}>{t("shortDescription")}</Label>
              <Textarea
                id={`certificate-desc-${certificate?.id ?? "new"}`}
                name="description"
                className="min-h-[120px]"
                value={draft.state.description}
                onChange={(event) => draft.setField("description", event.target.value)}
              />
            </div>
          </div>

          <FormFeedback message={message} />
          <div className="flex flex-wrap items-center gap-4">
            <p className="text-sm text-muted-foreground">{commonT("draftSavedHint")}</p>
            <Button type="submit" disabled={isPending}>
              {certificate ? buttonsT("update") : buttonsT("add")}
            </Button>
            {certificate ? (
              <Button
                type="button"
                variant="ghost"
                disabled={isPending}
                onClick={() =>
                  startTransition(async () => {
                    const result = await deleteCertificateAction(certificate.id);
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
