"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Bot, Send, Sparkles, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export function MonitoringAiChat() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Halo, saya siap bantu membaca insight monitoring website UMKM DekatLokal.",
    },
  ]);

  const canSubmit = useMemo(
    () => input.trim().length > 0 && !loading,
    [input, loading],
  );

  async function sendMessage() {
    const content = input.trim();
    if (!content || loading) return;
    const nextMessages = [...messages, { role: "user" as const, content }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    const startedAt = Date.now();

    try {
      const response = await fetch("/api/ai/monitoring-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages,
          pagePath: pathname,
        }),
      });
      const data = (await response.json().catch(() => null)) as {
        message?: string;
        error?: string;
      } | null;
      const thinkingDelay = Math.max(0, 850 - (Date.now() - startedAt));
      if (thinkingDelay) {
        await new Promise((resolve) =>
          window.setTimeout(resolve, thinkingDelay),
        );
      }
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            data?.message ??
            data?.error ??
            "Asisten analisa belum dapat merespons saat ini.",
        },
      ]);
    } catch {
      const thinkingDelay = Math.max(0, 850 - (Date.now() - startedAt));
      if (thinkingDelay) {
        await new Promise((resolve) =>
          window.setTimeout(resolve, thinkingDelay),
        );
      }
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: "Koneksi ke asisten analisa belum tersedia.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3">
      {open ? (
        <section
          className="w-[min(calc(100vw-2rem),390px)] overflow-hidden rounded-[26px] border border-white/70 bg-white/95 shadow-[0_24px_70px_rgba(16,24,40,.22)] backdrop-blur-xl"
          aria-label="Asisten analisa data monitoring"
        >
          <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFF_100%)] px-4 py-3.5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,#0B63F6_0%,#6AA6FF_48%,#0FBA81_100%)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,.5),0_10px_22px_rgba(2,85,245,.26)]">
                <div className="absolute inset-1 rounded-[14px] bg-white/20" />
                <Sparkles className="relative size-5 drop-shadow-sm" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="truncate text-sm font-semibold text-[#101828]">
                    Asisten Analisa
                  </h2>
                </div>
                <p className="mt-0.5 truncate text-xs text-[var(--text-secondary)]">
                  Insight monitoring website UMKM
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8"
              aria-label="Tutup asisten"
              onClick={() => setOpen(false)}
            >
              <X />
            </Button>
          </div>
          <div className="max-h-[380px] space-y-3 overflow-y-auto bg-[#F6F8FB] p-3.5">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={cn(
                  "max-w-[86%] rounded-[20px] px-3.5 py-2.5 text-sm leading-relaxed shadow-sm",
                  message.role === "user"
                    ? "ml-auto rounded-br-md bg-[var(--brand-primary)] text-white"
                    : "mr-auto rounded-bl-md border border-white bg-white text-[#344054]",
                )}
              >
                {message.content}
              </div>
            ))}
            {loading ? (
              <div className="mr-auto inline-flex max-w-[86%] items-center gap-2 rounded-[20px] rounded-bl-md border border-white bg-white px-3.5 py-2.5 text-sm text-[#667085] shadow-sm">
                <span className="flex size-6 items-center justify-center rounded-full bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]">
                  <Bot className="size-3.5" />
                </span>
                <span>Berpikir</span>
                <span className="flex items-center gap-1">
                  <span className="size-1.5 animate-bounce rounded-full bg-[#98A2B3]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-[#98A2B3] [animation-delay:120ms]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-[#98A2B3] [animation-delay:240ms]" />
                </span>
              </div>
            ) : null}
          </div>
          <div className="border-t border-[var(--border)] p-3">
            <div className="flex items-end gap-2">
              <Textarea
                value={input}
                rows={2}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void sendMessage();
                  }
                }}
                placeholder="Tanyakan insight traffic, Google, WhatsApp, atau health."
                aria-label="Pesan untuk asisten analisa"
                className="min-h-16 resize-none"
              />
              <Button
                type="button"
                size="icon"
                disabled={!canSubmit}
                aria-label="Kirim pesan"
                onClick={() => void sendMessage()}
              >
                <Send />
              </Button>
            </div>
          </div>
        </section>
      ) : null}
      <Button
        type="button"
        size="icon"
        className="group relative size-14 overflow-hidden rounded-[22px] border border-white/60 bg-[linear-gradient(145deg,#075FF7_0%,#5EA1FF_45%,#11A37F_100%)] shadow-[0_18px_44px_rgba(2,85,245,.34)] transition-transform hover:-translate-y-0.5 hover:shadow-[0_22px_54px_rgba(2,85,245,.42)]"
        aria-label="Buka asisten analisa"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="absolute inset-1 rounded-[18px] bg-white/16" />
        <span className="absolute -top-3 left-2 h-8 w-10 rounded-full bg-white/35 blur-sm transition-transform group-hover:translate-x-2" />
        <Sparkles className="relative size-6 text-white drop-shadow-sm" />
      </Button>
    </div>
  );
}
