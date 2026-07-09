"use client";

import { useCountUp } from "@/components/ui/animated-number";

type MetricFormat = "number" | "compact" | "percent" | "decimal";

function formatAnimatedValue(
  value: number,
  format: MetricFormat,
  decimals?: number,
) {
  if (format === "compact") {
    return new Intl.NumberFormat("id-ID", {
      notation: "compact",
      maximumFractionDigits: decimals ?? 1,
    }).format(value);
  }
  if (format === "percent") {
    return `${new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: decimals ?? 1,
      maximumFractionDigits: decimals ?? 1,
    }).format(value)}%`;
  }
  if (format === "decimal") {
    return new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: decimals ?? 2,
      maximumFractionDigits: decimals ?? 2,
    }).format(value);
  }
  return new Intl.NumberFormat("id-ID").format(Math.round(value));
}

export function AnimatedMetricValue({
  value,
  format = "number",
  decimals,
  prefix = "",
  suffix = "",
  className,
}: {
  value: number;
  format?: MetricFormat;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const { ref, value: animatedValue } = useCountUp<HTMLSpanElement>(value, 850);
  return (
    <span ref={ref} className={className} suppressHydrationWarning>
      {prefix}
      {formatAnimatedValue(animatedValue, format, decimals)}
      {suffix}
    </span>
  );
}
