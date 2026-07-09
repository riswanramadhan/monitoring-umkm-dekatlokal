export type WebsiteStatus = "live" | "attention" | "critical";

export type WebsiteType = "umkm" | "sociopreneur";

export type DateRangePreset = "all" | "7d" | "28d" | "90d" | "12m" | "custom";

export interface DateRange {
  preset: DateRangePreset;
  from: string;
  to: string;
  label: string;
  days: number;
}

export interface WebsiteMetrics {
  uniqueVisitors: number;
  sessions: number;
  pageViews: number;
  searchImpressions: number;
  organicClicks: number;
  searchCtr: number;
  averagePosition: number;
  whatsappClicks: number;
  uniqueWhatsappClickers: number;
  whatsappConversionRate: number;
  engagementRate: number;
  averageEngagementTime: number;
  indexedPages: number;
  totalPages: number;
}

export interface WebsitePerformance {
  uptime: number;
  lighthousePerformance: number;
  lighthouseSeo: number;
  lighthouseAccessibility: number;
  lighthouseBestPractices: number;
  lcp: number;
  inp: number;
  cls: number;
  healthScore: number;
}

export interface MonthlyGoogleVisit {
  month: string;
  label: string;
  visits: number;
}

export interface WebsiteMonitoringItem {
  id: string;
  slug: string;
  name: string;
  domain: string | null;
  category: string;
  type: WebsiteType;
  location: string;
  status: WebsiteStatus;
  launchedAt: string | null;
  googleIndexedAt: string;
  googleVisitsTotal: number;
  logoSrc: string;
  monthlyGoogleVisits: MonthlyGoogleVisit[];
  metrics: WebsiteMetrics;
  previousMetrics: WebsiteMetrics;
  performance: WebsitePerformance;
  trendPercentage: number;
}

export type MonitoringMetricKey =
  | "uniqueVisitors"
  | "pageViews"
  | "searchImpressions"
  | "organicClicks"
  | "whatsappClicks";

export interface DailyTrendPoint {
  date: string;
  uniqueVisitors: number;
  sessions: number;
  pageViews: number;
  searchImpressions: number;
  organicClicks: number;
  whatsappClicks: number;
  uniqueWhatsappClickers: number;
  averagePosition: number;
  engagementRate: number;
  averageEngagementTime: number;
}

export interface TrafficSource {
  source: "Organic Search" | "Direct" | "Instagram" | "WhatsApp" | "Lainnya";
  visitors: number;
  percentage: number;
  changePercentage: number;
}

export interface DeviceBreakdown {
  device: "Mobile" | "Desktop" | "Tablet";
  visitors: number;
  percentage: number;
}

export type CtaLocation =
  "navbar" | "hero" | "product" | "floating" | "footer" | "package";

export interface CtaLocationMetric {
  location: CtaLocation;
  label: string;
  clicks: number;
  uniqueClickers: number;
  conversionRate: number;
  percentage: number;
}

export interface SearchQueryMetric {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  trendPercentage: number;
  opportunity?: boolean;
}

export interface LandingPageMetric {
  path: string;
  title: string;
  visitors: number;
  pageViews: number;
  whatsappClicks: number;
  conversionRate: number;
}

export interface WebsiteAlert {
  id: string;
  websiteSlug: string;
  websiteName: string;
  severity: "info" | "warning" | "critical";
  issue: string;
  detectedAt: string;
  category:
    "performance" | "seo" | "tracking" | "uptime" | "traffic" | "conversion";
}

export interface MonitoringNote {
  id: string;
  websiteSlug: string;
  title: string;
  status: "open" | "done";
  priority: "low" | "medium" | "high";
  createdAt: string;
  assignee: string;
}

export interface PerformanceHistoryPoint {
  date: string;
  uptime: number;
  lighthousePerformance: number;
  lighthouseSeo: number;
  healthScore: number;
  lcp: number;
  inp: number;
  cls: number;
}

export interface MonitoringKpi {
  id: string;
  label: string;
  value: string;
  fullValue: string;
  helper?: string;
  changePercentage?: number;
  tone?: "blue" | "green" | "amber" | "red";
  iconKey:
    | "globe"
    | "users"
    | "pages"
    | "search"
    | "click"
    | "whatsapp"
    | "conversion"
    | "position";
  tooltip?: string;
  numericValue?: number;
  numericFormat?: "number" | "compact" | "percent" | "decimal";
  numericDecimals?: number;
}

export interface WhatsappFunnel {
  pageViews: number;
  uniqueVisitors: number;
  ctaViews: number;
  whatsappClicks: number;
  uniqueWhatsappClickers: number;
  conversionRate: number;
  bestWebsiteName: string;
  bestWebsiteRate: number;
  bestLocationLabel: string;
}

export interface SearchPerformanceSummary {
  searchImpressions: number;
  organicClicks: number;
  ctr: number;
  averagePosition: number;
  indexedPages: number;
  activeQueries: number;
}

export interface HealthSummary {
  healthy: number;
  attention: number;
  critical: number;
  unchecked: number;
}

export interface MonitoringOverview {
  range: DateRange;
  previousRange: DateRange;
  updatedAt: string;
  totals: WebsiteMetrics;
  previousTotals: WebsiteMetrics;
  kpis: MonitoringKpi[];
  websites: WebsiteMonitoringItem[];
  dailyTrends: DailyTrendPoint[];
  previousDailyTrends: DailyTrendPoint[];
  trafficSources: TrafficSource[];
  searchSummary: SearchPerformanceSummary;
  topQueries: SearchQueryMetric[];
  funnel: WhatsappFunnel;
  healthSummary: HealthSummary;
  alerts: WebsiteAlert[];
  statusCounts: {
    total: number;
    live: number;
    attention: number;
    critical: number;
  };
}

export interface WebsiteDetail extends WebsiteMonitoringItem {
  range: DateRange;
  previousRange: DateRange;
  dailyTrends: DailyTrendPoint[];
  previousDailyTrends: DailyTrendPoint[];
  trafficSources: TrafficSource[];
  devices: DeviceBreakdown[];
  searchQueries: SearchQueryMetric[];
  landingPages: LandingPageMetric[];
  ctaLocations: CtaLocationMetric[];
  performanceHistory: PerformanceHistoryPoint[];
  alerts: WebsiteAlert[];
  notes: MonitoringNote[];
  visitorLocations: Array<{
    location: string;
    visitors: number;
    percentage: number;
  }>;
}

export interface MonitoringRepository {
  getOverview(range: DateRange): Promise<MonitoringOverview>;
  getWebsites(range: DateRange): Promise<WebsiteMonitoringItem[]>;
  getWebsiteBySlug(
    slug: string,
    range: DateRange,
  ): Promise<WebsiteDetail | null>;
}

export type TrackingEventName =
  | "whatsapp_cta_click"
  | "website_view"
  | "product_view"
  | "instagram_click"
  | "marketplace_click"
  | "maps_click"
  | "phone_click"
  | "email_click";

export interface WhatsappCtaClickEventParams {
  website_slug: string;
  website_name: string;
  page_path: string;
  cta_location: CtaLocation;
  device_category: "mobile" | "desktop" | "tablet";
}

export interface TrackingEventDraft {
  name: TrackingEventName;
  params:
    | WhatsappCtaClickEventParams
    | Record<string, string | number | boolean | null>;
}
