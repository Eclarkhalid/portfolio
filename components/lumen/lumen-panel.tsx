"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import { ArrowUp, ArrowUpRight, MessageSquare, RotateCcw, Square, X } from "lucide-react";
import { CONTACT_DRAFT_KEY, type LumenEvent } from "@/lib/ai/events";
import { LumenMark } from "@/components/lumen/lumen-mark";

type Mode = "about" | "general";
type PageLink = { path: string; title: string; kind: string };
type Message = {
  role: "user" | "assistant";
  text: string;
  pages?: PageLink[];
  contact?: string;
  error?: string;
};

const STORAGE_KEY = "lumen:v1";
const MAX_QUESTION = 1000;

const MODES: Record<Mode, { label: string; caption: string; placeholder: string; starters: string[] }> = {
  about: {
    label: "About Eclar",
    caption: "Answers come only from this site, with links to the pages they use.",
    placeholder: "Ask about Eclar's work, products or experience",
    starters: [
      "What has Eclar built, and what was his role?",
      "Summarize his experience in three lines",
      "How is SpyGlow different from competitor monitoring?",
      "How do I start a project with him?",
    ],
  },
  general: {
    label: "Ask anything",
    caption: "General questions on software, AI and product. A few an hour.",
    placeholder: "Ask a software, AI or product question",
    starters: [
      "When should AI enter a data pipeline?",
      "Static or dynamic rendering for a portfolio?",
      "How do I make webhook retries safe?",
    ],
  },
};

function loadConversations(): Record<Mode, Message[]> {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "null");
    if (saved && Array.isArray(saved.about) && Array.isArray(saved.general)) return saved;
  } catch {
    // Storage blocked or corrupt: start fresh
  }
  return { about: [], general: [] };
}

/** Minimal, safe Markdown: paragraphs, lists, **bold** and [links](url). */
function renderInline(text: string, onNavigate: () => void): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/g).map((part, index) => {
    const bold = part.match(/^\*\*([^*]+)\*\*$/);
    if (bold) return <strong key={index} className="font-semibold text-neutral-950">{bold[1]}</strong>;
    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (link) {
      const [, label, href] = link;
      if (href.startsWith("/")) {
        return <Link key={index} href={href} onClick={onNavigate} className="font-semibold text-sky-700 hover:underline">{label}</Link>;
      }
      if (/^https:\/\//.test(href)) {
        return <a key={index} href={href} target="_blank" rel="noopener noreferrer" className="font-semibold text-sky-700 hover:underline">{label}</a>;
      }
      return label;
    }
    return part;
  });
}

function Markdown({ text, onNavigate }: { text: string; onNavigate: () => void }) {
  const blocks = text.trim().split(/\n{2,}/);
  return (
    <div className="flex flex-col gap-2.5">
      {blocks.map((block, index) => {
        const lines = block.split("\n");
        if (lines.every((line) => /^\s*[-*]\s+/.test(line))) {
          return (
            <ul key={index} className="list-disc space-y-1 pl-5">
              {lines.map((line, i) => <li key={i}>{renderInline(line.replace(/^\s*[-*]\s+/, ""), onNavigate)}</li>)}
            </ul>
          );
        }
        if (lines.every((line) => /^\s*\d+[.)]\s+/.test(line))) {
          return (
            <ol key={index} className="list-decimal space-y-1 pl-5">
              {lines.map((line, i) => <li key={i}>{renderInline(line.replace(/^\s*\d+[.)]\s+/, ""), onNavigate)}</li>)}
            </ol>
          );
        }
        return <p key={index}>{renderInline(lines.join(" "), onNavigate)}</p>;
      })}
    </div>
  );
}

export default function LumenPanel({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("about");
  const [conversations, setConversations] = useState<Record<Mode, Message[]>>(loadConversations);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [generalLeft, setGeneralLeft] = useState<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const messages = conversations[mode];
  const config = MODES[mode];

  useEffect(() => {
    inputRef.current?.focus();
  }, [mode]);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch {
      // Storage unavailable: the conversation simply won't survive a reload
    }
    endRef.current?.scrollIntoView({ block: "end" });
  }, [conversations]);

  useEffect(() => () => abortRef.current?.abort(), []);

  // On phones the panel covers the page, so close it when leaving for a page
  const closeOnSmallScreens = () => {
    if (window.matchMedia("(max-width: 1023px)").matches) onClose();
  };

  const updateLast = (target: Mode, change: (message: Message) => Message) =>
    setConversations((current) => {
      const list = current[target].slice();
      list[list.length - 1] = change(list[list.length - 1]);
      return { ...current, [target]: list };
    });

  const ask = async (question: string) => {
    const text = question.trim();
    if (!text || busy) return;
    const target = mode;
    const history = [...conversations[target], { role: "user" as const, text }];

    setInput("");
    setBusy(true);
    setConversations((current) => ({
      ...current,
      [target]: [...history, { role: "assistant", text: "" }],
    }));

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          mode: target,
          page: pathname,
          messages: history
            .filter((message) => message.text && !message.error)
            .slice(-40)
            .map((message) => ({ role: message.role, content: message.text })),
        }),
      });

      if (!response.ok || !response.body) {
        const failure = (await response.json().catch(() => null)) as LumenEvent | null;
        updateLast(target, (message) => ({
          ...message,
          error: failure?.type === "error" ? failure.message : "Lumen couldn't answer just now. Please try again.",
          contact: failure?.type === "error" && (failure.code === "unavailable" || failure.code === "budget") ? "" : undefined,
        }));
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const chunks = buffer.split("\n\n");
        buffer = chunks.pop() ?? "";
        for (const chunk of chunks) {
          if (!chunk.startsWith("data: ")) continue;
          const event = JSON.parse(chunk.slice(6)) as LumenEvent;
          if (event.type === "text") updateLast(target, (message) => ({ ...message, text: message.text + event.text }));
          else if (event.type === "pages") updateLast(target, (message) => ({ ...message, pages: [...(message.pages ?? []), ...event.pages].slice(0, 3) }));
          else if (event.type === "contact") updateLast(target, (message) => ({ ...message, contact: event.summary }));
          else if (event.type === "error") updateLast(target, (message) => ({ ...message, error: event.message }));
          else if (event.type === "done") setGeneralLeft(event.generalRemaining);
        }
      }
    } catch {
      if (!controller.signal.aborted) {
        updateLast(target, (message) => ({ ...message, error: "The connection dropped. Please try again." }));
      }
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    ask(input);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      ask(input);
    } else if (event.key === "Escape") {
      onClose();
    }
  };

  const startContact = (summary: string) => {
    try {
      if (summary) sessionStorage.setItem(CONTACT_DRAFT_KEY, summary);
    } catch {
      // Without storage the contact form just opens empty
    }
    closeOnSmallScreens();
    router.push("/contact");
  };

  const reset = () => {
    abortRef.current?.abort();
    setConversations((current) => ({ ...current, [mode]: [] }));
  };

  const tab = (active: boolean) =>
    `min-h-10 rounded-full text-sm font-semibold transition ${active ? "bg-white text-neutral-950 shadow-sm" : "text-neutral-600 hover:text-neutral-900"}`;

  return (
    <div className="flex h-full min-h-0 flex-col" onKeyDown={(event) => event.key === "Escape" && onClose()}>
      <header className="border-b border-neutral-100 px-5 pb-3.5 pt-[max(1rem,env(safe-area-inset-top))] lg:pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-[9px] bg-gradient-to-br from-sky-500 to-violet-500 text-white">
              <LumenMark className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-semibold text-neutral-950">Lumen</p>
              <p className="text-[11px] text-neutral-500">Eclar&apos;s AI guide · Powered by Claude</p>
            </div>
          </div>
          <div className="flex gap-1">
            <button type="button" onClick={reset} aria-label="New conversation" className="inline-flex h-10 w-10 items-center justify-center rounded-full text-neutral-600 transition hover:bg-neutral-100">
              <RotateCcw aria-hidden="true" className="h-4 w-4" />
            </button>
            <button type="button" onClick={onClose} aria-label="Close Lumen" className="inline-flex h-10 w-10 items-center justify-center rounded-full text-neutral-600 transition hover:bg-neutral-100">
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div role="tablist" aria-label="Mode" className="mt-3.5 grid grid-cols-2 gap-1 rounded-full bg-neutral-100 p-1">
          {(Object.keys(MODES) as Mode[]).map((key) => (
            <button key={key} type="button" role="tab" aria-selected={mode === key} onClick={() => setMode(key)} className={tab(mode === key)}>
              {MODES[key].label}
            </button>
          ))}
        </div>
        <p className="mt-2.5 text-xs leading-[18px] text-neutral-600">{config.caption}</p>
      </header>

      <div aria-live="polite" className="scrollbar-subtle min-h-0 flex-1 overflow-y-auto bg-neutral-50/50 px-5 py-4">
        {messages.length === 0 ? (
          <div className="flex flex-col gap-2">
            {config.starters.map((starter) => (
              <button
                key={starter}
                type="button"
                onClick={() => ask(starter)}
                className="min-h-11 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-left text-sm text-neutral-800 transition hover:border-sky-200 hover:bg-sky-50/40"
              >
                {starter}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((message, index) =>
              message.role === "user" ? (
                <div key={index} className="max-w-[85%] self-end whitespace-pre-wrap rounded-2xl rounded-br-md bg-neutral-900 px-3.5 py-2.5 text-sm leading-[21px] text-white">
                  {message.text}
                </div>
              ) : (
                <div key={index} className="flex flex-col gap-2.5 text-sm leading-[22px] text-neutral-800">
                  {message.text ? (
                    <Markdown text={message.text} onNavigate={closeOnSmallScreens} />
                  ) : busy && index === messages.length - 1 && !message.error ? (
                    <span className="inline-flex items-center gap-1.5 text-neutral-500">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sky-500" />
                      Thinking…
                    </span>
                  ) : null}

                  {message.error && <p className="text-sm text-red-700">{message.error}</p>}

                  {message.pages && message.pages.length > 0 && (
                    <div className="flex flex-col gap-1.5">
                      {message.pages.map((page) => (
                        <Link
                          key={page.path}
                          href={page.path}
                          onClick={closeOnSmallScreens}
                          className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-3 py-2.5 transition hover:border-sky-200"
                        >
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[13px] font-semibold text-neutral-900">{page.title}</span>
                            <span className="block text-xs text-neutral-500">{page.kind}</span>
                          </span>
                          <ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0 text-violet-700" />
                        </Link>
                      ))}
                    </div>
                  )}

                  {message.contact !== undefined && (
                    <button
                      type="button"
                      onClick={() => startContact(message.contact ?? "")}
                      className="inline-flex items-center gap-2 self-start rounded-full bg-neutral-900 px-4 py-2.5 text-[13px] font-medium text-white transition hover:bg-sky-800"
                    >
                      <MessageSquare aria-hidden="true" className="h-3.5 w-3.5" />
                      {message.contact ? "Review and send to Eclar" : "Contact Eclar"}
                    </button>
                  )}
                </div>
              )
            )}
            {mode === "general" && generalLeft !== null && (
              <p className="text-center text-xs text-neutral-500">
                {generalLeft === 1 ? "1 general question left this hour" : `${generalLeft} general questions left this hour`}
              </p>
            )}
            <div ref={endRef} />
          </div>
        )}
      </div>

      <form onSubmit={onSubmit} className="border-t border-neutral-100 bg-white px-4 pb-[max(0.875rem,env(safe-area-inset-bottom))] pt-3.5">
        <div className="flex items-end gap-2 rounded-2xl border border-neutral-300 bg-white py-2 pl-3.5 pr-2 focus-within:border-sky-600 focus-within:ring-2 focus-within:ring-sky-600/20">
          <label htmlFor="lumen-input" className="sr-only">Your question</label>
          <textarea
            id="lumen-input"
            ref={inputRef}
            rows={2}
            value={input}
            maxLength={MAX_QUESTION}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder={config.placeholder}
            className="scrollbar-subtle max-h-40 min-h-10 flex-1 resize-none bg-transparent py-1 text-base leading-5 text-neutral-900 outline-none placeholder:text-neutral-400 focus-visible:outline-none lg:text-sm"
          />
          {busy ? (
            <button type="button" onClick={() => abortRef.current?.abort()} aria-label="Stop" className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white">
              <Square aria-hidden="true" className="h-3.5 w-3.5 fill-current" />
            </button>
          ) : (
            <button type="submit" disabled={!input.trim()} aria-label="Send" className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white transition disabled:opacity-30">
              <ArrowUp aria-hidden="true" className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
