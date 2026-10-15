/**
 * Real client reviews from Fiverr, quoted word for word (excerpts only:
 * a sentence may be shortened, never reworded). Attributed by Fiverr
 * username and country, and linked to the Fiverr profile in profile.ts.
 * No ratings, prices, durations or dates: those go stale.
 */
export type Testimonial = {
  quote: string;
  author: string;
  country: string;
  note?: string;
  /** Also shown beside the contact form (keep this short list to the strongest). */
  onContact?: boolean;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "His code expertise and professionalism exceeded our expectations, and his proactive communication and cooperation made the process smooth and straightforward.",
    author: "maraclouldsolns",
    onContact: true,
    country: "United States",
  },
  {
    quote:
      "First he deployed it on a free server so I could see the progress of the work, then he deployed the complete app on my server.",
    author: "antoniogaldiero",
    country: "Italy",
    note: "Ongoing collaboration",
  },
  {
    quote: "Paid attention to details and prompt on changes. Will work with him again when launching.",
    author: "sachinkc",
    onContact: true,
    country: "United States",
  },
  {
    quote: "Communication was smooth, and the project was completed on time with functional deployment.",
    author: "user08577456",
    onContact: true,
    country: "Kenya",
  },
  {
    quote: "Khalid is exceptional. I'm really thankful to have found him.",
    author: "tosynero",
    country: "Czech Republic",
  },
];
