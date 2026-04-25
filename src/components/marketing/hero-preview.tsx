"use client";

import { motion } from "framer-motion";
import { BarChart3, BriefcaseBusiness, Languages, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function HeroPreview() {
  const t = useTranslations("marketingPreview");

  const orbitCards = [
    {
      icon: Sparkles,
      title: t("builderTitle"),
      subtitle: t("builderSubtitle"),
    },
    {
      icon: Languages,
      title: t("languagesTitle"),
      subtitle: t("languagesSubtitle"),
    },
    {
      icon: BriefcaseBusiness,
      title: t("recruiterTitle"),
      subtitle: t("recruiterSubtitle"),
    },
    {
      icon: BarChart3,
      title: t("discoverTitle"),
      subtitle: t("discoverSubtitle"),
    },
  ];

  return (
    <div className="relative mx-auto w-full max-w-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="glass-card relative overflow-hidden rounded-[2rem] p-6"
      >
        <div className="noise-overlay absolute inset-0 opacity-70" />
        <div className="relative space-y-6">
          <div className="flex items-center justify-between">
            <Badge>{t("badge")}</Badge>
            <div className="rounded-full border border-surface-border px-3 py-1 font-mono text-xs text-muted-foreground">
              /u/samandar-xasanov
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-[1.5fr,1fr]">
              <Card className="rounded-[1.75rem]">
                <CardContent className="space-y-5 p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-secondary" />
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold">Samandar Xasanov</h3>
                      <p className="text-sm text-muted-foreground">{t("demoRole")}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-left">
                    {[
                      [t("statProjects"), "12"],
                      [t("statExperience"), "4y"],
                      [t("statStatus"), t("statStatusValue")],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-2xl border border-surface-border bg-white/5 p-3"
                      >
                        <div className="text-xs text-muted-foreground">{label}</div>
                        <div className="mt-2 text-lg font-semibold">{value}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[1.75rem]">
                <CardContent className="space-y-4 p-6">
                  <div className="text-sm text-muted-foreground">{t("quickFilters")}</div>
                  {["Flutter", "Dart", "Firebase"].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-surface-border bg-white/5 px-4 py-3 text-sm"
                    >
                      {item}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {orbitCards.map((card, index) => {
                const Icon = card.icon;

                return (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.15 + index * 0.08 }}
                  >
                    <Card className="rounded-[1.5rem]">
                      <CardContent className="flex items-start gap-4 p-5">
                        <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                          <Icon className="size-5" />
                        </div>
                        <div className="space-y-1">
                          <div className="font-semibold">{card.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {card.subtitle}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
