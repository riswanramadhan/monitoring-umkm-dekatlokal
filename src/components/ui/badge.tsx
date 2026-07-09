import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
  {
    variants: {
      variant: {
        default: "bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]",
        success: "bg-[var(--success-soft)] text-[#15803D]",
        warning: "bg-[var(--warning-soft)] text-[#B45309]",
        danger: "bg-[var(--danger-soft)] text-[#B91C1C]",
        neutral: "bg-[var(--surface-muted)] text-[#475467]",
        outline: "border border-[var(--border-strong)] bg-white text-[#475467]",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
