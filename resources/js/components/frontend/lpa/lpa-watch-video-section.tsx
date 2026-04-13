import React from 'react';

import { CreateLpaCta } from '@/components/frontend/lpa/lpa-start-application-section';
import { RevealMotion, revealStagger } from '@/components/frontend/reveal-motion';
import { useReveal } from '@/hooks/use-reveal';
import { Bird, ClipboardCheck, Info, Monitor } from 'lucide-react';

const features: { icon: typeof Monitor; label: string }[] = [
    { icon: Monitor, label: 'Quick, guided online process' },
    { icon: ClipboardCheck, label: 'Expert checks with solicitor-level care' },
    { icon: Bird, label: 'No jargon—just peace of mind' },
];

export function LpaWatchVideoSection() {
    const [sectionRef, sectionVisible] = useReveal<HTMLElement>(0.08);

    return (
        <section ref={sectionRef} className="bg-white px-4 py-10 md:px-6 md:py-14">
            <div className="container mx-auto max-w-7xl">
                <div className="rounded-3xl border border-slate-200 bg-slate-100 p-8 shadow-sm md:p-10 lg:p-12">
                    <RevealMotion show={sectionVisible} mode="fade-up" delayClass="delay-100">
                        <h2 className="text-center font-montserrat text-2xl font-bold tracking-tight text-primary-900 md:text-3xl">
                            Watch how simple it can be with Power of Attorney Online.
                        </h2>
                    </RevealMotion>

                    <div className="mt-8 grid gap-4 sm:grid-cols-3">
                        {features.map(({ icon: Icon, label }, index) => (
                            <RevealMotion
                                key={label}
                                show={sectionVisible}
                                mode="fade-up"
                                delayClass={revealStagger(index)}
                            >
                                <div className="flex h-full items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                                        <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                                    </span>
                                    <p className="pt-1 text-sm font-medium leading-snug text-primary-800">{label}</p>
                                </div>
                            </RevealMotion>
                        ))}
                    </div>

                    <RevealMotion show={sectionVisible} mode="scale-up" delayClass="delay-300" className="mx-auto mt-10 max-w-4xl">
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-primary-900 shadow-lg">
                            <div className="relative w-full pt-[56.25%]">
                                <video
                                    controls
                                    playsInline
                                    preload="metadata"
                                    muted
                                    autoPlay
                                    className="absolute inset-0 h-full w-full object-cover"
                                >
                                    <source src="/assets/videos/home_page_video.mp4" type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        </div>
                    </RevealMotion>

                    <RevealMotion show={sectionVisible} mode="fade-up" delayClass="delay-500" className="mt-10">
                        <div className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:flex-wrap sm:gap-8">
                            <div className="flex items-center gap-2 text-center sm:text-left">
                                <span
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-white shadow-sm"
                                    aria-hidden
                                >
                                    <Info className="h-5 w-5" strokeWidth={2} />
                                </span>
                                <span className="text-sm font-semibold text-primary-800 md:text-base">
                                    Start yours today - it only takes 15 minutes
                                </span>
                            </div>
                            <CreateLpaCta>Create your LPA now</CreateLpaCta>
                        </div>
                    </RevealMotion>
                </div>
            </div>
        </section>
    );
}
