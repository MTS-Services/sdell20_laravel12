import React from 'react';

import { useReveal } from '@/hooks/use-reveal';

export function JobSection() {
    const [textRef, textVisible] = useReveal<HTMLDivElement>();
    const [imageRef, imageVisible] = useReveal<HTMLDivElement>(0.2);

    return (
        <section className="py-24">
            <div className="mx-auto max-w-7xl px-6">
                <div className="grid items-center gap-16 lg:grid-cols-2">
                    <div
                        ref={imageRef}
                        className={`order-2 flex justify-center lg:order-1 lg:justify-start transition-all duration-700 ease-out ${imageVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                            }`}
                    >
                        <div className="max-w-145 rounded-xl border border-primary-100 shadow-2xl">
                            <img
                                src="https://a.storyblok.com/f/309177/867x867/5b4a9d2eba/sam-mum.jpeg"
                                alt="Family legacy moments"
                                className="h-full w-full rounded-xl object-cover"
                                loading="lazy"
                            />
                        </div>
                    </div>
                    <div
                        ref={textRef}
                        className={`order-1 space-y-6 text-center lg:order-2 lg:text-left transition-all duration-700 ease-out ${textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                            }`}
                    >
                        <p className="text-xs uppercase tracking-[0.35em] text-primary-500">Why we exist</p>
                        <h2 className="text-4xl font-light text-primary-900 md:text-5xl">Our job is to bring death to life.</h2>
                        <p className="text-lg leading-relaxed text-primary-800">
                            Born after Sam's mum died in a car accident, we know the difference a good plan makes — and what it's like when there isn't one. We see a
                            world where you work out your personal meaning of legacy by talking about death with people you love.
                        </p>
                        <p className="text-lg leading-relaxed text-primary-800">We're here to make that happen by guiding every conversation and detail with empathy.</p>
                        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                            <a
                                href="#planning"
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-900 px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-primary-800"
                            >
                                Plan for death →
                            </a>
                            <a
                                href="#support"
                                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-primary-900 px-8 py-3 text-sm font-semibold text-primary-900 transition hover:bg-primary-100"
                            >
                                Get support after loss →
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
