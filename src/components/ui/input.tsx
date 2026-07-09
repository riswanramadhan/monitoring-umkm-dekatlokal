import * as React from "react";

import { cn } from "@/lib/utils";

export function Input({
  className,
  type,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-[var(--radius-control)] border border-[var(--border-strong)] bg-[var(--surface-muted)]/60 px-3 py-2 text-sm text-[var(--text-primary)] shadow-sm transition-[border-color,box-shadow,background-color] placeholder:text-[var(--text-tertiary)] hover:bg-white focus:border-[var(--brand-primary)] focus:bg-white disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
