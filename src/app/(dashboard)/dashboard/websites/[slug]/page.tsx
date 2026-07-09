import { notFound } from "next/navigation";

import { WebsiteDetailHeader } from "@/components/monitoring/website-detail-header";
import { WebsiteDetailTabs } from "@/components/monitoring/website-detail-tabs";
import {
  getMonitoringDateRange,
  monitoringRepository,
} from "@/lib/monitoring/repository";
import { requireSession } from "@/server/auth/session";

export default async function WebsiteDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireSession();
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const first = (key: string) => {
    const value = query[key];
    return Array.isArray(value) ? value[0] : value;
  };
  const range = getMonitoringDateRange({
    preset: first("range"),
    from: first("from"),
    to: first("to"),
  });
  const detail = await monitoringRepository.getWebsiteBySlug(slug, range);
  if (!detail) notFound();

  return (
    <div className="space-y-5">
      <WebsiteDetailHeader detail={detail} />
      <WebsiteDetailTabs detail={detail} />
    </div>
  );
}
