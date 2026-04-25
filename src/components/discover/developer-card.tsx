import Image from "next/image";

import { getDiscoverDevelopers } from "@/features/discover/queries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/routing";

type DeveloperCardProps = {
  developer: Awaited<ReturnType<typeof getDiscoverDevelopers>>["developers"][number];
  ctaLabel: string;
};

export function DeveloperCard({ developer, ctaLabel }: DeveloperCardProps) {
  return (
    <Card className="h-full rounded-[2rem]">
      <CardContent className="flex h-full flex-col gap-6 p-6">
        <div className="flex items-start gap-4">
          <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-surface-border">
            <Image
              src={
                developer.photoUrl ??
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80"
              }
              alt={developer.fullName ?? developer.user.username}
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">
              {developer.fullName ?? developer.user.username}
            </h3>
            <p className="text-sm text-muted-foreground">{developer.title}</p>
            <p className="text-xs text-muted-foreground">
              {developer.location}
              {developer.mainStack ? ` · ${developer.mainStack}` : ""}
            </p>
          </div>
        </div>

        <p className="flex-1 text-sm leading-7 text-muted-foreground">
          {developer.shortBio}
        </p>

        <div className="flex flex-wrap gap-2">
          {developer.skills.slice(0, 4).map((skill) => (
            <Badge key={skill.id} variant="outline">
              {skill.name}
            </Badge>
          ))}
        </div>

        <Button asChild variant="secondary">
          <Link href={`/u/${developer.user.username}`}>{ctaLabel}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
