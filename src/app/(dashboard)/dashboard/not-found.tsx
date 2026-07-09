import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardNotFound() {
  return (
    <div className="flex min-h-[55vh] flex-col items-center justify-center text-center">
      <SearchX className="size-10 text-[#98A2B3]" />
      <h2 className="mt-4 text-xl font-semibold">Data tidak ditemukan</h2>
      <p className="mt-2 text-sm text-[#667085]">
        Website mungkin belum tersedia atau tautannya tidak lagi berlaku.
      </p>
      <Button asChild className="mt-5">
        <Link href="/dashboard/websites">Kembali ke Website UMKM</Link>
      </Button>
    </div>
  );
}
