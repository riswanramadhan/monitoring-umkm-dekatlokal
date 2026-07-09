import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  action,
}: {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-[#D0D5DD] bg-white px-6 py-10 text-center">
      <div className="mb-3 rounded-xl bg-[#EAF1FF] p-3 text-[#0255F5]">
        <Icon className="size-5" />
      </div>
      <h3 className="font-semibold text-[#101828]">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-[#667085]">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
