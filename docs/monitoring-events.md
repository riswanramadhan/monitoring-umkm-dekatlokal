# Monitoring Website UMKM - Future Tracking Events

Event berikut disiapkan sebagai kontrak awal untuk integrasi analytics
berikutnya dan belum diaktifkan di produksi.

## Event WhatsApp

Nama event:

```txt
whatsapp_cta_click
```

Parameter:

```ts
{
  website_slug: string;
  website_name: string;
  page_path: string;
  cta_location:
    | "navbar"
    | "hero"
    | "product"
    | "floating"
    | "footer"
    | "package";
  device_category: "mobile" | "desktop" | "tablet";
}
```

## Event Lain

```txt
website_view
product_view
instagram_click
marketplace_click
maps_click
phone_click
email_click
```

Catatan: jangan memasukkan API key atau menyalakan tracking produksi dari
dashboard ini. Integrasi dapat diarahkan ke Google Analytics Data API, Google
Search Console API, PageSpeed atau CrUX API, database DekatLokal, dan internal
health-check API melalui `MonitoringRepository`.
