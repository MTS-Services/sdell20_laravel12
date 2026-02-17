import React from 'react';
import { Head } from '@inertiajs/react';

import FrontendLayout from '@/layouts/frontend-layout';

const policySections = [
    {
        title: '1. Who we are',
        copy: [
            'Will Writing Online Ltd provides online Will and Lasting Power of Attorney services for clients across England and Wales. We are registered in England & Wales (#15576136) with our principal office at Nightingale House, 46/48 East Street, Epsom, Surrey, KT17 1HQ.',
            'You can contact our Data Protection lead at privacy@willwritingonline.co.uk for any privacy-related questions.'
        ]
    },
    {
        title: '2. The information we collect',
        copy: [
            'When you create documents, book consultations, or subscribe to updates we collect contact details, identification information, household data, and any supporting documents you upload.',
            'We also gather limited technical data (device type, browser, and anonymised analytics) to keep the platform secure and reliable.'
        ]
    },
    {
        title: '3. How we use your information',
        copy: [
            'To prepare your Will or LPA, keep you updated on the status of your documents, and comply with legal/regulatory obligations.',
            'We never sell your data. We only share information with trusted delivery partners such as identity verification services, secure mail/hosting vendors, or legal counsel helping fulfil your instructions.'
        ]
    },
    {
        title: '4. Legal basis',
        copy: [
            'We rely on contractual necessity (to deliver your chosen service), explicit consent (for marketing preferences), and legitimate interest (maintaining platform security and fraud prevention).'
        ]
    },
    {
        title: '5. Retention & security',
        copy: [
            'Client files are stored for a minimum of 7 years unless a longer retention period is required by law or requested by you for document storage services.',
            'Your documents are encrypted in transit and at rest. We routinely review access logs, enforce MFA for all staff tools, and host the application on hardened UK-based infrastructure.'
        ]
    },
    {
        title: '6. Your rights',
        copy: [
            'You can request a copy of your data, ask us to correct inaccuracies, object to marketing, or request deletion where applicable. Contact privacy@willwritingonline.co.uk and we will respond within 30 days.',
            'If you are unhappy with how we handle your data you have the right to complain to the Information Commissioner’s Office (ICO).'
        ]
    },
    {
        title: '7. Updates to this policy',
        copy: [
            'We review this policy whenever our services or regulatory requirements change. The version below was last updated on 17 February 2026.'
        ]
    }
];

export default function PrivacyPolicy() {
    return (
        <FrontendLayout>
            <Head title="Privacy Policy | Will Writing Online" />
            <main className="bg-white py-14 sm:py-16">
                <section className="container mx-auto px-4 sm:px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-10 sm:mb-12 text-center">
                            <p className="text-xs sm:text-sm uppercase tracking-[0.4em] text-primary-400">Privacy Policy</p>
                            <h1 className="mt-4 text-3xl sm:text-4xl font-serif font-semibold text-primary-900">Protecting your data while you protect your legacy</h1>
                            <p className="mt-4 text-sm sm:text-base text-primary-700">
                                This policy explains how Will Writing Online Ltd collects, uses, and protects your information when you use our Will & LPA services.
                            </p>
                        </div>
                        <div className="space-y-8 sm:space-y-10">
                            {policySections.map((section) => (
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
