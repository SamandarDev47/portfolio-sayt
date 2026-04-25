"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

import { changePasswordAction, deleteAccountAction } from "@/actions/account";
import { FormFeedback } from "@/components/forms/form-feedback";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { localizedHref } from "@/lib/utils";

export function AccountSettingsForm({ locale }: { locale: string }) {
  const formsT = useTranslations("forms");
  const buttonsT = useTranslations("buttons");
  const accountT = useTranslations("account");
  const [message, setMessage] = useState<string | null>(null);
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card className="rounded-[2rem]">
        <CardContent className="space-y-5 p-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">{accountT("passwordTitle")}</h2>
            <p className="text-sm text-muted-foreground">
              {accountT("passwordDescription")}
            </p>
          </div>
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);

              startTransition(async () => {
                const result = await changePasswordAction({
                  currentPassword: formData.get("currentPassword"),
                  newPassword: formData.get("newPassword"),
                  confirmPassword: formData.get("confirmPassword"),
                });

                setMessage(result.message);
                if (result.success) {
                  toast.success(result.message);
                }
              });
            }}
          >
            <div>
              <Label htmlFor="currentPassword">{formsT("currentPassword")}</Label>
              <Input id="currentPassword" name="currentPassword" type="password" />
            </div>
            <div>
              <Label htmlFor="newPassword">{formsT("password")}</Label>
              <Input id="newPassword" name="newPassword" type="password" />
            </div>
            <div>
              <Label htmlFor="confirmPassword">{formsT("confirmPassword")}</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" />
            </div>
            <FormFeedback message={message} />
            <Button type="submit" disabled={isPending}>
              {buttonsT("save")}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="rounded-[2rem] border-rose-500/20">
        <CardContent className="space-y-5 p-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">{accountT("deleteTitle")}</h2>
            <p className="text-sm text-muted-foreground">
              {accountT("deleteDescription")}
            </p>
          </div>
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);

              startTransition(async () => {
                const result = await deleteAccountAction({
                  confirmation: String(formData.get("confirmation") ?? ""),
                });

                setDeleteMessage(result.message);
                if (result.success) {
                  toast.success(result.message);
                  await signOut({
                    callbackUrl: localizedHref(locale as never, "/"),
                  });
                }
              });
            }}
          >
            <div>
              <Label htmlFor="confirmation">{accountT("deleteConfirmLabel")}</Label>
              <Input id="confirmation" name="confirmation" />
            </div>
            <FormFeedback message={deleteMessage} tone="error" />
            <Button type="submit" variant="danger" disabled={isPending}>
              {accountT("deleteButton")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
