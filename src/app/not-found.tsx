import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <p className="text-sm font-semibold text-[#0255F5]">404</p>
      <h1 className="mt-2 text-2xl font-semibold">Halaman tidak ditemukan</h1>
      <Button asChild className="mt-5">
        <Link href="/dashboard">Kembali ke dashboard</Link>
      </Button>
    </main>
  );
}
