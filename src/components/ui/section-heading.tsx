import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "space-y-4",
        align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-2xl",
        className,
      )}
    >
      {eyebrow ? <Badge variant="secondary">{eyebrow}</Badge> : null}
      <div className="space-y-3">
        <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {title}
        </h2>
        {description ? (
          <p className="text-balance text-base leading-8 text-muted-foreground sm:text-lg">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
