import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

import { WebsiteLogo } from "@/components/monitoring/website-avatar";
import { DateRangeSelector } from "@/components/monitoring/date-range-selector";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateIndonesia } from "@/lib/monitoring/formatters";
import type { WebsiteDetail, WebsiteStatus } from "@/types/monitoring";

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

export function WebsiteDetailHeader({ detail }: { detail: WebsiteDetail }) {
  const href = detail.domain ? `https://${detail.domain}` : null;
  return (
    <Card>
      <CardContent className="p-5 sm:p-6">
        <div className="flex min-w-0 flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-full min-w-0">
            <Button asChild variant="ghost" size="sm" className="mb-3 -ml-2">
              <Link href="/dashboard/websites">
                <ArrowLeft />
                Kembali
              </Link>
            </Button>
            <div className="flex min-w-0 items-start gap-4">
              <WebsiteLogo
                website={detail}
                className="size-12 rounded-2xl text-sm"
              />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="max-w-full text-2xl font-semibold break-words">
                    {detail.name}
                  </h1>
                  <Badge variant={statusVariant(detail.status)}>
                    {statusLabel(detail.status)}
                  </Badge>
                </div>
                <p className="mt-1 text-sm break-words text-[var(--text-secondary)]">
                  {detail.domain}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="neutral">
                    {detail.type === "sociopreneur" ? "Sociopreneur" : "UMKM"}
                  </Badge>
                  <Badge variant="outline">{detail.category}</Badge>
                  <Badge variant="outline">{detail.location}</Badge>
                </div>
                <dl className="mt-4 grid gap-2 text-xs text-[var(--text-secondary)] sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <dt>Terindeks Google</dt>
                    <dd className="font-semibold text-[#344054]">
                      {formatDateIndonesia(detail.googleIndexedAt)}
                    </dd>
                  </div>
                  <div>
                    <dt>Periode</dt>
                    <dd className="font-semibold text-[#344054]">
                      {detail.range.label}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <DateRangeSelector
              range={detail.range}
              basePath={`/dashboard/websites/${detail.slug}`}
            />
            {href ? (
              <Button asChild variant="outline">
                <a href={href} target="_blank" rel="noopener noreferrer">
                  <ExternalLink />
                  Buka Website
                </a>
              </Button>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
