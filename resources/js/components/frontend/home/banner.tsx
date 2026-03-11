import React from 'react';
import { Link } from '@inertiajs/react';

import { useReveal } from '@/hooks/use-reveal';

const checklist = [
    {
        title: 'Safeguard Your Family',
        description: 'Making a Will protects your family, ensuring the right people inherit your estate when you die.',
    },
    {
        title: 'Protect Your Wealth',
        description: 'Making a Will helps to protect your wealth, minimising any potential claims on your estate that are against your wishes.',
    },
    {
        title: 'Plan For The Future',
        description: "Making a Will allows you and your family to plan for the future and ensure that your property and financial affairs are managed properly after you're gone.",
    },
];

export default function Banner() {
    const [headingRef, headingVisible] = useReveal<HTMLDivElement>();
    const [listRef, listVisible] = useReveal<HTMLUListElement>(0.1);
    const [ctaRef, ctaVisible] = useReveal<HTMLDivElement>(0.1);

    return (
        <section className="relative isolate min-h-[60vh] sm:min-h-[70vh] lg:min-h-[80vh] overflow-hidden bg-slate-900">
            {/* Background Image */}
            <img
                src="https://heirkinestateplanning.co.uk/wp-content/uploads/2025/12/home-banner-image.png"
                alt="Estate planning illustration"
                className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
            />

            {/* Main teal overlay (left heavy, right light like screenshot) */}
            <div className="absolute inset-0 -z-10 bg-linear-to-r from-slate-900/95 via-cyan-900/80 to-transparent" />

            {/* Soft vignette + contrast */}
            <div className="absolute inset-0 -z-10 bg-linear-to-t from-slate-900/40 via-transparent to-transparent" />

            {/* Decorative shapes (subtle blocks like screenshot) */}
            <div className="pointer-events-none absolute inset-0 -z-10 opacity-20">
                <div className="absolute -right-24 top-8 h-105 w-105 rounded-[64px] bg-white/10 blur-sm" />
                <div className="absolute right-24 top-32 h-28 w-28 rounded-3xl bg-white/10" />
                <div className="absolute right-48 top-32 h-28 w-28 rounded-3xl bg-white/10" />
                <div className="absolute right-24 top-64 h-28 w-28 rounded-3xl bg-white/10" />
                <div className="absolute right-48 top-64 h-28 w-28 rounded-3xl bg-white/10" />

                {/* diagonal soft bars */}
                <div className="absolute right-0 top-0 h-full w-[60%] -skew-x-12 bg-white/10" />
            </div>

            {/* Content */}
            <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16 sm:py-24 lg:flex-row lg:items-center lg:justify-between lg:gap-14 xl:gap-20">
                <div className="w-full max-w-2xl space-y-6 lg:w-[58%]">
                    <div
                        ref={headingRef}
                        className={`space-y-4 mb-15 md:mb-20 lg:mb-25  transition-all duration-700 ease-out ${headingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                    >
                        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary-200">Trusted by families across England & Wales</p>
                        <h1 className="text-3xl font-semibold leading-tight text-primary-50 sm:text-4xl lg:text-[48px]">
                            Protecting Your Assets, Securing Your Family's Future!
                        </h1>
                        <p className="text-base text-white/80 sm:text-lg">
                            Draft your legally robust will or LPA online, review it with specialists, and download it the same day. Accessible from desktop, tablet, or phone.
                        </p>
                    </div>

                    {/* checklist
                    <ul
                        ref={listRef}
                        className={`space-y-4 text-white transition-all duration-700 ease-out ${listVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                    >
                        {checklist.map(({ title, description }) => (
                            <li key={title} className="flex gap-3 text-base">
                                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/50 bg-white/10">
                                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20 6L9 17l-5-5" />
                                    </svg>
                                </span>
                                <div className="space-y-1">
                                    <p className="font-semibold tracking-wide text-[15px] text-primary-100">{title}</p>
                                    <p className="text-sm text-white/80">{description}</p>
                                </div>
                            </li>
                        ))}
                    </ul> */}

                    {/* CTA */}
                    <div
                        ref={ctaRef}
                        className={`flex flex-col gap-4 pt-3 transition-all duration-700 ease-out sm:flex-row ${ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                    >
                        <Link
                            href={route('will-writing.start')}
                            className="inline-flex items-center justify-center rounded-full border border-primary-600 bg-primary-600 px-10 py-4 text-sm font-semibold text-white shadow-lg shadow-black/30 transition hover:bg-transparent hover:text-primary-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
                        >
                            Create Your Will Now
                        </Link>
                        <Link
                            href={route('lpa.start')}
                            className="inline-flex items-center justify-center rounded-full border border-white/30 px-10 py-4 text-sm font-semibold text-white/90 transition hover:bg-white/10 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
                        >
                            Start an LPA
                        </Link>
                    </div>
                </div>

                <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-[0_25px_60px_rgba(0,0,0,0.35)] backdrop-blur-sm lg:w-[38%]">
                    <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/70">How it works</p>
                    <ul className="mt-4 space-y-4">
                        {checklist.map(({ title, description }) => (
                            <li key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                <p className="text-sm font-semibold text-white">{title}</p>
                                <p className="text-xs text-white/80">{description}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
