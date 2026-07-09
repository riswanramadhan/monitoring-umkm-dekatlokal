"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[55vh] flex-col items-center justify-center text-center">
      <div className="rounded-2xl bg-[#FEE2E2] p-4 text-[#DC2626]">
        <AlertTriangle className="size-7" />
      </div>
      <h2 className="mt-4 text-xl font-semibold">
        Dashboard belum dapat dimuat
      </h2>
      <p className="mt-2 max-w-md text-sm text-[#667085]">
        Muat ulang data lokal lalu coba lagi. Tidak ada perubahan permanen yang
        disimpan.
      </p>
      <Button onClick={reset} className="mt-5">
        <RefreshCw />
        Coba lagi
      </Button>
    </div>
  );
}
