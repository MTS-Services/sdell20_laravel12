import React from 'react';

import { useScrollReveal } from '@/hooks/use-scroll-reveal';

export function LoveOnesSection() {
    const sectionRef = useScrollReveal<HTMLElement>();
    return (
        <section ref={sectionRef} className="bg-white py-20">
            <div className="container mx-auto px-6">
                <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
                    <div className="order-2 md:order-1" data-animate data-animate-direction="left">
                        <img
                            src="https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&h=600&fit=crop"
                            alt="Family gathering"
                            className="h-auto w-full rounded-3xl shadow-2xl"
                        />
                    </div>
                    <div className="order-1 space-y-6 md:order-2" data-animate data-animate-direction="right" data-animate-delay="0.1s">
                        <h2 className="font-serif text-4xl font-bold text-primary-900 md:text-5xl">It's for the ones we love</h2>
                        <p className="font-body text-lg leading-relaxed text-slate-700">
                            Planning ahead isn't just about organization—it's an act of love. By documenting your wishes and important information now, you're giving your family the gift of clarity and peace of mind during one of life's most challenging moments.
                        </p>
                        <p className="font-body text-lg leading-relaxed text-slate-700">
                            Our secure platform makes it easy to gather everything in one place, so your loved ones can focus on what matters most: being together and honoring your memory.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
