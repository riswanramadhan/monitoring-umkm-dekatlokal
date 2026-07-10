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

type AiSoundAction = "toggle" | "send" | "complete";

function RobotMark({
  className,
  floating = false,
}: {
  className?: string;
  floating?: boolean;
}) {
  return (
    <span
      className={cn(
        "relative flex size-10 shrink-0 items-center justify-center overflow-visible rounded-2xl text-white [filter:drop-shadow(0_16px_18px_rgba(2,85,245,.22))] [transform-style:preserve-3d]",
        floating && "dekat-ai-float",
        className,
      )}
    >
      <span className="absolute -inset-1 [transform:translateZ(-10px)] rounded-[inherit] bg-[conic-gradient(from_160deg,#C7F9FF,#0255F5,#0FBA81,#C7F9FF)] opacity-75 shadow-[0_16px_26px_rgba(2,85,245,.24)]" />
      <span className="absolute inset-0 rounded-[inherit] bg-[linear-gradient(145deg,#F8FBFF_0%,#5AA1FF_22%,#0255F5_54%,#11C08A_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,.9),inset_-10px_-12px_18px_rgba(4,46,146,.28),inset_9px_8px_14px_rgba(255,255,255,.22),0_18px_32px_rgba(2,85,245,.32)]" />
      <span className="dekat-ai-shine absolute top-1.5 left-2 h-2 w-5 rounded-full bg-white/70 blur-[.2px]" />
      <span className="absolute inset-[7px] rounded-[12px] bg-white/16 shadow-[inset_0_1px_0_rgba(255,255,255,.42)]" />
      <Bot
        className="relative size-[48%] drop-shadow-[0_2px_4px_rgba(3,21,72,.32)]"
        strokeWidth={2.4}
      />
      <span className="dekat-ai-signal absolute right-1.5 bottom-1.5 size-2.5 rounded-full bg-[#24D682] shadow-[0_0_12px_rgba(36,214,130,.72)] ring-2 ring-white/95" />
    </span>
  );
}

function TypeCursor() {
  return (
    <span
      aria-hidden="true"
      className="dekat-ai-type-cursor ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 rounded-full bg-[var(--brand-primary)] align-baseline"
    />
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
    let current: {
      type: "paragraph" | "bullets" | "numbers";
      lines: string[];
    } | null = null;

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
    <div className="space-y-2 [overflow-wrap:anywhere] break-words">
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
  const audioContextRef = useRef<AudioContext | null>(null);
  const completeSoundRef = useRef(0);
  const typeTimerRef = useRef<number | null>(null);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Halo, saya DEKAT AI. Saya siap bantu membaca insight monitoring website UMKM DekatLokal.",
    },
  ]);

  const busy = loading || typing;
  const canSubmit = useMemo(
    () => input.trim().length > 0 && !busy,
    [busy, input],
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotionPreference = () => setReducedMotion(media.matches);
    syncMotionPreference();
    media.addEventListener("change", syncMotionPreference);
    return () => media.removeEventListener("change", syncMotionPreference);
  }, []);

  useEffect(() => {
    return () => {
      if (typeTimerRef.current) window.clearTimeout(typeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    messagesEndRef.current?.scrollIntoView({ block: "end" });
  }, [messages, loading, open, typing]);

  function getAudioContext() {
    const AudioContextConstructor =
      window.AudioContext ??
      (window as Window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextConstructor) return null;
    audioContextRef.current ??= new AudioContextConstructor();
    return audioContextRef.current;
  }

  function playAiSound(action: AiSoundAction) {
    const context = getAudioContext();
    if (!context) return;

    const schedule = () => {
      const master = context.createGain();
      master.gain.setValueAtTime(0.16, context.currentTime);
      master.connect(context.destination);

      const tone = (
        frequency: number,
        offset: number,
        duration: number,
        type: OscillatorType = "sine",
        volume = 0.8,
      ) => {
        const start = context.currentTime + offset;
        const oscillator = context.createOscillator();
        const envelope = context.createGain();

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, start);
        envelope.gain.setValueAtTime(0.0001, start);
        envelope.gain.exponentialRampToValueAtTime(volume, start + 0.018);
        envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);

        oscillator.connect(envelope);
        envelope.connect(master);
        oscillator.start(start);
        oscillator.stop(start + duration + 0.025);
      };

      if (action === "toggle") {
        tone(540, 0, 0.08, "triangle", 0.7);
        tone(780, 0.075, 0.1, "sine", 0.62);
      }

      if (action === "send") {
        tone(420, 0, 0.045, "square", 0.42);
        tone(660, 0.05, 0.075, "triangle", 0.58);
        tone(920, 0.095, 0.055, "sine", 0.38);
      }

      if (action === "complete") {
        const variants = [
          [760, 980, 1180],
          [680, 920, 1080],
          [860, 720, 1040],
        ] as const;
        const variant =
          variants[completeSoundRef.current % variants.length] ?? variants[0];
        completeSoundRef.current += 1;
        variant.forEach((frequency, index) => {
          tone(frequency, index * 0.07, 0.095, "sine", 0.5);
        });
      }

      window.setTimeout(() => master.disconnect(), 650);
    };

    if (context.state === "suspended") {
      void context
        .resume()
        .then(schedule)
        .catch(() => undefined);
      return;
    }

    schedule();
  }

  function getTypingDelay(char: string) {
    if (char === "\n") return 72;
    if (/[.!?]/.test(char)) return 46;
    if (/[,;:]/.test(char)) return 30;
    return 9;
  }

  async function typeAssistantMessage(content: string) {
    if (typeTimerRef.current) window.clearTimeout(typeTimerRef.current);

    if (reducedMotion) {
      setMessages((current) => [...current, { role: "assistant", content }]);
      playAiSound("complete");
      return;
    }

    const characters = Array.from(content);
    setTyping(true);
    setMessages((current) => [...current, { role: "assistant", content: "" }]);

    await new Promise<void>((resolve) => {
      let index = 0;
      const tick = () => {
        index += 1;
        const visibleContent = characters.slice(0, index).join("");
        setMessages((current) => {
          const next = [...current];
          const lastIndex = next.length - 1;
          const lastMessage = next[lastIndex];
          if (!lastMessage) return current;
          next[lastIndex] = {
            ...lastMessage,
            content: visibleContent,
          };
          return next;
        });

        if (index >= characters.length) {
          setTyping(false);
          playAiSound("complete");
          resolve();
          return;
        }

        typeTimerRef.current = window.setTimeout(
          tick,
          getTypingDelay(characters[index - 1] ?? ""),
        );
      };

      tick();
    });
  }

  async function sendMessage() {
    const content = input.trim();
    if (!content || busy) return;
    playAiSound("send");
    const nextMessages = [...messages, { role: "user" as const, content }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    const startedAt = Date.now();
    let assistantReply = "";

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
      assistantReply =
        data?.message ??
        data?.error ??
        "DEKAT AI belum dapat merespons saat ini.";
    } catch {
      const thinkingDelay = Math.max(0, 850 - (Date.now() - startedAt));
      if (thinkingDelay) {
        await new Promise((resolve) =>
          window.setTimeout(resolve, thinkingDelay),
        );
      }
      assistantReply = "Koneksi ke DEKAT AI belum tersedia.";
    } finally {
      setLoading(false);
    }

    await typeAssistantMessage(assistantReply);
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3">
      {open ? (
        <section
          className="w-[min(calc(100vw-2rem),440px)] overflow-hidden rounded-[26px] border border-white/70 bg-white/95 shadow-[0_24px_70px_rgba(16,24,40,.22)] backdrop-blur-xl"
          aria-label="DEKAT AI"
        >
          <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFF_100%)] px-4 py-3.5">
            <div className="flex min-w-0 items-center gap-3">
              <RobotMark />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="truncate text-sm font-semibold text-[#101828]">
                    DEKAT AI
                  </h2>
                </div>
                <p className="mt-0.5 truncate text-xs text-[var(--text-secondary)]">
                  Asisten monitoring website UMKM
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8"
              aria-label="Tutup DEKAT AI"
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
                {typing &&
                message.role === "assistant" &&
                index === messages.length - 1 ? (
                  <TypeCursor />
                ) : null}
              </div>
            ))}
            {loading ? (
              <div className="mr-auto inline-flex max-w-[86%] items-center gap-2 rounded-[20px] rounded-bl-md border border-white bg-white px-3.5 py-2.5 text-sm text-[#667085] shadow-sm">
                <span className="flex size-6 items-center justify-center rounded-full bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]">
                  <Bot className="size-3.5" />
                </span>
                <span>DEKAT AI berpikir</span>
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
                aria-label="Pesan untuk DEKAT AI"
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
        aria-label="Buka DEKAT AI"
        onClick={() => {
          playAiSound("toggle");
          setOpen((value) => !value);
        }}
      >
        <span className="absolute right-2 bottom-1 size-3 rotate-45 rounded-[3px] bg-[#0FBA81]" />
        <RobotMark className="size-14 rounded-[22px]" floating />
      </Button>
    </div>
  );
}
