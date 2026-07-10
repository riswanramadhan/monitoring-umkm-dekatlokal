"use client";

import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "2-digit",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Makassar",
});

const timeFormatter = new Intl.DateTimeFormat("id-ID", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
  timeZone: "Asia/Makassar",
});

export function RealtimeClock({ compact = false }: { compact?: boolean }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="inline-flex min-h-10 max-w-full items-center gap-2 rounded-[var(--radius-control)] border border-[var(--border-strong)] bg-white px-3 text-sm text-[#344054] shadow-sm">
      <Clock3 className="size-4 shrink-0 text-[var(--brand-primary)]" />
      <span className="min-w-0 truncate" suppressHydrationWarning>
        {compact
          ? `${timeFormatter.format(now)} WITA`
          : `${dateFormatter.format(now)} - ${timeFormatter.format(now)} WITA`}
      </span>
    </div>
  );
}
