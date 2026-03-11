import React from 'react';
import { router } from '@inertiajs/react';
import { User, Users } from 'lucide-react';

import { useReveal } from '@/hooks/use-reveal';

const options = [
    {
        id: 'single',
        label: 'Just for Me',
        description: 'Create a will for yourself with guided support and secure storage.',
        icon: <User className="h-12 w-12" />,
        price: '£83.99',
        accent: 'border-primary-200 hover:border-primary-300',
        highlight: 'text-primary-600',
    },
    {
        id: 'mirror',
        label: 'Mirror Wills',
        description: 'Create mirrored wills for you and your partner.',
        icon: <Users className="h-12 w-12" />,
        price: '£119.99',
        accent: 'border-primary-200 hover:border-primary-300',
        highlight: 'text-primary-600',
    },
];

export function WillChoiceSection() {
    const [sectionRef, sectionVisible] = useReveal<HTMLDivElement>(0.1);

    const handleSelect = (id: 'single' | 'mirror') => {
        router.visit(`/will-writing/start?preset=${id}`);
    };

    return (
        <section className="bg-linear-to-b from-primary-50 via-white to-white py-16 px-4">
            <div
                ref={sectionRef}
                className={`mx-auto max-w-4xl rounded-3xl bg-white/95 p-10 shadow-[0_25px_60px_rgba(18,35,46,0.12)] transition-all duration-700 ease-out ${sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            >
                <p className="text-center text-sm font-semibold uppercase tracking-[0.3em] text-secondary">Get Started</p>
                <h2 className="mt-4 text-center text-3xl font-semibold text-slate-900">
                    Is the Will just for You? Or You and a Partner?
                </h2>
                <p className="mt-2 text-center text-base text-slate-600">Choose an option to continue your application</p>

                <div className="mt-10 grid gap-6 md:grid-cols-2">
                    {options.map((option) => (
                        <button
                            key={option.id}
                            type="button"
                            onClick={() => handleSelect(option.id as 'single' | 'mirror')}
                            className={`group flex flex-col items-center gap-4 rounded-2xl border-2 bg-white p-6 text-center transition-all cursor-pointer ${option.accent} focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-200/60`}
                        >
                            <span className={`rounded-full border-2 border-primary-100 bg-primary-50 p-4 text-primary-600 transition-colors group-hover:bg-primary-100 ${option.highlight}`}>
                                {option.icon}
                            </span>
                            <div>
                                <p className="text-lg font-semibold text-slate-900">{option.label}</p>
                                <p className="mt-2 text-sm text-slate-600">{option.description}</p>
                                <p className="mt-4 text-2xl font-bold text-primary-600">{option.price}</p>
                                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">One-time fee</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </section >
    );
}
