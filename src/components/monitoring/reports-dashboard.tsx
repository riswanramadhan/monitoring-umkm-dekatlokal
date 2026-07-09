"use client";

import { Download } from "lucide-react";

import { AnimatedMetricValue } from "@/components/monitoring/animated-metric-value";
import { DateRangeSelector } from "@/components/monitoring/date-range-selector";
import { WebsiteLogo } from "@/components/monitoring/website-avatar";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatCompactNumber,
  formatDateIndonesia,
  formatDecimal,
  formatNumber,
  formatPercent,
  formatSignedPercent,
} from "@/lib/monitoring/formatters";
import type { DateRange, WebsiteMonitoringItem } from "@/types/monitoring";

const csvHeaders = [
  "Website",
  "Domain",
  "Tanggal Terindeks Google",
  "Kunjungan Google",
  "Pengunjung",
  "Tayangan Halaman",
  "Kunjungan WhatsApp",
  "Conversion Rate",
  "CTR",
  "Posisi Rata-rata",
  "Health Score",
  "Trend",
];

function escapeCsv(value: string | number) {
  const text = String(value);
  if (!/[",\r\n]/.test(text)) return text;
  return `"${text.replaceAll('"', '""')}"`;
}

function csvRow(website: WebsiteMonitoringItem) {
  return [
    website.name,
    website.domain ?? "",
    formatDateIndonesia(website.googleIndexedAt),
    website.metrics.organicClicks,
    website.metrics.uniqueVisitors,
    website.metrics.pageViews,
    website.metrics.whatsappClicks,
    `${formatPercent(website.metrics.whatsappConversionRate)}%`,
    `${formatPercent(website.metrics.searchCtr)}%`,
    formatDecimal(website.metrics.averagePosition),
    website.performance.healthScore,
    `${formatSignedPercent(website.trendPercentage)}`,
  ];
}

function downloadCsv(websites: WebsiteMonitoringItem[]) {
  const lines = [
    csvHeaders.map(escapeCsv).join(","),
    ...websites.map((website) => csvRow(website).map(escapeCsv).join(",")),
  ];
  const blob = new Blob([`\uFEFF${lines.join("\r\n")}`], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "laporan-monitoring-website-umkm.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function ReportsDashboard({
  websites,
  range,
}: {
  websites: WebsiteMonitoringItem[];
  range: DateRange;
}) {
  const totals = websites.reduce(
    (total, website) => ({
      google: total.google + website.metrics.organicClicks,
      visitors: total.visitors + website.metrics.uniqueVisitors,
      whatsapp: total.whatsapp + website.metrics.whatsappClicks,
    }),
    { google: 0, visitors: 0, whatsapp: 0 },
  );

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Monitoring"
        title="Laporan"
        description="Export ringkasan monitoring website UMKM untuk kebutuhan evaluasi dan tindak lanjut."
        actions={
          <>
            <DateRangeSelector range={range} basePath="/dashboard/reports" />
            <Button type="button" onClick={() => downloadCsv(websites)}>
              <Download />
              Export CSV
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-[13px] font-bold text-[#101828]">
              Total Website
            </p>
            <p className="mt-2 text-2xl leading-none font-semibold">
              <AnimatedMetricValue value={websites.length} />
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-[13px] font-bold text-[#101828]">
              Kunjungan Google
            </p>
            <p className="mt-2 text-2xl leading-none font-semibold">
              <AnimatedMetricValue value={totals.google} format="compact" />
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-[13px] font-bold text-[#101828]">
              Klik WhatsApp
            </p>
            <p className="mt-2 text-2xl leading-none font-semibold">
              <AnimatedMetricValue value={totals.whatsapp} format="compact" />
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Ringkasan Laporan Website</CardTitle>
          <CardDescription>
            Data laporan mengikuti periode {range.label.toLowerCase()}.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="hidden max-h-[68vh] overflow-auto lg:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Website</TableHead>
                  <TableHead>Google</TableHead>
                  <TableHead>Pengunjung</TableHead>
                  <TableHead>WA</TableHead>
                  <TableHead>Conversion</TableHead>
                  <TableHead>CTR</TableHead>
                  <TableHead>Posisi</TableHead>
                  <TableHead>Health</TableHead>
                  <TableHead>Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {websites.map((website) => (
                  <TableRow key={website.slug}>
                    <TableCell>
                      <div className="flex min-w-56 items-center gap-3">
                        <WebsiteLogo website={website} />
                        <div className="min-w-0">
                          <p className="font-semibold text-[#101828]">
                            {website.name}
                          </p>
                          <p className="truncate text-xs text-[var(--text-secondary)]">
                            {website.domain}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatCompactNumber(website.metrics.organicClicks)}
                    </TableCell>
                    <TableCell>
                      {formatCompactNumber(website.metrics.uniqueVisitors)}
                    </TableCell>
                    <TableCell>
                      {formatCompactNumber(website.metrics.whatsappClicks)}
                    </TableCell>
                    <TableCell>
                      {formatPercent(website.metrics.whatsappConversionRate)}%
                    </TableCell>
                    <TableCell>
                      {formatPercent(website.metrics.searchCtr)}%
                    </TableCell>
                    <TableCell>
                      {formatDecimal(website.metrics.averagePosition)}
                    </TableCell>
                    <TableCell>{website.performance.healthScore}</TableCell>
                    <TableCell>
                      {formatSignedPercent(website.trendPercentage)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="space-y-3 p-4 lg:hidden">
            {websites.map((website) => (
              <div key={website.slug} className="rounded-xl border p-3">
                <div className="flex min-w-0 items-start gap-3">
                  <WebsiteLogo website={website} />
                  <div className="min-w-0">
                    <p className="font-semibold text-[#101828]">
                      {website.name}
                    </p>
                    <p className="text-xs break-words text-[var(--text-secondary)]">
                      {website.domain}
                    </p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <span>
                    Google: {formatNumber(website.metrics.organicClicks)}
                  </span>
                  <span>
                    Pengunjung: {formatNumber(website.metrics.uniqueVisitors)}
                  </span>
                  <span>
                    WA: {formatNumber(website.metrics.whatsappClicks)}
                  </span>
                  <span>
                    Health: {formatNumber(website.performance.healthScore)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
