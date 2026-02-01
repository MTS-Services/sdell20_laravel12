import React from 'react';

import { useScrollReveal } from '@/hooks/use-scroll-reveal';

export function ManagingAffairsSection() {
    const sectionRef = useScrollReveal<HTMLElement>();
    const items = [
        {
            title: 'Legal Documents',
            desc: 'Store and organize your will, power of attorney, healthcare directives, and other important legal paperwork in one secure place.',
            icon: (
                <svg className="h-8 w-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
        },
        {
            title: 'Funeral Wishes',
            desc: 'Detail your preferences for memorial services, burial or cremation, and share the traditions that matter most to you.',
            icon: (
                <svg className="h-8 w-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
        },
        {
            title: 'Financial Information',
            desc: 'Keep track of accounts, insurance policies, investments, and debts to help your family manage your estate.',
            icon: (
                <svg className="h-8 w-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            title: 'Property & Assets',
            desc: 'Document real estate, vehicles, valuable items, and other possessions with clear information about their location and value.',
            icon: (
                <svg className="h-8 w-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
        },
        {
            title: 'Personal Messages',
            desc: 'Write letters, record videos, or share meaningful messages to be delivered to loved ones when the time is right.',
            icon: (
                <svg className="h-8 w-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            ),
        },
        {
            title: 'Digital Legacy',
            desc: 'Manage your online presence, social media accounts, and digital assets with instructions for access and closure.',
            icon: (
                <svg className="h-8 w-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
        },
    ];

    return (
        <section ref={sectionRef} id="planning" className="bg-cream py-24">
            <div className="container mx-auto px-6">
                <div className="mb-16 space-y-4 text-center" data-animate data-animate-direction="up">
                    <h2 className="font-serif text-5xl font-bold text-primary-900 md:text-6xl">Managing Your Affairs</h2>
                    <p className="mx-auto max-w-2xl font-body text-xl text-slate-700">Prepare the essential details that will help your loved ones during difficult times</p>
                </div>
                <div
                    className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3"
                    data-animate
                    data-animate-direction="up"
                    data-animate-delay="0.1s"
                >
                    {items.map((item) => (
                        <div key={item.title} className="feature-card rounded-2xl bg-white p-8 shadow-lg transition-shadow hover:shadow-2xl">
                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">{item.icon}</div>
                            <h3 className="mb-4 font-serif text-2xl font-semibold text-primary-900">{item.title}</h3>
                            <p className="leading-relaxed text-slate-600">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
