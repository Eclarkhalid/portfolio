"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { profile } from "@/content/profile";

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .refine((value) => !/[\r\n]/.test(value), "Invalid name"),
  email: z.string().trim().email().max(254),
  message: z.string().trim().min(10).max(5000),
  company: z.string().max(0).optional().or(z.literal("")),
  startedAt: z.coerce.number().int().positive(),
});

export type ContactState = {
  ok: boolean;
  error?: string;
} | null;

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const FORM_MIN_AGE_MS = 1_500;
const FORM_MAX_AGE_MS = 24 * 60 * 60 * 1000;
const attempts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(key: string, now: number) {
  if (key === "unknown") return false;

  const current = attempts.get(key);
  if (!current || current.resetAt <= now) {
    if (!current && attempts.size >= 1_000) {
      const oldestKey = attempts.keys().next().value;
      if (oldestKey) attempts.delete(oldestKey);
    }
    attempts.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  current.count += 1;
  if (attempts.size > 1_000) {
    for (const [storedKey, entry] of attempts) {
      if (entry.resetAt <= now) attempts.delete(storedKey);
    }
  }
  return current.count > RATE_LIMIT_MAX;
}

export async function sendMessage(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
    company: formData.get("company"),
    startedAt: formData.get("startedAt"),
  });

  if (!parsed.success) {
    return { ok: false, error: "Please fill in all fields correctly." };
  }

  const now = Date.now();
  const formAge = now - parsed.data.startedAt;
  if (formAge < FORM_MIN_AGE_MS || formAge > FORM_MAX_AGE_MS) {
    return { ok: false, error: "Please refresh the page and try again." };
  }

  const requestHeaders = await headers();
  const forwardedFor = requestHeaders.get("x-forwarded-for");
  const clientKey = forwardedFor?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(clientKey, now)) {
    return {
      ok: false,
      error: `Too many attempts. Email me directly at ${profile.email}.`,
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM;
  if (!apiKey || !from) {
    return {
      ok: false,
      error: `Email is not configured yet. Reach me directly at ${profile.email}.`,
    };
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const { name, email, message } = parsed.data;
    const result = await resend.emails.send({
      from,
      to: profile.email,
      replyTo: email,
      subject: `Portfolio inquiry from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });

    if (result.error) throw new Error(result.error.message);
    return { ok: true };
  } catch (error) {
    console.error("Contact delivery failed:", error);
    return {
      ok: false,
      error: `Something went wrong. Email me at ${profile.email}.`,
    };
  }
}
