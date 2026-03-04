import React from 'react';
import { router } from '@inertiajs/react';

const heroContent = {
    image: 'https://images.pexels.com/photos/4069291/pexels-photo-4069291.jpeg?auto=compress&cs=tinysrgb&w=1200',
    heading: 'Save £50 when you start your will online',
    description: 'Offer ends 15 February. We’ll apply the discount automatically when you finish the online part of our service.',
    legal: 'This offer is only available in England and Wales. Full terms and conditions apply.',
    primaryCtaLabel: "Let's get started",
};


export function WillWritingHeroSection() {
    const handleGetStarted = () => {
        router.visit('/will-writing/start');
    };

    return (
        <section className=" px-4 py-10 md:py-15 lg:py-20 sm:px-6 lg:px-10">
            <div className="mx-auto container rounded-4xl bg-white shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
                <div className="grid gap-10 overflow-hidden p-8 sm:p-12 lg:grid-cols-2">
                    <div className="flex flex-col justify-center">
                        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary-500">Will Writing</p>
                        <h1 className="mt-4 text-3xl md:text-4xl lg:text-5xl xl:text-6xl  font-serif font-bold leading-tight text-primary-500">{heroContent.heading}</h1>
                        <p className="mt-4 text-base md:text-lg lg:text-xl  text-primary-800 font-normal mb-2">{heroContent.description}</p>
                        <p className="mt-2 text-sm md:text-base lg:text-lg   text-primary-700">{heroContent.legal}</p>
                        <button
                            onClick={handleGetStarted}
                            className="mt-6 inline-flex w-full sm:w-96 items-center justify-center rounded-xl bg-[#05baf2] px-10 py-4 text-base font-semibold text-white shadow-[0_12px_30px_rgba(5,186,242,0.45)] transition hover:bg-[#04a8db] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#05baf2]"
                        >
                            {heroContent.primaryCtaLabel}
                        </button>
                    </div>
                    <div className="relative image-card rounded-[30px] border border-slate-100">
                        <div className="absolute left-4 top-4 z-20 rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white">Save £50</div>
                        <img src={heroContent.image} alt="Customer completing will online" className="relative z-10 w-full rounded-[28px] object-cover" />
                    </div>
                </div>
            </div>
        </section>
    );
}
