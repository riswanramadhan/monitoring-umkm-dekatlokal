import Image from "next/image";
import { cn } from "@/lib/utils";

export function BrandMark({
  size = 36,
  className,
  priority = false,
}: {
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/favicon.png"
      alt=""
      width={size}
      height={size}
      className={cn("shrink-0 rounded-[10px] object-contain", className)}
      style={{ width: size, height: size }}
      priority={priority}
    />
  );
}

export function Logo({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center overflow-hidden transition-[gap] duration-300 ease-out",
        compact ? "gap-0" : "gap-2.5",
        className,
      )}
      aria-label="DekatLokal"
    >
      <BrandMark priority />
      <span
        className={cn(
          "overflow-hidden font-[family-name:var(--font-brand-sans)] text-[17px] font-bold tracking-normal whitespace-nowrap text-[#0255F5] transition-[max-width,opacity,transform] duration-300 ease-out",
          compact
            ? "max-w-0 -translate-x-2 opacity-0"
            : "max-w-40 translate-x-0 opacity-100",
        )}
        aria-hidden={compact}
      >
        DekatLokal
      </span>
    </div>
  );
}
