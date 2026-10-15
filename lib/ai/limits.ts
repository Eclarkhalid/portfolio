/**
 * Lumen's guardrails: per-visitor rate limits and a daily spend cap.
 * In memory, which suits the single Node process on the VPS. A restart
 * resets both, which errs on the side of availability.
 */

const HOUR_MS = 60 * 60 * 1000;
export const LIMITS = {
  messagesPerHour: 20,
  generalPerHour: 5,
  maxQuestionChars: 1000,
  maxMessages: 40,
} as const;

// Claude Sonnet 5.5, USD per token
const PRICE = {
  input: 2 / 1_000_000,
  output: 10 / 1_000_000,
  cacheRead: 0.2 / 1_000_000,
  cacheWrite1h: 4 / 1_000_000,
};

type Window = { all: number[]; general: number[] };
const visitors = new Map<string, Window>();

function prune(times: number[], now: number) {
  while (times.length > 0 && times[0] <= now - HOUR_MS) times.shift();
}

/** Records the request if allowed. Returns how many general questions remain. */
export function takeQuota(visitor: string, general: boolean, now = Date.now()) {
  let window = visitors.get(visitor);
  if (!window) {
    if (visitors.size >= 5_000) {
      const oldest = visitors.keys().next().value;
      if (oldest) visitors.delete(oldest);
    }
    window = { all: [], general: [] };
    visitors.set(visitor, window);
  }
  prune(window.all, now);
  prune(window.general, now);

  if (window.all.length >= LIMITS.messagesPerHour) return { ok: false as const, reason: "rate" as const };
  if (general && window.general.length >= LIMITS.generalPerHour) {
    return { ok: false as const, reason: "general" as const };
  }

  window.all.push(now);
  if (general) window.general.push(now);
  return { ok: true as const, generalRemaining: LIMITS.generalPerHour - window.general.length };
}

export function generalRemaining(visitor: string, now = Date.now()) {
  const window = visitors.get(visitor);
  if (!window) return LIMITS.generalPerHour;
  prune(window.general, now);
  return LIMITS.generalPerHour - window.general.length;
}

let spendDay = "";
let spentUsd = 0;

function today() {
  return new Date().toISOString().slice(0, 10);
}

function dailyBudgetUsd() {
  const value = Number(process.env.AI_DAILY_BUDGET_USD);
  return Number.isFinite(value) && value > 0 ? value : 2;
}

export function budgetAvailable() {
  if (spendDay !== today()) {
    spendDay = today();
    spentUsd = 0;
  }
  return spentUsd < dailyBudgetUsd();
}

export function recordUsage(usage: {
  input_tokens: number;
  output_tokens: number;
  cache_read_input_tokens?: number | null;
  cache_creation_input_tokens?: number | null;
}) {
  budgetAvailable(); // roll the day over if needed
  spentUsd +=
    usage.input_tokens * PRICE.input +
    usage.output_tokens * PRICE.output +
    (usage.cache_read_input_tokens ?? 0) * PRICE.cacheRead +
    (usage.cache_creation_input_tokens ?? 0) * PRICE.cacheWrite1h;
}
