import { formatDate, formatDateTime } from "@/lib/utils";

const numberFormatter = new Intl.NumberFormat("id-ID");
const compactFormatter = new Intl.NumberFormat("id-ID", {
  notation: "compact",
  maximumFractionDigits: 1,
});
const decimalFormatter = new Intl.NumberFormat("id-ID", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const percentFormatter = new Intl.NumberFormat("id-ID", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export function formatNumber(value: number) {
  return numberFormatter.format(Math.round(value));
}

export function formatCompactNumber(value: number) {
  return compactFormatter.format(value);
}

export function formatPercent(value: number, fractionDigits = 1) {
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

export function formatSignedPercent(value: number) {
  const prefix = value > 0 ? "+" : "";
  return `${prefix}${percentFormatter.format(value)}%`;
}

export function formatDecimal(value: number) {
  return decimalFormatter.format(value);
}

export function formatDateIndonesia(value: string | Date | null | undefined) {
  return formatDate(value);
}

export function formatDateTimeWita(value: string | Date | null | undefined) {
  return formatDateTime(value);
}

export function formatDateShort(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    timeZone: "Asia/Makassar",
  }).format(new Date(`${value}T00:00:00+08:00`));
}

export function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.round(seconds % 60);
  if (minutes <= 0) return `${remaining} detik`;
  return `${minutes}m ${remaining}d`;
}

export function formatMetricValue(value: number, compact = false) {
  return compact ? formatCompactNumber(value) : formatNumber(value);
}
