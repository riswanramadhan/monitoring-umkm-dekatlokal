import { existsSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  getMonthlyGoogleVisits,
  websiteSeeds,
} from "@/data/monitoring/websites";
import { generateWebsiteDailyTrends } from "@/data/monitoring/trends";
import {
  aggregateDailyTrends,
  calculateWhatsappConversionRate,
} from "@/lib/monitoring/calculations";

const expectedGoogleVisits = new Map([
  ["aroma-bakery", 121],
  ["bio-atama", 221],
  ["kira-kira-michi", 201],
  ["iboo-idn", 102],
  ["minyak-pamboang", 166],
  ["kopi-teko", 312],
  ["eyfa-natural-oil", 89],
  ["mulkan-mimbaun", 77],
  ["rumah-keripik", 45],
  ["kareppe-crunch", 271],
  ["gingerfitplus", 101],
  ["bakpia-malino", 116],
  ["dapur-karaeng", 12],
]);

describe("monitoring operational data", () => {
  it("contains exactly 13 active UMKM websites", () => {
    expect(websiteSeeds).toHaveLength(13);
    expect(websiteSeeds.every((website) => website.type === "umkm")).toBe(true);
    expect(websiteSeeds.every((website) => website.status === "live")).toBe(
      true,
    );
  });

  it("does not include removed websites", () => {
    const slugs = websiteSeeds.map((website) => website.slug);
    expect(slugs).not.toContain("sikola-indonesia");
    expect(slugs).not.toContain("synergy-unhas");
    expect(slugs).not.toContain("with-soerai");
    expect(slugs).not.toContain("growmates");
  });

  it("keeps cumulative Google visits exactly as provided", () => {
    websiteSeeds.forEach((seed) => {
      expect(seed.googleVisitsTotal).toBe(expectedGoogleVisits.get(seed.slug));
      const metrics = aggregateDailyTrends(generateWebsiteDailyTrends(seed));
      expect(metrics.organicClicks).toBe(seed.googleVisitsTotal);
    });
  });

  it("keeps landing-page metadata and traffic sources realistic", () => {
    websiteSeeds.forEach((seed) => {
      expect(seed.indexedPages).toBe(1);
      expect(seed.totalPages).toBe(1);
      expect(Object.keys(seed.sourceShares)).not.toContain("Referral");
    });
    expect(
      websiteSeeds.find((seed) => seed.slug === "bakpia-malino")?.location,
    ).toBe("Gowa");
  });

  it("keeps UMKM locations scoped to Makassar except the Gowa list", () => {
    const gowaSlugs = new Set([
      "kareppe-crunch",
      "gingerfitplus",
      "rumah-keripik",
      "bakpia-malino",
    ]);
    websiteSeeds.forEach((seed) => {
      expect(seed.location).toBe(
        gowaSlugs.has(seed.slug) ? "Gowa" : "Makassar",
      );
    });
  });

  it("keeps derived landing page traffic conservative", () => {
    websiteSeeds.forEach((seed) => {
      const metrics = aggregateDailyTrends(generateWebsiteDailyTrends(seed));
      expect(metrics.uniqueVisitors).toBeLessThanOrEqual(
        Math.ceil(seed.googleVisitsTotal * 1.8),
      );
      expect(metrics.pageViews).toBeLessThanOrEqual(
        Math.ceil(metrics.uniqueVisitors * 1.45),
      );
      expect(metrics.whatsappClicks).toBeLessThanOrEqual(
        Math.ceil(metrics.uniqueVisitors * 0.06),
      );
    });
  });

  it("generates monthly Google visits that sum to each cumulative total", () => {
    websiteSeeds.forEach((seed) => {
      const monthlyTotal = getMonthlyGoogleVisits(seed).reduce(
        (total, item) => total + item.visits,
        0,
      );
      expect(monthlyTotal).toBe(seed.googleVisitsTotal);
    });
  });

  it("has local logo files for all websites", () => {
    websiteSeeds.forEach((seed) => {
      expect(seed.logoSrc).toBeTruthy();
      expect(
        existsSync(
          join(process.cwd(), "public", seed.logoSrc.replace(/^\//, "")),
        ),
      ).toBe(true);
    });
  });

  it("derives WhatsApp conversion rate from unique clickers", () => {
    expect(calculateWhatsappConversionRate(40, 1_000)).toBe(4);
  });
});
