"use client";

import { Button } from "@/components/ui/button";

export default function RootError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="id">
      <body>
        <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
          <h1 className="text-2xl font-semibold">Terjadi kendala</h1>
          <p className="mt-2 max-w-md text-sm text-[#667085]">
            Permintaan belum selesai. Silakan coba kembali tanpa mengulangi
            perubahan manual.
          </p>
          <Button className="mt-5" onClick={reset}>
            Coba lagi
          </Button>
        </main>
      </body>
    </html>
  );
}
