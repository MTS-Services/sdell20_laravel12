import React from 'react';

const steps = [
    {
        title: 'Find the right will for you',
        description: 'Speak to our friendly team who help determine the right type of will and answer every question.',
    },
    {
        title: 'Complete your will',
        description: 'Create your will with one of our writers or via our guided online platform with zero jargon.',
    },
    {
        title: 'Check and sign your will',
        description: 'Our legal team review every detail, then send clear signing instructions plus ongoing update options.',
    },
];

export function WillWritingProcessSection() {
    return (
        <section className="px-4 py-16 sm:px-6 lg:px-10">
            <div className="mx-auto max-w-6xl rounded-[36px] bg-white/70 px-6 py-10 shadow-2xl shadow-black/5 lg:px-12">
                <div className="grid gap-10 lg:grid-cols-[1fr,1.2fr]">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary-500 animate-fadeInUp">Process</p>
                        <h3 className="mt-4 text-3xl font-serif font-semibold text-slate-900 animate-fadeInUp delay-100">
                            Write your will in three simple steps
                        </h3>
                    </div>
                    <div className="space-y-8">
                        {steps.map((step, index) => (
                            <div key={step.title} className="flex gap-6 animate-fadeInUp" style={{ animationDelay: `${index * 150}ms` }}>
                                <div className="flex flex-col items-center">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-slate-900">
                                        {index + 1}
                                    </span>
                                    {index < steps.length - 1 && <span className="mt-3 h-16 w-px bg-primary-100" />}
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-slate-900">{step.title}</h4>
                                    <p className="mt-2 text-sm text-slate-600">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
