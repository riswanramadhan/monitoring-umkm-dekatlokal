"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { WebsiteLogo } from "@/components/monitoring/website-avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  formatCompactNumber,
  formatPercent,
  formatSignedPercent,
} from "@/lib/monitoring/formatters";
import { cn } from "@/lib/utils";
import type { WebsiteMonitoringItem } from "@/types/monitoring";

type RankingMode =
  "visitors" | "whatsapp" | "conversion" | "impressions" | "growth";

const rankingModes: Array<{ value: RankingMode; label: string }> = [
  { value: "visitors", label: "Pengunjung terbanyak" },
  { value: "whatsapp", label: "Klik WhatsApp terbanyak" },
  { value: "conversion", label: "Konversi tertinggi" },
  { value: "impressions", label: "Tayangan Google tertinggi" },
  { value: "growth", label: "Pertumbuhan tertinggi" },
];

function metricValue(website: WebsiteMonitoringItem, mode: RankingMode) {
  if (mode === "whatsapp") return website.metrics.whatsappClicks;
  if (mode === "conversion") return website.metrics.whatsappConversionRate;
  if (mode === "impressions") return website.metrics.searchImpressions;
  if (mode === "growth") return website.trendPercentage;
  return website.metrics.uniqueVisitors;
}

function metricLabel(value: number, mode: RankingMode) {
  if (mode === "conversion" || mode === "growth")
    return `${formatPercent(value)}%`;
  return formatCompactNumber(value);
}

export function WebsiteRanking({
  websites,
}: {
  websites: WebsiteMonitoringItem[];
}) {
  const [mode, setMode] = useState<RankingMode>("visitors");
  const ranking = useMemo(() => {
    const rows = websites
      .map((website) => ({ website, value: metricValue(website, mode) }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
    const max = Math.max(...rows.map((row) => row.value), 1);
    return rows.map((row) => ({ ...row, progress: (row.value / max) * 100 }));
  }, [mode, websites]);

  return (
    <Card className="h-full">
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Peringkat Website</CardTitle>
          <CardDescription>
            Top lima website pada metrik terpilih.
          </CardDescription>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/websites">Lihat Semua Website</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-2">
          {rankingModes.map((item) => (
            <Button
              key={item.value}
              type="button"
              size="sm"
              variant={mode === item.value ? "secondary" : "outline"}
              onClick={() => setMode(item.value)}
            >
              {item.label}
            </Button>
          ))}
        </div>
        <div className="space-y-3">
          {ranking.map(({ website, value, progress }, index) => {
            const positive = website.trendPercentage >= 0;
            return (
              <Link
                key={website.slug}
                href={`/dashboard/websites/${website.slug}`}
                className="block rounded-xl border border-[var(--border)] p-3 transition-colors hover:border-[#B2CCFF] hover:bg-[var(--surface-muted)]"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--brand-primary-soft)] text-xs font-bold text-[var(--brand-primary)]">
                    {index + 1}
                  </span>
                  <WebsiteLogo website={website} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#101828]">
                          {website.name}
                        </p>
                        <p className="truncate text-xs text-[var(--text-secondary)]">
                          {website.domain}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">
                          {metricLabel(value, mode)}
                        </p>
                        <p
                          className={cn(
                            "inline-flex items-center gap-1 text-xs font-semibold",
                            positive ? "text-[#15803D]" : "text-[#B91C1C]",
                          )}
                        >
                          {positive ? (
                            <ArrowUpRight className="size-3" />
                          ) : (
                            <ArrowDownRight className="size-3" />
                          )}
                          {formatSignedPercent(website.trendPercentage)}
                        </p>
                      </div>
                    </div>
                    <Progress
                      className="mt-2"
                      value={progress}
                      label={`Peringkat ${website.name}: ${metricLabel(value, mode)}`}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
