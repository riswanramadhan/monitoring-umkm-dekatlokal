import { Badge } from "@/components/ui/badge";
import type { WebsiteStatus } from "@/types/monitoring";

function statusLabel(status: WebsiteStatus) {
  if (status === "attention") return "Perlu perhatian";
  if (status === "critical") return "Bermasalah";
  return "Live";
}

function statusVariant(status: WebsiteStatus) {
  if (status === "attention") return "warning" as const;
  if (status === "critical") return "danger" as const;
  return "success" as const;
}

export function StatusBadge({ status }: { status: WebsiteStatus }) {
  const live = status === "live";
  return (
    <Badge
      variant={statusVariant(status)}
      className={
        live
          ? "bg-[#ECFDF3] text-[#027A48] shadow-[0_0_0_1px_rgba(34,197,94,.12),0_0_18px_rgba(34,197,94,.22)]"
          : undefined
      }
    >
      {live ? (
        <span className="relative flex size-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22C55E] opacity-70" />
          <span className="relative inline-flex size-2 rounded-full bg-[#16A34A] shadow-[0_0_10px_rgba(34,197,94,.9)]" />
        </span>
      ) : null}
      {statusLabel(status)}
    </Badge>
  );
}
