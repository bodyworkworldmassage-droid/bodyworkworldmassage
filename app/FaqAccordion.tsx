"use client";

import { useState } from "react";

const FAQS = [
  {
    question: "How do I find a provider near me?",
    answer:
      "Search by your city, state, or ZIP code and browse licensed professionals listed in that area, including any who are travelling through while you're searching.",
  },
  {
    question: "Can I find someone in a city I am visiting?",
    answer:
      "Yes — providers publish the cities they travel to and when, so travelling professionals show up in your results for that location too.",
  },
  {
    question: "How does booking work?",
    answer:
      "Each provider manages their own bookings directly through their profile, so you reach out to confirm availability and details with them.",
  },
  {
    question: "I am a massage professional. How do I get listed?",
    answer:
      "Create a free profile, add your services, locations, and availability, and you'll be discoverable to clients searching in your area.",
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="mt-4 divide-y divide-black/10 rounded-2xl border border-black/10 bg-white">
      {FAQS.map((faq, i) => {
        const isOpen = i === openIndex;
        return (
          <div key={faq.question}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? -1 : i)}
              className="font-jost flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-brand-green"
            >
              {faq.question}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`h-4 w-4 flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {isOpen && (
              <p className="font-jost px-5 pb-4 text-sm leading-6 text-[#3a352c]">
                {faq.answer}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
