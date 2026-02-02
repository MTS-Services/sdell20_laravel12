import React, { useMemo, useState } from 'react';

import FrontendLayout from '@/layouts/frontend-layout';

type FaqItem = {
    q: string;
    a: string;
};

export default function Contact() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    const faqItems: FaqItem[] = useMemo(
        () => [
            {
                q: 'How much does it cost to make a Will?',
                a: 'Costs vary depending on complexity and any additional services you choose. Book a free consultation and we’ll give you a clear quote after understanding your needs.',
            },
            {
                q: 'What is the difference between a Will and a Codicil?',
                a: 'A Will sets out your wishes in full. A Codicil is a legal add-on that updates parts of an existing Will without rewriting the whole document.',
            },
            {
                q: 'What can I include in my Will?',
                a: 'You can include how assets are distributed, appoint executors and guardians, make specific gifts, and include funeral wishes. We’ll guide you through what applies to your situation.',
            },
            {
                q: 'Do I need legal professional to write my Will?',
                a: 'Not always, but professional support helps reduce errors, ambiguity, and future disputes—especially if your estate is more complex.',
            },
            {
                q: 'How much does it cost to change your Will?',
                a: 'Small updates can sometimes be handled via a Codicil, while bigger changes may require a new Will. We’ll recommend the most cost-effective option after reviewing your needs.',
            },
        ],
        []
    );

    return (
        <FrontendLayout>
            <main className="bg-white">
                {/* HERO (matches screenshot: image right, teal overlay, left content) */}
                <section className="relative isolate overflow-hidden">
                    <img
                        src="https://heirkinestateplanning.co.uk/wp-content/uploads/2025/12/contact-bg.png"
                        alt="Family"
                        className="absolute inset-0 -z-20 h-full w-full object-cover object-right"
                        loading="lazy"
                    />

                    {/* Teal overlay */}
                    <div className="absolute inset-0 -z-10 bg-primary-800/75" />
                    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary-900/70 via-primary-800/65 to-transparent" />

                    <div className="container mx-auto px-6">
                        <div className="flex min-h-[360px] items-center py-16 md:min-h-[420px] md:py-20">
                            <div className="max-w-xl">
                                <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
                                    Get in Touch
                                </h1>
                                <p className="mt-4 text-base leading-relaxed text-white/85">
                                    Everyone’s situation is different. Contact us to discuss yours, and we’ll guide you
                                    through your options.
                                </p>
                                <p className="mt-4 text-sm text-white/70">
                                    Reach out today and book a free consultation to discuss your estate planning needs.
                                </p>

                                <div className="mt-7">
                                    <a
                                        href="#contact-form"
                                        className="inline-flex items-center justify-center rounded-full bg-primary-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600"
                                    >
                                        Enquire now
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CONTACT + FORM (2-col like screenshot) */}
                <section id="contact-form" className="container mx-auto px-6 py-18 md:py-14">
                    <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
                        {/* LEFT: text + contact details */}
                        <div>
                            <h2 className="text-3xl font-semibold text-primary-600">
                                Understand your
                                <br />
                                options with a free
                                <br />
                                consultation
                            </h2>

                            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600">
                                We’ll talk through your situation and explain the best next steps. Whether you need a
                                simple Will or help with a more complex estate, we’ll make the process clear and
                                comfortable.
                            </p>

                            <div className="mt-6 space-y-2 text-sm text-slate-700">
                                <p className="font-semibold text-slate-800">Contact Details</p>

                                <div className="space-y-2">
                                    <div className="flex items-start gap-2">
                                        <span className="mt-0.5 text-primary-600">
                                            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                                                <path
                                                    d="M2 5l5.5 2.2a2 2 0 011.1 2.7l-.7 1.6a15 15 0 007.6 7.6l1.6-.7a2 2 0 012.7 1.1L22 22"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </span>
                                        <div>
                                            <p className="font-medium text-slate-800">+44 (0) 203 455 9811</p>
                                            <p className="text-xs text-slate-500">Weekdays 8am – 6pm GMT</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2">
                                        <span className="mt-0.5 text-primary-600">
                                            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                                                <path d="M4 5h16v14H4z" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M4 7l8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </span>
                                        <div>
                                            <p className="font-medium text-slate-800">support@heirkinestate.com</p>
                                            <p className="text-xs text-slate-500">We respond within 24 hours</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2">
                                        <span className="mt-0.5 text-primary-600">
                                            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                                                <path
                                                    d="M12 22s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <circle cx="12" cy="11" r="3" />
                                            </svg>
                                        </span>
                                        <div>
                                            <p className="font-medium text-slate-800">120 Bishopsgate, London EC2N</p>
                                            <p className="text-xs text-slate-500">By appointment only</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: form */}
                        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                            <form className="p-6 md:p-7">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="text-xs font-semibold text-slate-700" htmlFor="firstName">
                                            First name
                                        </label>
                                        <input
                                            id="firstName"
                                            type="text"
                                            placeholder=""
                                            className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-slate-700" htmlFor="lastName">
                                            Last name
                                        </label>
                                        <input
                                            id="lastName"
                                            type="text"
                                            placeholder=""
                                            className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-slate-700" htmlFor="email">
                                            Email
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            placeholder=""
                                            className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-slate-700" htmlFor="phone">
                                            Phone number
                                        </label>
                                        <input
                                            id="phone"
                                            type="tel"
                                            placeholder=""
                                            className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="text-xs font-semibold text-slate-700" htmlFor="message">
                                            Message
                                        </label>
                                        <textarea
                                            id="message"
                                            rows={5}
                                            placeholder=""
                                            className="mt-2 w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <button
                                            type="submit"
                                            className="w-full rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600"
                                        >
                                            Send Message
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>

                {/* MAP (like screenshot) */}
                <section className="pb-20 ">
                    <div className="overflow-hidden">
                        <div className="h-65 w-full md:h-120">
                            <iframe
                                title="Office location map"
                                className="h-full w-full"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                src="https://www.google.com/maps?q=120%20Bishopsgate%20London%20EC2N&output=embed"
                            />
                        </div>
                    </div>
                </section>

                {/* FAQ (like screenshot) */}
                <section className="bg-white pb-16">
                    <div className="container mx-auto px-6">
                        <h2 className="text-center text-2xl font-semibold text-primary-600">
                            Frequently Asked Questions
                        </h2>

                        <div className="mx-auto mt-8 max-w-6xl divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
                            {faqItems.map((item, idx) => {
                                const isOpen = openFaq === idx;

                                return (
                                    <div key={item.q} className="p-5 md:p-6">
                                        <button
                                            type="button"
                                            onClick={() => setOpenFaq(isOpen ? null : idx)}
                                            className="flex w-full items-start justify-between gap-4 text-left"
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className="mt-0.5 text-primary-600">
                                                    <svg
                                                        viewBox="0 0 24 24"
                                                        className="h-6 w-6"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="1.8"
                                                    >
                                                        <path
                                                            d="M9 12l2 2 4-4"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                        <path
                                                            d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                </span>
                                                <p className="font-semibold text-slate-900">{item.q}</p>
                                            </div>

                                            <span className="mt-1 text-slate-400">
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    className={`h-5 w-5 transition-transform ${
                                                        isOpen ? 'rotate-180' : 'rotate-0'
                                                    }`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                >
                                                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </span>
                                        </button>

                                        {isOpen ? (
                                            <p className="mt-3 pl-9 text-sm leading-relaxed text-slate-600">{item.a}</p>
                                        ) : null}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </main>
        </FrontendLayout>
    );
}
