import React from 'react'

export default function banner() {
    return (
        <section className="relative isolate min-h-screen overflow-hidden bg-slate-900">
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
            <div className="mx-auto max-w-6xl px-6 py-24 sm:py-28 lg:py-32">
                <div className="max-w-xl">
                    <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-[56px]">
                        Protect your assets.
                        <br />
                        Wills &amp; Trusts made simple.
                    </h1>

                    <p className="mt-5 max-w-md text-base leading-7 text-slate-100/80">
                        From wills to trusts and lasting powers of attorney, we make estate planning simple,
                        affordable, and personal – so you can protect the people who matter most.
                    </p>

                    {/* checklist */}
                    <ul className="mt-8 space-y-4 text-white">
                        <li className="flex items-center gap-3 text-base">
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/50 bg-white/10">
                                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 6L9 17l-5-5" />
                                </svg>
                            </span>
                            <span className="font-medium">Protect loved ones</span>
                        </li>

                        <li className="flex items-center gap-3 text-base">
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/50 bg-white/10">
                                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 6L9 17l-5-5" />
                                </svg>
                            </span>
                            <span className="font-medium">Safeguard assets</span>
                        </li>

                        <li className="flex items-center gap-3 text-base">
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/50 bg-white/10">
                                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 6L9 17l-5-5" />
                                </svg>
                            </span>
                            <span className="font-medium">Plan with ease</span>
                        </li>
                    </ul>

                    {/* CTA */}
                    <div className="mt-9">
                        <a
                            href="#"
                            className="inline-flex items-center justify-center rounded-full border border-sky-400/60 bg-sky-500/90 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-900/40 transition duration-300 hover:border-white/80 hover:bg-transparent"
                        >
                            Explore Options
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}
