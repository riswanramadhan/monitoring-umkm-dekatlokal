import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDateTimeWita, formatNumber } from "@/lib/monitoring/formatters";
import type { HealthSummary, WebsiteAlert } from "@/types/monitoring";

function severityVariant(severity: WebsiteAlert["severity"]) {
  if (severity === "critical") return "danger" as const;
  if (severity === "warning") return "warning" as const;
  return "neutral" as const;
}

function severityLabel(severity: WebsiteAlert["severity"]) {
  if (severity === "critical") return "Critical";
  if (severity === "warning") return "Warning";
  return "Info";
}

export function WebsiteHealth({
  summary,
  alerts,
}: {
  summary: HealthSummary;
  alerts: WebsiteAlert[];
}) {
  const rows = [
    {
      label: "Website sehat",
      value: summary.healthy,
      variant: "success" as const,
    },
    {
      label: "Perlu perhatian",
      value: summary.attention,
      variant: "warning" as const,
    },
    {
      label: "Bermasalah",
      value: summary.critical,
      variant: "danger" as const,
    },
  ];
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Kondisi Website</CardTitle>
        <CardDescription>
          Ringkasan skor monitoring internal dan tindak lanjut prioritas.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2 sm:grid-cols-3">
          {rows.map((row) => (
            <div
              key={row.label}
              className="rounded-xl bg-[var(--surface-muted)] p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-[var(--text-secondary)]">
                  {row.label}
                </p>
                <Badge variant={row.variant}>{formatNumber(row.value)}</Badge>
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {alerts.slice(0, 5).map((alert) => (
            <div
              key={alert.id}
              className="rounded-xl border border-[var(--border)] p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={severityVariant(alert.severity)}>
                      {severityLabel(alert.severity)}
                    </Badge>
                    <p className="truncate text-sm font-semibold">
                      {alert.websiteName}
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-[#344054]">{alert.issue}</p>
                  <p className="mt-1 text-xs text-[var(--text-secondary)]">
                    {formatDateTimeWita(alert.detectedAt)}
                  </p>
                </div>
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/dashboard/websites/${alert.websiteSlug}`}>
                    Lihat Detail
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
