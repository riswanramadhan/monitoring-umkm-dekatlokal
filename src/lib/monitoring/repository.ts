import "server-only";

import { alertSeeds, monitoringNoteSeeds } from "@/data/monitoring/alerts";
import { searchQuerySeeds } from "@/data/monitoring/search-queries";
import {
  addDays,
  aggregateDailyByDate,
  createDateSeries,
  daysBetween,
  generateWebsiteDailyTrends,
  MOCK_TODAY,
} from "@/data/monitoring/trends";
import {
  getEarliestGoogleIndexedDate,
  getMonthlyGoogleVisits,
  type LocalWebsiteSeed,
  websiteSeeds,
} from "@/data/monitoring/websites";
import {
  aggregateDailyTrends,
  calculateCompositeHealthScore,
  calculatePercentageChange,
  coreWebVitalsScore,
  emptyMetrics,
  sumMetrics,
} from "@/lib/monitoring/calculations";
import {
  formatCompactNumber,
  formatDecimal,
  formatNumber,
  formatPercent,
} from "@/lib/monitoring/formatters";
import type {
  CtaLocation,
  CtaLocationMetric,
  DateRange,
  DateRangePreset,
  DeviceBreakdown,
  HealthSummary,
  LandingPageMetric,
  MonitoringOverview,
  MonitoringRepository,
  PerformanceHistoryPoint,
  SearchPerformanceSummary,
  SearchQueryMetric,
  TrafficSource,
  WebsiteAlert,
  WebsiteDetail,
  WebsiteMetrics,
  WebsiteMonitoringItem,
  WebsitePerformance,
} from "@/types/monitoring";

const DATA_AS_OF = "2026-07-09T00:00:00+08:00";

const presetDays: Record<Exclude<DateRangePreset, "all" | "custom">, number> = {
  "7d": 7,
  "28d": 28,
  "90d": 90,
  "12m": 365,
};

const presetLabels: Record<
  Exclude<DateRangePreset, "all" | "custom">,
  string
> = {
  "7d": "7 hari terakhir",
  "28d": "28 hari terakhir",
  "90d": "90 hari terakhir",
  "12m": "12 bulan terakhir",
};

const trafficSourceNames: TrafficSource["source"][] = [
  "Organic Search",
  "Direct",
  "Instagram",
  "WhatsApp",
  "Lainnya",
];

const ctaLabels: Record<CtaLocation, string> = {
  navbar: "Navbar",
  hero: "Hero",
  product: "Produk",
  floating: "Floating button",
  footer: "Footer",
  package: "Paket",
};

const trendCache = new Map(
  websiteSeeds.map((seed) => [seed.slug, generateWebsiteDailyTrends(seed)]),
);

function normalizeDate(value: string | undefined) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return null;
  if (value > MOCK_TODAY) return MOCK_TODAY;
  return value;
}

function labelCustomRange(from: string, to: string) {
  const formatter = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Makassar",
  });
  return `${formatter.format(new Date(`${from}T00:00:00+08:00`))} - ${formatter.format(new Date(`${to}T00:00:00+08:00`))}`;
}

export function getMonitoringDateRange(input?: {
  preset?: string;
  from?: string;
  to?: string;
}): DateRange {
  const requested = input?.preset;
  const preset: DateRangePreset =
    requested === "7d" ||
    requested === "28d" ||
    requested === "90d" ||
    requested === "12m" ||
    requested === "custom"
      ? requested
      : "all";

  if (preset === "custom") {
    const to = normalizeDate(input?.to) ?? MOCK_TODAY;
    const rawFrom = normalizeDate(input?.from) ?? addDays(to, -27);
    const from = rawFrom > to ? to : rawFrom;
    const safeFrom = daysBetween(from, to) > 365 ? addDays(to, -364) : from;
    const days = daysBetween(safeFrom, to);
    return {
      preset,
      from: safeFrom,
      to,
      days,
      label: labelCustomRange(safeFrom, to),
    };
  }

  if (preset === "all") {
    const from = getEarliestGoogleIndexedDate();
    return {
      preset,
      from,
      to: MOCK_TODAY,
      days: daysBetween(from, MOCK_TODAY),
      label: "Semua data",
    };
  }

  const days = presetDays[preset];
  const to = MOCK_TODAY;
  const from = addDays(to, -(days - 1));
  return {
    preset,
    from,
    to,
    days,
    label: presetLabels[preset],
  };
}

export function getPreviousDateRange(range: DateRange): DateRange {
  const to = addDays(range.from, -1);
  const from = addDays(to, -(range.days - 1));
  return {
    ...range,
    from,
    to,
    label: `Periode sebelumnya (${range.days} hari)`,
  };
}

function trendsForRange(seed: LocalWebsiteSeed, range: DateRange) {
  return (trendCache.get(seed.slug) ?? []).filter(
    (point) =>
      point.date >= range.from &&
      point.date >= seed.googleIndexedAt &&
      point.date <= range.to,
  );
}

function withStaticPageMetrics(
  metrics: WebsiteMetrics,
  seed: LocalWebsiteSeed,
): WebsiteMetrics {
  return {
    ...metrics,
    indexedPages: seed.indexedPages,
    totalPages: seed.totalPages,
  };
}

function buildPerformance(
  seed: LocalWebsiteSeed,
  trendPercentage: number,
): WebsitePerformance {
  const performance = {
    uptime: seed.uptime,
    lighthousePerformance: seed.lighthousePerformance,
    lighthouseSeo: seed.lighthouseSeo,
    lighthouseAccessibility: seed.lighthouseAccessibility,
    lighthouseBestPractices: seed.lighthouseBestPractices,
    lcp: seed.lcp,
    inp: seed.inp,
    cls: seed.cls,
    healthScore: 0,
  };
  return {
    ...performance,
    healthScore: calculateCompositeHealthScore({
      uptime: seed.uptime,
      coreWebVitalsScore: coreWebVitalsScore(performance),
      seoReadiness: seed.lighthouseSeo,
      trafficTrend: trendPercentage,
      trackingCompleteness: seed.trackingCompleteness,
    }),
  };
}

function buildWebsiteItem(
  seed: LocalWebsiteSeed,
  range: DateRange,
): WebsiteMonitoringItem {
  const previousRange = getPreviousDateRange(range);
  const metrics = withStaticPageMetrics(
    aggregateDailyTrends(trendsForRange(seed, range)),
    seed,
  );
  const previousMetrics = withStaticPageMetrics(
    aggregateDailyTrends(trendsForRange(seed, previousRange)),
    seed,
  );
  const trendPercentage = calculatePercentageChange(
    metrics.uniqueVisitors,
    previousMetrics.uniqueVisitors,
  );
  return {
    id: seed.id,
    slug: seed.slug,
    name: seed.name,
    domain: seed.domain,
    category: seed.category,
    type: seed.type,
    location: seed.location,
    status: seed.status,
    launchedAt: seed.launchedAt,
    googleIndexedAt: seed.googleIndexedAt,
    googleVisitsTotal: seed.googleVisitsTotal,
    logoSrc: seed.logoSrc,
    monthlyGoogleVisits: getMonthlyGoogleVisits(seed),
    metrics,
    previousMetrics,
    performance: buildPerformance(seed, trendPercentage),
    trendPercentage,
  };
}

function buildKpis(
  totals: WebsiteMetrics,
  previousTotals: WebsiteMetrics,
  statusCounts: MonitoringOverview["statusCounts"],
) {
  return [
    {
      id: "active-websites",
      label: "Website Aktif",
      value: formatNumber(statusCounts.total),
      fullValue: `${formatNumber(statusCounts.total)} website aktif`,
      numericValue: statusCounts.total,
      numericFormat: "number" as const,
      helper: `${formatNumber(statusCounts.live)} Live`,
      tone: "blue" as const,
      iconKey: "globe" as const,
      tooltip: "Jumlah website UMKM yang aktif dalam sistem monitoring.",
    },
    {
      id: "unique-visitors",
      label: "Pengunjung Unik",
      value: formatCompactNumber(totals.uniqueVisitors),
      fullValue: formatNumber(totals.uniqueVisitors),
      numericValue: totals.uniqueVisitors,
      numericFormat: "compact" as const,
      helper: "Total periode aktif",
      changePercentage: calculatePercentageChange(
        totals.uniqueVisitors,
        previousTotals.uniqueVisitors,
      ),
      tone: "green" as const,
      iconKey: "users" as const,
    },
    {
      id: "page-views",
      label: "Tayangan Halaman",
      value: formatCompactNumber(totals.pageViews),
      fullValue: formatNumber(totals.pageViews),
      numericValue: totals.pageViews,
      numericFormat: "compact" as const,
      helper: "Halaman website dibuka",
      changePercentage: calculatePercentageChange(
        totals.pageViews,
        previousTotals.pageViews,
      ),
      tone: "blue" as const,
      iconKey: "pages" as const,
      tooltip: "Jumlah halaman website yang dibuka oleh pengunjung.",
    },
    {
      id: "search-impressions",
      label: "Tayangan Google",
      value: formatCompactNumber(totals.searchImpressions),
      fullValue: formatNumber(totals.searchImpressions),
      numericValue: totals.searchImpressions,
      numericFormat: "compact" as const,
      helper: "Kemunculan di hasil Google",
      changePercentage: calculatePercentageChange(
        totals.searchImpressions,
        previousTotals.searchImpressions,
      ),
      tone: "blue" as const,
      iconKey: "search" as const,
      tooltip: "Jumlah kemunculan website pada hasil pencarian Google.",
    },
    {
      id: "organic-clicks",
      label: "Klik dari Google",
      value: formatCompactNumber(totals.organicClicks),
      fullValue: formatNumber(totals.organicClicks),
      numericValue: totals.organicClicks,
      numericFormat: "compact" as const,
      helper: "Kunjungan dari pencarian",
      changePercentage: calculatePercentageChange(
        totals.organicClicks,
        previousTotals.organicClicks,
      ),
      tone: "green" as const,
      iconKey: "click" as const,
      tooltip:
        "Jumlah kunjungan yang berasal dari klik hasil pencarian Google.",
    },
    {
      id: "whatsapp-clicks",
      label: "Klik WhatsApp",
      value: formatCompactNumber(totals.whatsappClicks),
      fullValue: formatNumber(totals.whatsappClicks),
      numericValue: totals.whatsappClicks,
      numericFormat: "compact" as const,
      helper: "Interaksi seluruh tombol WA",
      changePercentage: calculatePercentageChange(
        totals.whatsappClicks,
        previousTotals.whatsappClicks,
      ),
      tone: "green" as const,
      iconKey: "whatsapp" as const,
      tooltip: "Jumlah interaksi pada seluruh tombol WhatsApp di website UMKM.",
    },
    {
      id: "whatsapp-conversion",
      label: "Konversi WhatsApp",
      value: `${formatPercent(totals.whatsappConversionRate)}%`,
      fullValue: `${formatPercent(totals.whatsappConversionRate, 2)}%`,
      numericValue: totals.whatsappConversionRate,
      numericFormat: "percent" as const,
      numericDecimals: 1,
      helper: "Unique clicker / pengunjung",
      changePercentage:
        totals.whatsappConversionRate - previousTotals.whatsappConversionRate,
      tone: "amber" as const,
      iconKey: "conversion" as const,
      tooltip:
        "Dihitung dari unique WhatsApp clicker dibagi pengunjung unik, bukan total klik mentah.",
    },
    {
      id: "average-position",
      label: "Rata-rata Posisi Google",
      value: formatDecimal(totals.averagePosition),
      fullValue: formatDecimal(totals.averagePosition),
      numericValue: totals.averagePosition,
      numericFormat: "decimal" as const,
      numericDecimals: 2,
      helper: "Semakin kecil semakin baik",
      changePercentage: calculatePercentageChange(
        previousTotals.averagePosition,
        totals.averagePosition,
      ),
      tone: "amber" as const,
      iconKey: "position" as const,
      tooltip:
        "Rata-rata posisi website pada hasil pencarian Google. Angka lebih kecil berarti posisi lebih baik.",
    },
  ];
}

function buildStatusCounts(websites: WebsiteMonitoringItem[]) {
  const attention = websites.filter(
    (item) =>
      item.performance.healthScore >= 50 && item.performance.healthScore < 70,
  ).length;
  const critical = websites.filter(
    (item) => item.performance.healthScore < 50,
  ).length;
  return {
    total: websites.length,
    live: websites.length,
    attention,
    critical,
  };
}

function normalizedShareEntries<T extends string>(shares: Record<T, number>) {
  const entries = Object.entries(shares) as Array<[T, number]>;
  const total = entries.reduce((sum, [, value]) => sum + value, 0) || 1;
  return entries.map(([key, value]) => [key, value / total] as const);
}

function seedForSlug(slug: string) {
  return websiteSeeds.find((item) => item.slug === slug);
}

function buildTrafficSources(websites: WebsiteMonitoringItem[]) {
  return trafficSourceNames
    .map((source) => {
      const visitors = websites.reduce((total, website) => {
        const seed = seedForSlug(website.slug);
        const share =
          normalizedShareEntries(seed?.sourceShares ?? {}).find(
            ([key]) => key === source,
          )?.[1] ?? 0;
        return total + Math.round(website.metrics.uniqueVisitors * share);
      }, 0);
      const previousVisitors = websites.reduce((total, website) => {
        const seed = seedForSlug(website.slug);
        const share =
          normalizedShareEntries(seed?.sourceShares ?? {}).find(
            ([key]) => key === source,
          )?.[1] ?? 0;
        return (
          total + Math.round(website.previousMetrics.uniqueVisitors * share)
        );
      }, 0);
      return {
        source,
        visitors,
        percentage: 0,
        changePercentage: calculatePercentageChange(visitors, previousVisitors),
      };
    })
    .map((source, _index, list) => {
      const total = list.reduce((sum, item) => sum + item.visitors, 0) || 1;
      return { ...source, percentage: (source.visitors / total) * 100 };
    });
}

function buildSearchQueries(
  seed: LocalWebsiteSeed,
  website: WebsiteMonitoringItem,
) {
  return searchQuerySeeds
    .filter((query) => query.websiteSlug === seed.slug)
    .map<SearchQueryMetric>((query, index) => {
      const impressions = Math.round(
        website.metrics.searchImpressions * query.share,
      );
      const clickModifier = 1 + (index % 2 === 0 ? 0.08 : -0.04);
      const clicks = Math.round(
        impressions * (website.metrics.searchCtr / 100) * clickModifier,
      );
      const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
      const position = Math.max(
        1,
        website.metrics.averagePosition + query.positionOffset,
      );
      return {
        query: query.query,
        clicks,
        impressions,
        ctr,
        position,
        trendPercentage: website.trendPercentage + query.trendBias,
        opportunity:
          impressions >= 300 && ctr < 5 && position >= 4 && position <= 20,
      };
    })
    .filter(
      (query) => query.impressions > 0 || website.metrics.organicClicks > 0,
    )
    .sort((a, b) => b.clicks - a.clicks);
}

function enrichAlerts(websites: WebsiteMonitoringItem[]) {
  return alertSeeds
    .map<WebsiteAlert | null>((alert) => {
      const website = websites.find((item) => item.slug === alert.websiteSlug);
      if (!website) return null;
      return { ...alert, websiteName: website.name };
    })
    .filter((alert): alert is WebsiteAlert => Boolean(alert));
}

function buildSearchSummary(
  totals: WebsiteMetrics,
  websites: WebsiteMonitoringItem[],
): SearchPerformanceSummary {
  const activeQueries = websites.reduce((total, website) => {
    const seed = seedForSlug(website.slug);
    return (
      total +
      searchQuerySeeds.filter((query) => query.websiteSlug === seed?.slug)
        .length
    );
  }, 0);
  return {
    searchImpressions: totals.searchImpressions,
    organicClicks: totals.organicClicks,
    ctr: totals.searchCtr,
    averagePosition: totals.averagePosition,
    indexedPages: totals.indexedPages,
    activeQueries,
  };
}

function buildFunnel(
  websites: WebsiteMonitoringItem[],
  totals: WebsiteMetrics,
) {
  const bestWebsite = [...websites].sort(
    (a, b) =>
      b.metrics.whatsappConversionRate - a.metrics.whatsappConversionRate,
  )[0];
  const bestLocation = websites
    .flatMap((website) => {
      const seed = seedForSlug(website.slug);
      if (!seed) return [];
      return normalizedShareEntries(seed.ctaShares).map(
        ([location, share]) => ({
          location,
          clicks: website.metrics.whatsappClicks * share,
        }),
      );
    })
    .sort((a, b) => b.clicks - a.clicks)[0];
  return {
    pageViews: totals.pageViews,
    uniqueVisitors: totals.uniqueVisitors,
    ctaViews: Math.round(totals.pageViews * 0.38),
    whatsappClicks: totals.whatsappClicks,
    uniqueWhatsappClickers: totals.uniqueWhatsappClickers,
    conversionRate: totals.whatsappConversionRate,
    bestWebsiteName: bestWebsite?.name ?? "Belum ada",
    bestWebsiteRate: bestWebsite?.metrics.whatsappConversionRate ?? 0,
    bestLocationLabel: bestLocation
      ? ctaLabels[bestLocation.location]
      : "Belum ada",
  };
}

function buildHealthSummary(websites: WebsiteMonitoringItem[]): HealthSummary {
  return {
    healthy: websites.filter((item) => item.performance.healthScore >= 85)
      .length,
    attention: websites.filter(
      (item) =>
        item.performance.healthScore >= 50 && item.performance.healthScore < 85,
    ).length,
    critical: websites.filter((item) => item.performance.healthScore < 50)
      .length,
    unchecked: 0,
  };
}

function buildDevices(
  seed: LocalWebsiteSeed,
  website: WebsiteMonitoringItem,
): DeviceBreakdown[] {
  return normalizedShareEntries(seed.deviceShares).map(([device, share]) => ({
    device,
    visitors: Math.round(website.metrics.uniqueVisitors * share),
    percentage: share * 100,
  }));
}

function buildCtaLocations(
  seed: LocalWebsiteSeed,
  website: WebsiteMonitoringItem,
): CtaLocationMetric[] {
  return normalizedShareEntries(seed.ctaShares).map(([location, share]) => {
    const clicks = Math.round(website.metrics.whatsappClicks * share);
    const uniqueClickers = Math.round(
      website.metrics.uniqueWhatsappClickers * share,
    );
    return {
      location,
      label: ctaLabels[location],
      clicks,
      uniqueClickers,
      conversionRate:
        website.metrics.uniqueVisitors > 0
          ? (uniqueClickers / website.metrics.uniqueVisitors) * 100
          : 0,
      percentage: share * 100,
    };
  });
}

function buildLandingPages(
  seed: LocalWebsiteSeed,
  website: WebsiteMonitoringItem,
): LandingPageMetric[] {
  return seed.topPages.map((page) => {
    const visitors = Math.round(website.metrics.uniqueVisitors * page.share);
    const pageViews = Math.round(website.metrics.pageViews * page.share);
    const whatsappClicks = Math.round(
      website.metrics.whatsappClicks * page.share,
    );
    return {
      path: page.path,
      title: page.title,
      visitors,
      pageViews,
      whatsappClicks,
      conversionRate:
        visitors > 0
          ? (Math.round(website.metrics.uniqueWhatsappClickers * page.share) /
              visitors) *
            100
          : 0,
    };
  });
}

function buildPerformanceHistory(
  seed: LocalWebsiteSeed,
  website: WebsiteMonitoringItem,
  range: DateRange,
): PerformanceHistoryPoint[] {
  const from =
    range.from > seed.googleIndexedAt ? range.from : seed.googleIndexedAt;
  const dates = createDateSeries(from, range.to);
  const step = Math.max(1, Math.floor(dates.length / 8));
  return dates
    .filter((_, index) => index % step === 0)
    .slice(-8)
    .map((date, index) => {
      const wave = Math.sin((index + seed.id.length) / 2) * 2;
      return {
        date,
        uptime: Math.max(0, Math.min(100, seed.uptime + wave * 0.03)),
        lighthousePerformance: Math.max(
          0,
          Math.min(100, seed.lighthousePerformance + wave),
        ),
        lighthouseSeo: Math.max(
          0,
          Math.min(100, seed.lighthouseSeo + wave * 0.6),
        ),
        healthScore: Math.max(
          0,
          Math.min(100, website.performance.healthScore + Math.round(wave)),
        ),
        lcp: Math.max(0, seed.lcp + wave * 0.05),
        inp: Math.max(0, seed.inp + wave * 5),
        cls: Math.max(0, seed.cls + wave * 0.004),
      };
    });
}

function provinceForLocation(location: string) {
  if (location === "Majene") return "Sulawesi Barat";
  return "Sulawesi Selatan";
}

function buildVisitorLocations(website: WebsiteMonitoringItem) {
  const primary = provinceForLocation(website.location);
  const rows = [
    { location: primary, share: 0.7 },
    {
      location:
        primary === "Sulawesi Selatan" ? "Sulawesi Barat" : "Sulawesi Selatan",
      share: 0.12,
    },
    { location: "DKI Jakarta", share: 0.08 },
    { location: "Jawa Barat", share: 0.04 },
    { location: "Lainnya", share: 0.06 },
  ];
  const totalShare = rows.reduce((total, row) => total + row.share, 0) || 1;
  return rows.map((row) => ({
    location: row.location,
    visitors: Math.round(
      website.metrics.uniqueVisitors * (row.share / totalShare),
    ),
    percentage: (row.share / totalShare) * 100,
  }));
}

export class LocalMonitoringRepository implements MonitoringRepository {
  async getOverview(range: DateRange): Promise<MonitoringOverview> {
    const previousRange = getPreviousDateRange(range);
    const websites = websiteSeeds.map((seed) => buildWebsiteItem(seed, range));
    const totals = sumMetrics(websites.map((website) => website.metrics));
    const previousTotals = sumMetrics(
      websites.map((website) => website.previousMetrics),
    );
    const dates = createDateSeries(range.from, range.to);
    const previousDates = createDateSeries(
      previousRange.from,
      previousRange.to,
    );
    const allSeries = websiteSeeds.map((seed) => trendsForRange(seed, range));
    const previousSeries = websiteSeeds.map((seed) =>
      trendsForRange(seed, previousRange),
    );
    const alerts = enrichAlerts(websites);
    const statusCounts = buildStatusCounts(websites);
    const topQueries = websites
      .flatMap((website) => {
        const seed = seedForSlug(website.slug);
        return seed ? buildSearchQueries(seed, website) : [];
      })
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 7);

    return {
      range,
      previousRange,
      updatedAt: DATA_AS_OF,
      totals,
      previousTotals,
      kpis: buildKpis(totals, previousTotals, statusCounts),
      websites,
      dailyTrends: aggregateDailyByDate(allSeries, dates),
      previousDailyTrends: aggregateDailyByDate(previousSeries, previousDates),
      trafficSources: buildTrafficSources(websites),
      searchSummary: buildSearchSummary(totals, websites),
      topQueries,
      funnel: buildFunnel(websites, totals),
      healthSummary: buildHealthSummary(websites),
      alerts,
      statusCounts,
    };
  }

  async getWebsites(range: DateRange): Promise<WebsiteMonitoringItem[]> {
    return websiteSeeds.map((seed) => buildWebsiteItem(seed, range));
  }

  async getWebsiteBySlug(
    slug: string,
    range: DateRange,
  ): Promise<WebsiteDetail | null> {
    const seed = seedForSlug(slug);
    if (!seed) return null;
    const website = buildWebsiteItem(seed, range);
    const previousRange = getPreviousDateRange(range);
    const dailyTrends = trendsForRange(seed, range);
    const previousDailyTrends = trendsForRange(seed, previousRange);
    const landingPages = buildLandingPages(seed, website);
    return {
      ...website,
      range,
      previousRange,
      dailyTrends,
      previousDailyTrends,
      trafficSources: buildTrafficSources([website]),
      devices: buildDevices(seed, website),
      searchQueries: buildSearchQueries(seed, website),
      landingPages,
      ctaLocations: buildCtaLocations(seed, website),
      performanceHistory: buildPerformanceHistory(seed, website, range),
      alerts: enrichAlerts([website]).filter(
        (alert) => alert.websiteSlug === slug,
      ),
      notes: monitoringNoteSeeds.filter((note) => note.websiteSlug === slug),
      visitorLocations: buildVisitorLocations(website),
    };
  }
}

export const monitoringRepository = new LocalMonitoringRepository();

export const monitoringDatePresets: Array<{
  value: DateRangePreset;
  label: string;
}> = [
  { value: "all", label: "Semua data" },
  { value: "7d", label: "7 hari" },
  { value: "28d", label: "28 hari" },
  { value: "90d", label: "90 hari" },
  { value: "12m", label: "12 bulan" },
  { value: "custom", label: "Custom range" },
];

export function emptyMonitoringMetrics(): WebsiteMetrics {
  return { ...emptyMetrics };
}
