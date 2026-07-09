import Image from "next/image";

import { cn } from "@/lib/utils";
import type { WebsiteMonitoringItem } from "@/types/monitoring";

export function AvatarInitial({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <span
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-primary-soft)] text-xs font-bold text-[var(--brand-primary)]",
        className,
      )}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

export function WebsiteLogo({
  website,
  className,
  imageClassName,
}: {
  website: Pick<WebsiteMonitoringItem, "name" | "logoSrc">;
  className?: string;
  imageClassName?: string;
}) {
  if (!website.logoSrc) {
    return <AvatarInitial name={website.name} className={className} />;
  }

  return (
    <span
      className={cn(
        "relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[var(--border)] bg-white p-1",
        className,
      )}
      aria-hidden="true"
    >
      <Image
        src={website.logoSrc}
        alt=""
        fill
        sizes="48px"
        className={cn("object-contain p-1", imageClassName)}
      />
    </span>
  );
}
