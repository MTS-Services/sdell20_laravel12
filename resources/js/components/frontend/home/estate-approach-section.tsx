import React from "react";

import { useReveal } from "@/hooks/use-reveal";

const pointsLeft = [
  "Legally appoints who you truly trust to handle your estate and follow your wishes",
  "Prevents delays at a difficult time by keeping the administration of your estate simple",
];

const pointsRight = [
  "Protects your loved ones with clear instructions so they know exactly what you wanted",
  "Limits heartache for your loved ones by giving them clarity and certainty when it’s needed",
];

export function EstateApproachSection() {
  const [headerRef, headerVisible] = useReveal<HTMLDivElement>();
  const [listRef, listVisible] = useReveal<HTMLDivElement>(0.2);

  return (
    <section className="relative isolate overflow-hidden py-16">
      {/* Background */}
      <img
        src="https://heirkinestateplanning.co.uk/wp-content/uploads/2025/12/secure-storage.jpg"
        alt="Family"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
      />



      <div className="container mx-auto px-6">
        <div className="flex min-h-[80vh] items-center py-18 md:py-22">
          <div className="mx-auto w-full max-w-5xl text-center text-white">
            {/* Headings */}
            <div
              ref={headerRef}
              className={[
                "transition-all duration-700 ease-out",
                headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
              ].join(" ")}
            >
              <h2 className="mx-auto max-w-4xl text-balance font-sans text-4xl font-semibold leading-tight tracking-tight md:text-5xl lg:text-[3.5rem]">
                Why Horizon Estate Planning is the consumer choice for Wills
              </h2>

              <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-white/80 md:mt-6 md:text-base">
                Because we combine expert guidance with a personal service delivered in the comfort of
                <br className="hidden sm:block" />
                your own home.
              </p>

              <h3 className="mt-10 font-sans text-2xl font-semibold md:mt-12 md:text-3xl">
                Horizon Estate Approach
              </h3>

              <p className="mx-auto mt-4 max-w-4xl text-sm leading-relaxed text-white/80 md:text-base">
                We make estate planning simple, supportive, and stress-free. With home visits, plain-English
                advice, and a specialist team that truly cares, families trust us to help them make the
                right decisions.
              </p>
            </div>

            {/* Checklist */}
            <div
              ref={listRef}
              className={[
                "mx-auto mt-10 grid max-w-4xl gap-10 text-left transition-all duration-700 ease-out md:mt-12 md:grid-cols-2",
                listVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
              ].join(" ")}
            >
              <SimpleCheckList items={pointsLeft} />
              <SimpleCheckList items={pointsRight} />
            </div>

            {/* CTA */}
            <div className="mt-12 flex justify-center md:mt-14">
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-full border border-primary-600 bg-primary-600 px-10 py-4 text-sm font-semibold text-white shadow-lg shadow-black/30 transition hover:bg-transparent focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
              >
                Get started now
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SimpleCheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-6">
      {items.map((text) => (
        <li key={text} className="flex items-start gap-4">
          <CheckIcon />
          <p className="max-w-[28rem] text-sm font-medium leading-relaxed text-white/90 md:text-base">
            {text}
          </p>
        </li>
      ))}
    </ul>
  );
}

function CheckIcon() {
  return (
    <span className="mt-0.5 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full border border-white/45 bg-white/0">
      <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path
          d="M7.9 13.6 4.7 10.4a1 1 0 0 1 1.4-1.4l1.8 1.8 6-6a1 1 0 1 1 1.4 1.4l-6.7 6.7a1 1 0 0 1-1.4 0Z"
          fill="currentColor"
          className="text-white"
        />
      </svg>
    </span>
  );
}
