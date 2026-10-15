/** sessionStorage key for a message Lumen drafted for the contact form. */
export const CONTACT_DRAFT_KEY = "lumen:contact-draft";

/** Server-sent events from /api/chat to the Lumen panel. */
export type LumenEvent =
  | { type: "text"; text: string }
  | { type: "pages"; pages: { path: string; title: string; kind: string }[] }
  | { type: "contact"; summary: string }
  | { type: "done"; generalRemaining: number }
  | {
      type: "error";
      code: "rate" | "general" | "budget" | "unavailable" | "refusal" | "failed";
      message: string;
    };
