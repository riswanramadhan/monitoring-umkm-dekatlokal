"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  Columns3,
  ExternalLink,
  Eye,
  MessageSquarePlus,
  MoreHorizontal,
  RotateCcw,
  Search,
} from "lucide-react";

import { WebsiteLogo } from "@/components/monitoring/website-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { SelectNative } from "@/components/ui/select-native";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getHealthBadgeVariant,
  getHealthLabel,
} from "@/lib/monitoring/calculations";
import {
  formatCompactNumber,
  formatDecimal,
  formatNumber,
  formatPercent,
  formatSignedPercent,
} from "@/lib/monitoring/formatters";
import { cn } from "@/lib/utils";
import type {
  WebsiteMonitoringItem,
  WebsiteStatus,
  WebsiteType,
} from "@/types/monitoring";

type SortKey =
  | "traffic"
  | "whatsapp"
  | "conversion"
  | "growth"
  | "position"
  | "launched"
  | "name"
  | "health";

type ColumnId =
  | "website"
  | "status"
  | "type"
  | "location"
  | "visitors"
  | "pageViews"
  | "impressions"
  | "organicClicks"
  | "ctr"
  | "whatsapp"
  | "conversion"
  | "position"
  | "health"
  | "trend"
  | "action";

const sortOptions: Array<{ value: SortKey; label: string }> = [
  { value: "traffic", label: "Traffic tertinggi" },
  { value: "whatsapp", label: "Klik WhatsApp tertinggi" },
  { value: "conversion", label: "Konversi tertinggi" },
  { value: "growth", label: "Pertumbuhan tertinggi" },
  { value: "position", label: "Posisi Google terbaik" },
  { value: "launched", label: "Terbaru ditambahkan" },
  { value: "name", label: "Nama A-Z" },
  { value: "health", label: "Health score tertinggi" },
];

function statusLabel(status: WebsiteStatus) {
  if (status === "attention") return "Perlu perhatian";
  if (status === "critical") return "Bermasalah";
  return "Live";
}

function statusVariant(status: WebsiteStatus) {
  if (status === "attention") return "warning" as const;
  if (status === "critical") return "danger" as const;
  return "success" as const;
}

function typeLabel(type: WebsiteType) {
  return type === "sociopreneur" ? "Sociopreneur" : "UMKM";
}

function externalHref(domain: string | null) {
  return domain ? `https://${domain}` : null;
}

function getSortValue(website: WebsiteMonitoringItem, key: SortKey) {
  if (key === "whatsapp") return website.metrics.whatsappClicks;
  if (key === "conversion") return website.metrics.whatsappConversionRate;
  if (key === "growth") return website.trendPercentage;
  if (key === "position") {
    return website.metrics.averagePosition > 0
      ? -website.metrics.averagePosition
      : Number.NEGATIVE_INFINITY;
  }
  if (key === "launched") {
    return website.launchedAt ? new Date(website.launchedAt).getTime() : 0;
  }
  if (key === "name") return website.name.toLowerCase();
  if (key === "health") return website.performance.healthScore;
  return website.metrics.uniqueVisitors;
}

function compareWebsites(
  a: WebsiteMonitoringItem,
  b: WebsiteMonitoringItem,
  key: SortKey,
) {
  const first = getSortValue(a, key);
  const second = getSortValue(b, key);
  if (typeof first === "string" && typeof second === "string") {
    return first.localeCompare(second, "id-ID");
  }
  return Number(second) - Number(first);
}

function TrendValue({ value }: { value: number }) {
  const positive = value >= 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-semibold",
        positive ? "text-[#15803D]" : "text-[#B91C1C]",
      )}
    >
      {positive ? (
        <ArrowUp className="size-3" />
      ) : (
        <ArrowDown className="size-3" />
      )}
      {formatSignedPercent(value)}
    </span>
  );
}

function WebsiteActions({ website }: { website: WebsiteMonitoringItem }) {
  const href = externalHref(website.domain);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          aria-label={`Aksi ${website.name}`}
        >
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/websites/${website.slug}`}>
            <Eye />
            Lihat detail
          </Link>
        </DropdownMenuItem>
        {href ? (
          <DropdownMenuItem asChild>
            <a href={href} target="_blank" rel="noopener noreferrer">
              <ExternalLink />
              Buka website
            </a>
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/websites/${website.slug}#traffic`}>
            <BarChart3 />
            Lihat analytics
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/websites/${website.slug}#notes`}>
            <MessageSquarePlus />
            Catat tindak lanjut
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function WebsiteCard({ website }: { website: WebsiteMonitoringItem }) {
  const href = externalHref(website.domain);
  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <WebsiteLogo website={website} />
          <div className="min-w-0">
            <Link
              href={`/dashboard/websites/${website.slug}`}
              className="font-semibold transition-colors hover:text-[#0255F5]"
            >
              {website.name}
            </Link>
            <p className="truncate text-xs text-[#667085]">{website.domain}</p>
          </div>
        </div>
        <Badge variant={statusVariant(website.status)}>
          {statusLabel(website.status)}
        </Badge>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <Metric
          label="Pengunjung"
          value={formatCompactNumber(website.metrics.uniqueVisitors)}
        />
        <Metric
          label="Tayangan"
          value={formatCompactNumber(website.metrics.pageViews)}
        />
        <Metric
          label="Klik WA"
          value={formatCompactNumber(website.metrics.whatsappClicks)}
        />
        <Metric
          label="Konversi"
          value={`${formatPercent(website.metrics.whatsappConversionRate)}%`}
        />
        <Metric
          label="Posisi"
          value={formatDecimal(website.metrics.averagePosition)}
        />
        <Metric
          label="Health"
          value={`${website.performance.healthScore}/100`}
        />
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="neutral">{typeLabel(website.type)}</Badge>
          <Badge variant="outline">{website.location}</Badge>
          <Badge
            variant={getHealthBadgeVariant(website.performance.healthScore)}
          >
            {getHealthLabel(website.performance.healthScore)}
          </Badge>
        </div>
        <div className="flex gap-2">
          {href ? (
            <Button asChild variant="outline" size="sm">
              <a href={href} target="_blank" rel="noopener noreferrer">
                <ExternalLink />
                Buka Website
              </a>
            </Button>
          ) : null}
          <Button asChild variant="ghost" size="sm">
            <Link href={`/dashboard/websites/${website.slug}`}>Detail</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[var(--surface-muted)] p-3">
      <p className="text-[11px] text-[var(--text-secondary)]">{label}</p>
      <p className="mt-1 font-semibold text-[#101828]">{value}</p>
    </div>
  );
}

export function WebsitesTable({
  websites,
  title = "Ringkasan Website UMKM",
  description,
  defaultPageSize = 10,
  showViewToggle = false,
  initialQuery = "",
}: {
  websites: WebsiteMonitoringItem[];
  title?: string;
  description?: string;
  defaultPageSize?: number;
  showViewToggle?: boolean;
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [status, setStatus] = useState<WebsiteStatus | "all">("all");
  const [type, setType] = useState<WebsiteType | "all">("all");
  const [location, setLocation] = useState("all");
  const [sort, setSort] = useState<SortKey>("traffic");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [view, setView] = useState<"table" | "grid">("table");
  const [hiddenColumns, setHiddenColumns] = useState<Set<ColumnId>>(new Set());

  const locations = useMemo(
    () => [
      "all",
      ...Array.from(new Set(websites.map((website) => website.location))),
    ],
    [websites],
  );

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return websites
      .filter((website) => {
        const matchesQuery =
          !normalizedQuery ||
          [
            website.name,
            website.domain ?? "",
            website.category,
            website.location,
          ]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery);
        const matchesStatus =
          status === "all" ||
          (status === "live" && website.status === "live") ||
          (status === "attention" &&
            website.performance.healthScore >= 50 &&
            website.performance.healthScore < 85) ||
          (status === "critical" && website.performance.healthScore < 50) ||
          website.status === status;
        const matchesType = type === "all" || website.type === type;
        const matchesLocation =
          location === "all" || website.location === location;
        return matchesQuery && matchesStatus && matchesType && matchesLocation;
      })
      .sort((a, b) => compareWebsites(a, b, sort));
  }, [location, query, sort, status, type, websites]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const rows = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  function resetFilters() {
    setQuery("");
    setStatus("all");
    setType("all");
    setLocation("all");
    setSort("traffic");
    setPage(1);
  }

  function sortable(label: string, sortKey: SortKey) {
    return (
      <button
        type="button"
        onClick={() => {
          setSort(sortKey);
          setPage(1);
        }}
        className="flex items-center gap-1 hover:text-[#0255F5]"
      >
        {label}
        {sort === sortKey ? <ArrowDown className="size-3" /> : null}
      </button>
    );
  }

  const columns: Array<{
    id: ColumnId;
    label: string;
    header: ReactNode;
    cell: (website: WebsiteMonitoringItem) => ReactNode;
    className?: string;
  }> = [
    {
      id: "website",
      label: "Website",
      header: sortable("Website", "name"),
      cell: (website) => (
        <div className="flex min-w-56 items-center gap-3">
          <WebsiteLogo website={website} />
          <div className="min-w-0">
            <Link
              href={`/dashboard/websites/${website.slug}`}
              className="font-semibold text-[#101828] transition-colors hover:text-[#0255F5]"
            >
              {website.name}
            </Link>
            <p className="truncate text-xs text-[#667085]">{website.domain}</p>
          </div>
        </div>
      ),
    },
    {
      id: "status",
      label: "Status",
      header: "Status",
      cell: (website) => (
        <Badge variant={statusVariant(website.status)}>
          {statusLabel(website.status)}
        </Badge>
      ),
    },
    {
      id: "type",
      label: "Jenis",
      header: "Jenis",
      cell: (website) => typeLabel(website.type),
    },
    {
      id: "location",
      label: "Lokasi",
      header: "Lokasi",
      cell: (website) => website.location,
    },
    {
      id: "visitors",
      label: "Pengunjung",
      header: sortable("Pengunjung", "traffic"),
      cell: (website) => (
        <span title={formatNumber(website.metrics.uniqueVisitors)}>
          {formatCompactNumber(website.metrics.uniqueVisitors)}
        </span>
      ),
    },
    {
      id: "pageViews",
      label: "Page views",
      header: "Page views",
      cell: (website) => (
        <span title={formatNumber(website.metrics.pageViews)}>
          {formatCompactNumber(website.metrics.pageViews)}
        </span>
      ),
    },
    {
      id: "impressions",
      label: "Tayangan Google",
      header: "Tayangan Google",
      cell: (website) => (
        <span title={formatNumber(website.metrics.searchImpressions)}>
          {formatCompactNumber(website.metrics.searchImpressions)}
        </span>
      ),
    },
    {
      id: "organicClicks",
      label: "Klik Google",
      header: "Klik Google",
      cell: (website) => formatCompactNumber(website.metrics.organicClicks),
    },
    {
      id: "ctr",
      label: "CTR",
      header: "CTR",
      cell: (website) => `${formatPercent(website.metrics.searchCtr)}%`,
    },
    {
      id: "whatsapp",
      label: "Klik WhatsApp",
      header: sortable("Klik WhatsApp", "whatsapp"),
      cell: (website) => formatCompactNumber(website.metrics.whatsappClicks),
    },
    {
      id: "conversion",
      label: "Conversion rate",
      header: sortable("Conversion rate", "conversion"),
      cell: (website) =>
        `${formatPercent(website.metrics.whatsappConversionRate)}%`,
    },
    {
      id: "position",
      label: "Average position",
      header: sortable("Average position", "position"),
      cell: (website) => formatDecimal(website.metrics.averagePosition),
    },
    {
      id: "health",
      label: "Health score",
      header: sortable("Health score", "health"),
      cell: (website) => (
        <div className="min-w-24" title="Skor Monitoring Internal">
          <div className="mb-1 flex items-center justify-between gap-2">
            <strong>{website.performance.healthScore}</strong>
            <Badge
              variant={getHealthBadgeVariant(website.performance.healthScore)}
            >
              {getHealthLabel(website.performance.healthScore)}
            </Badge>
          </div>
          <Progress
            value={website.performance.healthScore}
            label={`Skor Monitoring Internal ${website.name}: ${website.performance.healthScore}`}
          />
        </div>
      ),
    },
    {
      id: "trend",
      label: "Trend",
      header: sortable("Trend", "growth"),
      cell: (website) => <TrendValue value={website.trendPercentage} />,
    },
    {
      id: "action",
      label: "Action",
      header: "Action",
      cell: (website) => <WebsiteActions website={website} />,
    },
  ];

  const visibleColumns = columns.filter(
    (column) => !hiddenColumns.has(column.id),
  );
  const hasActiveFilters =
    query ||
    status !== "all" ||
    type !== "all" ||
    location !== "all" ||
    sort !== "traffic";

  return (
    <div>
      <div className="border-b border-[var(--border)] p-4 sm:p-5">
        <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-start">
          <div className="min-w-0">
            <h2 className="max-w-full text-base font-semibold break-words">
              {title}
            </h2>
            {description ? (
              <p className="mt-1 max-w-3xl text-sm break-words text-[var(--text-secondary)]">
                {description}
              </p>
            ) : null}
          </div>
          {showViewToggle ? (
            <div className="flex rounded-xl border border-[var(--border)] bg-white p-1">
              <Button
                type="button"
                size="sm"
                variant={view === "table" ? "secondary" : "ghost"}
                onClick={() => setView("table")}
              >
                Table
              </Button>
              <Button
                type="button"
                size="sm"
                variant={view === "grid" ? "secondary" : "ghost"}
                onClick={() => setView("grid")}
              >
                Grid
              </Button>
            </div>
          ) : null}
        </div>
        <div className="mt-4 flex flex-col gap-3 xl:flex-row xl:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute top-3 left-3 size-4 text-[var(--text-tertiary)]" />
            <Input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Cari website, domain, kategori, atau lokasi..."
              aria-label="Cari website"
              className="pl-9"
            />
          </div>
          <div className="grid gap-2 sm:grid-cols-2 xl:flex xl:items-center">
            <SelectNative
              value={status}
              onChange={(event) => {
                setStatus(event.target.value as WebsiteStatus | "all");
                setPage(1);
              }}
              aria-label="Filter status"
            >
              <option value="all">Semua status</option>
              <option value="live">Live</option>
              <option value="attention">Perlu perhatian</option>
              <option value="critical">Bermasalah</option>
            </SelectNative>
            <SelectNative
              value={type}
              onChange={(event) => {
                setType(event.target.value as WebsiteType | "all");
                setPage(1);
              }}
              aria-label="Filter jenis"
            >
              <option value="all">Semua jenis</option>
              <option value="umkm">UMKM</option>
              <option value="sociopreneur">Sociopreneur</option>
            </SelectNative>
            <SelectNative
              value={location}
              onChange={(event) => {
                setLocation(event.target.value);
                setPage(1);
              }}
              aria-label="Filter lokasi"
            >
              {locations.map((item) => (
                <option key={item} value={item}>
                  {item === "all" ? "Semua lokasi" : item}
                </option>
              ))}
            </SelectNative>
            <SelectNative
              value={sort}
              onChange={(event) => {
                setSort(event.target.value as SortKey);
                setPage(1);
              }}
              aria-label="Urutkan website"
            >
              {sortOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </SelectNative>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="outline">
                  <Columns3 />
                  Kolom
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {columns
                  .filter(
                    (column) =>
                      column.id !== "website" && column.id !== "action",
                  )
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={!hiddenColumns.has(column.id)}
                      onCheckedChange={(checked) => {
                        setHiddenColumns((current) => {
                          const next = new Set(current);
                          if (checked) next.delete(column.id);
                          else next.add(column.id);
                          return next;
                        });
                      }}
                    >
                      {column.label}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {hasActiveFilters ? (
              <Button type="button" variant="ghost" onClick={resetFilters}>
                <RotateCcw />
                Reset
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      {view === "grid" && showViewToggle ? (
        <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((website) => (
            <WebsiteCard key={website.slug} website={website} />
          ))}
        </div>
      ) : (
        <>
          <div className="hidden max-h-[68vh] overflow-auto border-y border-[var(--border)] bg-white lg:block">
            <Table>
              <TableHeader>
                <TableRow>
                  {visibleColumns.map((column) => (
                    <TableHead key={column.id}>{column.header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((website) => (
                  <TableRow key={website.slug}>
                    {visibleColumns.map((column) => (
                      <TableCell key={column.id} className={column.className}>
                        {column.cell(website)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="space-y-3 border-t border-[var(--border)] p-4 lg:hidden">
            {rows.map((website) => (
              <WebsiteCard key={website.slug} website={website} />
            ))}
          </div>
        </>
      )}

      {!rows.length ? (
        <div className="p-5 text-center text-sm text-[var(--text-secondary)]">
          Tidak ada website yang cocok dengan filter aktif.
        </div>
      ) : null}

      <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <p className="text-xs text-[#667085]">
          Menampilkan {formatNumber(rows.length)} dari{" "}
          {formatNumber(filtered.length)} website - Halaman{" "}
          {formatNumber(safePage)} dari {formatNumber(pageCount)}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <SelectNative
            value={String(pageSize)}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setPage(1);
            }}
            aria-label="Jumlah baris per halaman"
            className="h-8 text-xs"
          >
            <option value="5">5 baris</option>
            <option value="10">10 baris</option>
            <option value="13">13 baris</option>
          </SelectNative>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={safePage <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            Sebelumnya
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={safePage >= pageCount}
            onClick={() =>
              setPage((current) => Math.min(pageCount, current + 1))
            }
          >
            Berikutnya
          </Button>
        </div>
      </div>
    </div>
  );
}
