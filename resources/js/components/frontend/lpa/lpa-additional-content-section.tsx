import React from 'react';

import { RevealMotion, revealStagger } from '@/components/frontend/reveal-motion';
import { useReveal } from '@/hooks/use-reveal';

const applicationSteps = [
    {
        title: 'Decide Which LPA You Need',
        points: [
            'There are two types of LPA:',
            'Health & Welfare LPA - Covers decisions about your medical care, living arrangements, and daily wellbeing.',
            'Property & Financial Affairs LPA - Covers decisions about money, bills, property, and investments.',
        ],
    },
    {
        title: 'Choose Your LPA Attorneys',
        points: [
            'Your attorneys are the people who will act for you if you lose mental capacity. They could be:',
            'A trusted friend or family member',
            'A professional, such as a solicitor',
            'Choose someone responsible, trustworthy, and who understands your wishes.',
        ],
    },
    {
        title: 'Pick a Certificate Provider',
        points: [
            "A certificate provider confirms you're making the LPA willingly and that you understand it. They must be:",
            'A professional (e.g., doctor or solicitor), or',
            'Someone who has known you personally for at least two years.',
        ],
    },
    {
        title: 'Prepare Your Details',
        points: [
            "Before filling in your forms, you'll need the full legal names and current addresses of:",
            'You (the donor)',
            'All attorneys',
            'Your certificate provider',
            'Any witnesses who will sign at the relevant stages',
        ],
    },
    {
        title: 'Complete Your Forms',
        points: [
            "You'll need to include:",
            'Attorney names and details',
            'How they will act (jointly or individually)',
            'Any preferences or instructions',
            'Our online system makes this simple and helps reduce the chance of errors that could lead to rejection.',
        ],
    },
    {
        title: 'Sign in the Correct Order',
        points: [
            'All signatures must be wet signatures (pen on paper). The correct order is:',
            '1. You (the donor): sign first, with a witness.',
            '2. Certificate provider: signs next.',
            '3. Attorneys: each must sign with a witness.',
            'Witnesses must be independent adults. Record their full legal names and addresses clearly.',
        ],
    },
    {
        title: 'Register Your LPA',
        points: [
            'Send your forms to the Office of the Public Guardian.',
            "Fee: GBP92 per LPA (discounts may apply if you're on a low income).",
            'Registration time: Up to 10 weeks.',
        ],
    },
    {
        title: 'Keep It Safe',
        points: [
            'Once registered, your LPA is legally valid.',
            'Store it securely and make sure your attorneys know where to find it.',
            'You can also keep a digital copy for convenience.',
        ],
    },
];

export function LpaAdditionalContentSection() {
    const [sectionRef, sectionVisible] = useReveal<HTMLElement>(0.08);

    return (
        <section ref={sectionRef} className="bg-white px-4 py-10 md:px-6 md:py-14">
            <div className="container mx-auto max-w-7xl">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8 lg:p-10">
                    <RevealMotion show={sectionVisible} mode="fade-up" delayClass="delay-100">
                        <h2 className="font-montserrat text-2xl font-bold tracking-tight text-primary-900 md:text-3xl">
                            A Lasting Power of Attorney: What Is It?
                        </h2>
                    </RevealMotion>

                    <RevealMotion show={sectionVisible} mode="fade-up" delayClass="delay-200">
                        <div className="mt-5 space-y-4 text-base leading-relaxed text-slate-700 md:text-lg">
                            <p>
                                A Lasting Power of Attorney, or LPA, is a legal document that allows you to designate trusted
                                individuals to make decisions on your behalf in the event that you are unable to do so.
                            </p>
                            <p>
                                These choices may have to do with your finances, your care, or your health. An LPA must be
                                registered with the Office of the Public Guardian before it may be used, and it only becomes
                                effective when necessary.
                            </p>
                            <p>
                                <strong>Health and welfare:</strong> This includes choices on your living situation, medical
                                care, and care arrangements. You can only use it if you are mentally incapable.
                            </p>
                            <p>
                                <strong>Property and finance:</strong> Decisions pertaining to money, property, debts, and
                                investments fall under this category. Once registered, it may be utilized with your consent or
                                in the event that you become incapacitated.
                            </p>
                            <p>Having both kinds guarantees that every aspect of your life is safeguarded.</p>
                            <p>
                                Power of Attorney Online makes creating a Lasting Power of Attorney (LPA) easy, straightforward,
                                and stress-free.
                            </p>
                        </div>
                    </RevealMotion>

                    <RevealMotion show={sectionVisible} mode="fade-up" delayClass="delay-300">
                        <h3 className="mt-10 font-montserrat text-xl font-bold text-primary-900 md:text-2xl">
                            How to Apply for a Lasting Power of Attorney
                        </h3>
                    </RevealMotion>

                    <RevealMotion show={sectionVisible} mode="fade-up" delayClass="delay-400">
                        <p className="mt-3 text-base leading-relaxed text-slate-700 md:text-lg">
                            Our guided procedure ensures that you know precisely what to do at every step, whether you&apos;re
                            helping a loved one or setting one up for yourself. We can help with everything from obtaining
                            information to registering with the Office of the Public Guardian (OPG).
                        </p>
                    </RevealMotion>

                    <div className="mt-8 grid gap-4 md:gap-5">
                        {applicationSteps.map((step, index) => (
                            <RevealMotion
                                key={step.title}
                                show={sectionVisible}
                                mode="fade-up"
                                delayClass={revealStagger(index)}
                            >
                                <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-6">
                                    <h4 className="text-lg font-bold text-primary-900 md:text-xl">
                                        {index + 1}. {step.title}
                                    </h4>
                                    <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700 md:text-base">
                                        {step.points.map((point) => (
                                            <li key={point}>{point}</li>
                                        ))}
                                    </ul>
                                </article>
                            </RevealMotion>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
