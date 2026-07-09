"use client";

import { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Navigation, SettingsNavigation } from "./navigation";

export function MobileNavigation() {
  const [open, setOpen] = useState(false);
  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Buka navigasi"
        >
          <Menu />
        </Button>
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[#101828]/40 lg:hidden" />
        <DialogPrimitive.Content
          className="fixed inset-y-0 left-0 z-50 w-[min(86vw,300px)] bg-white p-5 shadow-xl lg:hidden"
          aria-describedby={undefined}
        >
          <DialogPrimitive.Title className="sr-only">
            Navigasi
          </DialogPrimitive.Title>
          <div className="mb-8 flex items-center justify-between">
            <Logo />
            <DialogPrimitive.Close asChild>
              <Button variant="ghost" size="icon" aria-label="Tutup navigasi">
                <X />
              </Button>
            </DialogPrimitive.Close>
          </div>
          <div className="flex h-[calc(100%-4rem)] flex-col">
            <Navigation onNavigate={() => setOpen(false)} />
            <div className="mt-auto border-t pt-3">
              <SettingsNavigation onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
