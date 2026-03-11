import React from 'react';

import { useReveal } from '@/hooks/use-reveal';

export function LpaVideoSection() {
    const [sectionRef, sectionVisible] = useReveal<HTMLDivElement>(0.1);

    return (
        <section className="bg-linear-to-b from-primary-50 via-white to-white px-6 py-20">
            <div
                ref={sectionRef}
                className={`mx-auto max-w-4xl rounded-3xl border border-primary-100 bg-white/95 p-8 text-center shadow-[0_25px_60px_rgba(18,35,46,0.08)] transition-all duration-700 ease-out ${sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            >
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-secondary">Watch & learn</p>
                <h2 className="mt-3 text-3xl font-semibold text-primary">See how the LPA process works</h2>
                <p className="mt-2 text-base text-text-muted">
                    This short explainer covers each step we handle for you, from drafting to registering your documents with the Office of Public Guardian.
                </p>

                <div className="mt-8 aspect-video w-full overflow-hidden rounded-2xl border border-primary-100 bg-black shadow-lg">
                    <iframe
                        className="h-full w-full"
                        src="https://www.youtube.com/embed/ztZWHiixUDg?si=UJ7zCnZ4ReWLBFff&start=41"
                        title="How LPA works"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                    />
                </div>
            </div>
        </section>
    );
}
