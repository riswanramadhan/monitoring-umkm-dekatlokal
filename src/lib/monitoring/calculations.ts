import type {
  DailyTrendPoint,
  WebsiteMetrics,
  WebsitePerformance,
} from "@/types/monitoring";

export const emptyMetrics: WebsiteMetrics = {
  uniqueVisitors: 0,
  sessions: 0,
  pageViews: 0,
  searchImpressions: 0,
  organicClicks: 0,
  searchCtr: 0,
  averagePosition: 0,
  whatsappClicks: 0,
  uniqueWhatsappClickers: 0,
  whatsappConversionRate: 0,
  engagementRate: 0,
  averageEngagementTime: 0,
  indexedPages: 0,
  totalPages: 0,
};

export function calculatePercentageChange(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

export function calculateSearchCtr(clicks: number, impressions: number) {
  if (impressions <= 0) return 0;
  return (clicks / impressions) * 100;
}

export function calculateWhatsappConversionRate(
  uniqueWhatsappClickers: number,
  uniqueVisitors: number,
) {
  if (uniqueVisitors <= 0) return 0;
  return (uniqueWhatsappClickers / uniqueVisitors) * 100;
}

export function sumMetrics(metrics: WebsiteMetrics[]): WebsiteMetrics {
  const summed = metrics.reduce(
    (total, item) => ({
      uniqueVisitors: total.uniqueVisitors + item.uniqueVisitors,
      sessions: total.sessions + item.sessions,
      pageViews: total.pageViews + item.pageViews,
      searchImpressions: total.searchImpressions + item.searchImpressions,
      organicClicks: total.organicClicks + item.organicClicks,
      searchCtr: 0,
      averagePosition:
        total.averagePosition +
        item.averagePosition * Math.max(item.searchImpressions, 1),
      whatsappClicks: total.whatsappClicks + item.whatsappClicks,
      uniqueWhatsappClickers:
        total.uniqueWhatsappClickers + item.uniqueWhatsappClickers,
      whatsappConversionRate: 0,
      engagementRate:
        total.engagementRate + item.engagementRate * Math.max(item.sessions, 1),
      averageEngagementTime:
        total.averageEngagementTime +
        item.averageEngagementTime * Math.max(item.sessions, 1),
      indexedPages: total.indexedPages + item.indexedPages,
      totalPages: total.totalPages + item.totalPages,
    }),
    { ...emptyMetrics },
  );
  const impressionWeight = metrics.reduce(
    (total, item) => total + Math.max(item.searchImpressions, 1),
    0,
  );
  const sessionWeight = metrics.reduce(
    (total, item) => total + Math.max(item.sessions, 1),
    0,
  );
  return {
    ...summed,
    searchCtr: calculateSearchCtr(
      summed.organicClicks,
      summed.searchImpressions,
    ),
    whatsappConversionRate: calculateWhatsappConversionRate(
      summed.uniqueWhatsappClickers,
      summed.uniqueVisitors,
    ),
    averagePosition: impressionWeight
      ? summed.averagePosition / impressionWeight
      : 0,
    engagementRate: sessionWeight ? summed.engagementRate / sessionWeight : 0,
    averageEngagementTime: sessionWeight
      ? summed.averageEngagementTime / sessionWeight
      : 0,
  };
}

export function aggregateDailyTrends(
  points: DailyTrendPoint[],
): WebsiteMetrics {
  const metrics = points.reduce(
    (total, point) => ({
      uniqueVisitors: total.uniqueVisitors + point.uniqueVisitors,
      sessions: total.sessions + point.sessions,
      pageViews: total.pageViews + point.pageViews,
      searchImpressions: total.searchImpressions + point.searchImpressions,
      organicClicks: total.organicClicks + point.organicClicks,
      searchCtr: 0,
      averagePosition:
        total.averagePosition +
        point.averagePosition * Math.max(point.searchImpressions, 1),
      whatsappClicks: total.whatsappClicks + point.whatsappClicks,
      uniqueWhatsappClickers:
        total.uniqueWhatsappClickers + point.uniqueWhatsappClickers,
      whatsappConversionRate: 0,
      engagementRate:
        total.engagementRate +
        point.engagementRate * Math.max(point.sessions, 1),
      averageEngagementTime:
        total.averageEngagementTime +
        point.averageEngagementTime * Math.max(point.sessions, 1),
      indexedPages: total.indexedPages,
      totalPages: total.totalPages,
    }),
    { ...emptyMetrics },
  );
  const impressionWeight = points.reduce(
    (total, point) => total + Math.max(point.searchImpressions, 1),
    0,
  );
  const sessionWeight = points.reduce(
    (total, point) => total + Math.max(point.sessions, 1),
    0,
  );
  return {
    ...metrics,
    searchCtr: calculateSearchCtr(
      metrics.organicClicks,
      metrics.searchImpressions,
    ),
    averagePosition: impressionWeight
      ? metrics.averagePosition / impressionWeight
      : 0,
    whatsappConversionRate: calculateWhatsappConversionRate(
      metrics.uniqueWhatsappClickers,
      metrics.uniqueVisitors,
    ),
    engagementRate: sessionWeight ? metrics.engagementRate / sessionWeight : 0,
    averageEngagementTime: sessionWeight
      ? metrics.averageEngagementTime / sessionWeight
      : 0,
  };
}

export function calculateCompositeHealthScore({
  uptime,
  coreWebVitalsScore,
  seoReadiness,
  trafficTrend,
  trackingCompleteness,
}: {
  uptime: number;
  coreWebVitalsScore: number;
  seoReadiness: number;
  trafficTrend: number;
  trackingCompleteness: number;
}) {
  const trendScore = Math.max(0, Math.min(100, 70 + trafficTrend));
  return Math.round(
    uptime * 0.25 +
      coreWebVitalsScore * 0.2 +
      seoReadiness * 0.2 +
      trendScore * 0.2 +
      trackingCompleteness * 0.15,
  );
}

export function coreWebVitalsScore(
  performance: Pick<WebsitePerformance, "lcp" | "inp" | "cls">,
) {
  const lcpScore =
    performance.lcp <= 2.5 ? 100 : performance.lcp <= 4 ? 72 : 38;
  const inpScore =
    performance.inp <= 200 ? 100 : performance.inp <= 500 ? 72 : 38;
  const clsScore =
    performance.cls <= 0.1 ? 100 : performance.cls <= 0.25 ? 72 : 38;
  return Math.round((lcpScore + inpScore + clsScore) / 3);
}

export function getHealthLabel(value: number) {
  if (value >= 85) return "Sangat Baik";
  if (value >= 70) return "Baik";
  if (value >= 50) return "Perlu Perhatian";
  return "Bermasalah";
}

export function getHealthBadgeVariant(value: number) {
  if (value >= 85) return "success" as const;
  if (value >= 70) return "neutral" as const;
  if (value >= 50) return "warning" as const;
  return "danger" as const;
}

export function getCoreWebVitalStatus(
  metric: "lcp" | "inp" | "cls",
  value: number,
) {
  if (metric === "lcp") {
    if (value <= 2.5) return "Good";
    if (value <= 4) return "Needs Improvement";
    return "Poor";
  }
  if (metric === "inp") {
    if (value <= 200) return "Good";
    if (value <= 500) return "Needs Improvement";
    return "Poor";
  }
  if (value <= 0.1) return "Good";
  if (value <= 0.25) return "Needs Improvement";
  return "Poor";
}
