"use client";

import { useActionState, useEffect, useRef } from "react";
import { sendMessage, type ContactState } from "@/app/contact/actions";

export function ContactForm() {
  const startedAtRef = useRef<HTMLInputElement>(null);
  const [state, formAction, pending] = useActionState<ContactState, FormData>(
    sendMessage,
    null
  );

  useEffect(() => {
    if (startedAtRef.current) {
      startedAtRef.current.value = String(Date.now());
    }
  }, []);

  if (state?.ok) {
    return (
      <div
        className="rounded-xl border border-green-200 bg-green-50 p-6 text-sm text-green-800"
        role="status"
        aria-live="polite"
      >
        Thanks, your message has been sent. I will reply as soon as I can.
      </div>
    );
  }

  const inputClasses =
    "mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-600";

  return (
    <form
      action={formAction}
      className="flex max-w-xl flex-col gap-4"
      aria-busy={pending}
    >
      <input ref={startedAtRef} type="hidden" name="startedAt" />
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">Company website</label>
        <input
          id="company"
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <div>
        <label htmlFor="name" className="text-sm font-medium text-neutral-700">
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          minLength={2}
          maxLength={100}
          autoComplete="name"
          className={inputClasses}
        />
      </div>
      <div>
        <label htmlFor="email" className="text-sm font-medium text-neutral-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
          className={inputClasses}
        />
      </div>
      <div>
        <label htmlFor="message" className="text-sm font-medium text-neutral-700">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={6}
          className={inputClasses}
        />
      </div>
      {state?.error && (
        <p className="text-sm text-red-700" role="alert">
          {state.error}
        </p>
      )}
      <p className="text-xs leading-relaxed text-neutral-500">
        Your details are used only to respond to this inquiry. Read the{" "}
        <a href="/privacy" className="text-sky-700 hover:underline">
          privacy note
        </a>
        .
      </p>
      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-full bg-neutral-900 px-6 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
