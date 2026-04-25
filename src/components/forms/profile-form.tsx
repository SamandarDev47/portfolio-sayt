"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { updateProfileAction } from "@/actions/portfolio";
import { FormFeedback } from "@/components/forms/form-feedback";
import { ImageUploadField } from "@/components/forms/image-upload-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePersistentObjectState } from "@/hooks/use-persistent-object-state";
import { profileSchema, type ProfileInput } from "@/lib/validators/portfolio";

type ProfileFormProps = {
  defaultValues: ProfileInput;
};

const profileFields: Array<{
  name: keyof ProfileInput;
  type: React.HTMLInputTypeAttribute;
}> = [
  { name: "location", type: "text" },
  { name: "mainStack", type: "text" },
  { name: "availability", type: "text" },
  { name: "email", type: "email" },
  { name: "phone", type: "text" },
  { name: "telegram", type: "url" },
  { name: "github", type: "url" },
  { name: "linkedIn", type: "url" },
  { name: "website", type: "url" },
];

export function ProfileForm({ defaultValues }: ProfileFormProps) {
  const router = useRouter();
  const formsT = useTranslations("forms");
  const buttonsT = useTranslations("buttons");
  const commonT = useTranslations("common");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const hasRestoredDraftRef = useRef(false);
  const {
    state: draftState,
    isReady: isDraftReady,
    setState: setDraftState,
    clear: clearDraft,
  } = usePersistentObjectState(
    `profile:${defaultValues.username}`,
    defaultValues,
  );

  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema) as never,
    defaultValues,
  });
  const watchedValues = useWatch({
    control: form.control,
  });

  useEffect(() => {
    if (!isDraftReady || hasRestoredDraftRef.current) {
      return;
    }

    form.reset(draftState);
    hasRestoredDraftRef.current = true;
  }, [draftState, form, isDraftReady]);

  useEffect(() => {
    if (!isDraftReady || !hasRestoredDraftRef.current) {
      return;
    }

    setDraftState({
      ...defaultValues,
      ...watchedValues,
    } as ProfileInput);
  }, [defaultValues, isDraftReady, setDraftState, watchedValues]);

  const onSubmit = form.handleSubmit((values) => {
    setMessage(null);
    startTransition(async () => {
      const result = await updateProfileAction(values);
      setMessage(result.message);

      if (!result.success) {
        for (const [field, errors] of Object.entries(result.fieldErrors ?? {})) {
          form.setError(field as keyof ProfileInput, {
            message: errors?.[0] ?? commonT("invalidValue"),
          });
        }
        return;
      }

      clearDraft();
      toast.success(result.message);
      router.refresh();
    });
  });

  return (
    <Card className="rounded-[2rem]">
      <CardContent className="p-6">
        <form className="space-y-6" onSubmit={onSubmit}>
          <div className="grid gap-6 lg:grid-cols-[0.75fr,1fr]">
            <Controller
              control={form.control}
              name="photoUrl"
              render={({ field }) => (
                <ImageUploadField
                  label={formsT("photo")}
                  folder="profiles"
                  value={field.value}
                  onChange={field.onChange}
                  onRemove={() => field.onChange("")}
                  hint={formsT("profileImageHint")}
                />
              )}
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="fullName">{formsT("fullName")}</Label>
                <Input id="fullName" {...form.register("fullName")} />
                <p className="mt-2 text-sm text-rose-300">
                  {form.formState.errors.fullName?.message}
                </p>
              </div>
              <div>
                <Label htmlFor="username">{formsT("username")}</Label>
                <Input id="username" {...form.register("username")} />
                <p className="mt-2 text-sm text-rose-300">
                  {form.formState.errors.username?.message}
                </p>
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="title">{formsT("title")}</Label>
                <Input id="title" {...form.register("title")} />
                <p className="mt-2 text-sm text-rose-300">
                  {form.formState.errors.title?.message}
                </p>
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="shortBio">{formsT("shortBio")}</Label>
                <Textarea id="shortBio" {...form.register("shortBio")} className="min-h-[110px]" />
                <p className="mt-2 text-sm text-rose-300">
                  {form.formState.errors.shortBio?.message}
                </p>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="about">{formsT("about")}</Label>
            <Textarea id="about" {...form.register("about")} className="min-h-[180px]" />
            <p className="mt-2 text-sm text-rose-300">{form.formState.errors.about?.message}</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {profileFields.map(({ name, type }) => (
              <div key={name}>
                <Label htmlFor={name}>{formsT(name as never)}</Label>
                <Input
                  id={name}
                  type={type}
                  {...form.register(name)}
                />
                <p className="mt-2 text-sm text-rose-300">
                  {form.formState.errors[name]?.message as string | undefined}
                </p>
              </div>
            ))}
          </div>

          <FormFeedback
            message={message}
            tone={message?.toLowerCase().includes("success") ? "success" : "default"}
          />

          <div className="flex flex-wrap items-center gap-4">
            <p className="text-sm text-muted-foreground">{commonT("draftSavedHint")}</p>
            <Button type="submit" size="lg" disabled={isPending}>
              {buttonsT("save")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
