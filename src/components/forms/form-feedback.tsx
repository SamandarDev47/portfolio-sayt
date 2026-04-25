import { cn } from "@/lib/utils";

type FormFeedbackProps = {
  message?: string | null;
  tone?: "default" | "error" | "success";
  className?: string;
};

export function FormFeedback({
  message,
  tone = "default",
  className,
}: FormFeedbackProps) {
  if (!message) {
    return null;
  }

  return (
    <div
      className={cn(
        "rounded-2xl border px-4 py-3 text-sm",
        tone === "error" &&
          "border-rose-500/30 bg-rose-500/10 text-rose-200 dark:text-rose-200",
        tone === "success" &&
          "border-primary/30 bg-primary/10 text-primary dark:text-primary",
        tone === "default" &&
          "border-surface-border bg-surface text-muted-foreground",
        className,
      )}
    >
      {message}
    </div>
  );
}
