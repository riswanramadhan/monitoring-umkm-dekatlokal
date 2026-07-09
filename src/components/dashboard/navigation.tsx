"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileBarChart, LayoutDashboard, Settings, Globe2 } from "lucide-react";

import { cn } from "@/lib/utils";

export const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/websites", label: "Website UMKM", icon: Globe2 },
  { href: "/dashboard/reports", label: "Laporan", icon: FileBarChart },
];

export function Navigation({
  collapsed = false,
  onNavigate,
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  return (
    <nav aria-label="Navigasi utama" className="space-y-1">
      {navItems.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            title={collapsed ? item.label : undefined}
            className={cn(
              "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors before:absolute before:-left-4 before:h-6 before:w-[3px] before:rounded-r-full before:bg-transparent",
              active
                ? "bg-[var(--brand-primary-soft)] font-semibold text-[var(--brand-primary)] before:bg-[var(--brand-primary)]"
                : "text-[#475467] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]",
              collapsed && "justify-center px-2",
            )}
          >
            <Icon className="size-[18px] shrink-0" />
            <span className={cn(collapsed && "sr-only")}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function SettingsNavigation({
  collapsed = false,
  onNavigate,
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = pathname.startsWith("/dashboard/pengaturan");
  return (
    <Link
      href="/dashboard/pengaturan"
      onClick={onNavigate}
      title={collapsed ? "Pengaturan" : undefined}
      className={cn(
        "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors before:absolute before:-left-4 before:h-6 before:w-[3px] before:rounded-r-full before:bg-transparent",
        active
          ? "bg-[var(--brand-primary-soft)] font-semibold text-[var(--brand-primary)] before:bg-[var(--brand-primary)]"
          : "text-[#475467] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]",
        collapsed && "justify-center px-2",
      )}
    >
      <Settings className="size-[18px] shrink-0" />
      <span className={cn(collapsed && "sr-only")}>Pengaturan</span>
    </Link>
  );
}

export function Breadcrumb() {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  const labels: Record<string, string> = {
    dashboard: "Dashboard",
    websites: "Website UMKM",
    reports: "Laporan",
    pengaturan: "Pengaturan",
  };
  return (
    <div
      className="flex items-center gap-2 text-sm text-[#667085]"
      aria-label="Breadcrumb"
    >
      {parts.map((part, index) => (
        <span
          key={`${part}-${index}`}
          className={
            index === parts.length - 1 ? "font-medium text-[#344054]" : ""
          }
        >
          {index > 0 ? <span className="mr-2 text-[#D0D5DD]">/</span> : null}
          {labels[part] ?? (index === parts.length - 1 ? "Detail" : part)}
        </span>
      ))}
    </div>
  );
}
