import "server-only";

export async function getHeaderNotifications() {
  return {
    count: 5,
    items: [
      {
        id: "monitoring-alert-1",
        umkmId: "rumah-keripik",
        slug: "rumah-keripik",
        businessName: "Rumah Keripik",
        status: "critical",
        submittedAt: "2026-07-09T08:35:00+08:00",
      },
      {
        id: "monitoring-alert-2",
        umkmId: "mulkan-mimbaun",
        slug: "mulkan-mimbaun",
        businessName: "Mulkan Mimba'un",
        status: "warning",
        submittedAt: "2026-07-09T07:52:00+08:00",
      },
      {
        id: "monitoring-alert-3",
        umkmId: "bio-atama",
        slug: "bio-atama",
        businessName: "Bio Atama",
        status: "warning",
        submittedAt: "2026-07-08T11:10:00+08:00",
      },
    ],
  };
}
