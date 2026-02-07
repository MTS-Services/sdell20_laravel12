import React from 'react';

const heroContent = {
    image: 'https://a.storyblok.com/f/309177/x/210759265f/willwriting_hero.avif',
    heading: 'Professional will writing services, tailored to you.',
    description: 'Finding the right type of will can feel complex—we make it simple. Trusted by 700,000+ families to plan ahead with confidence and compassion.',
    primaryCtaLabel: "Let's get started",
    primaryCtaHref: '#pricing',
};

const heroReviewStars = Array.from({ length: 5 }, (_, index) => index);

export function WillWritingHeroSection() {
    return (
        <section className="px-4 py-12 sm:px-6 lg:px-10">
            <div className="relative mx-auto container overflow-hidden rounded-[40px] bg-slate-800 text-white">
                <img src={heroContent.image} alt="Family planning legacy together" className="absolute inset-0 h-full w-full object-cover" />
                <div className="relative z-10 flex min-h-160 flex-col justify-center gap-6 px-8 py-12 sm:px-16 lg:px-20">
                    <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/70 animate-fadeInUp">Will Writing</p>
                    <h1 className="text-4xl font-serif font-semibold leading-tight lg:text-5xl animate-fadeInUp delay-100">{heroContent.heading}</h1>
                    <p className="max-w-2xl text-base text-white/80 animate-fadeInUp delay-200">{heroContent.description}</p>
                    <div className="flex flex-wrap items-center gap-4 animate-fadeInUp delay-300">
                        <a
                            href={heroContent.primaryCtaHref}
                            className="inline-flex items-center gap-3 rounded-full bg-white px-8 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-slate-50"
                        >
                            {heroContent.primaryCtaLabel}
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <path d="M5 12h14" />
                                <path d="M12 5l7 7-7 7" />
                            </svg>
                        </a>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-white/80 animate-fadeInUp delay-400">
                        <span className="underline decoration-1 underline-offset-4">Excellent</span>
                        <div className="flex gap-0.5">
                            {heroReviewStars.map((_, index) => (
                                <span key={index} className={`inline-flex h-4 w-6 items-center justify-center ${index < 4 ? 'bg-primary-500 text-white' : 'bg-white/20 text-white/70'}`}>
                                    ★
                                </span>
                            ))}
                        </div>
                        <span className="flex items-center gap-1 text-[11px] text-white/70">
                            <svg className="h-3.5 w-3.5 text-primary-500" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.782 1.402 8.174L12 18.896 4.664 23.166l1.402-8.174L.132 9.21l8.2-1.192z" />
                            </svg>
                            Trustpilot
                        </span>
                        <span className="text-[10px] text-white/60">Laura, Head of Legal, with Mamá Inés</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
