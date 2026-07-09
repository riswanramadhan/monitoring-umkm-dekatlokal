import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { AnimatedMetricValue } from "@/components/monitoring/animated-metric-value";
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
  formatDecimal,
  formatNumber,
  formatPercent,
  formatSignedPercent,
} from "@/lib/monitoring/formatters";
import { cn } from "@/lib/utils";
import type {
  SearchPerformanceSummary,
  SearchQueryMetric,
} from "@/types/monitoring";

export function SearchPerformance({
  summary,
  queries,
}: {
  summary: SearchPerformanceSummary;
  queries: SearchQueryMetric[];
}) {
  const summaryRows = [
    {
      label: "Tayangan Google",
      value: formatCompactNumber(summary.searchImpressions),
      title: formatNumber(summary.searchImpressions),
      numericValue: summary.searchImpressions,
      numericFormat: "compact" as const,
    },
    {
      label: "Klik dari Google",
      value: formatCompactNumber(summary.organicClicks),
      title: formatNumber(summary.organicClicks),
      numericValue: summary.organicClicks,
      numericFormat: "compact" as const,
    },
    {
      label: "CTR",
      value: `${formatPercent(summary.ctr)}%`,
      numericValue: summary.ctr,
      numericFormat: "percent" as const,
    },
    {
      label: "Posisi rata-rata",
      value: formatDecimal(summary.averagePosition),
      numericValue: summary.averagePosition,
      numericFormat: "decimal" as const,
    },
    {
      label: "Indexed pages",
      value: formatNumber(summary.indexedPages),
      numericValue: summary.indexedPages,
      numericFormat: "number" as const,
    },
    {
      label: "Query aktif",
      value: formatNumber(summary.activeQueries),
      numericValue: summary.activeQueries,
      numericFormat: "number" as const,
    },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Performa Google Search</CardTitle>
        <CardDescription>
          Visibilitas website dari hasil pencarian Google.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {summaryRows.map((row) => (
            <div
              key={row.label}
              className="rounded-xl bg-[var(--surface-muted)] p-3"
            >
              <p className="text-xs text-[var(--text-secondary)]">
                {row.label}
              </p>
              <p className="mt-1 text-lg font-semibold" title={row.title}>
                <AnimatedMetricValue
                  value={row.numericValue}
                  format={row.numericFormat}
                />
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 overflow-hidden rounded-xl border border-[var(--border)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Query</TableHead>
                <TableHead>Clicks</TableHead>
                <TableHead>Impressions</TableHead>
                <TableHead>CTR</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {queries.slice(0, 5).map((query) => {
                const positive = query.trendPercentage >= 0;
                return (
                  <TableRow key={query.query}>
                    <TableCell>
                      <div className="font-medium text-[#101828]">
                        {query.query}
                      </div>
                    </TableCell>
                    <TableCell>{formatNumber(query.clicks)}</TableCell>
                    <TableCell>
                      {formatCompactNumber(query.impressions)}
                    </TableCell>
                    <TableCell>{formatPercent(query.ctr)}%</TableCell>
                    <TableCell>{formatDecimal(query.position)}</TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 font-semibold",
                          positive ? "text-[#15803D]" : "text-[#B91C1C]",
                        )}
                      >
                        {positive ? (
                          <ArrowUpRight className="size-3" />
                        ) : (
                          <ArrowDownRight className="size-3" />
                        )}
                        {formatSignedPercent(query.trendPercentage)}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
