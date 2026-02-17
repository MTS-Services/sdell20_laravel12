import React from 'react';

const steps = [
    {
        number: 1,
        title: 'Launch your branded platform',
        paragraphs: [
            'Receive a fully operational Laravel site with Home, Create a Will, LPA Health & Welfare, LPA Property & Finance, About, Contact, Login/Register, and Dashboard pages ready to customize.',
            'We guide you through deployment so the site goes live quickly on your domain and remains secure from day one.',
            '30 days of post-delivery support ensures every workflow feels confident before you onboard clients.',
        ],
    },
    {
        number: 2,
        title: 'Automate client experiences',
        paragraphs: [
            'Clients self-serve via guided forms, generate PDFs of their wills and LPAs, and manage progress from their personal dashboards.',
            'Secure registration and login flows keep every document protected while you monitor submissions remotely.',
        ],
    },
    {
        number: 3,
        title: 'Scale your remote business',
        paragraphs: [
            'Add team members or franchise partners, update pricing pages, and grow by promoting the GOV.UK-inspired flow to new regions.',
            'Because everything happens online, you can reinvest savings from office overhead into marketing and client perks.',
        ],
    },
];

export function WillWritingProcessSection() {
    return (
        <section className="px-4 py-16 sm:px-6 lg:px-10">
            <div className="mx-auto max-w-6xl rounded-[36px] bg-white/70 px-6 py-10 shadow-2xl shadow-black/5 lg:px-12">
                <div className="grid gap-10 lg:grid-cols-[1fr,1.3fr]">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary-500 animate-fadeInUp">Process</p>
                        <h3 className="mt-4 text-3xl font-serif font-semibold text-primary-900 animate-fadeInUp delay-100">
                            Unlock a high-return business opportunity with Will Write Online
                        </h3>
                        <p className="mt-3 text-sm text-primary-600">
                            Three simple stages take you from investment inquiry to a thriving, remote-first will and LPA service.
                        </p>
                    </div>
                    <div className="space-y-10">
                        {steps.map((step, index) => (
                            <div key={step.number} className="flex gap-6 animate-fadeInUp" style={{ animationDelay: `${index * 150}ms` }}>
                                <div className="flex flex-col items-center">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary-200 bg-white text-sm font-semibold text-primary-600">
                                        {step.number}
                                    </span>
                                    {index < steps.length - 1 && <span className="mt-3 h-20 w-px bg-primary-100" />}
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-primary-900">{step.title}</h4>
                                    <div className="mt-2 space-y-2 text-sm text-primary-600">
                                        {step.paragraphs.map((paragraph) => (
                                            <p key={paragraph}>{paragraph}</p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
