import React from 'react';
import { router } from '@inertiajs/react';

const heroContent = {
    image: 'https://images.pexels.com/photos/4069291/pexels-photo-4069291.jpeg?auto=compress&cs=tinysrgb&w=1200',
    heading: 'Make a Will Online',
    intro:
        'Need a Will? Or is it time to update the one you already have? Online Will Write lets you create a brand new Will or refresh your existing one quickly, securely, and entirely online.',
    changePrompt: 'Life changes quickly. Since making your Will, has there been:',
    prompts: ['A birth in the family?', 'A marriage or divorce?', 'A change of address?', 'A change in assets or financial position?', 'A change in executors or beneficiaries?'],
    assurance:
        'Even small changes can affect how your estate is distributed and how smoothly matters are handled for your family and loved ones. Updating your Will ensures:',
    benefits: [
        'Your wishes are legally clear and current',
        'Your family avoids unnecessary disputes',
        'Your assets are distributed exactly as intended',
        'Your executors have clear instructions',
        'You remain protected under current circumstances',
    ],
    closing:
        'If you don’t yet have a Will, putting one in place now gives you peace of mind and certainty for the future. Our online process is straightforward, secure, and includes professional guidance throughout.',
    offerTitle: 'Save £50 when you start your will online',
    offerBody: 'We’ll apply the discount automatically when you finish the online part of our service.',
    offerLegal: 'This offer is only available in England and Wales. Full terms and conditions apply.',
    primaryCtaLabel: "Let's get started",
};


export function WillWritingHeroSection() {
    const handleGetStarted = () => {
        router.visit('/will-writing/start');
    };

    return (
        <section className="px-4 py-10 sm:px-6 md:py-14 lg:px-10 lg:py-20">
            <div className="container mx-auto rounded-[40px] bg-white shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
                <div className="grid gap-10 overflow-hidden p-8 sm:p-12 lg:grid-cols-[1.15fr_0.85fr]">
                    <div className="space-y-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary-500">Will Writing</p>
                        <h1 className="text-3xl font-serif font-bold leading-tight text-primary-900 md:text-4xl lg:text-5xl">{heroContent.heading}</h1>
                        <p className="text-base leading-relaxed text-primary-700">{heroContent.intro}</p>
                        <p className="text-base font-semibold text-primary-900">{heroContent.changePrompt}</p>
                        <ul className="list-disc space-y-2 pl-5 text-base text-primary-800">
                            {heroContent.prompts.map((prompt) => (
                                <li key={prompt}>{prompt}</li>
                            ))}
                        </ul>
                        <p className="text-base leading-relaxed text-primary-700">{heroContent.assurance}</p>
                        <ul className="list-disc space-y-2 pl-5 text-base text-primary-800">
                            {heroContent.benefits.map((benefit) => (
                                <li key={benefit}>{benefit}</li>
                            ))}
                        </ul>
                        <p className="text-base leading-relaxed text-primary-700">{heroContent.closing}</p>
                        <button
                            onClick={handleGetStarted}
                            className="mt-6 inline-flex w-full sm:w-96 items-center justify-center rounded-xl bg-[#05baf2] px-10 py-4 text-base sm:text-lg font-semibold text-white shadow-[0_12px_30px_rgba(5,186,242,0.45)] transition hover:bg-[#04a8db] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#05baf2]"
                        >
                            {heroContent.primaryCtaLabel}
                        </button>
                    </div>
                    <div className="space-y-6 rounded-[30px] border border-slate-100 bg-slate-50/60 p-6">
                        <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white shadow-[0_20px_45px_rgba(15,23,42,0.08)]">
                            <img src={heroContent.image} alt="Customer completing will online" className="h-64 w-full object-cover" />
                            <div className="absolute inset-x-6 bottom-6 rounded-2xl bg-primary-900/40 p-4 text-white shadow-lg">
                                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary-200">Limited-time offer</p>
                                <p className="mt-2 text-xl font-serif font-semibold text-white">{heroContent.offerTitle}</p>
                                <p className="mt-2 text-sm text-white">{heroContent.offerBody}</p>
                                <p className="mt-1 text-xs text-white">{heroContent.offerLegal}</p>
                            </div>
                        </div>
                        <div className="rounded-[24px] border border-primary-100 bg-white p-5 text-primary-800">
                            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-500">Professional guidance</p>
                            <p className="mt-3 text-base leading-relaxed">
                                We’ll confirm the documents you need, guide you through every form, and make sure everything is signed and witnessed correctly before you
                                download or print your Will.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
