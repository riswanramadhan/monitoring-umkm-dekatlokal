"use client";

import { useCountUp } from "@/components/ui/animated-number";
import { cn } from "@/lib/utils";

export function AnimatedCircularProgress({
  value,
  sizeClassName = "size-48",
  innerClassName = "size-40",
  valueClassName = "text-3xl",
  caption,
  suffix = "%",
  className,
}: {
  value: number;
  sizeClassName?: string;
  innerClassName?: string;
  valueClassName?: string;
  caption?: React.ReactNode;
  suffix?: React.ReactNode;
  className?: string;
}) {
  const safe = Math.max(0, Math.min(100, value));
  const { ref, value: animatedValue } = useCountUp<HTMLDivElement>(safe, 1150);
  const display = Number.isInteger(safe)
    ? Math.round(animatedValue)
    : animatedValue.toFixed(1).replace(".", ",");

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex shrink-0 items-center justify-center rounded-full",
        sizeClassName,
        className,
      )}
      style={{
        background: `conic-gradient(#0255F5 ${animatedValue * 3.6}deg, #E7EAF0 0deg)`,
      }}
      role="img"
      aria-label={`Nilai ${safe} dari 100`}
    >
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-full bg-white",
          innerClassName,
        )}
      >
        <strong className={cn("tracking-tight", valueClassName)}>
          {display}
          <span aria-hidden="true">{suffix}</span>
        </strong>
        {caption}
      </div>
    </div>
  );
}
