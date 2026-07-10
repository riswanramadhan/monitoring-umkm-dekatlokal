"use client";

import Link from "next/link";
import { Bell, ChevronDown, LogOut, Search } from "lucide-react";

import { logoutAction } from "@/features/auth/actions";
import { formatDateTime } from "@/lib/utils";
import type { SessionProfile } from "@/server/auth/session";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Breadcrumb } from "./navigation";
import { MobileNavigation } from "./mobile-navigation";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { BrandMark } from "@/components/brand/logo";
import { RealtimeClock } from "@/components/monitoring/realtime-clock";

interface NotificationData {
  count: number;
  items: Array<{
    id: string;
    umkmId: string;
    slug: string;
    businessName: string;
    status: string;
    submittedAt: string;
  }>;
}

export function DashboardHeader({
  session,
  notifications,
}: {
  session: SessionProfile;
  notifications: NotificationData;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <MobileNavigation />
        <div className="hidden min-w-0 flex-1 items-center gap-3 md:flex">
          <Breadcrumb />
          <RealtimeClock compact />
        </div>
        <form
          action="/dashboard/websites"
          method="get"
          role="search"
          className="relative ml-auto w-full max-w-[360px]"
        >
          <Search className="absolute top-3 left-3 size-4 text-[#98A2B3]" />
          <Input
            name="q"
            aria-label="Cari website"
            placeholder="Cari website atau domain..."
            className="bg-[#F9FAFB] pl-9"
          />
        </form>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="relative flex size-10 cursor-pointer items-center justify-center rounded-[10px] text-[#475467] hover:bg-[var(--surface-muted)]"
              aria-label={`${notifications.count} notifikasi tindak lanjut`}
            >
              <Bell className="size-5" />
              {notifications.count > 0 ? (
                <span className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-[#DC2626] text-[9px] font-bold text-white">
                  {Math.min(notifications.count, 9)}
                </span>
              ) : null}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 p-3">
            <div className="flex items-center justify-between px-2 py-1">
              <p className="text-sm font-semibold">Perlu perhatian</p>
              <Badge variant="neutral">
                <AnimatedNumber value={notifications.count} />
              </Badge>
            </div>
            <div className="mt-2 space-y-1">
              {notifications.items.length ? (
                notifications.items.map((item) => (
                  <Link
                    key={item.id}
                    href={`/dashboard/websites/${item.slug}`}
                    className="block rounded-xl px-3 py-2 hover:bg-[#F7F9FC]"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-medium text-[#344054]">
                        {item.businessName}
                      </p>
                      <Badge variant="warning">Cek monitoring</Badge>
                    </div>
                    <p className="mt-1 text-xs text-[#98A2B3]">
                      {formatDateTime(item.submittedAt)}
                    </p>
                  </Link>
                ))
              ) : (
                <p className="px-3 py-6 text-center text-sm text-[#667085]">
                  Tidak ada antrean baru.
                </p>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="hidden cursor-pointer items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-[var(--surface-muted)] sm:flex"
              aria-label="Buka menu akun"
            >
              <BrandMark size={32} />
              <ChevronDown className="size-4 text-[#667085]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <div className="border-b px-2 py-2">
              <p className="truncate text-sm font-semibold">
                {session.fullName}
              </p>
              <p className="truncate text-xs text-[#667085]">{session.email}</p>
            </div>
            <DropdownMenuSeparator />
            <form action={logoutAction}>
              <DropdownMenuItem asChild>
                <button type="submit" className="w-full">
                  <LogOut />
                  Keluar
                </button>
              </DropdownMenuItem>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
