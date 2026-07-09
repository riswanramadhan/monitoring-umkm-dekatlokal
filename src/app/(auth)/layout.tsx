import { Logo } from "@/components/brand/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden bg-[#0255F5] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -top-32 -right-32 size-96 rounded-full bg-white/10" />
        <div className="absolute -bottom-40 -left-24 size-[30rem] rounded-full bg-[#0147D6]" />
        <div className="relative">
          <Logo className="rounded-xl bg-white px-4 py-2" />
        </div>
        <div className="relative max-w-xl">
          <p className="mb-4 text-sm font-semibold tracking-[0.2em] text-blue-100 uppercase">
            Monitoring Website UMKM
          </p>
          <h1 className="text-4xl leading-tight font-semibold">
            Pantau performa seluruh website DekatLokal dalam satu ruang kerja.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-blue-100">
            Lihat traffic, visibilitas Google, klik WhatsApp, dan kondisi
            website UMKM tanpa menghubungkan data produksi.
          </p>
        </div>
        <p className="relative text-sm text-blue-100">
          2026 DekatLokal - Built for Local Growth
        </p>
      </section>
      <section className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-md">{children}</div>
      </section>
    </main>
  );
}
