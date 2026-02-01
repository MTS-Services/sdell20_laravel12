import React from 'react';

import { useScrollReveal } from '@/hooks/use-scroll-reveal';

export function HowItWorksSection() {
    const sectionRef = useScrollReveal<HTMLElement>();

    const steps = [
        {
            number: '1',
            gradient: 'from-green-400 to-green-600',
            accent: 'bg-yellow-400',
            title: 'Answer Questions',
            description:
                "While there is more than one way to make a will online, you can generally expect to answer questions about your circumstances such as whether you're single or married, and where your assets are located from your mobile phone or comfort of your computer chair.",
        },
        {
            number: '2',
            gradient: 'from-yellow-400 to-yellow-600',
            accent: 'bg-orange-400',
            title: 'Expert Review',
            description:
                'Following this, a team of experts will typically examine your application, recommend any changes and do a final review to ensure everything is legally compliant and meets your specific needs.',
        },
        {
            number: '3',
            gradient: 'from-orange-400 to-orange-600',
            accent: 'bg-red-400',
            title: 'Sign & Witness',
            description:
                "Once approved, you'll still need to print and sign your legally-binding document in the presence of two witnesses to make it valid and enforceable under law.",
        },
    ];

    return (
        <section ref={sectionRef} className="bg-cream py-24">
            <div className="container mx-auto px-6">
                <div className="mb-16 space-y-4 text-center" data-animate data-animate-direction="up">
                    <h2 className="font-serif text-5xl font-bold text-primary-900 md:text-6xl">Quick Guide to Will Writing Online</h2>
                    <p className="mx-auto max-w-3xl font-body text-xl text-slate-700">Create your legally-binding will in three simple steps</p>
                </div>

                <div
                    className="mx-auto grid max-w-6xl gap-12 md:grid-cols-3"
                    data-animate
                    data-animate-direction="up"
                    data-animate-delay="0.1s"
                >
                    {steps.map((step) => (
                        <div key={step.number} className="space-y-6 text-center">
                            <div className="text-center space-y-6">
                                <div className="relative inline-block">
                                    <div
                                        className={`mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-linear-to-br ${step.gradient} shadow-2xl transition-transform hover:scale-110`}
                                    >
                                        <span
                                            className="text-7xl font-black text-white"
                                            style={{ fontFamily: 'Arial Black, sans-serif', textShadow: '3px 3px 0px rgba(0,0,0,0.2)' }}
                                        >
                                            {step.number}
                                        </span>
                                    </div>
                                    <div className={`absolute -top-2 -right-2 h-12 w-12 rounded-full ${step.accent}`} />
                                    <div className="absolute -bottom-2 -left-2 h-8 w-8 rounded-full bg-green-300" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="font-serif text-2xl font-bold text-primary-900">{step.title}</h3>
                                <p className="font-body text-slate-700 leading-relaxed">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
