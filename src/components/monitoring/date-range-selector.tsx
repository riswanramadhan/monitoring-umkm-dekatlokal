"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { DateRange } from "@/types/monitoring";

const monitoringDatePresets = [
  { value: "all", label: "Semua data" },
  { value: "7d", label: "7 hari" },
  { value: "28d", label: "28 hari" },
  { value: "90d", label: "90 hari" },
  { value: "12m", label: "12 bulan" },
] as const;

function hrefFor(basePath: string, preset: string) {
  const params = new URLSearchParams();
  params.set("range", preset);
  return `${basePath}?${params.toString()}`;
}

export function DateRangeSelector({
  range,
  basePath,
}: {
  range: DateRange;
  basePath: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [from, setFrom] = useState(range.from);
  const [to, setTo] = useState(range.to);

  function applyCustom() {
    const params = new URLSearchParams();
    params.set("range", "custom");
    params.set("from", from);
    params.set("to", to);
    setOpen(false);
    router.push(`${basePath}?${params.toString()}`);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" className="max-w-full">
          <span className="truncate">{range.label}</span>
          {open ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 p-2">
        <div className="space-y-1">
          {monitoringDatePresets.map((item) => {
            const active = range.preset === item.value;
            return (
              <Button
                key={item.value}
                asChild
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  active &&
                    "bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]",
                )}
                onClick={() => setOpen(false)}
              >
                <Link href={hrefFor(basePath, item.value)}>
                  <span className="flex-1 text-left">{item.label}</span>
                  {active ? <Check className="size-4" /> : null}
                </Link>
              </Button>
            );
          })}
        </div>
        <div className="mt-2 border-t border-[var(--border)] pt-3">
          <div className="mb-2">
            <p className="text-sm font-semibold">Custom range</p>
            <p className="text-xs text-[var(--text-secondary)]">
              Tanggal memakai timezone Asia/Makassar.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="date"
              value={from}
              max={to}
              aria-label="Tanggal awal"
              onChange={(event) => setFrom(event.target.value)}
            />
            <Input
              type="date"
              value={to}
              min={from}
              aria-label="Tanggal akhir"
              onChange={(event) => setTo(event.target.value)}
            />
          </div>
          <Button
            type="button"
            size="sm"
            className="mt-2 w-full"
            onClick={applyCustom}
          >
            Terapkan
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function RefreshButton() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => {
        router.refresh();
      }}
      aria-label={`Refresh data ${pathname}?${params.toString()}`}
    >
      <RefreshCw />
      Refresh
    </Button>
  );
}
