"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Globe2,
  Info,
  MousePointerClick,
  Search,
  Target,
  UsersRound,
} from "lucide-react";

import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { AnimatedMetricValue } from "@/components/monitoring/animated-metric-value";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { formatSignedPercent } from "@/lib/monitoring/formatters";
import type { MonitoringKpi } from "@/types/monitoring";

const iconMap = {
  globe: Globe2,
  users: UsersRound,
  pages: BarChart3,
  search: Search,
  click: MousePointerClick,
  whatsapp: WhatsAppIcon,
  conversion: Target,
  position: Search,
};

const tones = {
  blue: "text-[#0255F5]",
  green: "text-[#16A34A]",
  amber: "text-[#D97706]",
  red: "text-[#DC2626]",
};

export function DashboardKpiGrid({ kpis }: { kpis: MonitoringKpi[] }) {
  return (
    <TooltipProvider>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = iconMap[kpi.iconKey];
          const positive = (kpi.changePercentage ?? 0) >= 0;
          return (
            <Card key={kpi.id} className="min-h-28">
              <CardContent className="p-4 sm:p-[18px]">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-[13px] font-bold text-[#101828]">
                        {kpi.label}
                      </p>
                      {kpi.tooltip ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              className="rounded-full text-[#98A2B3] hover:text-[#667085]"
                              aria-label={`Info ${kpi.label}`}
                            >
                              <Info className="size-3.5" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-72">
                            {kpi.tooltip}
                          </TooltipContent>
                        </Tooltip>
                      ) : null}
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="mt-2 text-[28px] leading-none font-semibold tracking-tight text-[var(--text-primary)]">
                          {typeof kpi.numericValue === "number" ? (
                            <AnimatedMetricValue
                              value={kpi.numericValue}
                              format={kpi.numericFormat}
                              decimals={kpi.numericDecimals}
                            />
                          ) : (
                            kpi.value
                          )}
                        </p>
                      </TooltipTrigger>
                      <TooltipContent>{kpi.fullValue}</TooltipContent>
                    </Tooltip>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                      {typeof kpi.changePercentage === "number" ? (
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 font-semibold",
                            positive ? "text-[#15803D]" : "text-[#B91C1C]",
                          )}
                        >
                          {positive ? (
                            <ArrowUpRight className="size-3.5" />
                          ) : (
                            <ArrowDownRight className="size-3.5" />
                          )}
                          {formatSignedPercent(kpi.changePercentage)}
                        </span>
                      ) : null}
                      {kpi.helper ? (
                        <span className="text-[#98A2B3]">{kpi.helper}</span>
                      ) : null}
                    </div>
                  </div>
                  <div className={tones[kpi.tone ?? "blue"]}>
                    <Icon className="size-[22px]" strokeWidth={2.2} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
