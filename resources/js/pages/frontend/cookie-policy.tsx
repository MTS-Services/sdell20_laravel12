import React from 'react';
import { Head } from '@inertiajs/react';

import FrontendLayout from '@/layouts/frontend-layout';

const cookieHighlights = [
    {
        title: 'Essential cookies',
        detail: 'Required for secure login, session handling, and remembering your document progress. These are always enabled.'
    },
    {
        title: 'Performance cookies',
        detail: 'Help us understand which questionnaires need the most clarification so we can improve completion rates.'
    },
    {
        title: 'Marketing cookies',
        detail: 'Used only when you opt in to hear about new digital will bundles or promotions.'
    }
];

const quickFacts = [
    'We never sell cookie data to third parties.',
    'All cookies auto-expire within 12 months or sooner.',
    'You can update preferences at any time from your dashboard.'
];

export default function CookiePolicy() {
    return (
        <FrontendLayout>
            <Head title="Cookie Policy | Will Writing Online" />
            <main className="bg-slate-50 py-14 sm:py-20">
                <section className="container mx-auto px-4 sm:px-6">
                    <div className="grid gap-8 lg:gap-10 lg:grid-cols-[1.1fr_0.9fr]">
                        <div className="space-y-8 sm:space-y-10">
                            <header className="rounded-4xl bg-white/90 p-6 sm:p-8 shadow-[0_25px_60px_rgba(15,23,42,0.08)]">
                                <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.5em] text-primary-400">Cookie Policy</p>
                                <h1 className="mt-4 text-3xl sm:text-4xl font-serif font-semibold text-primary-900">Cookies that keep your online will journey smooth</h1>
                                <p className="mt-4 text-sm sm:text-base leading-relaxed text-primary-700">
                                    Will Writing Online runs entirely through a secure digital experience. Cookies allow us to keep your answers saved, deliver faster load times, and tailor educational nudges while you complete questionnaires. This page explains what we collect and how to control it.
                                </p>
                            </header>

                            <section className="rounded-4xl border border-primary-100 bg-white/80 p-6 sm:p-8">
                                <h2 className="text-xl sm:text-2xl font-semibold text-primary-900">Cookie categories</h2>
                                <div className="mt-6 grid gap-4 sm:gap-6 md:grid-cols-2">
                                    {cookieHighlights.map((item) => (
                                        <div key={item.title} className="rounded-3xl border border-slate-200/80 bg-slate-50/60 p-4 sm:p-5">
                                            <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-primary-400">{item.title}</p>
                                            <p className="mt-3 text-sm sm:text-base leading-relaxed text-primary-700">{item.detail}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="rounded-4xl bg-primary-900 p-6 sm:p-8 text-white">
                                <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
                                    <div className="lg:w-2/3">
                                        <h2 className="text-2xl sm:text-3xl font-semibold">Managing preferences</h2>
                                        <p className="mt-3 text-sm sm:text-base text-white/80">
                                            Log into your dashboard, open “Privacy & Cookies,” and toggle the categories you’d like to allow. Essential cookies are locked on to make sure wills and LPAs are produced securely.
                                        </p>
                                    </div>
                                    <div className="lg:w-1/3">
                                        <div className="rounded-3xl bg-white/10 p-4">
                                            <p className="text-xs uppercase tracking-[0.4em] text-white/70">Need help?</p>
                                            <p className="mt-2 text-xs font-semibold">Email privacy@willwritingonline.co.uk</p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <aside className="space-y-6">
                            <div className="rounded-4xl bg-white p-6 sm:p-7 shadow-[0_20px_55px_rgba(15,23,42,0.08)]">
                                <h3 className="text-lg sm:text-xl font-semibold text-primary-900">At-a-glance</h3>
                                <ul className="mt-4 space-y-4 text-sm sm:text-base text-primary-700">
                                    {quickFacts.map((fact) => (
                                        <li key={fact} className="flex items-start gap-3">
                                            <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-primary-500" />
                                            <span>{fact}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="rounded-4xl border border-slate-200 bg-white/90 p-6 sm:p-7">
                                <h3 className="text-lg sm:text-xl font-semibold text-primary-900">Third-party tools</h3>
                                <p className="mt-3 text-sm sm:text-base leading-relaxed text-primary-700">
                                    We work with privacy-first analytics partners (currently Plausible) and payment providers (Stripe) who set their own cookies strictly for fraud prevention and reporting. Those cookies are controlled by the partners and never used for unrelated advertising.
                                </p>
                            </div>
                            <div className="rounded-4xl border border-primary-100 bg-primary-50 p-6 sm:p-7">
                                <h3 className="text-lg sm:text-xl font-semibold text-primary-900">Retention policy</h3>
                                <p className="mt-3 text-sm sm:text-base leading-relaxed text-primary-700">
                                    Cookie data is retained for the minimum period necessary to run your online sessions—typically between 30 days and 12 months. You can delete cookies from your browser at any time to reset identifiers.
                                </p>
                            </div>
                        </aside>
                    </div>
                </section>
            </main>
        </FrontendLayout>
    );
}
