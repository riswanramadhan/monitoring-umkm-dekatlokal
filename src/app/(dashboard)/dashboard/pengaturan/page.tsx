import { PageHeader } from "@/components/dashboard/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireSession } from "@/server/auth/session";

export default async function SettingsPage() {
  await requireSession();
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Superadmin"
        title="Pengaturan"
        description="Kelola preferensi dashboard monitoring website UMKM DekatLokal."
      />
      <Card>
        <CardHeader>
          <CardTitle>Preferensi Monitoring</CardTitle>
          <CardDescription>
            Konfigurasi tampilan dan akses dashboard superadmin.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl bg-[var(--surface-muted)] p-4">
            <p className="text-sm font-semibold text-[#101828]">
              Timezone dashboard
            </p>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Asia/Makassar
            </p>
          </div>
          <div className="rounded-xl bg-[var(--surface-muted)] p-4">
            <p className="text-sm font-semibold text-[#101828]">Role aktif</p>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Superadmin
            </p>
          </div>
          <div className="rounded-xl bg-[var(--surface-muted)] p-4">
            <p className="text-sm font-semibold text-[#101828]">
              Cakupan monitoring
            </p>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              13 website UMKM aktif
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
