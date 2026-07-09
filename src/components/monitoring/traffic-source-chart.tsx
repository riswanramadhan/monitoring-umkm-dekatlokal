"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  formatCompactNumber,
  formatPercent,
  formatSignedPercent,
} from "@/lib/monitoring/formatters";
import { cn } from "@/lib/utils";
import type { TrafficSource } from "@/types/monitoring";

const colors = ["#0255F5", "#16A34A", "#F59E0B", "#128C7E", "#98A2B3"];

const tooltipStyle = {
  border: "1px solid #E7EAF0",
  borderRadius: 10,
  boxShadow: "0 8px 24px rgba(16,24,40,.10)",
  fontSize: 12,
};

export function TrafficSourceChart({ data }: { data: TrafficSource[] }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Sumber Kunjungan</CardTitle>
        <CardDescription>
          Distribusi pengunjung berdasarkan kanal.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-[160px_1fr] sm:items-center">
          <div className="relative h-40" aria-hidden="true">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="visitors"
                  nameKey="source"
                  innerRadius={48}
                  outerRadius={70}
                  paddingAngle={2}
                >
                  {data.map((item, index) => (
                    <Cell
                      key={item.source}
                      fill={colors[index % colors.length]}
                    />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => [
                    formatCompactNumber(Number(value ?? 0)),
                    "Pengunjung",
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {data.map((item, index) => (
              <div
                key={item.source}
                className="flex items-center justify-between gap-3 rounded-lg p-1.5 hover:bg-[var(--surface-muted)]"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: colors[index % colors.length] }}
                    />
                    <p className="truncate text-sm font-medium">
                      {item.source}
                    </p>
                  </div>
                  <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                    {formatPercent(item.percentage)}% -{" "}
                    {formatCompactNumber(item.visitors)} pengunjung
                  </p>
                </div>
                <span
                  className={cn(
                    "text-xs font-semibold",
                    item.changePercentage >= 0
                      ? "text-[#15803D]"
                      : "text-[#B91C1C]",
                  )}
                >
                  {formatSignedPercent(item.changePercentage)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
