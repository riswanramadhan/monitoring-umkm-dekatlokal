# Dashboard Monitoring Website UMKM DekatLokal

Dokumen ini menjelaskan isi dashboard monitoring website UMKM DekatLokal untuk
kebutuhan presentasi internal superadmin.

## Tujuan Dashboard

Dashboard ini dipakai untuk membaca kondisi 13 website UMKM aktif yang berada di
subdomain DekatLokal. Fokus utamanya adalah melihat performa landing page UMKM
secara ringkas: visibilitas Google, kunjungan, klik WhatsApp, konversi, dan
kondisi teknis website.

Semua website pada dashboard ini adalah landing page statis satu halaman. Karena
itu nilai `Indexed pages` dan `Total pages` dibuat 1 untuk setiap UMKM.

## Cakupan Website

Dashboard mencakup 13 UMKM aktif:

1. Aroma Bakery
2. Bio Atama
3. Kira Kira Michi
4. Iboo IDN
5. Minyak Pamboang
6. Kopi Teko
7. Eyfa Natural Oil
8. Mulkan Mimba'un
9. Rumah Keripik
10. Kareppe Crunch
11. Ginger Fit Plus
12. Bakpia Malino
13. Dapur Karaeng

## Menu Overview

Menu Overview adalah ringkasan utama untuk melihat kondisi semua website dalam
satu layar.

KPI yang ditampilkan:

- `Website Aktif`: jumlah website UMKM yang sedang live.
- `Pengunjung Unik`: estimasi jumlah pengunjung berbeda pada periode aktif.
- `Tayangan Halaman`: jumlah halaman landing page yang dibuka pengunjung.
- `Tayangan Google`: jumlah kemunculan website pada hasil pencarian Google.
- `Klik dari Google`: kunjungan yang berasal dari klik hasil pencarian Google.
- `Klik WhatsApp`: total interaksi pada tombol WhatsApp.
- `Konversi WhatsApp`: unique WhatsApp clicker dibagi pengunjung unik.
- `Rata-rata Posisi Google`: rata-rata posisi website di hasil pencarian; makin
  kecil makin baik.

Grafik `Perkembangan Performa Website` dipakai untuk melihat perubahan metrik
harian. Pilihan metriknya mencakup pengunjung, tayangan halaman, tayangan Google,
klik Google, dan klik WhatsApp.

Card `Peringkat Website` membantu melihat UMKM terbaik berdasarkan traffic,
klik WhatsApp, konversi, tayangan Google, atau pertumbuhan.

Card `Konversi WhatsApp` menjelaskan funnel sederhana dari tayangan halaman,
pengunjung, melihat CTA, klik WhatsApp, sampai unique clicker.

Card `Sumber Kunjungan` membagi traffic ke Organic Search, Direct, Instagram,
WhatsApp, dan Lainnya.

Card `Performa Google Search` menjelaskan performa pencarian: impressions,
clicks, CTR, posisi rata-rata, indexed pages, query aktif, dan top query.

Card `Kondisi Website` menunjukkan ringkasan kesehatan website berdasarkan skor
monitoring internal.

## Menu Website UMKM

Menu Website UMKM menampilkan daftar semua website yang dimonitor.

Data yang ditampilkan per website:

- Nama dan domain website.
- Jenis dan lokasi UMKM.
- Status live.
- Pengunjung, tayangan halaman, klik WhatsApp, conversion rate.
- Posisi rata-rata Google.
- Skor monitoring internal.
- Trend traffic.

Menu ini dapat dipakai untuk mencari, memfilter, mengurutkan, membuka website,
dan masuk ke detail setiap UMKM.

## Detail Website

Halaman detail dipakai untuk membaca satu website UMKM secara lebih dalam.

### Tab Overview

Tab ini menampilkan KPI khusus satu website, grafik trend, sumber traffic,
device, top query, CTA terbaik, dan total kunjungan Google.

Grafik pada detail dimulai dari tanggal website tersebut mulai terindeks Google,
bukan dari tanggal website lain.

### Tab Traffic

Tab Traffic menjelaskan performa kunjungan landing page:

- Visitors: jumlah pengunjung unik.
- Sessions: jumlah sesi kunjungan.
- Page views: jumlah tayangan landing page.
- Pages/session: rata-rata halaman per sesi.
- Avg. engagement: estimasi waktu interaksi rata-rata.
- Engagement rate: rasio sesi yang memiliki interaksi bermakna.
- Lokasi Pengunjung: estimasi provinsi asal traffic, bukan kota/kabupaten.
- Device category: proporsi mobile, desktop, dan tablet.
- Traffic source: asal kunjungan.

### Tab Google Search

Tab Google Search menjelaskan performa website di hasil pencarian Google:

- Impressions: jumlah kemunculan website di Google.
- Clicks: jumlah klik dari Google.
- CTR: clicks dibagi impressions.
- Position: posisi rata-rata pencarian.
- Indexed pages: jumlah halaman yang terindeks.
- Query aktif: kata kunci yang menghasilkan visibilitas.

### Tab CTA WhatsApp

Tab ini menjelaskan efektivitas tombol WhatsApp:

- Total click: semua klik tombol WhatsApp.
- Unique clicker: jumlah pengunjung berbeda yang klik WhatsApp.
- Conversion rate: unique clicker dibagi pengunjung unik.
- Trend click: arah perubahan klik pada periode aktif.
- Click berdasarkan device: pembagian klik WhatsApp berdasarkan perangkat.

### Tab Performance

Tab Performance menjelaskan kondisi teknis website:

- Uptime: estimasi ketersediaan website.
- Lighthouse performance: skor performa halaman.
- SEO score: kesiapan SEO dasar halaman.
- Accessibility score: aksesibilitas dasar.
- Best practices score: praktik teknis website.
- LCP, INP, CLS: indikator Core Web Vitals.
- Performance history: riwayat skor teknis.

### Tab Catatan

Tab Catatan dipakai untuk membuat catatan tindak lanjut internal, misalnya
optimasi SEO, perbaikan copy CTA, atau perbaikan performa.

## Menu Laporan

Menu Laporan menyediakan ringkasan performa website dan tombol `Export CSV`.

Kolom CSV:

- Website
- Domain
- Tanggal Terindeks Google
- Kunjungan Google
- Pengunjung
- Tayangan Halaman
- Kunjungan WhatsApp
- Conversion Rate
- CTR
- Posisi Rata-rata
- Health Score
- Trend

CSV menggunakan UTF-8 BOM agar aman dibuka di Excel.

## Skor Monitoring Internal

Skor Monitoring Internal adalah indikator internal DekatLokal, bukan metric
resmi Google.

Komposisi skor:

- 25% uptime
- 20% Core Web Vitals
- 20% SEO readiness
- 20% traffic trend
- 15% kelengkapan tracking konversi

Label skor:

- 85-100: Sangat Baik
- 70-84: Baik
- 50-69: Perlu Perhatian
- Di bawah 50: Bermasalah

## Cara Membaca Insight

Prioritas optimasi dapat dibaca dari kombinasi berikut:

- Kunjungan Google tinggi tetapi klik WhatsApp rendah berarti CTA atau penawaran
  perlu diperbaiki.
- Tayangan Google tinggi tetapi CTR rendah berarti title, meta description, atau
  relevansi query perlu ditinjau.
- Posisi rata-rata besar berarti website masih perlu optimasi SEO.
- Traffic turun tetapi health score baik berarti kemungkinan masalah ada pada
  demand, campaign, atau konten.
- Health score rendah berarti perbaikan teknis perlu didahulukan sebelum
  optimasi growth.

## Catatan Presentasi

Gunakan Overview untuk menjelaskan gambaran seluruh UMKM, Website UMKM untuk
menunjukkan daftar operasional, Detail Website untuk studi kasus per brand, dan
Laporan untuk kebutuhan ekspor data.
