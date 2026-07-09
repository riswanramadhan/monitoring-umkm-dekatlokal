import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-control)] text-sm font-semibold transition-[color,background-color,border-color,box-shadow,transform] duration-150 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 disabled:active:scale-100 [&_svg]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--brand-primary)] text-white shadow-sm hover:bg-[var(--brand-primary-hover)]",
        secondary:
          "bg-[var(--brand-primary-soft)] text-[var(--brand-primary)] hover:bg-[#dce8ff]",
        outline:
          "border border-[var(--border-strong)] bg-white text-[#344054] hover:bg-[var(--surface-muted)]",
        ghost:
          "text-[#475467] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]",
        danger: "bg-[var(--danger)] text-white hover:bg-[#dc2626]",
        link: "text-[var(--brand-primary)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-11 px-5",
        icon: "size-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { buttonVariants };
