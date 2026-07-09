import Link from "next/link";
import { Download } from "lucide-react";

import {
  DateRangeSelector,
  RefreshButton,
} from "@/components/monitoring/date-range-selector";
import { DashboardKpiGrid } from "@/components/monitoring/dashboard-kpi";
import { PerformanceChart } from "@/components/monitoring/performance-chart";
import { RealtimeClock } from "@/components/monitoring/realtime-clock";
import { SearchPerformance } from "@/components/monitoring/search-performance";
import { TrafficSourceChart } from "@/components/monitoring/traffic-source-chart";
import { WebsiteHealth } from "@/components/monitoring/website-health";
import { WebsiteRanking } from "@/components/monitoring/website-ranking";
import { WhatsappFunnel } from "@/components/monitoring/whatsapp-funnel";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import type { MonitoringOverview } from "@/types/monitoring";

export function MonitoringOverviewDashboard({
  overview,
}: {
  overview: MonitoringOverview;
}) {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Superadmin"
        title="Monitoring Website UMKM"
        description="Pantau visibilitas, traffic, konversi, dan kondisi seluruh website UMKM dalam satu dashboard."
        actions={
          <>
            <RealtimeClock />
            <DateRangeSelector range={overview.range} basePath="/dashboard" />
            <Button asChild variant="outline">
              <Link href="/dashboard/reports">
                <Download />
                Export
              </Link>
            </Button>
            <RefreshButton />
          </>
        }
      />

      <DashboardKpiGrid kpis={overview.kpis} />

      <PerformanceChart
        data={overview.dailyTrends}
        previousData={overview.previousDailyTrends}
      />

      <div className="grid gap-4 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <WebsiteRanking websites={overview.websites} />
        </div>
        <div className="xl:col-span-5">
          <WhatsappFunnel funnel={overview.funnel} />
        </div>
        <div className="xl:col-span-5">
          <TrafficSourceChart data={overview.trafficSources} />
        </div>
        <div className="xl:col-span-7">
          <SearchPerformance
            summary={overview.searchSummary}
            queries={overview.topQueries}
          />
        </div>
        <div className="xl:col-span-12">
          <WebsiteHealth
            summary={overview.healthSummary}
            alerts={overview.alerts}
          />
        </div>
      </div>
    </div>
  );
}
