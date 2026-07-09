import type { DailyTrendPoint, MonthlyGoogleVisit } from "@/types/monitoring";
import type { LocalWebsiteSeed } from "./websites";
import {
  MONITORING_TODAY,
  allocateIntegerTotal,
  getMonthlyGoogleVisits,
} from "./websites";

export const MOCK_TODAY = MONITORING_TODAY;
const dayMs = 86_400_000;

function toUtcDate(date: string) {
  return new Date(`${date}T00:00:00.000Z`);
}

export function addDays(date: string, offset: number) {
  const next = new Date(toUtcDate(date).getTime() + offset * dayMs);
  return next.toISOString().slice(0, 10);
}

export function daysBetween(from: string, to: string) {
  return (
    Math.floor((toUtcDate(to).getTime() - toUtcDate(from).getTime()) / dayMs) +
    1
  );
}

export function createDateSeries(from: string, to: string) {
  const days = Math.max(daysBetween(from, to), 0);
  return Array.from({ length: days }, (_, index) => addDays(from, index));
}

function seedPhase(seed: Pick<LocalWebsiteSeed, "slug">) {
  return seed.slug
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0);
}

function weekdayMultiplier(date: string) {
  const day = toUtcDate(date).getUTCDay();
  const multipliers = [0.92, 1.04, 1.06, 1.08, 1.03, 0.98, 0.94];
  return multipliers[day] ?? 1;
}

function roundMetric(value: number) {
  return Math.max(0, Math.round(value));
}

function normalizedSourceShare(seed: LocalWebsiteSeed, source: string) {
  const entries = Object.entries(seed.sourceShares);
  const total = entries.reduce((sum, [, value]) => sum + value, 0) || 1;
  return (seed.sourceShares[source] ?? 0) / total;
}

function monthKey(date: string) {
  return date.slice(0, 7);
}

function allocateDailyOrganicClicks(
  seed: LocalWebsiteSeed,
  dates: string[],
  monthly: MonthlyGoogleVisit[],
) {
  const allocations = new Map<string, number>();
  const phase = seedPhase(seed);

  monthly.forEach((monthRow, monthIndex) => {
    const monthDates = dates.filter(
      (date) =>
        monthKey(date) === monthRow.month &&
        date >= seed.googleIndexedAt &&
        date <= MOCK_TODAY,
    );
    const weights = monthDates.map((date, index) => {
      const seasonality =
        1 +
        Math.sin((index + phase + monthIndex) / 5) * 0.08 +
        Math.cos((index + phase) / 7) * 0.04;
      return weekdayMultiplier(date) * seasonality;
    });
    const dailyVisits = allocateIntegerTotal(weights, monthRow.visits);
    monthDates.forEach((date, index) => {
      allocations.set(date, dailyVisits[index] ?? 0);
    });
  });

  return allocations;
}

function activeDaysInMonth(seed: LocalWebsiteSeed, date: string) {
  const month = monthKey(date);
  const start = `${month}-01`;
  const lastDay = new Date(
    Date.UTC(Number(month.slice(0, 4)), Number(month.slice(5, 7)), 0),
  )
    .toISOString()
    .slice(8, 10);
  const end = `${month}-${lastDay}`;
  const activeFrom =
    seed.googleIndexedAt > start ? seed.googleIndexedAt : start;
  const activeTo = MOCK_TODAY < end ? MOCK_TODAY : end;
  return activeFrom > activeTo ? 1 : daysBetween(activeFrom, activeTo);
}

function buildMonthlyAverageMap(
  seed: LocalWebsiteSeed,
  monthly: MonthlyGoogleVisit[],
) {
  return new Map(
    monthly.map((item) => [
      item.month,
      item.visits / activeDaysInMonth(seed, `${item.month}-01`),
    ]),
  );
}

function emptyPoint(date: string): DailyTrendPoint {
  return {
    date,
    uniqueVisitors: 0,
    sessions: 0,
    pageViews: 0,
    searchImpressions: 0,
    organicClicks: 0,
    whatsappClicks: 0,
    uniqueWhatsappClickers: 0,
    averagePosition: 0,
    engagementRate: 0,
    averageEngagementTime: 0,
  };
}

function dailyPoint(
  seed: LocalWebsiteSeed,
  date: string,
  index: number,
  organicClicks: number,
  organicAverage: number,
): DailyTrendPoint {
  if (date < seed.googleIndexedAt || date > MOCK_TODAY) {
    return emptyPoint(date);
  }

  const phase = seedPhase(seed);
  const organicShare = Math.max(
    normalizedSourceShare(seed, "Organic Search"),
    0.18,
  );
  const seasonality =
    1 +
    Math.sin((index + phase) / 11) * 0.07 +
    Math.cos((index + phase) / 17) * 0.05;
  const visitorBase = Math.max(organicClicks, organicAverage * 0.44);
  const visitors = roundMetric(
    Math.max(1, (visitorBase / organicShare) * seasonality * 0.86),
  );
  const sessions = roundMetric(visitors * (1.01 + (phase % 4) * 0.008));
  const pageDepth = Math.min(seed.pagesPerSession, 1.28);
  const pageViews = roundMetric(sessions * pageDepth);
  const impressionBase =
    organicClicks > 0
      ? organicClicks / seed.searchCtr
      : (organicAverage / seed.searchCtr) * 0.42;
  const searchImpressions = roundMetric(
    impressionBase * (1 + Math.sin((index + phase) / 13) * 0.05),
  );
  const uniqueWhatsappClickers = Math.min(
    visitors,
    roundMetric(
      visitors *
        seed.whatsappConversion *
        0.58 *
        (1 + Math.cos((index + phase) / 9) * 0.08),
    ),
  );
  const whatsappClicks = Math.max(
    uniqueWhatsappClickers,
    roundMetric(uniqueWhatsappClickers * (1.04 + (phase % 3) * 0.03)),
  );

  return {
    date,
    uniqueVisitors: visitors,
    sessions,
    pageViews,
    searchImpressions,
    organicClicks,
    whatsappClicks,
    uniqueWhatsappClickers,
    averagePosition: Math.max(
      1,
      seed.averagePosition + Math.sin((index + phase) / 19) * 0.36,
    ),
    engagementRate: Math.max(
      0,
      Math.min(100, seed.engagementRate + Math.cos((index + phase) / 10) * 2.1),
    ),
    averageEngagementTime: Math.max(
      0,
      seed.averageEngagementTime + Math.sin((index + phase) / 12) * 7,
    ),
  };
}

export function generateWebsiteDailyTrends(seed: LocalWebsiteSeed, days = 760) {
  const from = addDays(MOCK_TODAY, -(days - 1));
  const dates = createDateSeries(from, MOCK_TODAY);
  const monthly = getMonthlyGoogleVisits(seed);
  const organicByDate = allocateDailyOrganicClicks(seed, dates, monthly);
  const monthlyAverage = buildMonthlyAverageMap(seed, monthly);
  return dates.map((date, index) =>
    dailyPoint(
      seed,
      date,
      index,
      organicByDate.get(date) ?? 0,
      monthlyAverage.get(monthKey(date)) ?? 0,
    ),
  );
}

export function aggregateDailyByDate(
  trends: DailyTrendPoint[][],
  dates: string[],
) {
  return dates
    .map((date) =>
      trends.reduce<DailyTrendPoint>(
        (total, series) => {
          const point = series.find((item) => item.date === date);
          if (!point) return total;
          return {
            date,
            uniqueVisitors: total.uniqueVisitors + point.uniqueVisitors,
            sessions: total.sessions + point.sessions,
            pageViews: total.pageViews + point.pageViews,
            searchImpressions:
              total.searchImpressions + point.searchImpressions,
            organicClicks: total.organicClicks + point.organicClicks,
            whatsappClicks: total.whatsappClicks + point.whatsappClicks,
            uniqueWhatsappClickers:
              total.uniqueWhatsappClickers + point.uniqueWhatsappClickers,
            averagePosition:
              total.averagePosition +
              point.averagePosition * Math.max(point.searchImpressions, 1),
            engagementRate:
              total.engagementRate +
              point.engagementRate * Math.max(point.sessions, 1),
            averageEngagementTime:
              total.averageEngagementTime +
              point.averageEngagementTime * Math.max(point.sessions, 1),
          };
        },
        {
          date,
          uniqueVisitors: 0,
          sessions: 0,
          pageViews: 0,
          searchImpressions: 0,
          organicClicks: 0,
          whatsappClicks: 0,
          uniqueWhatsappClickers: 0,
          averagePosition: 0,
          engagementRate: 0,
          averageEngagementTime: 0,
        },
      ),
    )
    .map((point) => {
      const sourcePoints = trends
        .map((series) => series.find((item) => item.date === point.date))
        .filter((item): item is DailyTrendPoint => Boolean(item));
      const impressions = sourcePoints.reduce(
        (total, item) => total + Math.max(item.searchImpressions, 1),
        0,
      );
      const sessions = sourcePoints.reduce(
        (total, item) => total + Math.max(item.sessions, 1),
        0,
      );
      return {
        ...point,
        averagePosition: impressions ? point.averagePosition / impressions : 0,
        engagementRate: sessions ? point.engagementRate / sessions : 0,
        averageEngagementTime: sessions
          ? point.averageEngagementTime / sessions
          : 0,
      };
    });
}
