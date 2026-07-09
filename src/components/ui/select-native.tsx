import * as React from "react";

import { cn } from "@/lib/utils";

export function SelectNative({
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-10 rounded-[var(--radius-control)] border border-[var(--border-strong)] bg-white px-3 text-sm text-[#344054] shadow-sm transition-colors focus:border-[var(--brand-primary)]",
        className,
      )}
      {...props}
    />
  );
}
