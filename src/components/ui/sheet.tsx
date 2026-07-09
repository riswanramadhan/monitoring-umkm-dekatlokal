"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;

export function SheetContent({
  side = "right",
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  side?: "right" | "left" | "bottom";
}) {
  const positions = {
    right:
      "inset-y-0 right-0 h-full w-full max-w-lg translate-x-full border-l data-[state=open]:translate-x-0 data-[state=closed]:translate-x-full",
    left: "inset-y-0 left-0 h-full w-[min(88vw,320px)] -translate-x-full border-r data-[state=open]:translate-x-0 data-[state=closed]:-translate-x-full",
    bottom:
      "inset-x-0 bottom-0 max-h-[92vh] w-full translate-y-full rounded-t-[var(--radius-panel)] border-t data-[state=open]:translate-y-0 data-[state=closed]:translate-y-full",
  };
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[#101828]/40 backdrop-blur-[2px] transition-opacity duration-200 data-[state=closed]:opacity-0 data-[state=open]:opacity-100" />
      <DialogPrimitive.Content
        className={cn(
          "fixed z-50 overflow-y-auto bg-white shadow-[var(--shadow-floating)] transition-transform duration-200 ease-out",
          positions[side],
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          className="absolute top-4 right-4 z-20 rounded-lg p-2 text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-muted)]"
          aria-label="Tutup panel"
        >
          <X className="size-4" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function SheetHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-1 pr-10", className)} {...props} />;
}

export function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn(
        "text-lg font-semibold text-[var(--text-primary)]",
        className,
      )}
      {...props}
    />
  );
}

export function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn("text-sm text-[var(--text-secondary)]", className)}
      {...props}
    />
  );
}
