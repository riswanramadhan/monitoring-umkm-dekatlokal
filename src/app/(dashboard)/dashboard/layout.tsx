import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireSession } from "@/server/auth/session";
import { getHeaderNotifications } from "@/server/repositories/header";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();
  const notifications = await getHeaderNotifications();
  return (
    <DashboardShell session={session} notifications={notifications}>
      {children}
    </DashboardShell>
  );
}
