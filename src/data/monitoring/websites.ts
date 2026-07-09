import type {
  CtaLocation,
  MonthlyGoogleVisit,
  WebsiteStatus,
  WebsiteType,
} from "@/types/monitoring";

export interface LocalWebsiteSeed {
  id: string;
  slug: string;
  name: string;
  domain: string;
  category: string;
  type: WebsiteType;
  location: string;
  status: WebsiteStatus;
  launchedAt: string;
  googleIndexedAt: string;
  googleVisitsTotal: number;
  logoSrc: string;
  pagesPerSession: number;
  searchCtr: number;
  averagePosition: number;
  whatsappConversion: number;
  trafficGrowth: number;
  engagementRate: number;
  averageEngagementTime: number;
  indexedPages: number;
  totalPages: number;
  uptime: number;
  lighthousePerformance: number;
  lighthouseSeo: number;
  lighthouseAccessibility: number;
  lighthouseBestPractices: number;
  lcp: number;
  inp: number;
  cls: number;
  trackingCompleteness: number;
  sourceShares: Record<string, number>;
  deviceShares: Record<"Mobile" | "Desktop" | "Tablet", number>;
  ctaShares: Record<CtaLocation, number>;
  topPages: Array<{ path: string; title: string; share: number }>;
}

export const MONITORING_TODAY = "2026-07-09";

const standardSources = {
  "Organic Search": 0.66,
  Direct: 0.16,
  Instagram: 0.1,
  WhatsApp: 0.05,
  Lainnya: 0.03,
};

const socialSources = {
  "Organic Search": 0.56,
  Direct: 0.14,
  Instagram: 0.22,
  WhatsApp: 0.05,
  Lainnya: 0.03,
};

const searchLedSources = {
  "Organic Search": 0.72,
  Direct: 0.13,
  Instagram: 0.07,
  WhatsApp: 0.05,
  Lainnya: 0.03,
};

const defaultDevices = { Mobile: 0.74, Desktop: 0.19, Tablet: 0.07 };

const defaultCta = {
  navbar: 0.17,
  hero: 0.29,
  product: 0.22,
  floating: 0.18,
  footer: 0.08,
  package: 0.06,
};

function pages(productLabel: string) {
  return [{ path: "/", title: productLabel, share: 1 }];
}

export const websiteSeeds: LocalWebsiteSeed[] = [
  {
    id: "web-001",
    slug: "aroma-bakery",
    name: "Aroma Bakery",
    domain: "aromabakery.dekatlokal.com",
    category: "Bakery",
    type: "umkm",
    location: "Makassar",
    status: "live",
    launchedAt: "2026-03-22T09:00:00+08:00",
    googleIndexedAt: "2026-03-22",
    googleVisitsTotal: 121,
    logoSrc: "/aroma-bakery.webp",
    pagesPerSession: 2.18,
    searchCtr: 0.061,
    averagePosition: 8.42,
    whatsappConversion: 0.064,
    trafficGrowth: 14,
    engagementRate: 64,
    averageEngagementTime: 118,
    indexedPages: 1,
    totalPages: 1,
    uptime: 99.93,
    lighthousePerformance: 88,
    lighthouseSeo: 89,
    lighthouseAccessibility: 93,
    lighthouseBestPractices: 91,
    lcp: 2.3,
    inp: 172,
    cls: 0.06,
    trackingCompleteness: 94,
    sourceShares: standardSources,
    deviceShares: defaultDevices,
    ctaShares: { ...defaultCta, hero: 0.33, footer: 0.05 },
    topPages: pages("Roti dan Kue"),
  },
  {
    id: "web-002",
    slug: "bio-atama",
    name: "Bio Atama",
    domain: "bioatama.dekatlokal.com",
    category: "Pertanian",
    type: "umkm",
    location: "Gowa",
    status: "live",
    launchedAt: "2026-03-25T09:00:00+08:00",
    googleIndexedAt: "2026-03-25",
    googleVisitsTotal: 221,
    logoSrc: "/bio-atama.webp",
    pagesPerSession: 2.04,
    searchCtr: 0.047,
    averagePosition: 11.76,
    whatsappConversion: 0.039,
    trafficGrowth: 6,
    engagementRate: 58,
    averageEngagementTime: 102,
    indexedPages: 1,
    totalPages: 1,
    uptime: 99.71,
    lighthousePerformance: 73,
    lighthouseSeo: 71,
    lighthouseAccessibility: 88,
    lighthouseBestPractices: 84,
    lcp: 3.3,
    inp: 246,
    cls: 0.13,
    trackingCompleteness: 82,
    sourceShares: searchLedSources,
    deviceShares: { Mobile: 0.7, Desktop: 0.23, Tablet: 0.07 },
    ctaShares: { ...defaultCta, product: 0.27, floating: 0.14 },
    topPages: pages("Produk Organik"),
  },
  {
    id: "web-003",
    slug: "kira-kira-michi",
    name: "Kira Kira Michi",
    domain: "kirakiramichi.dekatlokal.com",
    category: "Merchandise",
    type: "umkm",
    location: "Makassar",
    status: "live",
    launchedAt: "2026-03-29T09:00:00+08:00",
    googleIndexedAt: "2026-03-29",
    googleVisitsTotal: 201,
    logoSrc: "/kira-kira-michi.webp",
    pagesPerSession: 2.23,
    searchCtr: 0.055,
    averagePosition: 9.58,
    whatsappConversion: 0.056,
    trafficGrowth: 12,
    engagementRate: 63,
    averageEngagementTime: 114,
    indexedPages: 1,
    totalPages: 1,
    uptime: 99.9,
    lighthousePerformance: 84,
    lighthouseSeo: 83,
    lighthouseAccessibility: 91,
    lighthouseBestPractices: 90,
    lcp: 2.5,
    inp: 188,
    cls: 0.08,
    trackingCompleteness: 91,
    sourceShares: socialSources,
    deviceShares: defaultDevices,
    ctaShares: { ...defaultCta, product: 0.28, hero: 0.26 },
    topPages: pages("Merchandise Custom"),
  },
  {
    id: "web-004",
    slug: "iboo-idn",
    name: "Iboo IDN",
    domain: "ibooidn.dekatlokal.com",
    category: "Fashion",
    type: "umkm",
    location: "Makassar",
    status: "live",
    launchedAt: "2026-04-15T09:00:00+08:00",
    googleIndexedAt: "2026-04-15",
    googleVisitsTotal: 102,
    logoSrc: "/iboo-idn.webp",
    pagesPerSession: 2.08,
    searchCtr: 0.046,
    averagePosition: 12.18,
    whatsappConversion: 0.044,
    trafficGrowth: 5,
    engagementRate: 59,
    averageEngagementTime: 106,
    indexedPages: 1,
    totalPages: 1,
    uptime: 99.86,
    lighthousePerformance: 81,
    lighthouseSeo: 80,
    lighthouseAccessibility: 89,
    lighthouseBestPractices: 88,
    lcp: 2.8,
    inp: 205,
    cls: 0.09,
    trackingCompleteness: 89,
    sourceShares: socialSources,
    deviceShares: defaultDevices,
    ctaShares: defaultCta,
    topPages: pages("Katalog Fashion"),
  },
  {
    id: "web-005",
    slug: "minyak-pamboang",
    name: "Minyak Pamboang",
    domain: "minyakpamboang.dekatlokal.com",
    category: "Minyak Tradisional",
    type: "umkm",
    location: "Majene",
    status: "live",
    launchedAt: "2026-05-15T09:00:00+08:00",
    googleIndexedAt: "2026-05-15",
    googleVisitsTotal: 166,
    logoSrc: "/minyak-pamboang.webp",
    pagesPerSession: 2.02,
    searchCtr: 0.043,
    averagePosition: 13.64,
    whatsappConversion: 0.04,
    trafficGrowth: 7,
    engagementRate: 57,
    averageEngagementTime: 98,
    indexedPages: 1,
    totalPages: 1,
    uptime: 99.54,
    lighthousePerformance: 69,
    lighthouseSeo: 72,
    lighthouseAccessibility: 86,
    lighthouseBestPractices: 82,
    lcp: 3.7,
    inp: 312,
    cls: 0.15,
    trackingCompleteness: 80,
    sourceShares: searchLedSources,
    deviceShares: defaultDevices,
    ctaShares: { ...defaultCta, footer: 0.12, floating: 0.15 },
    topPages: pages("Minyak Pamboang"),
  },
  {
    id: "web-006",
    slug: "kopi-teko",
    name: "Kopi Teko",
    domain: "kopiteko.dekatlokal.com",
    category: "Kopi",
    type: "umkm",
    location: "Makassar",
    status: "live",
    launchedAt: "2026-05-22T09:00:00+08:00",
    googleIndexedAt: "2026-05-22",
    googleVisitsTotal: 312,
    logoSrc: "/kopi-teko.webp",
    pagesPerSession: 2.28,
    searchCtr: 0.072,
    averagePosition: 7.18,
    whatsappConversion: 0.061,
    trafficGrowth: 18,
    engagementRate: 66,
    averageEngagementTime: 128,
    indexedPages: 1,
    totalPages: 1,
    uptime: 99.95,
    lighthousePerformance: 90,
    lighthouseSeo: 88,
    lighthouseAccessibility: 94,
    lighthouseBestPractices: 92,
    lcp: 2.1,
    inp: 154,
    cls: 0.04,
    trackingCompleteness: 95,
    sourceShares: { ...searchLedSources, Instagram: 0.14, Direct: 0.17 },
    deviceShares: defaultDevices,
    ctaShares: { ...defaultCta, hero: 0.33, floating: 0.2 },
    topPages: pages("Menu Kopi"),
  },
  {
    id: "web-007",
    slug: "eyfa-natural-oil",
    name: "Eyfa Natural Oil",
    domain: "eyfa.dekatlokal.com",
    category: "Kesehatan",
    type: "umkm",
    location: "Gowa",
    status: "live",
    launchedAt: "2026-06-17T09:00:00+08:00",
    googleIndexedAt: "2026-06-17",
    googleVisitsTotal: 89,
    logoSrc: "/eyfa-natural-oil.webp",
    pagesPerSession: 2.16,
    searchCtr: 0.057,
    averagePosition: 10.36,
    whatsappConversion: 0.065,
    trafficGrowth: 16,
    engagementRate: 64,
    averageEngagementTime: 116,
    indexedPages: 1,
    totalPages: 1,
    uptime: 99.88,
    lighthousePerformance: 82,
    lighthouseSeo: 84,
    lighthouseAccessibility: 91,
    lighthouseBestPractices: 90,
    lcp: 2.6,
    inp: 190,
    cls: 0.07,
    trackingCompleteness: 92,
    sourceShares: standardSources,
    deviceShares: defaultDevices,
    ctaShares: { ...defaultCta, product: 0.3, hero: 0.27 },
    topPages: pages("Natural Oil"),
  },
  {
    id: "web-008",
    slug: "mulkan-mimbaun",
    name: "Mulkan Mimba'un",
    domain: "mulkanmimbaun.dekatlokal.com",
    category: "Herbal",
    type: "umkm",
    location: "Gowa",
    status: "live",
    launchedAt: "2026-06-10T09:00:00+08:00",
    googleIndexedAt: "2026-06-10",
    googleVisitsTotal: 77,
    logoSrc: "/mulkan-mimbaun.webp",
    pagesPerSession: 1.9,
    searchCtr: 0.039,
    averagePosition: 16.18,
    whatsappConversion: 0.032,
    trafficGrowth: -4,
    engagementRate: 52,
    averageEngagementTime: 88,
    indexedPages: 1,
    totalPages: 1,
    uptime: 99.28,
    lighthousePerformance: 63,
    lighthouseSeo: 61,
    lighthouseAccessibility: 82,
    lighthouseBestPractices: 79,
    lcp: 4.1,
    inp: 372,
    cls: 0.18,
    trackingCompleteness: 69,
    sourceShares: standardSources,
    deviceShares: { Mobile: 0.77, Desktop: 0.16, Tablet: 0.07 },
    ctaShares: { ...defaultCta, footer: 0.14, hero: 0.25 },
    topPages: pages("Produk Herbal"),
  },
  {
    id: "web-009",
    slug: "rumah-keripik",
    name: "Rumah Keripik",
    domain: "rumahkeripik.dekatlokal.com",
    category: "Camilan",
    type: "umkm",
    location: "Gowa",
    status: "live",
    launchedAt: "2026-06-22T09:00:00+08:00",
    googleIndexedAt: "2026-06-22",
    googleVisitsTotal: 45,
    logoSrc: "/rumah-keripik.webp",
    pagesPerSession: 1.82,
    searchCtr: 0.035,
    averagePosition: 17.42,
    whatsappConversion: 0.024,
    trafficGrowth: -9,
    engagementRate: 49,
    averageEngagementTime: 78,
    indexedPages: 1,
    totalPages: 1,
    uptime: 98.14,
    lighthousePerformance: 56,
    lighthouseSeo: 58,
    lighthouseAccessibility: 76,
    lighthouseBestPractices: 74,
    lcp: 4.7,
    inp: 510,
    cls: 0.26,
    trackingCompleteness: 55,
    sourceShares: standardSources,
    deviceShares: { Mobile: 0.8, Desktop: 0.13, Tablet: 0.07 },
    ctaShares: { ...defaultCta, floating: 0.1, footer: 0.15 },
    topPages: pages("Keripik Pisang"),
  },
  {
    id: "web-010",
    slug: "kareppe-crunch",
    name: "Kareppe Crunch",
    domain: "kareppecrunch.dekatlokal.com",
    category: "Camilan",
    type: "umkm",
    location: "Makassar",
    status: "live",
    launchedAt: "2026-04-27T09:00:00+08:00",
    googleIndexedAt: "2026-04-27",
    googleVisitsTotal: 271,
    logoSrc: "/logo-kareppe-transparent.webp",
    pagesPerSession: 2.19,
    searchCtr: 0.063,
    averagePosition: 8.72,
    whatsappConversion: 0.052,
    trafficGrowth: 13,
    engagementRate: 62,
    averageEngagementTime: 112,
    indexedPages: 1,
    totalPages: 1,
    uptime: 99.87,
    lighthousePerformance: 83,
    lighthouseSeo: 84,
    lighthouseAccessibility: 90,
    lighthouseBestPractices: 89,
    lcp: 2.6,
    inp: 192,
    cls: 0.08,
    trackingCompleteness: 91,
    sourceShares: { ...standardSources, Instagram: 0.19, Direct: 0.18 },
    deviceShares: defaultDevices,
    ctaShares: defaultCta,
    topPages: pages("Kareppe Crunch"),
  },
  {
    id: "web-011",
    slug: "gingerfitplus",
    name: "Ginger Fit Plus",
    domain: "gingerfitplus.dekatlokal.com",
    category: "Minuman Sehat",
    type: "umkm",
    location: "Makassar",
    status: "live",
    launchedAt: "2026-06-27T09:00:00+08:00",
    googleIndexedAt: "2026-06-27",
    googleVisitsTotal: 101,
    logoSrc: "/gingerfit-plus.webp",
    pagesPerSession: 2.26,
    searchCtr: 0.073,
    averagePosition: 6.82,
    whatsappConversion: 0.071,
    trafficGrowth: 22,
    engagementRate: 68,
    averageEngagementTime: 132,
    indexedPages: 1,
    totalPages: 1,
    uptime: 99.94,
    lighthousePerformance: 89,
    lighthouseSeo: 90,
    lighthouseAccessibility: 94,
    lighthouseBestPractices: 92,
    lcp: 2.1,
    inp: 152,
    cls: 0.04,
    trackingCompleteness: 96,
    sourceShares: searchLedSources,
    deviceShares: defaultDevices,
    ctaShares: { ...defaultCta, hero: 0.35, product: 0.24 },
    topPages: pages("Gingershot"),
  },
  {
    id: "web-012",
    slug: "bakpia-malino",
    name: "Bakpia Malino",
    domain: "bakpiamalino.dekatlokal.com",
    category: "Oleh-oleh",
    type: "umkm",
    location: "Gowa",
    status: "live",
    launchedAt: "2026-06-28T09:00:00+08:00",
    googleIndexedAt: "2026-06-28",
    googleVisitsTotal: 116,
    logoSrc: "/bakpia-malino.webp",
    pagesPerSession: 2.17,
    searchCtr: 0.07,
    averagePosition: 7.54,
    whatsappConversion: 0.058,
    trafficGrowth: 19,
    engagementRate: 65,
    averageEngagementTime: 120,
    indexedPages: 1,
    totalPages: 1,
    uptime: 99.91,
    lighthousePerformance: 86,
    lighthouseSeo: 88,
    lighthouseAccessibility: 92,
    lighthouseBestPractices: 91,
    lcp: 2.4,
    inp: 176,
    cls: 0.06,
    trackingCompleteness: 93,
    sourceShares: searchLedSources,
    deviceShares: defaultDevices,
    ctaShares: defaultCta,
    topPages: pages("Bakpia Malino"),
  },
  {
    id: "web-013",
    slug: "dapur-karaeng",
    name: "Dapur Karaeng",
    domain: "dapurkaraeng.dekatlokal.com",
    category: "Kuliner",
    type: "umkm",
    location: "Gowa",
    status: "live",
    launchedAt: "2026-07-05T09:00:00+08:00",
    googleIndexedAt: "2026-07-05",
    googleVisitsTotal: 12,
    logoSrc: "/dapur-karaeng.jpg",
    pagesPerSession: 1.86,
    searchCtr: 0.041,
    averagePosition: 18.86,
    whatsappConversion: 0.035,
    trafficGrowth: 9,
    engagementRate: 51,
    averageEngagementTime: 82,
    indexedPages: 1,
    totalPages: 1,
    uptime: 99.76,
    lighthousePerformance: 74,
    lighthouseSeo: 70,
    lighthouseAccessibility: 86,
    lighthouseBestPractices: 83,
    lcp: 3.2,
    inp: 260,
    cls: 0.13,
    trackingCompleteness: 78,
    sourceShares: socialSources,
    deviceShares: { Mobile: 0.78, Desktop: 0.15, Tablet: 0.07 },
    ctaShares: { ...defaultCta, product: 0.26, hero: 0.27 },
    topPages: pages("Menu Dapur"),
  },
];

const dayMs = 86_400_000;

function toUtcDate(date: string) {
  return new Date(`${date}T00:00:00.000Z`);
}

function addDays(date: string, offset: number) {
  const next = new Date(toUtcDate(date).getTime() + offset * dayMs);
  return next.toISOString().slice(0, 10);
}

function daysBetween(from: string, to: string) {
  return (
    Math.floor((toUtcDate(to).getTime() - toUtcDate(from).getTime()) / dayMs) +
    1
  );
}

function daysInMonth(year: number, month: number) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function monthKey(date: string) {
  return date.slice(0, 7);
}

function nextMonth(key: string) {
  const [rawYear, rawMonth] = key.split("-").map(Number);
  const year = rawYear ?? 2026;
  const month = rawMonth ?? 1;
  const next = new Date(Date.UTC(year, month, 1));
  return next.toISOString().slice(0, 7);
}

function monthLabel(key: string) {
  return new Intl.DateTimeFormat("id-ID", {
    month: "short",
    year: "numeric",
    timeZone: "Asia/Makassar",
  }).format(new Date(`${key}-01T00:00:00+08:00`));
}

function seedPhase(seed: Pick<LocalWebsiteSeed, "slug">) {
  return seed.slug
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0);
}

export function allocateIntegerTotal(values: number[], total: number) {
  if (!values.length) return [];
  const safeTotal = Math.max(0, Math.round(total));
  const weightTotal = values.reduce(
    (sum, value) => sum + Math.max(value, 0),
    0,
  );
  if (weightTotal <= 0) {
    const result = Array.from({ length: values.length }, () => 0);
    result[0] = safeTotal;
    return result;
  }
  const raw = values.map(
    (value) => (Math.max(value, 0) / weightTotal) * safeTotal,
  );
  const result = raw.map(Math.floor);
  let remainder = safeTotal - result.reduce((sum, value) => sum + value, 0);
  const order = raw
    .map((value, index) => ({ index, fraction: value - Math.floor(value) }))
    .sort((a, b) => b.fraction - a.fraction || a.index - b.index);
  for (let i = 0; i < order.length && remainder > 0; i += 1) {
    const targetIndex = order[i]?.index ?? 0;
    result[targetIndex] = (result[targetIndex] ?? 0) + 1;
    remainder -= 1;
  }
  return result;
}

export function getMonthlyGoogleVisits(
  seed: Pick<
    LocalWebsiteSeed,
    "googleIndexedAt" | "googleVisitsTotal" | "slug"
  >,
): MonthlyGoogleVisit[] {
  const start = monthKey(seed.googleIndexedAt);
  const end = monthKey(MONITORING_TODAY);
  const months: string[] = [];
  for (let current = start; current <= end; current = nextMonth(current)) {
    months.push(current);
  }

  const phase = seedPhase(seed);
  const weights = months.map((month, index) => {
    const [year, monthNumber] = month.split("-").map(Number);
    const monthStart = `${month}-01`;
    const monthEnd = `${month}-${String(daysInMonth(year ?? 2026, monthNumber ?? 1)).padStart(2, "0")}`;
    const activeFrom =
      seed.googleIndexedAt > monthStart ? seed.googleIndexedAt : monthStart;
    const activeTo = MONITORING_TODAY < monthEnd ? MONITORING_TODAY : monthEnd;
    const activeDays =
      activeFrom > activeTo ? 0 : daysBetween(activeFrom, activeTo);
    const availability = activeDays / daysBetween(monthStart, monthEnd);
    const growth = 1 + index * 0.22;
    const localPattern = 1 + (((phase + index) % 5) - 2) * 0.025;
    return availability * growth * localPattern;
  });
  const visits = allocateIntegerTotal(weights, seed.googleVisitsTotal);
  return months.map((month, index) => ({
    month,
    label: monthLabel(month),
    visits: visits[index] ?? 0,
  }));
}

export function getEarliestGoogleIndexedDate() {
  return (
    websiteSeeds
      .map((seed) => seed.googleIndexedAt)
      .sort((a, b) => a.localeCompare(b))[0] ?? MONITORING_TODAY
  );
}

export function getPreviousDate(date: string) {
  return addDays(date, -1);
}
