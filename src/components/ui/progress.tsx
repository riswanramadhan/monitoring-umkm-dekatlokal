"use client";

import { cn } from "@/lib/utils";
import { useCountUp } from "@/components/ui/animated-number";

export function Progress({
  value,
  className,
  indicatorClassName,
  label,
}: {
  value: number;
  className?: string;
  indicatorClassName?: string;
  label?: string;
}) {
  const safeValue = Math.max(0, Math.min(100, value));
  const { ref, value: animatedValue } = useCountUp<HTMLDivElement>(
    safeValue,
    900,
  );
  return (
    <div
      ref={ref}
      className={cn(
        "h-1.5 overflow-hidden rounded-full bg-[#EAECF0]",
        className,
      )}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={safeValue}
    >
      <div
        className={cn(
          "h-full rounded-full bg-[var(--brand-primary)]",
          indicatorClassName,
        )}
        style={{ width: `${animatedValue}%` }}
      />
    </div>
  );
}
