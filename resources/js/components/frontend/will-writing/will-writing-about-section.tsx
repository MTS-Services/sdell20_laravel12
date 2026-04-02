import React from 'react';

const aboutContent = {
    heading: 'Our job is to bring care to life.',
    paragraphs: [
        'At Will Write Online, we move thoughtfully, communicate clearly, and obsess over every detail so families can plan in confidence.',
        "We're a team that values kindness, craft, and ownership—building services that genuinely help people prepare for tomorrow.",
    ],
};

export function WillWritingAboutSection() {
    return (
        <section className="bg-linear-to-b from-primary-50 via-white to-white px-4 py-16 sm:px-6 lg:px-10">
            <div className="mx-auto max-w-5xl rounded-[36px] bg-white/70 p-8 shadow-2xl shadow-primary-200/40">
                <div className="space-y-4 animate-fadeInUp delay-100 text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary-500">About</p>
                    <h3 className="text-3xl font-serif font-semibold text-primary-900">{aboutContent.heading}</h3>
                    <div className="mx-auto max-w-3xl space-y-4">
                        {aboutContent.paragraphs.map((text) => (
                            <p key={text} className="text-sm text-primary-600">
                                {text}
                            </p>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
