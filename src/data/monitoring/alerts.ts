import type { MonitoringNote, WebsiteAlert } from "@/types/monitoring";

export const alertSeeds: Omit<WebsiteAlert, "websiteName">[] = [
  {
    id: "alert-rumah-keripik-lcp",
    websiteSlug: "rumah-keripik",
    severity: "critical",
    issue: "LCP lambat pada halaman produk utama.",
    detectedAt: "2026-07-09T08:35:00+08:00",
    category: "performance",
  },
  {
    id: "alert-rumah-keripik-cta",
    websiteSlug: "rumah-keripik",
    severity: "warning",
    issue: "CTA tidak mendapatkan klik signifikan dalam periode aktif.",
    detectedAt: "2026-07-08T16:20:00+08:00",
    category: "conversion",
  },
  {
    id: "alert-mulkan-seo",
    websiteSlug: "mulkan-mimbaun",
    severity: "warning",
    issue: "Meta description belum optimal pada beberapa halaman.",
    detectedAt: "2026-07-09T07:52:00+08:00",
    category: "seo",
  },
  {
    id: "alert-bio-sitemap",
    websiteSlug: "bio-atama",
    severity: "warning",
    issue: "Sitemap belum terbaca pada pemeriksaan terakhir.",
    detectedAt: "2026-07-08T11:10:00+08:00",
    category: "seo",
  },
  {
    id: "alert-minyak-uptime",
    websiteSlug: "minyak-pamboang",
    severity: "warning",
    issue: "Uptime menurun dibanding pemeriksaan sebelumnya.",
    detectedAt: "2026-07-09T06:42:00+08:00",
    category: "uptime",
  },
];

export const monitoringNoteSeeds: MonitoringNote[] = [
  {
    id: "note-rumah-keripik-1",
    websiteSlug: "rumah-keripik",
    title: "Audit gambar hero dan ukuran asset produk.",
    status: "open",
    priority: "high",
    createdAt: "2026-07-08T13:22:00+08:00",
    assignee: "Tim Website",
  },
  {
    id: "note-mulkan-1",
    websiteSlug: "mulkan-mimbaun",
    title: "Tulis ulang meta description untuk halaman produk herbal.",
    status: "open",
    priority: "medium",
    createdAt: "2026-07-07T10:05:00+08:00",
    assignee: "SEO",
  },
];
