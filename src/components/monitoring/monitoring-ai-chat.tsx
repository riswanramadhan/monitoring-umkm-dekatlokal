"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Bot, Send, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

function RobotMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,#0255F5_0%,#4D8DFF_55%,#0FBA81_100%)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,.55),0_10px_22px_rgba(2,85,245,.24)]",
        className,
      )}
    >
      <span className="absolute inset-1 rounded-[14px] bg-white/18" />
      <Bot className="relative size-5" strokeWidth={2.4} />
      <span className="absolute right-1.5 bottom-1.5 size-2 rounded-full bg-[#22C55E] ring-2 ring-white" />
    </span>
  );
}

function renderInline(content: string) {
  const pieces = content.split(/(\*\*[^*]+\*\*)/g);
  return pieces.map((piece, index) => {
    const bold = piece.startsWith("**") && piece.endsWith("**");
    if (!bold) return <span key={`${piece}-${index}`}>{piece}</span>;
    return (
      <strong key={`${piece}-${index}`} className="font-bold text-inherit">
        {piece.slice(2, -2)}
      </strong>
    );
  });
}

function FormattedMessage({ content }: { content: string }) {
  const blocks = useMemo(() => {
    const groups: Array<{
      type: "paragraph" | "bullets" | "numbers";
      lines: string[];
    }> = [];
    let current:
      | {
          type: "paragraph" | "bullets" | "numbers";
          lines: string[];
        }
      | null = null;

    function pushCurrent() {
      if (current && current.lines.length) groups.push(current);
      current = null;
    }

    content
      .trim()
      .split(/\r?\n/)
      .forEach((rawLine) => {
        const line = rawLine.trimEnd();
        const trimmed = line.trim();
        if (!trimmed) {
          pushCurrent();
          return;
        }

        const type = /^[-*]\s+/.test(trimmed)
          ? "bullets"
          : /^\d+[.)]\s+/.test(trimmed)
            ? "numbers"
            : "paragraph";
        const value =
          type === "bullets"
            ? trimmed.replace(/^[-*]\s+/, "")
            : type === "numbers"
              ? trimmed.replace(/^\d+[.)]\s+/, "")
              : trimmed;

        if (!current || current.type !== type) {
          pushCurrent();
          current = { type, lines: [] };
        }
        current.lines.push(value);
      });
    pushCurrent();

    return groups;
  }, [content]);

  if (!blocks.length) return null;

  return (
    <div className="space-y-2 break-words [overflow-wrap:anywhere]">
      {blocks.map((block, index) => {
        if (block.type === "bullets") {
          return (
            <ul
              key={`${block.type}-${index}`}
              className="list-disc space-y-1 pl-4"
            >
              {block.lines.map((line, lineIndex) => (
                <li key={`${line}-${lineIndex}`}>{renderInline(line)}</li>
              ))}
            </ul>
          );
        }
        if (block.type === "numbers") {
          return (
            <ol
              key={`${block.type}-${index}`}
              className="list-decimal space-y-1 pl-4"
            >
              {block.lines.map((line, lineIndex) => (
                <li key={`${line}-${lineIndex}`}>{renderInline(line)}</li>
              ))}
            </ol>
          );
        }
        return (
          <p key={`${block.type}-${index}`}>
            {block.lines.reduce<ReactNode[]>((nodes, line, lineIndex) => {
              if (lineIndex) nodes.push(<br key={`br-${lineIndex}`} />);
              nodes.push(
                <span key={`${line}-${lineIndex}`}>{renderInline(line)}</span>,
              );
              return nodes;
            }, [])}
          </p>
        );
      })}
    </div>
  );
}

export function MonitoringAiChat() {
  const pathname = usePathname();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
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

  useEffect(() => {
    if (!open) return;
    messagesEndRef.current?.scrollIntoView({ block: "end" });
  }, [messages, loading, open]);

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
          className="w-[min(calc(100vw-2rem),440px)] overflow-hidden rounded-[26px] border border-white/70 bg-white/95 shadow-[0_24px_70px_rgba(16,24,40,.22)] backdrop-blur-xl"
          aria-label="Asisten analisa data monitoring"
        >
          <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFF_100%)] px-4 py-3.5">
            <div className="flex min-w-0 items-center gap-3">
              <RobotMark />
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
          <div className="max-h-[min(68vh,560px)] space-y-3 overflow-y-auto bg-[#F6F8FB] p-3.5">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={cn(
                  "max-w-[92%] rounded-[20px] px-3.5 py-2.5 text-sm leading-relaxed shadow-sm",
                  message.role === "user"
                    ? "ml-auto rounded-br-md bg-[var(--brand-primary)] text-white"
                    : "mr-auto rounded-bl-md border border-white bg-white text-[#344054]",
                )}
              >
                <FormattedMessage content={message.content} />
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
            <div ref={messagesEndRef} />
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
        className="group relative size-14 overflow-visible rounded-[22px] border border-white/60 bg-white p-0 shadow-[0_18px_44px_rgba(2,85,245,.34)] transition-transform hover:-translate-y-0.5 hover:shadow-[0_22px_54px_rgba(2,85,245,.42)]"
        aria-label="Buka asisten analisa"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="absolute right-2 bottom-1 size-3 rotate-45 rounded-[3px] bg-[#0FBA81]" />
        <RobotMark className="size-14 rounded-[22px]" />
      </Button>
    </div>
  );
}
