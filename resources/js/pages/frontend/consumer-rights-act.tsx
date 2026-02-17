import React from 'react';
import { Head } from '@inertiajs/react';

import FrontendLayout from '@/layouts/frontend-layout';

const consumerRightsSections = [
    {
        title: '1. Why this matters',
        copy: [
            'Transparent consumer protection is core to Will Writing Online. Every step of your fully digital estate-planning journey follows the Consumer Rights Act 2015 so you can order with confidence without ever visiting an office.'
        ]
    },
    {
        title: '2. Services supplied digitally',
        copy: [
            'Our wills, LPAs, and supporting consultations are classified as digital services. We commit to delivering those services with reasonable care and skill, matching the descriptions and timelines agreed during checkout, and providing clear updates inside your dashboard.'
        ]
    },
    {
        title: '3. Pricing and transparency',
        copy: [
            'All prices shown on our website include VAT unless stated otherwise. You will always see a full breakdown of charges before paying, including any Office of the Public Guardian fees that apply when registering LPAs.'
        ]
    },
    {
        title: '4. Your right to cancel',
        copy: [
            'Under the Consumer Rights Act and UK consumer contract regulations, you may cancel within 14 days of purchase if drafting has not yet begun and receive a full refund. If drafting work has already started, we will refund the unused portion of the service minus the cost of the completed legal work.'
        ]
    },
    {
        title: '5. Fixes and remedies',
        copy: [
            'If any document or digital service we supply fails to meet the agreed specification, we will correct it at no additional cost. Where a remedy cannot be provided within a reasonable timeframe, you may be entitled to a partial or full refund depending on the stage of work completed.'
        ]
    },
    {
        title: '6. Getting in touch',
        copy: [
            'Need to raise a concern? Email help@willwritingonline.co.uk or use the secure messaging inside your dashboard. We respond to all consumer-rights enquiries within two UK working days.'
        ]
    }
];

export default function ConsumerRightsAct() {
    return (
        <FrontendLayout>
            <Head title="Consumer Rights Act 2015 | Will Writing Online" />
            <main className="bg-white py-14 sm:py-16">
                <section className="container mx-auto px-4 sm:px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-10 sm:mb-12 text-center">
                            <p className="text-xs sm:text-sm uppercase tracking-[0.4em] text-primary-400">Consumer Rights</p>
                            <h1 className="mt-4 text-3xl sm:text-4xl font-serif font-semibold text-primary-900">How we comply with the Consumer Rights Act 2015</h1>
                            <p className="mt-4 text-sm sm:text-base text-primary-700">
                                Our online-only will and LPA service follows UK legislation for digital services so you always know your protections.
                            </p>
                        </div>
                        <div className="space-y-8 sm:space-y-10">
                            {consumerRightsSections.map((section) => (
                                <article key={section.title} className="rounded-3xl border border-slate-200/80 bg-white/70 p-6 sm:p-7 shadow-[0_15px_45px_rgba(15,23,42,0.08)]">
                                    <h2 className="text-xl sm:text-2xl font-semibold text-primary-900">{section.title}</h2>
                                    <div className="mt-4 space-y-3 text-sm sm:text-base leading-relaxed text-primary-700">
                                        {section.copy.map((paragraph) => (
                                            <p key={paragraph}>{paragraph}</p>
                                        ))}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </FrontendLayout>
    );
}
