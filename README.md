# Dashboard Monitoring Website UMKM DekatLokal

Dashboard frontend untuk superadmin DekatLokal dalam memonitor performa website
subdomain UMKM.

Data operasional lokal disiapkan di dalam repository agar tampilan dashboard
dapat dipakai untuk evaluasi internal tanpa memanggil analytics produksi dari
aplikasi.

## Fitur Utama

- Overview monitoring website di `/dashboard`.
- Daftar website di `/dashboard/websites`.
- Detail website di `/dashboard/websites/[slug]`.
- KPI traffic, tayangan Google, klik Google, klik WhatsApp, conversion rate,
  posisi rata-rata, dan skor monitoring internal.
- Grafik Recharts dengan pilihan metric dan pembanding periode sebelumnya.
- Search, filter, sort, pagination, table/grid view, dan mobile card list.
- Tab detail untuk Traffic, Google Search, CTA WhatsApp, Performance, dan
  Catatan.
- Laporan CSV untuk ringkasan performa website.
- Asisten analisa data monitoring berbasis Gemini API.

## Menjalankan Lokal

Prasyarat: Node.js 20.9+ dan pnpm 11.

```bash
pnpm install
pnpm dev
```

Buka `http://localhost:3000`.

Kredensial lokal:

```txt
hello@dekatlokal.com
dekatlokal0110
```

## Struktur Monitoring

```txt
src/
  app/(dashboard)/dashboard/
  components/monitoring/
  data/monitoring/
  lib/monitoring/
  types/monitoring.ts
docs/monitoring-events.md
```

`LocalMonitoringRepository` menjadi abstraction layer agar data lokal mudah
diganti dengan Google Analytics Data API, Google Search Console API, PageSpeed
atau CrUX API, database DekatLokal, dan internal health-check API pada tahap
berikutnya.

## Quality Gate

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```
