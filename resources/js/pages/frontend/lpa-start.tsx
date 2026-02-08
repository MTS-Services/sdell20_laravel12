import React, { useMemo, useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, ChevronDown, Clock3, Mail, MapPin, Phone, ShieldCheck, Star, UserCheck, Users } from 'lucide-react';


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

const underageIllustration = 'https://online.zenco.com/images/globecaution1.png';
const regionalIllustration = 'https://online.zenco.com/images/globecaution1.png';

const LpaStartPage: React.FC = () => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [showUnderageNotice, setShowUnderageNotice] = useState(false);
    const [showHelpPanel, setShowHelpPanel] = useState(false);
    const [showRegionalNotice, setShowRegionalNotice] = useState(false);

    const currentStep = steps[currentStepIndex];
    const progress = useMemo(() => ((currentStepIndex + 1) / steps.length) * 100, [currentStepIndex]);

    const handleOptionSelect = (value: string): void => {
        setAnswers((prev) => ({ ...prev, [currentStep.id]: value }));

        if (currentStep.id === 'adult' && value === 'no') {
            setShowUnderageNotice(true);
            setShowHelpPanel(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        if (currentStep.id === 'region' && value === 'no') {
            setShowRegionalNotice(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        if (!currentStep.final) {
            setTimeout(() => {
                setCurrentStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 120);
        }
    };

    const handleBack = (): void => {
        if (showUnderageNotice) {
            setShowUnderageNotice(false);
            return;
        }

        if (showRegionalNotice) {
            setShowRegionalNotice(false);
            return;
        }

        if (currentStepIndex === 0) {
            router.visit(route('lpa'));
            return;
        }

        setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleRegionalProceed = (): void => {
        setShowRegionalNotice(false);
        setTimeout(() => {
            setCurrentStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 120);
    };

    const handleRegionalDecline = (): void => {
        router.visit(route('lpa'));
    };

    if (showUnderageNotice) {
        return (
            <section className="min-h-screen bg-primary-50 px-4 py-20 sm:px-6">
                <div className="mx-auto w-full max-w-2xl space-y-8 text-center">
                    <div className="flex justify-center">
                        <img src={underageIllustration} alt="Age requirement" className="h-20 w-20 rounded-full border border-slate-200 bg-white object-cover" />
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-2xl font-semibold text-slate-900 lg:text-3xl">Sorry, we can&apos;t continue</h1>
                        <div className="space-y-3 text-sm text-slate-600 lg:text-base">
                            <p>You have said the people this document is for are not over 18 or do not have the mental capacity to make decisions.</p>
                            <p>The specialist document is for adults 18 years or over and able to make decisions and understand what this document is for.</p>
                            <p>Unfortunately this means that you can&apos;t use our online service to get a Lasting Power of Attorney in place. If you answered this question incorrectly then please click the &quot;Back&quot; button.</p>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm">
                        <button
                            type="button"
                            onClick={() => setShowHelpPanel((prev) => !prev)}
                            className="flex w-full items-center justify-between rounded-lg bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800"
                        >
                            Need help?
                            <ChevronDown
                                className={`h-4 w-4 text-slate-500 transition ${showHelpPanel ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {showHelpPanel ? (
                            <div className="space-y-4 px-1 pb-1 pt-4 text-sm text-slate-700">
                                <div className="flex items-start gap-3">
                                    <Phone className="mt-0.5 h-4 w-4 text-primary-600" />
                                    <div>
                                        <p className="font-semibold text-slate-900">Call us</p>
                                        <p>0800 888 6068</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Clock3 className="mt-0.5 h-4 w-4 text-primary-600" />
                                    <div>
                                        <p className="font-semibold text-slate-900">Opening hours</p>
                                        <p>Monday - Friday · 8:00am - 5:30pm</p>
                                        <p>Weekends · Closed (Bank holidays hours might differ)</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Mail className="mt-0.5 h-4 w-4 text-primary-600" />
                                    <div>
                                        <p className="font-semibold text-slate-900">Email us</p>
                                        <p>enquiries@zenco.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin className="mt-0.5 h-4 w-4 text-primary-600" />
                                    <div>
                                        <p className="font-semibold text-slate-900">Address</p>
                                        <p>Zenqo legal<br />Second Floor<br />64 Mansfield Street<br />Leicester<br />LE1 3DL</p>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>

                    <div className="pt-4">
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
            </section>
        );
    }

    if (showRegionalNotice) {
        return (
            <section className="min-h-screen bg-white px-4 py-20 sm:px-6">
                <div className="mx-auto w-full max-w-2xl space-y-8 ">
                    <div className="flex justify-center">
                        <img src={regionalIllustration} alt="Region confirmation" className="h-20 w-20 rounded-full border border-slate-200 bg-white object-cover" />
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-2xl font-semibold text-slate-900 lg:text-3xl">
                            Confirm you wish to continue outside of{' '}
                            <span className="text-primary-600">England or Wales?</span>
                        </h1>
                        <div className="space-y-3 text-sm text-slate-600 lg:text-base">
                            <p>Some countries will accept a notarised power of attorney.</p>
                            <p>You will need to register the power of attorney with the Office of the Public Guardian first, which takes approx 16-20 weeks.</p>
                            <p>You can then take the document to be notarised.</p>
                            <p>If you wish to continue, it will be at your own risk. We cannot guarantee success.</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 lg:flex-row lg:justify-start">
                        <button
                            type="button"
                            onClick={handleRegionalProceed}
                            className="w-full  border border-slate-200 bg-white px-6 py-4 text-base font-semibold text-slate-800 shadow-md transition hover:-translate-y-1 hover:shadow-lg lg:w-auto"
                        >
                            I understand and wish to proceed
                        </button>
                        <button
                            type="button"
                            onClick={handleRegionalDecline}
                            className="w-full  border border-slate-200 bg-white px-6 py-4 text-base font-semibold text-slate-800 shadow-md transition hover:-translate-y-1 hover:shadow-lg lg:w-auto"
                        >
                            I do not want to proceed
                        </button>
                    </div>

                    <div className="pt-4">
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
            </section>
        );
    }

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
