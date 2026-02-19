import { router } from '@inertiajs/react';
import React from 'react';

function getCsrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}

const pricingOptions = [
    {
        tier: 'single will',
        product: 'single_will',
        usualPrice: 'Usual price £149',
        savings: 'Save £50',
        price: '£99 for a single will',
        amount: 99,
        blurb: "Make a will just for you, whether or not you're in a relationship.",
        bannerColor: 'from-rose-100 via-amber-100 to-rose-50',
    },
    {
        tier: 'mirror wills',
        product: 'mirror_wills',
        usualPrice: 'Usual price £200',
        savings: 'Save £50',
        price: '£150 for mirror wills',
        amount: 150,
        blurb: "Make a will with someone who has wishes similar to yours, such as a partner.",
        bannerColor: 'from-emerald-100 via-sky-100 to-emerald-50',
    },
];

export function WillWritingPricingSection() {
    return (
        <section id="pricing" className="px-4 pt-6 lg:pt-16 sm:px-6 lg:px-10">
            <div className="mx-auto max-w-4xl">
                <div className="text-center">
                    <h2 className="text-3xl font-semibold text-primary-900">Choose the will that fits</h2>
                    <p className="mt-2 text-base text-primary-600">Transparent pricing with limited-time savings applied automatically.</p>
                </div>
                <div className="mt-12 grid gap-8 md:grid-cols-2">
                    {pricingOptions.map((option) => (
                        <div
                            key={option.tier}
                            role="button"
                            tabIndex={0}
                            onClick={async () => {
                                const amountPence = option.amount * 100;
                                try {
                                    const res = await fetch(route('payment.select-plan'), {
                                        method: 'POST',
                                        headers: {
                                            Accept: 'application/json',
                                            'Content-Type': 'application/json',
                                            'X-XSRF-TOKEN': getCsrfToken(),
                                        },
                                        credentials: 'same-origin',
                                        body: JSON.stringify({
                                            amount: amountPence,
                                            product: option.product,
                                        }),
                                    });
                                    if (!res.ok) throw new Error('Failed to save selection');
                                    const data = await res.json();
                                    router.visit(
                                        route('checkout', {
                                            amount: data.amount,
                                            payment_id: data.payment_id,
                                        }),
                                    );
                                } catch {
                                    router.visit(
                                        route('checkout', { amount: amountPence }),
                                    );
                                }
                            }}
                            onKeyDown={async (e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    const amountPence = option.amount * 100;
                                    try {
                                        const res = await fetch(route('payment.select-plan'), {
                                            method: 'POST',
                                            headers: {
                                                Accept: 'application/json',
                                                'Content-Type': 'application/json',
                                                'X-XSRF-TOKEN': getCsrfToken(),
                                            },
                                            credentials: 'same-origin',
                                            body: JSON.stringify({
                                                amount: amountPence,
                                                product: option.product,
                                            }),
                                        });
                                        if (!res.ok) throw new Error('Failed to save selection');
                                        const data = await res.json();
                                        router.visit(
                                            route('checkout', {
                                                amount: data.amount,
                                                payment_id: data.payment_id,
                                            }),
                                        );
                                    } catch {
                                        router.visit(
                                            route('checkout', { amount: amountPence }),
                                        );
                                    }
                                }
                            }}
                            className="relative cursor-pointer overflow-hidden rounded-3xl bg-white shadow-[0_15px_35px_rgba(15,23,42,0.1)] transition hover:-translate-y-1 focus-visible:outline focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                        >
                            <div className={`relative h-40 w-full bg-linear-to-br ${option.bannerColor}`}>
                                <div className="absolute top-5 left-5 rounded-full bg-rose-600 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-white">
                                    {option.savings}
                                </div>
                                <div className="absolute bottom-4 left-6 text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">{option.tier}</div>
                            </div>
                            <div className="p-8">
                                <p className="text-sm text-primary-500">{option.usualPrice}</p>
                                <p className="mt-3 text-2xl font-semibold text-primary-900">{option.price}</p>
                                <p className="mt-3 text-base text-primary-600">{option.blurb}</p>
                                <p className="mt-4 text-sm font-medium text-primary-600">
                                    Pay £{option.amount} →
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                <p className="mt-10 text-sm md:text-base lg:text-lg leading-relaxed text-primary-800">
                    Your circumstances might mean you need a different type of will which could cost more. We’ll discuss this with you. You do not have to pay anything until you’ve spoken to us.
                    All prices include VAT and this offer is available in England and Wales. Full <span className="text-primary-600 underline">terms and conditions</span> apply.
                </p>
                <div className="mt-10 flex justify-center">
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
