import { Badge } from "@/components/ui/badge";

type DashboardPageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
};

export function DashboardPageHeader({
  eyebrow,
  title,
  description,
}: DashboardPageHeaderProps) {
  return (
    <div className="space-y-4">
      {eyebrow ? <Badge variant="secondary">{eyebrow}</Badge> : null}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        <p className="max-w-3xl text-base leading-8 text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
