import React, { useState } from 'react';

import { useReveal } from '@/hooks/use-reveal';

const reviewItems = [
    {
        title: 'Chris was so easy to talk to',
        body: 'Chris was so easy to talk to and he listened and addressed our concerns very personal.',
        author: 'Mark Hirst • 18 hours ago',
    },
    {
        title: 'Legacy issues',
        body: 'Impressed by the way the consultant dug deeply into the issues with me.',
        author: 'P. Murray • 10 hours ago',
    },
    {
        title: 'Knowledgeable and attentive',
        body: 'Very attentive and pleasant advisor who listened and was skilful for my will.',
        author: 'B. H • 15 hours ago',
    },
    {
        title: 'Very informative review',
        body: 'We had a very informative review of our estate planning needs following the creation.',
        author: 'Andrew Hutchinson • 18 hours ago',
    },
    {
        title: 'Seamless process',
        body: 'Seamless process to date from enquiry through identification of most suitable type.',
        author: 'Stuart Trower • 18 hours ago',
    },
    {
        title: 'Kind, clear guidance',
        body: 'Guidance was kind, clear, and made complex paperwork easy to sign off.',
        author: 'Rebecca L • 1 day ago',
    },
];

type ReviewItem = (typeof reviewItems)[number];

export function TeamSection() {
    const [introRef, introVisible] = useReveal<HTMLDivElement>();
    const [photoRef, photoVisible] = useReveal<HTMLDivElement>(0.15);

    return (
        <section className="bg-primary-50 py-24">
            <div className="container mx-auto px-6">
                <div
                    ref={introRef}
                    className={`mx-auto mb-12 max-w-3xl text-center transition-all duration-700 ease-out ${introVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                        }`}
                >
                    <h2 className="text-4xl font-light text-slate-900 md:text-5xl">Meet the team</h2>
                    <p className="mt-4 text-lg text-slate-600">We're a creative bunch who are here to make all of life's admin easier.</p>
                </div>

                <div
                    ref={photoRef}
                    className={`mx-auto max-w-5xl transition-all duration-700 ease-out ${photoVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                >
                    <div className="overflow-hidden rounded-3xl shadow-2xl">
                        <img
                            src="https://octopuslegacy.com/build/assets/meetTheTeam-BtHz-ds9.avif"
                            alt="Horizon Wills team"
                            className="h-full w-full object-cover"
                            loading="lazy"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

export function QuoteSection() {
    const [quoteRef, quoteVisible] = useReveal<HTMLDivElement>();
    const [sliderRevealRef, sliderVisible] = useReveal<HTMLDivElement>(0.1);
    const [currentIndex, setCurrentIndex] = useState(0);

    const VISIBLE_CARDS = 4;
    const totalCards = reviewItems.length;
    const maxIndex = totalCards - VISIBLE_CARDS;

    function handleNext() {
        setCurrentIndex((prev) => {
            if (prev >= maxIndex) {
                return 0; // Loop back to start
            }
            return prev + 1;
        });
    }

    function handlePrev() {
        setCurrentIndex((prev) => {
            if (prev <= 0) {
                return maxIndex; // Loop to end
            }
            return prev - 1;
        });
    }

    return (
        <section className="quote-section bg-slate-900 py-24 text-white">
            <div className="mx-auto max-w-7xl px-6">
                <div
                    ref={quoteRef}
                    className={`mx-auto max-w-3xl text-center transition-all duration-700 ease-out ${quoteVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                        }`}
                >
                    <h2 className="text-3xl font-light md:text-4xl">These people are talking about death and creating their legacy.</h2>
                    <p className="mt-4 text-lg text-primary-50/80">Join the conversation. Read what they have to say.</p>
                </div>

                <div className="relative mt-10">
                    {/* Previous Button */}
                    <button
                        type="button"
                        className="absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-x-4 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-slate-800/80 text-primary-50/70 transition hover:bg-white/10 sm:h-12 sm:w-12 lg:-translate-x-16"
                        onClick={handlePrev}
                        aria-label="Show previous review"
                    >
                        <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
                        </svg>
                    </button>

                    {/* Next Button */}
                    <button
                        type="button"
                        className="absolute right-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 translate-x-4 items-center justify-center rounded-full border border-white/20 bg-slate-800/80 text-primary-50/70 transition hover:bg-white/10 sm:h-12 sm:w-12 lg:translate-x-16"
                        onClick={handleNext}
                        aria-label="Show next review"
                    >
                        <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
                        </svg>
                    </button>

                    <div
                        ref={sliderRevealRef}
                        className={`overflow-hidden pb-6 transition-all duration-700 ease-out ${sliderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                    >
                        <div className="relative">
                            <div
                                className="flex transition-transform duration-500 ease-out"
                                style={{
                                    transform: `translateX(-${(currentIndex * 100) / VISIBLE_CARDS}%)`,
                                }}
                            >
                                {reviewItems.map((item, index) => (
                                    <div
                                        key={`card-${index}`}
                                        className="shrink-0 px-2"
                                        style={{ width: `${100 / VISIBLE_CARDS}%` }}
                                    >
                                        <div className="rounded-xl border border-white/10 bg-slate-900/90 p-4 text-left">
                                            <div className="flex items-center gap-2 text-sm font-semibold text-green-400">
                                                <span className="flex gap-1">★ ★ ★ ★ ★</span>
                                                <span>Invited</span>
                                            </div>
                                            <h3 className="mt-4 text-sm font-semibold text-white">{item.title}</h3>
                                            <p className="mt-2 text-xs text-primary-50/70">{item.body}</p>
                                            <p className="mt-3 text-[11px] text-primary-100/60">{item.author}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Pagination Dots
                    <div className="mt-6 flex items-center justify-center gap-2">
                        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                            <button
                                key={`dot-${index}`}
                                type="button"
                                className={`h-2.5 w-2.5 rounded-full transition ${currentIndex === index ? 'bg-white' : 'bg-white/30'}`}
                                onClick={() => setCurrentIndex(index)}
                                aria-label={`Go to position ${index + 1}`}
                            />
                        ))}
                    </div> */}
                </div>

                <p className="mt-10 text-center text-xs text-primary-50/70">
                    Rated 4.6 / 5 based on 1,521 reviews. Showing our 4 &amp; 5 star reviews. <span className="font-semibold">Trustpilot</span>
                </p>
            </div>
        </section>
    );
}