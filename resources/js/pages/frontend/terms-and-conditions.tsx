import React from 'react';
import { Head } from '@inertiajs/react';

import FrontendLayout from '@/layouts/frontend-layout';

const termsSections = [
    {
        title: '1. Introduction',
        copy: [
            'These Terms and Conditions govern your use of the Will Writing Online website, applications, and services. By ordering a will, LPA, or related service you agree to these terms in full. If you do not agree, please stop using the service immediately.',
            'Our estate-planning experience is delivered entirely online—consultations, questionnaires, document reviews, and approvals are completed through our secure digital platform.',
            'Will Writing Online is registered in England & Wales #15576136 with its principal office at Nightingale House, 46/48 East Street, Epsom, Surrey, KT17 1HQ.'
        ]
    },
    {
        title: '2. Our services',
        copy: [
            'We provide templated and bespoke Will and Lasting Power of Attorney services for individuals located in England and Wales. We do not provide advice for Scotland, Northern Ireland, or jurisdictions outside the UK.',
            'All documents are prepared based on the information you provide. We will not be responsible for errors or omissions arising from inaccurate or incomplete instructions.'
        ]
    },
    {
        title: '3. Eligibility',
        copy: [
            'To use our service you must be at least 18 years old, have mental capacity, and be a resident of England or Wales. You confirm that any person you are creating documents for also meets these requirements.'
        ]
    },
    {
        title: '4. Fees & payment',
        copy: [
            'Prices are displayed before checkout and include VAT unless stated otherwise. Payment is taken at the point you approve your draft documents. Any Office of the Public Guardian registration fees are payable separately when lodging LPAs.'
        ]
    },
    {
        title: '5. Intellectual property',
        copy: [
            'All software, templates, and written content provided through our platform remain the property of Will Writing Online. You may only use generated documents for your personal estate planning and must not resell, copy, or distribute them commercially.'
        ]
    },
    {
        title: '6. Limitation of liability',
        copy: [
            'We are not liable for any indirect, consequential, or incidental loss. Our total liability for any claim arising out of our services shall not exceed the amount paid for the service in question, except where liability cannot be limited under UK law.'
        ]
    },
    {
        title: '7. Cancellation & refunds',
        copy: [
            'You may cancel within 14 days of purchase if we have not begun drafting your documents and receive a full refund. Once drafting work has started, refunds will reflect the time already spent by our legal team.'
        ]
    },
    {
        title: '8. Changes to these terms',
        copy: [
            'We may update these terms to reflect changes in legislation or our services. The latest version will always be published on this page and will take effect immediately for new orders.'
        ]
    }
];

export default function TermsAndConditions() {
    return (
        <FrontendLayout>
            <Head title="Terms & Conditions | Will Writing Online" />
            <main className="bg-white py-14 sm:py-16">
                <section className="container mx-auto px-4 sm:px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-10 sm:mb-12 text-center">
                            <p className="text-xs sm:text-sm uppercase tracking-[0.4em] text-primary-400">Terms & Conditions</p>
                            <h1 className="mt-4 text-3xl sm:text-4xl font-serif font-semibold text-primary-900">Clear, plain-language terms for every client</h1>
                            <p className="mt-4 text-sm sm:text-base text-primary-700">
                                Please read these terms carefully before ordering a Will, LPA, or related service from Will Writing Online.
                            </p>
                        </div>
                        <div className="space-y-8 sm:space-y-10">
                            {termsSections.map((section) => (
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
