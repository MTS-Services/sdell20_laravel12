import React, { useMemo, useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, ChevronDown, Clock3, Mail, MapPin, Phone, ShieldCheck, Star, UserCheck, Users } from 'lucide-react';
import StepsHeader from '@/components/frontend/will/steps-header';


type StepOption = {
    label: string;
    value: string;
};

const PartnerAdultQuestion: React.FC = () => (
    <>
        <span>Are you and your partner both </span>
        <span className="text-lpa-step">over 18</span>
        <span> and have </span>
        <span className="text-lpa-step">mental capacity</span>
        <span> to make decisions?</span>
    </>
);

const PartnerRegionQuestion: React.FC = () => (
    <>
        <span>Do you and your partner both live in </span>
        <span className="text-lpa-step">England or Wales?</span>
    </>
);

const SinglePersonAdultQuestion: React.FC = () => (
    <>
        <span>Is the person who these documents are for </span>
        <span className="text-lpa-step">over 18</span>
        <span> years old and has </span>
        <span className="text-lpa-step">mental capacity</span>
        <span> to make decisions?</span>
    </>
);

const SinglePersonRegionQuestion: React.FC = () => (
    <>
        <span>Does the person the documents are for live in </span>
        <span className="text-lpa-step">England or Wales?</span>
    </>
);

const MultiPersonAdultQuestion: React.FC = () => (
    <>
        <span>Are all the people who these documents are for </span>
        <span className="text-lpa-step">over 18</span>
        <span> years old and have </span>
        <span className="text-lpa-step">mental capacity</span>
        <span> to make decisions?</span>
    </>
);

const MultiPersonRegionQuestion: React.FC = () => (
    <>
        <span>Do all the people who these documents are for live in </span>
        <span className="text-lpa-step">England or Wales?</span>
    </>
);

type Step = {
    id: string;
    question: string;
    highlight?: string;
    description?: string;
    icon: React.ComponentType<{ className?: string }>;
    options?: StepOption[];
    final?: boolean;
    illustrationSrc?: string;
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
            { label: 'Health & Welfare LPA', value: 'health' },
            { label: 'Property & Finance LPA', value: 'finance' },
            { label: 'Both LPAs', value: 'both' },
        ],
    },
    {
        id: 'howMany',
        question: 'How many people is this for?',
        highlight: 'How many',
        description:
            'You have said that you want documents for someone else, please tell us how many other people do you want these for?',
        icon: Users,
        illustrationSrc: 'https://online.zenco.com/images/family1.png',
        options: [
            { label: '1 person', value: 'one' },
            { label: '2 people', value: 'two' },
            { label: 'More than 2 people', value: 'more' },
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

const isStepVisible = (stepId: string, currentAnswers: Record<string, string>): boolean => {
    if (stepId === 'howMany') {
        return currentAnswers.who === 'someone-else';
    }

    return true;
};

const getNextVisibleStepIndex = (currentIndex: number, currentAnswers: Record<string, string>): number => {
    let nextIndex = Math.min(currentIndex + 1, steps.length - 1);

    while (nextIndex < steps.length && !isStepVisible(steps[nextIndex].id, currentAnswers)) {
        nextIndex += 1;
    }

    return Math.min(nextIndex, steps.length - 1);
};

const getPreviousVisibleStepIndex = (currentIndex: number, currentAnswers: Record<string, string>): number => {
    let prevIndex = Math.max(currentIndex - 1, 0);

    while (prevIndex > 0 && !isStepVisible(steps[prevIndex].id, currentAnswers)) {
        prevIndex -= 1;
    }

    return Math.max(prevIndex, 0);
};

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
            <span key={`${part}-${index}`} className="text-lpa-step">
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
            'w-full cursor-pointer rounded border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-primary-700 sm:px-6 sm:py-3 lg:px-8 lg:py-4 lg:text-base',
            'shadow-[0_2px_8px_rgba(15,23,42,0.12)] transition duration-300 hover:bg-primary-500 hover:text-primary-50',
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
                <img src={src} alt="" className="h-26 w-26 select-none sm:h-33 sm:w-40 lg:h-40 lg:w-50" draggable={false} />
            </div>
        );
    }

    // fallback for other steps
    return (
        <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white sm:h-16 sm:w-16">
                <Icon className="h-6 w-6 text-primary-500 sm:h-8 sm:w-8" />
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
    const [showRegionalDecline, setShowRegionalDecline] = useState(false);
    const [showRegionalHelpPanel, setShowRegionalHelpPanel] = useState(false);

    const currentStep = steps[currentStepIndex];
    const progress = useMemo(() => ((currentStepIndex + 1) / steps.length) * 100, [currentStepIndex]);
    const isPartnerFlow = answers.who === 'partner';
    const isSomeoneElseFlow = answers.who === 'someone-else';
    const isSingleSomeoneElse = isSomeoneElseFlow && answers.howMany === 'one';
    const isMultiSomeoneElse = isSomeoneElseFlow && answers.howMany !== undefined && answers.howMany !== 'one';

    const renderQuestion = (): React.ReactNode => {
        if (isPartnerFlow && currentStep.id === 'adult') {
            return <PartnerAdultQuestion />;
        }

        if (isPartnerFlow && currentStep.id === 'region') {
            return <PartnerRegionQuestion />;
        }

        if (isSingleSomeoneElse && currentStep.id === 'adult') {
            return <SinglePersonAdultQuestion />;
        }

        if (isSingleSomeoneElse && currentStep.id === 'region') {
            return <SinglePersonRegionQuestion />;
        }

        if (isMultiSomeoneElse && currentStep.id === 'adult') {
            return <MultiPersonAdultQuestion />;
        }

        if (isMultiSomeoneElse && currentStep.id === 'region') {
            return <MultiPersonRegionQuestion />;
        }

        return highlightQuestion(currentStep.question, currentStep.highlight);
    };

    const handleOptionSelect = (value: string): void => {
        const nextAnswers = { ...answers, [currentStep.id]: value };

        if (currentStep.id === 'who' && value !== 'someone-else') {
            delete nextAnswers.howMany;
        }

        setAnswers(nextAnswers);

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
                setCurrentStepIndex((prev) => getNextVisibleStepIndex(prev, nextAnswers));
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

        if (showRegionalDecline) {
            setShowRegionalDecline(false);
            return;
        }

        if (currentStepIndex === 0) {
            router.visit(route('lpa'));
            return;
        }

        setCurrentStepIndex((prev) => getPreviousVisibleStepIndex(prev, answers));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleRegionalProceed = (): void => {
        setShowRegionalNotice(false);
        setTimeout(() => {
            setCurrentStepIndex((prev) => getNextVisibleStepIndex(prev, answers));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 120);
    };

    const handleRegionalDecline = (): void => {
        setShowRegionalDecline(true);
        setShowRegionalNotice(false);
        setShowRegionalHelpPanel(false);
    };

    if (showUnderageNotice) {
        return (
            <>
                <StepsHeader />
                <section className="min-h-screen bg-primary-50 px-4 py-20 sm:px-6">
                    <div className="mx-auto w-full max-w-2xl space-y-8 text-center">
                        <div className="flex justify-center">
                            <img src={underageIllustration} alt="Age requirement" className="h-20 w-20 rounded-full border border-slate-200 bg-white object-cover" />
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-2xl font-semibold text-primary-900 lg:text-3xl">Sorry, we can&apos;t continue</h1>
                            <div className="space-y-3 text-sm text-primary-600 lg:text-base">
                                <p>You have said the people this document is for are not over 18 or do not have the mental capacity to make decisions.</p>
                                <p>The specialist document is for adults 18 years or over and able to make decisions and understand what this document is for.</p>
                                <p>Unfortunately this means that you can&apos;t use our online service to get a Lasting Power of Attorney in place. If you answered this question incorrectly then please click the &quot;Back&quot; button.</p>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm">
                            <button
                                type="button"
                                onClick={() => setShowHelpPanel((prev) => !prev)}
                                className="flex w-full cursor-pointer items-center justify-between rounded-lg bg-slate-50 px-4 py-3 text-sm font-semibold text-primary-800 transition duration-300 hover:text-lpa-step"
                            >
                                Need help?
                                <ChevronDown
                                    className={`h-4 w-4 text-primary-500 transition ${showHelpPanel ? 'rotate-180' : ''}`}
                                />
                            </button>

                            {showHelpPanel ? (
                                <div className="space-y-4 px-1 pb-1 pt-4 text-sm text-primary-700">
                                    <div className="flex items-start gap-3">
                                        <Phone className="mt-0.5 h-4 w-4 text-primary-600" />
                                        <div>
                                            <p className="font-semibold text-primary-900">Call us</p>
                                            <p>0800 888 6068</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Clock3 className="mt-0.5 h-4 w-4 text-primary-600" />
                                        <div>
                                            <p className="font-semibold text-primary-900">Opening hours</p>
                                            <p>Monday - Friday · 8:00am - 5:30pm</p>
                                            <p>Weekends · Closed (Bank holidays hours might differ)</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Mail className="mt-0.5 h-4 w-4 text-primary-600" />
                                        <div>
                                            <p className="font-semibold text-primary-900">Email us</p>
                                            <p>enquiries@zenco.com</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <MapPin className="mt-0.5 h-4 w-4 text-primary-600" />
                                        <div>
                                            <p className="font-semibold text-primary-900">Address</p>
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
                                className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-primary-600 transition duration-300 hover:text-lpa-step lg:text-base"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back
                            </button>
                        </div>
                    </div>
                </section>
            </>
        );
    }

    if (showRegionalNotice) {
        return (
            <>
                <StepsHeader />
                <section className="min-h-screen bg-primary-50 px-4 py-20 sm:px-6">
                    <div className="mx-auto w-full max-w-2xl space-y-8 ">
                        <div className="flex justify-center">
                            <img src={regionalIllustration} alt="Region confirmation" className="h-20 w-20 rounded-full border border-slate-200 bg-white object-cover" />
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-2xl font-semibold text-primary-900 lg:text-3xl">
                                Confirm you wish to continue outside of{' '}
                                <span className="text-primary-600">England or Wales?</span>
                            </h1>
                            <div className="space-y-3 text-sm text-primary-600 lg:text-base">
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
                                className="w-full cursor-pointer border border-slate-200 bg-white px-6 py-4 text-base font-semibold text-primary-800 shadow-md transition duration-300 hover:-translate-y-1 hover:text-lpa-step hover:shadow-lg lg:w-auto"
                            >
                                I understand and wish to proceed
                            </button>
                            <button
                                type="button"
                                onClick={handleRegionalDecline}
                                className="w-full cursor-pointer border border-slate-200 bg-white px-6 py-4 text-base font-semibold text-primary-800 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-lg lg:w-auto"
                            >
                                I do not want to proceed
                            </button>
                        </div>

                        <div className="pt-4">
                            <button
                                type="button"
                                onClick={handleBack}
                                className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-primary-600 transition duration-300 hover:text-primary-900 lg:text-base"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back
                            </button>
                        </div>
                    </div>
                </section>
            </>
        );
    }

    if (showRegionalDecline) {
        return (
            <>
                <StepsHeader />
                <section className="min-h-screen bg-primary-50 px-4 py-20 sm:px-6">
                    <div className="mx-auto w-full max-w-2xl space-y-8 text-center">
                        <div className="flex justify-center">
                            <img src={regionalIllustration} alt="Region restriction" className="h-20 w-20 rounded-full border border-slate-200 bg-primary-50 object-cover" />
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-2xl font-semibold text-primary-900 lg:text-3xl">Sorry, we can&apos;t continue</h1>
                            <div className="space-y-3 text-sm text-primary-600 lg:text-base">
                                <p>You have said that the people this document is for do not live in England or Wales.</p>
                                <p>Unfortunately this means that you can&apos;t use our online service to get a Lasting Power of Attorney in place. If you answered this question incorrectly then please click the &quot;Back&quot; button.</p>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm">
                            <button
                                type="button"
                                onClick={() => setShowRegionalHelpPanel((prev) => !prev)}
                                className="flex w-full cursor-pointer items-center justify-between rounded-lg bg-slate-50 px-4 py-3 text-sm font-semibold text-primary-800 transition duration-300"
                            >
                                Need help?
                                <ChevronDown className={`h-4 w-4 text-primary-500 transition ${showRegionalHelpPanel ? 'rotate-180' : ''}`} />
                            </button>

                            {showRegionalHelpPanel ? (
                                <div className="space-y-4 px-1 pb-1 pt-4 text-sm text-primary-700">
                                    <div className="flex items-start gap-3">
                                        <Phone className="mt-0.5 h-4 w-4 text-primary-600" />
                                        <div>
                                            <p className="font-semibold text-primary-900">Call us</p>
                                            <p>0800 888 6068</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Clock3 className="mt-0.5 h-4 w-4 text-primary-600" />
                                        <div>
                                            <p className="font-semibold text-primary-900">Opening hours</p>
                                            <p>Monday - Friday · 8:00am - 5:30pm</p>
                                            <p>Weekends · Closed (Bank holidays hours might differ)</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Mail className="mt-0.5 h-4 w-4 text-primary-600" />
                                        <div>
                                            <p className="font-semibold text-primary-900">Email us</p>
                                            <p>enquiries@zenco.com</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <MapPin className="mt-0.5 h-4 w-4 text-primary-600" />
                                        <div>
                                            <p className="font-semibold text-primary-900">Address</p>
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
                                className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-primary-600 transition duration-300 hover:text-primary-900 lg:text-base"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back
                            </button>
                        </div>
                    </div>
                </section>
            </>
        );
    }

    return (
        <>
            <StepsHeader />
            <section className="min-h-screen bg-primary-50 px-3 py-10 sm:px-6 sm:py-16 md:px-10 md:py-20 lg:px-0">
                <div className="mx-auto w-full max-w-2xl md:max-w-3xl lg:max-w-2xl">
                    <div className="mb-4 sm:mb-0 h-1.5 w-full rounded-full bg-slate-200 sm:hidden">
                        <div className="h-full rounded-full bg-primary-500 transition-[width] duration-300" style={{ width: `${progress}%` }} />
                    </div>

                    <div className="space-y-4 sm:space-y-6 md:space-y-8">
                        <Illustration src={currentStep.illustrationSrc} icon={currentStep.icon} />

                        <div className="space-y-3 text-left sm:space-y-4 md:space-y-5">
                            <h1 className="text-xl font-semibold leading-7 text-primary-900 sm:text-2xl md:text-3xl lg:text-3xl lg:leading-9">
                                {renderQuestion()}
                            </h1>

                            {currentStep.description ? (
                                <p className="max-w-2xl text-xs leading-5 text-primary-600 sm:text-sm md:text-base lg:text-base lg:leading-6">
                                    {currentStep.description}
                                </p>
                            ) : null}
                        </div>

                        {!currentStep.final ? (
                            <div className="grid max-w-xl grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-2">
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
                                <div className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 md:p-7 lg:p-8">
                                    <div className="mb-4 flex items-start gap-3 text-primary-600 lg:gap-4">
                                        <ShieldCheck className="mt-0.5 h-6 w-6 text-emerald-500 lg:h-7 lg:w-7" />
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary-500 lg:text-sm">
                                                Trustpilot
                                            </p>
                                            <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-primary-800 lg:text-base">
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
                                            <p className="text-xs text-primary-500 lg:text-sm">2,718 reviews</p>
                                        </div>
                                    </div>

                                    <ul className="space-y-3 text-sm text-primary-700 lg:text-base">
                                        {benefits.map((benefit) => (
                                            <li key={benefit} className="flex gap-3">
                                                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500 lg:h-6 lg:w-6" />
                                                <span>{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Link
                                        href={route('register')}
                                        className="mt-4 inline-flex w-full items-center justify-center rounded bg-primary-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 hover:text-white sm:mt-6 sm:py-3 md:text-base lg:py-4 lg:text-base"
                                    >
                                        Continue online
                                    </Link>
                                </div>
                            </div>
                        )}

                        <div className="pt-4 sm:pt-6 md:pt-8">
                            <button
                                type="button"
                                onClick={handleBack}
                                className="inline-flex cursor-pointer items-center gap-2 py-2 text-sm font-medium text-primary-600 transition hover:text-lpa-step sm:text-base md:text-lg"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default LpaStartPage;
