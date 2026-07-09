import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { NextResponse } from "next/server";

import {
  getMonitoringDateRange,
  monitoringRepository,
} from "@/lib/monitoring/repository";
import {
  formatCompactNumber,
  formatDateIndonesia,
  formatDecimal,
  formatNumber,
  formatPercent,
} from "@/lib/monitoring/formatters";
import { requireApiSession } from "@/server/auth/session";
import type { WebsiteMonitoringItem } from "@/types/monitoring";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

interface GeminiPart {
  text?: string;
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: GeminiPart[];
    };
  }>;
  error?: {
    message?: string;
  };
}

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    (candidate.role === "user" || candidate.role === "assistant") &&
    typeof candidate.content === "string"
  );
}

function getSlugFromPath(path?: string) {
  if (!path) return null;
  const match = path.match(/\/dashboard\/websites\/([^/?#]+)/);
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

function readEnvFileValue(fileName: string, key: string) {
  const filePath = join(process.cwd(), fileName);
  if (!existsSync(filePath)) return null;
  const lines = readFileSync(filePath, "utf8").split(/\r?\n/);
  return lines.reduce<string | null>((current, item) => {
    const trimmed = item.trim();
    const isMatch =
      trimmed.startsWith(`${key}=`) || trimmed.startsWith(`export ${key}=`);
    if (!isMatch) return current;
    const raw = trimmed
      .replace(/^export\s+/, "")
      .split("=")
      .slice(1)
      .join("=");
    const value = raw.trim().replace(/^['"]|['"]$/g, "");
    return value || current;
  }, null);
}

function getLocalEnvValue(key: string) {
  return (
    process.env[key] ??
    readEnvFileValue(".env.local", key) ??
    readEnvFileValue(".env", key) ??
    readEnvFileValue(".env.example", key)
  );
}

function buildWebsiteLine(rank: number, website: WebsiteMonitoringItem) {
  return `${rank}. ${website.name} (${website.domain}): Google ${formatNumber(website.metrics.organicClicks)}, pengunjung ${formatNumber(website.metrics.uniqueVisitors)}, WA ${formatNumber(website.metrics.whatsappClicks)}, konversi ${formatPercent(website.metrics.whatsappConversionRate)}%, posisi ${formatDecimal(website.metrics.averagePosition)}, health ${website.performance.healthScore}, trend ${formatPercent(website.trendPercentage)}%.`;
}

async function buildMonitoringContext(pagePath?: string) {
  const range = getMonitoringDateRange({ preset: "all" });
  const overview = await monitoringRepository.getOverview(range);
  const rankingGoogle = [...overview.websites]
    .sort((a, b) => b.metrics.organicClicks - a.metrics.organicClicks)
    .slice(0, 5);
  const rankingWhatsapp = [...overview.websites]
    .sort((a, b) => b.metrics.whatsappClicks - a.metrics.whatsappClicks)
    .slice(0, 5);
  const monthly = overview.websites
    .map((website) => {
      const months = website.monthlyGoogleVisits
        .map((item) => `${item.label}: ${item.visits}`)
        .join(", ");
      return `${website.name}: ${months}`;
    })
    .join("\n");
  const slug = getSlugFromPath(pagePath);
  const detail = slug
    ? await monitoringRepository.getWebsiteBySlug(slug, range)
    : null;

  return [
    `Periode aktif: ${overview.range.label} (${formatDateIndonesia(overview.range.from)} sampai ${formatDateIndonesia(overview.range.to)}).`,
    `Total website: ${formatNumber(overview.statusCounts.total)} UMKM aktif.`,
    `Total pengunjung: ${formatNumber(overview.totals.uniqueVisitors)}; tayangan halaman: ${formatNumber(overview.totals.pageViews)}; kunjungan Google: ${formatNumber(overview.totals.organicClicks)}; tayangan Google: ${formatNumber(overview.totals.searchImpressions)}; klik WhatsApp: ${formatNumber(overview.totals.whatsappClicks)}; konversi WhatsApp: ${formatPercent(overview.totals.whatsappConversionRate)}%.`,
    `Ranking kunjungan Google:\n${rankingGoogle.map((website, index) => buildWebsiteLine(index + 1, website)).join("\n")}`,
    `Ranking WhatsApp:\n${rankingWhatsapp.map((website, index) => buildWebsiteLine(index + 1, website)).join("\n")}`,
    `Sumber kunjungan: ${overview.trafficSources.map((source) => `${source.source} ${formatCompactNumber(source.visitors)} (${formatPercent(source.percentage)}%)`).join(", ")}.`,
    `Kondisi website: sehat ${overview.healthSummary.healthy}, perlu perhatian ${overview.healthSummary.attention}, bermasalah ${overview.healthSummary.critical}.`,
    `Data bulanan kunjungan Google:\n${monthly}`,
    detail
      ? `Detail halaman aktif: ${detail.name}, domain ${detail.domain}, terindeks Google ${formatDateIndonesia(detail.googleIndexedAt)}, total Google ${formatNumber(detail.metrics.organicClicks)}, pengunjung ${formatNumber(detail.metrics.uniqueVisitors)}, WA ${formatNumber(detail.metrics.whatsappClicks)}, conversion ${formatPercent(detail.metrics.whatsappConversionRate)}%, top query ${detail.searchQueries[0]?.query ?? "tidak tersedia"}, health ${detail.performance.healthScore}.`
      : "",
  ]
    .filter(Boolean)
    .join("\n\n");
}

export async function POST(request: Request) {
  const session = await requireApiSession();
  if (!session) {
    return NextResponse.json(
      { error: "Sesi dashboard tidak aktif." },
      { status: 401 },
    );
  }

  const apiKey = getLocalEnvValue("GEMINI_API_KEY");
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "GEMINI_API_KEY belum ditemukan. Tambahkan GEMINI_API_KEY ke .env.local atau .env.example untuk mengaktifkan asisten analisa.",
      },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => null)) as {
    messages?: unknown;
    pagePath?: unknown;
  } | null;
  const messages = Array.isArray(body?.messages)
    ? body.messages.filter(isChatMessage).slice(-8)
    : [];
  const pagePath = typeof body?.pagePath === "string" ? body.pagePath : "";

  if (!messages.length) {
    return NextResponse.json(
      { error: "Pesan belum tersedia." },
      { status: 400 },
    );
  }

  const model = getLocalEnvValue("GEMINI_MODEL") ?? "gemini-2.5-flash";
  const context = await buildMonitoringContext(pagePath);
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: {
        parts: [
          {
            text: [
              "Anda adalah asisten analisa data monitoring website UMKM DekatLokal.",
              "Jawab hanya berdasarkan konteks dashboard monitoring yang diberikan.",
              "Jika pertanyaan di luar dashboard ini, tolak secara singkat dan arahkan kembali ke insight monitoring.",
              "Gunakan bahasa Indonesia yang ringkas, profesional, dan berikan rekomendasi tindak lanjut bila relevan.",
            ].join(" "),
          },
        ],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: `Konteks monitoring saat ini:\n${context}` }],
        },
        ...messages.map((message) => ({
          role: message.role === "assistant" ? "model" : "user",
          parts: [{ text: message.content }],
        })),
      ],
      generationConfig: {
        temperature: 0.25,
        maxOutputTokens: 700,
      },
    }),
  });

  const data = (await response
    .json()
    .catch(() => null)) as GeminiResponse | null;
  if (!response.ok) {
    return NextResponse.json(
      {
        error:
          data?.error?.message ??
          "Asisten analisa belum dapat memproses permintaan.",
      },
      { status: response.status },
    );
  }

  const text =
    data?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? "")
      .join("")
      .trim() ?? "";

  return NextResponse.json({
    message:
      text ||
      "Saya belum menemukan insight yang cukup dari konteks monitoring saat ini.",
  });
}
