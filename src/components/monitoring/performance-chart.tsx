"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDateShort, formatNumber } from "@/lib/monitoring/formatters";
import type { DailyTrendPoint, MonitoringMetricKey } from "@/types/monitoring";

const metricOptions: Array<{
  key: MonitoringMetricKey;
  label: string;
  color: string;
}> = [
  { key: "uniqueVisitors", label: "Pengunjung", color: "#0255F5" },
  { key: "pageViews", label: "Tayangan halaman", color: "#16A34A" },
  { key: "searchImpressions", label: "Tayangan Google", color: "#D97706" },
  { key: "organicClicks", label: "Klik Google", color: "#7C3AED" },
  { key: "whatsappClicks", label: "Klik WhatsApp", color: "#128C7E" },
];

const tooltipStyle = {
  border: "1px solid #E7EAF0",
  borderRadius: 10,
  boxShadow: "0 8px 24px rgba(16,24,40,.10)",
  fontSize: 12,
};

export function PerformanceChart({
  data,
  previousData,
}: {
  data: DailyTrendPoint[];
  previousData: DailyTrendPoint[];
}) {
  const [selected, setSelected] = useState<MonitoringMetricKey[]>([
    "uniqueVisitors",
    "whatsappClicks",
  ]);
  const [showPrevious, setShowPrevious] = useState(true);

  const chartData = useMemo(
    () =>
      data.map((point, index) => {
        const previous = previousData[index];
        return {
          ...point,
          label: formatDateShort(point.date),
          previousDate: previous?.date,
          previousUniqueVisitors: previous?.uniqueVisitors ?? 0,
          previousPageViews: previous?.pageViews ?? 0,
          previousSearchImpressions: previous?.searchImpressions ?? 0,
          previousOrganicClicks: previous?.organicClicks ?? 0,
          previousWhatsappClicks: previous?.whatsappClicks ?? 0,
        };
      }),
    [data, previousData],
  );

  function toggleMetric(metric: MonitoringMetricKey) {
    setSelected((current) => {
      if (current.includes(metric)) {
        return current.length === 1
          ? current
          : current.filter((item) => item !== metric);
      }
      return [...current, metric];
    });
  }

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Perkembangan Performa Website</CardTitle>
          <CardDescription>
            Perbandingan traffic, visibilitas Google, dan konversi selama
            periode terpilih.
          </CardDescription>
        </div>
        <Button
          type="button"
          size="sm"
          variant={showPrevious ? "secondary" : "outline"}
          onClick={() => setShowPrevious((value) => !value)}
        >
          Periode sebelumnya
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-2">
          {metricOptions.map((metric) => (
            <Button
              key={metric.key}
              type="button"
              size="sm"
              variant={selected.includes(metric.key) ? "secondary" : "outline"}
              onClick={() => toggleMetric(metric.key)}
            >
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: metric.color }}
              />
              {metric.label}
            </Button>
          ))}
        </div>
        <div className="h-72" aria-hidden="true">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ left: -14, right: 8, top: 8 }}
            >
              <defs>
                {metricOptions.map((metric) => (
                  <linearGradient
                    key={metric.key}
                    id={`fill-${metric.key}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={metric.color}
                      stopOpacity={0.16}
                    />
                    <stop
                      offset="95%"
                      stopColor={metric.color}
                      stopOpacity={0}
                    />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E7EAF0"
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: "#667085" }}
                tickLine={false}
                axisLine={false}
                minTickGap={18}
              />
              <YAxis
                tickFormatter={(value: number) => formatNumber(value)}
                tick={{ fontSize: 10, fill: "#667085" }}
                tickLine={false}
                axisLine={false}
              />
              <RechartsTooltip
                contentStyle={tooltipStyle}
                formatter={(value, name) => [
                  formatNumber(Number(value ?? 0)),
                  name,
                ]}
                labelFormatter={(label) => `Tanggal ${label}`}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {selected.map((metric) => {
                const option = metricOptions.find(
                  (item) => item.key === metric,
                );
                if (!option) return null;
                return (
                  <Area
                    key={metric}
                    type="monotone"
                    dataKey={metric}
                    name={option.label}
                    stroke={option.color}
                    fill={`url(#fill-${metric})`}
                    strokeWidth={2.4}
                    activeDot={{ r: 5, fill: option.color }}
                  />
                );
              })}
              {showPrevious
                ? selected.map((metric) => {
                    const option = metricOptions.find(
                      (item) => item.key === metric,
                    );
                    if (!option) return null;
                    const previousKey =
                      `previous${metric.charAt(0).toUpperCase()}${metric.slice(1)}` as const;
                    return (
                      <Line
                        key={previousKey}
                        type="monotone"
                        dataKey={previousKey}
                        name={`${option.label} sebelumnya`}
                        stroke={option.color}
                        strokeWidth={1.6}
                        strokeDasharray="4 4"
                        dot={false}
                        opacity={0.5}
                      />
                    );
                  })
                : null}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="sr-only">
          Performa harian:{" "}
          {data
            .map(
              (item) =>
                `${item.date} pengunjung ${item.uniqueVisitors}, klik WhatsApp ${item.whatsappClicks}`,
            )
            .join(", ")}
        </p>
      </CardContent>
    </Card>
  );
}
