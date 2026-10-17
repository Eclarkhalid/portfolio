import { ArrowUpRight } from "lucide-react";
import { profile } from "@/content/profile";
import { testimonials, type Testimonial } from "@/content/testimonials";

/** Server component. Real Fiverr reviews from content/testimonials.ts. */

function Attribution({ item }: { item: Testimonial }) {
  return (
    <figcaption className="mt-4 type-meta text-neutral-500">
      <span className="font-semibold text-neutral-800">{item.author}</span>
      {" · "}
      {item.country}
      {item.note && <> · {item.note}</>}
    </figcaption>
  );
}

function FiverrLink() {
  return (
    <a
      href={profile.links.fiverr}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet-700 transition hover:text-sky-700"
    >
      Read the reviews on Fiverr <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
    </a>
  );
}

/** Home: a lead quote, then the rest in a grid. */
export function TestimonialsGrid() {
  const [lead, ...rest] = testimonials;
  return (
    <div className="py-10">
      <figure className="max-w-4xl">
        <blockquote className="text-2xl font-medium leading-snug tracking-[-0.02em] text-neutral-900 @3xl:text-3xl">
          &ldquo;{lead.quote}&rdquo;
        </blockquote>
        <Attribution item={lead} />
      </figure>
      <div className="mt-10 grid gap-4 @2xl:grid-cols-2">
        {rest.map((item, index) => (
          <figure
            key={item.author + index}
            className={`rounded-2xl border p-6 ${index % 2 === 0 ? "border-sky-100 bg-sky-50/50" : "border-violet-100 bg-violet-50/50"}`}
          >
            <blockquote className="text-base leading-7 text-neutral-800">&ldquo;{item.quote}&rdquo;</blockquote>
            <Attribution item={item} />
          </figure>
        ))}
      </div>
      <div className="mt-8">
        <FiverrLink />
      </div>
    </div>
  );
}

/** Contact: the shortlist marked onContact, as a compact list. */
export function TestimonialsList() {
  return (
    <div>
      <div className="flex flex-col divide-y divide-neutral-200 border-y border-neutral-200">
        {testimonials.filter((item) => item.onContact).map((item, index) => (
          <figure key={item.author + index} className="py-5">
            <blockquote className="text-sm leading-6 text-neutral-800">&ldquo;{item.quote}&rdquo;</blockquote>
            <Attribution item={item} />
          </figure>
        ))}
      </div>
      <div className="mt-6">
        <FiverrLink />
      </div>
    </div>
  );
}
