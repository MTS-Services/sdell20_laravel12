import React from 'react';

const pricingOptions = [
    {
        tier: 'Online',
        blurb: 'Create your will using our online will platform',
        price: '£150',
        features: ['Reviewed by our expert team', 'Completed online', 'For simple estates'],
    },
    {
        tier: 'Phone/home',
        blurb: 'Prepare your will over the phone or during a home visit',
        price: '£250',
        features: ['With an expert will writer', 'Completed over the phone or in person', 'Suitable for most estates'],
    },
    {
        tier: 'Will with trust',
        blurb: 'Manage and protect your assets for your loved ones',
        price: '£450',
        features: ['With an expert will writer', 'Completed face-to-face', 'For complex estates and trusts'],
    },
];

export function WillWritingPricingSection() {
    return (
        <section id="pricing" className="px-4 pb-12 sm:px-6 lg:px-10">
            <div className="mx-auto max-w-6xl">
                <div className="text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary-500 animate-fadeInUp">Plans</p>
                    <h2 className="mt-4 text-3xl font-serif font-semibold text-slate-900 animate-fadeInUp delay-100">
                        What are our different types of wills?
                    </h2>
                </div>
                <div className="mt-12 grid gap-6 md:grid-cols-3">
                    {pricingOptions.map((option, index) => (
                        <div
                            key={option.tier}
                            className="rounded-4xl border border-white/30 bg-white p-6 shadow-xl shadow-black/5 animate-fadeInUp transition-all duration-300 hover:-translate-y-1 hover:bg-primary-50"
                            style={{ animationDelay: `${index * 150}ms` }}
                        >
                            <div className="inline-flex rounded-full bg-primary-900 px-4 py-2 text-base font-semibold text-white">{option.tier}</div>
                            <p className="mt-4 text-sm text-slate-500">{option.blurb}</p>
                            <p className="mt-6 text-4xl font-semibold text-slate-900">{option.price}</p>
                            <ul className="mt-6 space-y-3 text-sm text-slate-700">
                                {option.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-2">
                                        <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700">✓</span>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="mt-8 flex justify-center animate-fadeInUp delay-200">
                    <button className="inline-flex items-center gap-2 rounded-full border border-primary-600 bg-primary-600 hover:text-primary-600 px-8 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-transparent">
                        Get started
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14" />
                            <path d="M12 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
}
