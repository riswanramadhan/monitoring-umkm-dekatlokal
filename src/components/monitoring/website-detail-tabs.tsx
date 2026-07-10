"use client";

import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Plus, CheckCircle2 } from "lucide-react";

import { AnimatedMetricValue } from "@/components/monitoring/animated-metric-value";
import { PerformanceChart } from "@/components/monitoring/performance-chart";
import { SearchPerformance } from "@/components/monitoring/search-performance";
import { TrafficSourceChart } from "@/components/monitoring/traffic-source-chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { SelectNative } from "@/components/ui/select-native";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  getCoreWebVitalStatus,
  getHealthBadgeVariant,
  getHealthLabel,
} from "@/lib/monitoring/calculations";
import {
  formatCompactNumber,
  formatDateIndonesia,
  formatDateShort,
  formatDecimal,
  formatDuration,
  formatNumber,
  formatPercent,
  formatSignedPercent,
} from "@/lib/monitoring/formatters";
import type {
  MonitoringNote,
  SearchPerformanceSummary,
  WebsiteDetail,
} from "@/types/monitoring";

const tooltipStyle = {
  border: "1px solid #E7EAF0",
  borderRadius: 10,
  boxShadow: "0 8px 24px rgba(16,24,40,.10)",
  fontSize: 12,
};

function MiniKpi({
  label,
  value,
  helper,
  numericValue,
  numericFormat = "compact",
  numericDecimals,
}: {
  label: string;
  value: string;
  helper?: string;
  numericValue?: number;
  numericFormat?: "number" | "compact" | "percent" | "decimal";
  numericDecimals?: number;
}) {
  return (
    <Card className="min-h-[124px]">
      <CardContent className="p-5 sm:p-6">
        <p className="text-[13px] font-bold text-[#101828]">{label}</p>
        <p className="mt-3 text-2xl leading-none font-semibold">
          {typeof numericValue === "number" ? (
            <AnimatedMetricValue
              value={numericValue}
              format={numericFormat}
              decimals={numericDecimals}
            />
          ) : (
            value
          )}
        </p>
        {helper ? (
          <p className="mt-2 text-xs text-[var(--text-secondary)]">{helper}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

function DetailKpis({ detail }: { detail: WebsiteDetail }) {
  const metrics = detail.metrics;
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <MiniKpi
        label="Pengunjung unik"
        value={formatCompactNumber(metrics.uniqueVisitors)}
        numericValue={metrics.uniqueVisitors}
        helper={formatNumber(metrics.uniqueVisitors)}
      />
      <MiniKpi
        label="Tayangan halaman"
        value={formatCompactNumber(metrics.pageViews)}
        numericValue={metrics.pageViews}
        helper={formatNumber(metrics.pageViews)}
      />
      <MiniKpi
        label="Tayangan Google"
        value={formatCompactNumber(metrics.searchImpressions)}
        numericValue={metrics.searchImpressions}
        helper={formatNumber(metrics.searchImpressions)}
      />
      <MiniKpi
        label="Klik dari Google"
        value={formatCompactNumber(metrics.organicClicks)}
        numericValue={metrics.organicClicks}
        helper={`${formatPercent(metrics.searchCtr)}% CTR`}
      />
      <MiniKpi
        label="Klik WhatsApp"
        value={formatCompactNumber(metrics.whatsappClicks)}
        numericValue={metrics.whatsappClicks}
        helper={`${formatNumber(metrics.uniqueWhatsappClickers)} unique clicker`}
      />
      <MiniKpi
        label="Konversi WhatsApp"
        value={`${formatPercent(metrics.whatsappConversionRate)}%`}
        numericValue={metrics.whatsappConversionRate}
        numericFormat="percent"
        numericDecimals={1}
        helper="Unique clicker / pengunjung"
      />
      <MiniKpi
        label="Posisi rata-rata"
        value={formatDecimal(metrics.averagePosition)}
        numericValue={metrics.averagePosition}
        numericFormat="decimal"
        numericDecimals={2}
        helper="Semakin kecil semakin baik"
      />
      <MiniKpi
        label="Skor Monitoring Internal"
        value={`${detail.performance.healthScore}/100`}
        numericValue={detail.performance.healthScore}
        numericFormat="number"
        numericDecimals={0}
        helper={getHealthLabel(detail.performance.healthScore)}
      />
    </div>
  );
}

function SummaryList({
  title,
  description,
  rows,
}: {
  title: string;
  description?: string;
  rows: Array<{ label: string; value: string; progress?: number }>;
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="space-y-3">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
              <span className="text-[#344054]">{row.label}</span>
              <strong>{row.value}</strong>
            </div>
            {typeof row.progress === "number" ? (
              <Progress
                value={row.progress}
                label={`${row.label}: ${row.value}`}
              />
            ) : null}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function OverviewTab({ detail }: { detail: WebsiteDetail }) {
  const bestCta = [...detail.ctaLocations].sort(
    (a, b) => b.clicks - a.clicks,
  )[0];
  const topQuery = detail.searchQueries[0];
  const deviceRows = detail.devices.map((device) => ({
    label: device.device,
    value: `${formatPercent(device.percentage)}%`,
    progress: device.percentage,
  }));
  return (
    <div className="space-y-5">
      <DetailKpis detail={detail} />
      <PerformanceChart
        data={detail.dailyTrends}
        previousData={detail.previousDailyTrends}
      />
      <div className="grid gap-4 xl:grid-cols-12">
        <div className="xl:col-span-4">
          <TrafficSourceChart data={detail.trafficSources} />
        </div>
        <div className="xl:col-span-4">
          <SummaryList title="Device" rows={deviceRows} />
        </div>
        <div className="xl:col-span-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Snapshot Cepat</CardTitle>
              <CardDescription>
                Ringkasan query dan CTA pada periode aktif.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="rounded-xl bg-[var(--surface-muted)] p-3">
                <p className="text-xs text-[var(--text-secondary)]">
                  Top query
                </p>
                <p className="mt-1 font-semibold">
                  {topQuery?.query ?? "Belum ada"}
                </p>
              </div>
              <div className="rounded-xl bg-[var(--surface-muted)] p-3">
                <p className="text-xs text-[var(--text-secondary)]">
                  CTA terbaik
                </p>
                <p className="mt-1 font-semibold">
                  {bestCta?.label ?? "Belum ada"} -{" "}
                  {bestCta ? formatCompactNumber(bestCta.clicks) : "0"} klik
                </p>
              </div>
              <div className="rounded-xl bg-[var(--surface-muted)] p-3">
                <p className="text-xs text-[var(--text-secondary)]">
                  Kunjungan Google
                </p>
                <p className="mt-1 font-semibold">
                  {formatCompactNumber(detail.metrics.organicClicks)} klik
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function TrafficTab({ detail }: { detail: WebsiteDetail }) {
  const metrics = detail.metrics;
  return (
    <div className="space-y-5" id="traffic">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <MiniKpi
          label="Visitors"
          value={formatCompactNumber(metrics.uniqueVisitors)}
          numericValue={metrics.uniqueVisitors}
        />
        <MiniKpi
          label="Sessions"
          value={formatCompactNumber(metrics.sessions)}
          numericValue={metrics.sessions}
        />
        <MiniKpi
          label="Page views"
          value={formatCompactNumber(metrics.pageViews)}
          numericValue={metrics.pageViews}
        />
        <MiniKpi
          label="Pages/session"
          value={
            metrics.sessions
              ? formatDecimal(metrics.pageViews / metrics.sessions)
              : "0,00"
          }
          numericValue={
            metrics.sessions ? metrics.pageViews / metrics.sessions : 0
          }
          numericFormat="decimal"
          numericDecimals={2}
        />
        <MiniKpi
          label="Avg. engagement"
          value={formatDuration(metrics.averageEngagementTime)}
        />
        <MiniKpi
          label="Engagement rate"
          value={`${formatPercent(metrics.engagementRate)}%`}
          numericValue={metrics.engagementRate}
          numericFormat="percent"
          numericDecimals={1}
        />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <SummaryList
          title="New versus returning visitor"
          rows={[
            { label: "New visitor", value: "64,0%", progress: 64 },
            { label: "Returning visitor", value: "36,0%", progress: 36 },
          ]}
        />
        <SummaryList
          title="Lokasi Pengunjung"
          description="Perkiraan lokasi berdasarkan pola traffic; tidak akurat sampai kota/kabupaten."
          rows={detail.visitorLocations.map((item) => ({
            label: item.location,
            value: `${formatCompactNumber(item.visitors)} (${formatPercent(item.percentage)}%)`,
            progress: item.percentage,
          }))}
        />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <TrafficSourceChart data={detail.trafficSources} />
        <SummaryList
          title="Device category"
          rows={detail.devices.map((device) => ({
            label: device.device,
            value: `${formatCompactNumber(device.visitors)} (${formatPercent(device.percentage)}%)`,
            progress: device.percentage,
          }))}
        />
      </div>
    </div>
  );
}

function SearchTab({ detail }: { detail: WebsiteDetail }) {
  const summary: SearchPerformanceSummary = {
    searchImpressions: detail.metrics.searchImpressions,
    organicClicks: detail.metrics.organicClicks,
    ctr: detail.metrics.searchCtr,
    averagePosition: detail.metrics.averagePosition,
    indexedPages: detail.metrics.indexedPages,
    activeQueries: detail.searchQueries.length,
  };
  return (
    <div className="space-y-5">
      <SearchPerformance summary={summary} queries={detail.searchQueries} />
      <div className="grid gap-4 xl:grid-cols-2">
        <SummaryList
          title="Search device"
          rows={detail.devices.map((device) => ({
            label: device.device,
            value: `${formatPercent(device.percentage)}%`,
            progress: device.percentage,
          }))}
        />
        <SummaryList
          title="Search country"
          rows={[
            { label: "Indonesia", value: "96,4%", progress: 96.4 },
            { label: "Malaysia", value: "2,1%", progress: 2.1 },
            { label: "Lainnya", value: "1,5%", progress: 1.5 },
          ]}
        />
      </div>
    </div>
  );
}

function CtaTab({ detail }: { detail: WebsiteDetail }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MiniKpi
          label="Total click"
          value={formatCompactNumber(detail.metrics.whatsappClicks)}
          numericValue={detail.metrics.whatsappClicks}
        />
        <MiniKpi
          label="Unique clicker"
          value={formatCompactNumber(detail.metrics.uniqueWhatsappClickers)}
          numericValue={detail.metrics.uniqueWhatsappClickers}
        />
        <MiniKpi
          label="Conversion rate"
          value={`${formatPercent(detail.metrics.whatsappConversionRate)}%`}
          numericValue={detail.metrics.whatsappConversionRate}
          numericFormat="percent"
          numericDecimals={1}
        />
        <MiniKpi
          label="Trend click"
          value={formatSignedPercent(detail.trendPercentage)}
        />
      </div>
      <div className="grid gap-4">
        <SummaryList
          title="Click berdasarkan device"
          rows={detail.devices.map((device) => ({
            label: device.device,
            value: `${formatCompactNumber(Math.round(detail.metrics.whatsappClicks * (device.percentage / 100)))} klik`,
            progress: device.percentage,
          }))}
        />
      </div>
      <PerformanceChart
        data={detail.dailyTrends}
        previousData={detail.previousDailyTrends}
      />
    </div>
  );
}

function cwvVariant(status: string) {
  if (status === "Good") return "success" as const;
  if (status === "Needs Improvement") return "warning" as const;
  return "danger" as const;
}

function PerformanceTab({ detail }: { detail: WebsiteDetail }) {
  const performance = detail.performance;
  const cwvRows = [
    { label: "LCP", metric: "lcp" as const, value: performance.lcp, unit: "s" },
    {
      label: "INP",
      metric: "inp" as const,
      value: performance.inp,
      unit: "ms",
    },
    { label: "CLS", metric: "cls" as const, value: performance.cls, unit: "" },
  ];
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MiniKpi
          label="Uptime"
          value={`${formatPercent(performance.uptime, 2)}%`}
          numericValue={performance.uptime}
          numericFormat="percent"
          numericDecimals={2}
        />
        <MiniKpi
          label="Lighthouse performance"
          value={`${performance.lighthousePerformance}/100`}
          numericValue={performance.lighthousePerformance}
          numericFormat="number"
        />
        <MiniKpi
          label="SEO score"
          value={`${performance.lighthouseSeo}/100`}
          numericValue={performance.lighthouseSeo}
          numericFormat="number"
        />
        <MiniKpi
          label="Accessibility score"
          value={`${performance.lighthouseAccessibility}/100`}
          numericValue={performance.lighthouseAccessibility}
          numericFormat="number"
        />
        <MiniKpi
          label="Best practices score"
          value={`${performance.lighthouseBestPractices}/100`}
          numericValue={performance.lighthouseBestPractices}
          numericFormat="number"
        />
        <MiniKpi
          label="LCP"
          value={`${formatDecimal(performance.lcp)}s`}
          numericValue={performance.lcp}
          numericFormat="decimal"
          numericDecimals={2}
        />
        <MiniKpi
          label="INP"
          value={`${formatNumber(performance.inp)}ms`}
          numericValue={performance.inp}
          numericFormat="number"
        />
        <MiniKpi
          label="CLS"
          value={formatDecimal(performance.cls)}
          numericValue={performance.cls}
          numericFormat="decimal"
          numericDecimals={2}
        />
      </div>
      <Card>
        <CardHeader className="flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>Core Web Vitals</CardTitle>
            <CardDescription>Status performa halaman utama.</CardDescription>
          </div>
          <Badge variant={getHealthBadgeVariant(performance.healthScore)}>
            {getHealthLabel(performance.healthScore)}
          </Badge>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          {cwvRows.map((row) => {
            const status = getCoreWebVitalStatus(row.metric, row.value);
            const displayValue =
              row.metric === "inp"
                ? formatNumber(row.value)
                : formatDecimal(row.value);
            return (
              <div key={row.label} className="rounded-xl border p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold">{row.label}</p>
                  <Badge variant={cwvVariant(status)}>{status}</Badge>
                </div>
                <p className="mt-2 text-2xl font-semibold">
                  {displayValue}
                  {row.unit}
                </p>
              </div>
            );
          })}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Performance history</CardTitle>
          <CardDescription>Riwayat skor performa website.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72" aria-hidden="true">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={detail.performanceHistory.map((point) => ({
                  ...point,
                  label: formatDateShort(point.date),
                }))}
                margin={{ left: -18, right: 8 }}
              >
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
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#667085" }}
                  tickLine={false}
                  axisLine={false}
                />
                <RechartsTooltip contentStyle={tooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="healthScore"
                  stroke="#0255F5"
                  strokeWidth={2.4}
                  name="Health score"
                />
                <Line
                  type="monotone"
                  dataKey="lighthousePerformance"
                  stroke="#16A34A"
                  strokeWidth={2}
                  name="Performance"
                />
                <Line
                  type="monotone"
                  dataKey="lighthouseSeo"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  name="SEO"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function NotesTab({ detail }: { detail: WebsiteDetail }) {
  const [notes, setNotes] = useState<MonitoringNote[]>(detail.notes);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [priority, setPriority] =
    useState<MonitoringNote["priority"]>("medium");

  function addNote() {
    if (!title.trim()) return;
    setNotes((current) => [
      {
        id: `local-${Date.now()}`,
        websiteSlug: detail.slug,
        title: title.trim(),
        status: "open",
        priority,
        createdAt: new Date().toISOString(),
        assignee: "Belum ditugaskan",
      },
      ...current,
    ]);
    setTitle("");
    setPriority("medium");
    setOpen(false);
  }

  function toggleDone(noteId: string) {
    setNotes((current) =>
      current.map((note) =>
        note.id === noteId
          ? { ...note, status: note.status === "done" ? "open" : "done" }
          : note,
      ),
    );
  }

  return (
    <div className="space-y-4" id="notes">
      <Card>
        <CardHeader className="flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>Catatan Tindak Lanjut</CardTitle>
            <CardDescription>
              Catatan disimpan sementara selama halaman terbuka.
            </CardDescription>
          </div>
          <Button type="button" onClick={() => setOpen((value) => !value)}>
            <Plus />
            Tambah catatan
          </Button>
        </CardHeader>
        {open ? (
          <CardContent className="grid gap-3 border-t pt-5 sm:grid-cols-[1fr_180px_auto]">
            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Contoh: Optimasi meta title halaman produk"
              aria-label="Judul catatan"
            />
            <SelectNative
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value as MonitoringNote["priority"])
              }
              aria-label="Prioritas catatan"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </SelectNative>
            <Button type="button" onClick={addNote}>
              Simpan
            </Button>
            <Textarea
              className="sm:col-span-3"
              placeholder="Detail tindak lanjut opsional."
              aria-label="Detail catatan opsional"
            />
          </CardContent>
        ) : null}
      </Card>
      <div className="grid gap-3">
        {notes.map((note) => (
          <Card key={note.id}>
            <CardContent className="p-5 sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant={note.status === "done" ? "success" : "neutral"}
                    >
                      {note.status === "done" ? "Done" : "Open"}
                    </Badge>
                    <Badge
                      variant={
                        note.priority === "high"
                          ? "danger"
                          : note.priority === "medium"
                            ? "warning"
                            : "neutral"
                      }
                    >
                      {note.priority}
                    </Badge>
                  </div>
                  <p className="mt-2 font-semibold">{note.title}</p>
                  <p className="mt-1 text-xs text-[var(--text-secondary)]">
                    {formatDateIndonesia(note.createdAt)} - Assignee:{" "}
                    {note.assignee}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => toggleDone(note.id)}
                >
                  <CheckCircle2 />
                  {note.status === "done" ? "Buka ulang" : "Tandai done"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {!notes.length ? (
          <div className="rounded-2xl border border-dashed bg-white p-8 text-center text-sm text-[var(--text-secondary)]">
            Belum ada catatan tindak lanjut.
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function WebsiteDetailTabs({ detail }: { detail: WebsiteDetail }) {
  const [tab, setTab] = useState("overview");
  useEffect(() => {
    function syncHash() {
      const hash = window.location.hash.replace("#", "");
      if (
        ["traffic", "search", "whatsapp", "performance", "notes"].includes(hash)
      ) {
        setTab(hash === "search" ? "google-search" : hash);
      }
    }
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  return (
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList className="max-w-full overflow-x-auto">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="traffic">Traffic</TabsTrigger>
        <TabsTrigger value="google-search">Google Search</TabsTrigger>
        <TabsTrigger value="whatsapp">CTA WhatsApp</TabsTrigger>
        <TabsTrigger value="performance">Performance</TabsTrigger>
        <TabsTrigger value="notes">Catatan</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <OverviewTab detail={detail} />
      </TabsContent>
      <TabsContent value="traffic">
        <TrafficTab detail={detail} />
      </TabsContent>
      <TabsContent value="google-search">
        <SearchTab detail={detail} />
      </TabsContent>
      <TabsContent value="whatsapp">
        <CtaTab detail={detail} />
      </TabsContent>
      <TabsContent value="performance">
        <PerformanceTab detail={detail} />
      </TabsContent>
      <TabsContent value="notes">
        <NotesTab detail={detail} />
      </TabsContent>
    </Tabs>
  );
}
