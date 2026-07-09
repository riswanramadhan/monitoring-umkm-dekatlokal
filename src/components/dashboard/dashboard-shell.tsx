"use client";

import { useEffect, useState } from "react";

import type { SessionProfile } from "@/server/auth/session";
import { MonitoringAiChat } from "@/components/monitoring/monitoring-ai-chat";
import { cn } from "@/lib/utils";
import { DashboardHeader } from "./header";
import { Sidebar } from "./sidebar";

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

const SIDEBAR_KEY = "dekatlokal:sidebar-collapsed";

export function DashboardShell({
  session,
  notifications,
  children,
}: {
  session: SessionProfile;
  notifications: NotificationData;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const stored = window.localStorage.getItem(SIDEBAR_KEY);
      setCollapsed(
        stored === null
          ? window.matchMedia("(min-width: 1024px) and (max-width: 1439px)")
              .matches
          : stored === "true",
      );
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function toggleSidebar() {
    setCollapsed((value) => {
      window.localStorage.setItem(SIDEBAR_KEY, String(!value));
      return !value;
    });
  }

  return (
    <div className="min-h-screen bg-[var(--page-bg)]">
      <Sidebar
        session={session}
        collapsed={collapsed}
        onToggle={toggleSidebar}
      />
      <div
        className={cn(
          "transition-[padding] duration-200",
          collapsed ? "lg:pl-[72px]" : "lg:pl-[232px]",
        )}
      >
        <DashboardHeader session={session} notifications={notifications} />
        <main className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
          {children}
        </main>
        <MonitoringAiChat />
      </div>
    </div>
  );
}
