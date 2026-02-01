import React from 'react';

import { useReveal } from '@/hooks/use-reveal';

export function MissionSection() {
    const [contentRef, contentVisible] = useReveal<HTMLDivElement>();
    const [videoRef, videoVisible] = useReveal<HTMLDivElement>(0.2);

    return (
        <section className="mission-section bg-slate-50 py-24">
            <div className="container mx-auto px-6">
                <div
                    ref={contentRef}
                    className={`mx-auto mb-16 max-w-3xl text-center transition-all duration-700 ease-out ${
                        contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                >
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-slate-300 bg-white">
                        <svg className="h-8 w-8 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 6v6l4 2" />
                        </svg>
                    </div>
                    <h2 className="text-4xl font-light text-slate-900 md:text-5xl">Our mission</h2>
                    <p className="mt-6 text-lg leading-relaxed text-slate-600">
                        Death is inevitable. Losing what and who you love is hard. But doing nothing about it is harder. We plan to prevent the people you'll leave
                        behind from spending precious time figuring out what to do next, and more time living the life you've left them.
                    </p>
                </div>

                <div
                    ref={videoRef}
                    className={`mx-auto max-w-4xl transition-all duration-700 ease-out ${videoVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                >
                    <div className="aspect-video overflow-hidden rounded-3xl bg-linear-to-br from-slate-200 to-slate-300 shadow-2xl">
                        <video
                            className="h-full w-full object-cover"
                            loop
                            playsInline
                            controls
                            poster="https://a.storyblok.com/f/309177/2620x1458/648998649c/video-thumbnail.avif"
                        >
                            <source
                                src="https://a.storyblok.com/f/309177/x/1bfef5d928/oct_leg_0005_legacy_box_all-contributors_v2_16x9.mp4"
                                type="video/mp4"
                            />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
            </div>
        </section>
    );
}
