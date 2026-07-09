"use client";

import { Badge } from "@/components/ui/badge";
import { BrandMark, Logo } from "@/components/brand/logo";
import type { SessionProfile } from "@/server/auth/session";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CircleHelp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Navigation, SettingsNavigation } from "./navigation";

export function Sidebar({
  session,
  collapsed,
  onToggle,
}: {
  session: SessionProfile;
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 hidden border-r border-[var(--border)] bg-white px-4 py-5 transition-[width] duration-300 ease-out lg:flex lg:flex-col",
        collapsed ? "w-[72px]" : "w-[232px]",
      )}
    >
      <div
        className={cn(
          "flex h-10 items-center",
          collapsed ? "justify-center" : "justify-between px-1",
        )}
      >
        <Logo compact={collapsed} />
        {!collapsed ? (
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={onToggle}
            aria-label="Ciutkan sidebar"
          >
            <ChevronLeft />
          </Button>
        ) : null}
      </div>
      {collapsed ? (
        <Button
          variant="ghost"
          size="icon"
          className="mx-auto mt-3 size-8"
          onClick={onToggle}
          aria-label="Bentangkan sidebar"
        >
          <ChevronRight />
        </Button>
      ) : (
        <Badge variant="neutral" className="mt-4 w-fit">
          Superadmin
        </Badge>
      )}
      <div className="mt-7 flex-1">
        <Navigation collapsed={collapsed} />
      </div>
      <div className="space-y-1 border-t border-[var(--border)] pt-3">
        <SettingsNavigation collapsed={collapsed} />
        <a
          href="mailto:hello@dekatlokal.com?subject=Bantuan%20Dashboard%20DekatLokal"
          title={collapsed ? "Bantuan" : undefined}
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#475467] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]",
            collapsed && "justify-center px-2",
          )}
        >
          <CircleHelp className="size-[18px] shrink-0" />
          <span className={cn(collapsed && "sr-only")}>Bantuan</span>
        </a>
      </div>
      <div
        className={cn(
          "mt-3 rounded-xl bg-[var(--surface-muted)]",
          collapsed ? "p-2" : "p-3",
        )}
      >
        <div
          className={cn(
            "flex items-center gap-2",
            collapsed && "justify-center",
          )}
        >
          <BrandMark size={32} />
          {!collapsed ? (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#344054]">
                {session.fullName}
              </p>
              <p className="mt-0.5 text-xs text-[var(--text-secondary)] capitalize">
                {session.role}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
