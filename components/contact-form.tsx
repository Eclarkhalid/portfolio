"use client";

import { startTransition, useActionState, useEffect, useRef } from "react";
import { sendMessage, type ContactState } from "@/app/contact/actions";
import { CONTACT_DRAFT_KEY } from "@/lib/ai/events";

export function ContactForm() {
  const startedAtRef = useRef<HTMLInputElement>(null);
  const [state, formAction, pending] = useActionState<ContactState, FormData>(
    sendMessage,
    null
  );

  const messageRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (startedAtRef.current) {
      startedAtRef.current.value = String(Date.now());
    }
    // Prefill a message Lumen drafted; the visitor reviews it before sending
    try {
      const draft = sessionStorage.getItem(CONTACT_DRAFT_KEY);
      if (draft && messageRef.current && !messageRef.current.value) {
        messageRef.current.value = draft;
        messageRef.current.focus();
      }
      sessionStorage.removeItem(CONTACT_DRAFT_KEY);
    } catch {
      // Storage unavailable: nothing to prefill
    }
  }, []);

  if (state?.ok) {
    return (
      <div
        className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-sm font-medium text-emerald-900"
        role="status"
        aria-live="polite"
      >
        Thanks, your message has been sent. I will reply as soon as I can.
      </div>
    );
  }

  const inputClasses =
    "mt-2 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm transition placeholder:text-neutral-400 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-600/20";

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        // Submit manually so React's automatic form reset doesn't wipe what
        // the visitor typed when delivery fails. Without JS, `action` still works.
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        startTransition(() => formAction(formData));
      }}
      className="flex max-w-2xl flex-col gap-5"
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
        <label htmlFor="name" className="text-sm font-semibold text-neutral-800">
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
        <label htmlFor="email" className="text-sm font-semibold text-neutral-800">
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
        <label htmlFor="message" className="text-sm font-semibold text-neutral-800">
          Message
        </label>
        <textarea
          ref={messageRef}
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
      <p className="text-xs font-medium leading-relaxed text-neutral-600">
        Your details are used only to respond to this inquiry. Read the{" "}
        <a href="/privacy" className="text-sky-700 hover:underline">
          privacy note
        </a>
        .
      </p>
      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
