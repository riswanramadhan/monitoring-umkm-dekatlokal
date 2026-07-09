import { MonitoringOverviewDashboard } from "@/components/monitoring/monitoring-overview-dashboard";
import {
  getMonitoringDateRange,
  monitoringRepository,
} from "@/lib/monitoring/repository";
import { requireSession } from "@/server/auth/session";

export default async function OverviewPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireSession();
  const params = await searchParams;
  const first = (key: string) => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };
  const range = getMonitoringDateRange({
    preset: first("range"),
    from: first("from"),
    to: first("to"),
  });
  const overview = await monitoringRepository.getOverview(range);

  return <MonitoringOverviewDashboard overview={overview} />;
}
