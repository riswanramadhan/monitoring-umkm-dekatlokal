import {
  AlertTriangle,
  Globe2,
  RadioTower,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";

import { AnimatedMetricValue } from "@/components/monitoring/animated-metric-value";
import {
  DateRangeSelector,
  RefreshButton,
} from "@/components/monitoring/date-range-selector";
import { WebsitesTable } from "@/components/monitoring/websites-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import type { DateRange, WebsiteMonitoringItem } from "@/types/monitoring";

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
}) {
  return (
    <Card className="h-full min-h-[124px]">
      <CardContent className="h-full p-5 sm:p-6">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-[13px] font-bold text-[#101828]">{label}</p>
            <p className="mt-3 text-2xl leading-none font-semibold">
              <AnimatedMetricValue value={value} />
            </p>
          </div>
          <span className="flex size-10 shrink-0 items-center justify-center rounded-[14px] bg-[var(--brand-primary-soft)] text-[var(--brand-primary)] shadow-[inset_0_1px_0_rgba(255,255,255,.78)]">
            <Icon className="size-[22px]" />
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export function WebsitesDashboard({
  websites,
  range,
  initialQuery = "",
}: {
  websites: WebsiteMonitoringItem[];
  range: DateRange;
  initialQuery?: string;
}) {
  const attention = websites.filter(
    (website) =>
      website.performance.healthScore >= 50 &&
      website.performance.healthScore < 85,
  ).length;
  const critical = websites.filter(
    (website) => website.performance.healthScore < 50,
  ).length;
  const live = websites.length;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Monitoring"
        title="Website UMKM"
        description="Daftar seluruh website yang dikelola dan dimonitor oleh DekatLokal."
        actions={
          <>
            <DateRangeSelector range={range} basePath="/dashboard/websites" />
            <RefreshButton />
          </>
        }
      />
      <div className="grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Jumlah website"
          value={websites.length}
          icon={Globe2}
        />
        <StatCard label="Website live" value={live} icon={RadioTower} />
        <StatCard
          label="Perlu perhatian"
          value={attention}
          icon={AlertTriangle}
        />
        <StatCard label="Bermasalah" value={critical} icon={ShieldAlert} />
      </div>
      <Card className="overflow-hidden">
        <WebsitesTable
          websites={websites}
          title="Daftar Website"
          description="Cari, filter, dan urutkan website berdasarkan performa monitoring."
          defaultPageSize={13}
          showViewToggle
          initialQuery={initialQuery}
        />
      </Card>
    </div>
  );
}
