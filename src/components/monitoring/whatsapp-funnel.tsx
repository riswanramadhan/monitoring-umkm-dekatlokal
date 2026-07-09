import { MessageCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  formatCompactNumber,
  formatNumber,
  formatPercent,
} from "@/lib/monitoring/formatters";
import type { WhatsappFunnel as WhatsappFunnelData } from "@/types/monitoring";

export function WhatsappFunnel({ funnel }: { funnel: WhatsappFunnelData }) {
  const steps = [
    { label: "Tayangan halaman", value: funnel.pageViews },
    { label: "Pengunjung unik", value: funnel.uniqueVisitors },
    { label: "Melihat section CTA", value: funnel.ctaViews },
    { label: "Klik WhatsApp", value: funnel.whatsappClicks },
    { label: "Unique WhatsApp clicker", value: funnel.uniqueWhatsappClickers },
  ];
  const max = Math.max(funnel.pageViews, 1);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Konversi WhatsApp</CardTitle>
        <CardDescription>
          Funnel compact dari kunjungan sampai unique clicker.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-[var(--surface-muted)] p-3">
            <p className="text-xs text-[var(--text-secondary)]">Total klik</p>
            <p className="mt-1 text-xl font-semibold">
              {formatCompactNumber(funnel.whatsappClicks)}
            </p>
          </div>
          <div className="rounded-xl bg-[var(--surface-muted)] p-3">
            <p className="text-xs text-[var(--text-secondary)]">
              Unique clicker
            </p>
            <p className="mt-1 text-xl font-semibold">
              {formatCompactNumber(funnel.uniqueWhatsappClickers)}
            </p>
          </div>
          <div className="rounded-xl bg-[var(--surface-muted)] p-3">
            <p className="text-xs text-[var(--text-secondary)]">
              Conversion rate
            </p>
            <p className="mt-1 text-xl font-semibold">
              {formatPercent(funnel.conversionRate)}%
            </p>
          </div>
        </div>
        <div className="space-y-3">
          {steps.map((step) => (
            <div key={step.label}>
              <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
                <span className="font-medium text-[#344054]">{step.label}</span>
                <strong title={formatNumber(step.value)}>
                  {formatCompactNumber(step.value)}
                </strong>
              </div>
              <Progress
                value={(step.value / max) * 100}
                label={`${step.label}: ${formatNumber(step.value)}`}
              />
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-[var(--border)] p-3">
          <div className="flex items-start gap-2">
            <MessageCircle className="mt-0.5 size-4 text-[#128C7E]" />
            <div>
              <p className="text-sm font-semibold">{funnel.bestWebsiteName}</p>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                Conversion rate tertinggi{" "}
                <Badge variant="success">
                  {formatPercent(funnel.bestWebsiteRate)}%
                </Badge>{" "}
                dengan lokasi CTA paling efektif di {funnel.bestLocationLabel}.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
