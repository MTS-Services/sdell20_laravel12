import React, { useMemo, useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, MapPin, ShieldCheck, Star, UserCheck, Users } from 'lucide-react';


type StepOption = {
    label: string;
    value: string;
};

type Step = {
    id: string;
    question: string;
    highlight?: string;
    description?: string;
    icon: React.ComponentType<{ className?: string }>;
    options?: StepOption[];
    final?: boolean;
    illustrationSrc?: string; // 👈 add this
};

const steps: Step[] = [
    {
        id: 'who',
        question: 'Who are the Lasting Power of Attorney documents for?',
        highlight: 'Lasting Power of Attorney',
        description:
            'If you are creating these documents as an attorney or doing these documents for someone else, then please choose “Someone else”.',
        icon: Users,
        illustrationSrc: 'https://online.zenco.com/images/family1.png',
        options: [
            { label: 'Me', value: 'me' },
            { label: 'Me and my partner', value: 'partner' },
            { label: 'Someone else', value: 'someone-else' },
        ],
    },
    {
        id: 'adult',
        question: 'Are you over 18?',
        highlight: 'over 18',
        description: 'LPAs can only be created by people aged 18 or over.',
        icon: UserCheck,
        options: [
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' },
        ],
    },
    {
        id: 'region',
        question: 'Do you live in England or Wales?',
        highlight: 'England or Wales',
        description: 'If you live in Scotland or Northern Ireland, you will follow a different process.',
        icon: MapPin,
        options: [
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' },
        ],
    },
    {
        id: 'summary',
        question: 'Create a Power of Attorney online',
        description: 'TrustScore 4.9 • 2,718 reviews',
        icon: ShieldCheck,
        final: true,
    },
];

const benefits = [
    'Protect yourself and your family. Ensure everything is in place before it is needed.',
    'Secure your family’s future. Guarantee access to finance when most needed and make important health decisions.',
    'It only takes 15 minutes. Easy-to-use system. Designed for all ages. Save your progress as you go.',
];

const highlightQuestion = (question: string, highlight?: string): React.ReactNode => {
    if (!highlight) return question;

    const regex = new RegExp(`(${highlight})`, 'i');
    const parts = question.split(regex);

    return parts.map((part, index) =>
        part.match(regex) ? (
            <span key={`${part}-${index}`} className="text-primary-500">
                {part}
            </span>
        ) : (
            <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>
        ),
    );
};

const OptionButton: React.FC<{
    label: string;
    onClick: () => void;
    selected: boolean;
}> = ({ label, onClick, selected }) => (
    <button
        type="button"
        onClick={onClick}
        className={[
            'w-full rounded border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 lg:px-8 lg:py-4 lg:text-base',
            'shadow-[0_2px_8px_rgba(15,23,42,0.12)] transition',
            'hover:border-slate-300 hover:shadow-[0_3px_10px_rgba(15,23,42,0.14)]',
            selected ? 'border-primary-400 text-primary-600' : '',
        ].join(' ')}
    >
        {label}
    </button>
);

const Illustration: React.FC<{ src?: string; icon: React.ComponentType<{ className?: string }> }> = ({ src, icon: Icon }) => {
    if (src) {
        return (
            <div className="flex justify-center">
                <img src={src} alt="" className="h-16 w-40 select-none lg:h-40 lg:w-50" draggable={false} />
            </div>
        );
    }

    // fallback for other steps
    return (
        <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-slate-200 bg-white">
                <Icon className="h-8 w-8 text-slate-500" />
            </div>
        </div>
    );
};

const LpaStartPage: React.FC = () => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});

    const currentStep = steps[currentStepIndex];
    const progress = useMemo(() => ((currentStepIndex + 1) / steps.length) * 100, [currentStepIndex]);

    const handleOptionSelect = (value: string): void => {
        setAnswers((prev) => ({ ...prev, [currentStep.id]: value }));

        if (!currentStep.final) {
            setTimeout(() => {
                setCurrentStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 120);
        }
    };

    const handleBack = (): void => {
        if (currentStepIndex === 0) {
            router.visit(route('lpa'));
            return;
        }

        setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <section className="min-h-screen bg-primary-50 px-4 py-20 sm:px-6">
            <div className="mx-auto w-full max-w-2xl">
                {/* optional progress (hidden to match screenshot) */}
                <div className="sr-only" aria-hidden="true">
                    {progress}%
                </div>

                <div className="space-y-6">
                    <Illustration src={currentStep.illustrationSrc} icon={currentStep.icon} />

                    <div className="space-y-4 text-left">
                        <h1 className="text-2xl font-semibold leading-7 text-slate-900 lg:text-3xl lg:leading-9">
                            {highlightQuestion(currentStep.question, currentStep.highlight)}
                        </h1>

                        {currentStep.description ? (
                            <p className="max-w-2xl text-sm leading-5 text-slate-600 lg:text-base lg:leading-6">
                                {currentStep.description}
                            </p>
                        ) : null}
                    </div>

                    {!currentStep.final ? (
                        <div className="grid max-w-xl grid-cols-1 gap-4 lg:grid-cols-2">
                            {currentStep.options?.map((option) => (
                                <OptionButton
                                    key={option.value}
                                    label={option.label}
                                    selected={answers[currentStep.id] === option.value}
                                    onClick={() => handleOptionSelect(option.value)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
                                <div className="mb-4 flex items-start gap-3 text-slate-600 lg:gap-4">
                                    <ShieldCheck className="mt-0.5 h-6 w-6 text-emerald-500 lg:h-7 lg:w-7" />
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 lg:text-sm">
                                            Trustpilot
                                        </p>
                                        <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-800 lg:text-base">
                                            TrustScore 4.9
                                            <span className="flex items-center gap-1 text-primary-600">
                                                {[...Array(5)].map((_, index) => (
                                                    <Star
                                                        key={`star-${index}`}
                                                        className="h-4 w-4 fill-primary-600 text-primary-600 lg:h-5 lg:w-5"
                                                    />
                                                ))}
                                            </span>
                                        </p>
                                        <p className="text-xs text-slate-500 lg:text-sm">2,718 reviews</p>
                                    </div>
                                </div>

                                <ul className="space-y-3 text-sm text-slate-700 lg:text-base">
                                    {benefits.map((benefit) => (
                                        <li key={benefit} className="flex gap-3">
                                            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500 lg:h-6 lg:w-6" />
                                            <span>{benefit}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href={route('lpa')}
                                    className="mt-6 inline-flex w-full items-center justify-center rounded bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 lg:py-4 lg:text-base"
                                >
                                    Continue online
                                </Link>
                            </div>
                        </div>
                    )}

                    <div className="pt-6">
                        <button
                            type="button"
                            onClick={handleBack}
                            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900 lg:text-base"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LpaStartPage;
