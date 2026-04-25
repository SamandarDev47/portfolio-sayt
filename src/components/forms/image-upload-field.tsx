"use client";

import { useId, useState, useTransition } from "react";
import Image from "next/image";
import { LoaderCircle, UploadCloud, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type ImageUploadFieldProps = {
  label: string;
  folder: string;
  value?: string | null;
  onChange: (value: string) => void;
  onRemove?: () => void;
  hint?: string;
};

export function ImageUploadField({
  label,
  folder,
  value,
  onChange,
  onRemove,
  hint,
}: ImageUploadFieldProps) {
  const commonT = useTranslations("common");
  const buttonsT = useTranslations("buttons");
  const inputId = useId();
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const previewUrl = localPreviewUrl ?? value ?? null;

  async function handleUpload(file: File) {
    const localPreview = URL.createObjectURL(file);
    setLocalPreviewUrl(localPreview);

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`/api/uploads?folder=${folder}`, {
      method: "POST",
      body: formData,
    });

    const payload = (await response.json()) as { url?: string; message?: string };

    if (!response.ok || !payload.url) {
      setLocalPreviewUrl(null);
      toast.error(payload.message ?? commonT("uploadFailed"));
      return;
    }

    onChange(payload.url);
    setLocalPreviewUrl(null);
    toast.success(commonT("uploadSuccess"));
  }

  return (
    <div className="space-y-3">
      <Label htmlFor={inputId}>{label}</Label>
      <div className="rounded-[1.75rem] border border-dashed border-surface-border bg-surface p-4">
        {previewUrl ? (
          <div className="space-y-4">
            <div className="relative h-52 w-full overflow-hidden rounded-[1.5rem] border border-surface-border">
              <Image src={previewUrl} alt={label} fill className="object-cover" />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="secondary">
                <label htmlFor={inputId} className="cursor-pointer">
                  <UploadCloud className="size-4" />
                  {buttonsT("replaceImage")}
                </label>
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setLocalPreviewUrl(null);
                  onChange("");
                  onRemove?.();
                }}
              >
                <X className="size-4" />
                {buttonsT("removeImage")}
              </Button>
            </div>
          </div>
        ) : (
          <label
            htmlFor={inputId}
            className="flex min-h-44 cursor-pointer flex-col items-center justify-center gap-3 rounded-[1.5rem] border border-surface-border bg-white/5 text-center"
          >
            {isPending ? (
              <LoaderCircle className="size-6 animate-spin text-primary" />
            ) : (
              <UploadCloud className="size-6 text-primary" />
            )}
            <div className="space-y-1">
              <div className="font-medium">{commonT("chooseImageToUpload")}</div>
              {hint ? <div className="text-sm text-muted-foreground">{hint}</div> : null}
            </div>
          </label>
        )}

        <input
          id={inputId}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) {
              return;
            }

            startTransition(async () => {
              await handleUpload(file);
            });
          }}
        />
      </div>
    </div>
  );
}
