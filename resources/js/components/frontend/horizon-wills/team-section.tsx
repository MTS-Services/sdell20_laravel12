import React, { useEffect, useState } from 'react';

type Testimonial = {
    quote: string;
    name: string;
};

const BG_IMAGE =
    'https://heirkinestateplanning.co.uk/wp-content/themes/Heirkin/assets/images/testimonial-bg.png';

const READ_MORE_THRESHOLD = 220;

const testimonials: Testimonial[] = [
    {
        quote: `I thought doing my will myself would be simple, but I ended up completely stuck and worried I'd make mistakes. Heirkin Estate Planning took over and explained everything clearly during the home visit. They sorted it all properly and I finally have peace of mind.`,
        name: 'Samantha S.',
    },
    {
        quote: `From the first call to the final paperwork, everything was handled with clarity and care. The team made the whole process feel straightforward and stress-free.`,
        name: 'James T.',
    },
    {
        quote: `Professional, friendly, and extremely thorough. I felt supported throughout, and everything was explained in a way I could easily understand.`,
        name: 'Aisha R.',
    },
    {
        quote: `Excellent service and great communication. I appreciated how patient they were with my questions and how well they guided me through each step.`,
        name: 'Michael P.',
    },
    {
        quote: `The home visit was incredibly helpful. They were organised, reassuring, and made sure everything was correct — it gave me real peace of mind.`,
        name: 'Helen W.',
    },
    {
        quote: `Fast, clear, and trustworthy. The entire experience felt premium and well-managed from start to finish.`,
        name: 'Daniel K.',
    },
];

export function TeamSection() {
    const [active, setActive] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTestimonial, setModalTestimonial] = useState<Testimonial | null>(null);

    // Auto-slide (optional)
    useEffect(() => {
        const t = setInterval(() => {
            setActive((prev) => (prev + 1) % testimonials.length);
        }, 6500);
        return () => clearInterval(t);
    }, []);

    const t = testimonials[active];

    return (
        <section
            className="relative overflow-hidden py-20 lg:py-28"
            style={{
                backgroundImage: `url('${BG_IMAGE}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '640px',
            }}
        >
            {/* Dark overlay (to match screenshot) */}
            <div className="absolute inset-0 -z-10 bg-slate-900/60" aria-hidden="true" />

            <div className="mx-auto max-w-7xl px-6">
                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                    {/* Left content */}
                    <div className="text-white">
                        <h2 className="font-sans text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
                            What
                            <br />
                            people say
                            <br />
                            about us
                        </h2>

                        <p className="mt-8 max-w-md text-base leading-7 text-white/80 sm:text-lg">
                            Hear from our happy customers — real stories of trust, satisfaction, and
                            exceptional service experiences.
                        </p>
                    </div>

                    {/* Right testimonial card */}
                    <div className="lg:flex lg:justify-end">
                        <div className="relative flex w-full max-w-2xl flex-col rounded-3xl border border-white/15 bg-black/10 p-8 shadow-2xl backdrop-blur-xl sm:p-10 min-h-105 sm:max-h-85">
                            {/* Quote mark */}
                            <div className="mb-6 text-white/70">
                                <svg
                                    className="h-10 w-10"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path d="M7.17 6A5.17 5.17 0 0 0 2 11.17V18a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H6.5a3.17 3.17 0 0 1 3.17-3.17.75.75 0 0 0 0-1.5H7.17Zm12 0A5.17 5.17 0 0 0 14 11.17V18a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2h-2.5a3.17 3.17 0 0 1 3.17-3.17.75.75 0 0 0 0-1.5h-2.5Z" />
                                </svg>
                            </div>

                            {/* Quote */}
                            <p className="text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
                                {t.quote.length > READ_MORE_THRESHOLD
                                    ? `${t.quote.slice(0, READ_MORE_THRESHOLD)}...`
                                    : t.quote}
                            </p>

                            {t.quote.length > READ_MORE_THRESHOLD && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setModalTestimonial(t);
                                        setIsModalOpen(true);
                                    }}
                                    className="mt-6 inline-flex items-center text-sm font-semibold text-white transition hover:text-white/80"
                                >
                                    Read more
                                    <span className="ml-2 text-base" aria-hidden="true">
                                        →
                                    </span>
                                </button>
                            )}

                            {/* Name */}
                            <p className="mt-8 font-semibold text-white">{t.name}</p>

                            {/* Dots / progress */}
                            <div className="mt-auto flex items-center justify-center gap-3 pt-10">
                                {testimonials.map((_, i) => {
                                    const isActive = i === active;
                                    return (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => setActive(i)}
                                            aria-label={`Go to testimonial ${i + 1}`}
                                            className={[
                                                'h-2 rounded-full transition-all duration-300',
                                                isActive ? 'w-12 bg-white' : 'w-2 bg-white/35 hover:bg-white/60',
                                            ].join(' ')}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && modalTestimonial && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-10"
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Full testimonial from ${modalTestimonial.name}`}
                >
                    <div className="relative w-full max-w-2xl rounded-3xl bg-primary-200/70 p-8 shadow-3xl">
                        <button
                            type="button"
                            className="absolute right-4 top-4 text-white transition hover:text-white/70"
                            aria-label="Close full testimonial"
                            onClick={() => setIsModalOpen(false)}
                        >
                            ×
                        </button>
                        <h3 className="text-2xl font-bold text-white">{modalTestimonial.name}</h3>
                        <p className="mt-4 text-base leading-7 text-white/80">{modalTestimonial.quote}</p>
                    </div>
                </div>
            )}
        </section>
    );
}
