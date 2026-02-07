import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

type FormData = {
    hasPartner: string;
    hasChildren: string;
    ownsHome: string;
    livesInEnglandWales: string;
    livesInScotlandIreland: string;
    assetsInUK: string;
    ownsBusiness: string;
    partnerNeedsWill: string;
    outOfRegionCountry: string;
    outOfRegionEmail: string;
};

type StepOption = {
    label: string;
    description?: string;
    recommended?: boolean;
    action: () => void;
};

type StepConfig = {
    image: string;
    question: string;
    subtitle?: string;
    options?: StepOption[];
    isFinalStep?: boolean;
    variant?: 'outOfRegion';
};

export default function WillQuestionnaire() {
    const [currentStep, setCurrentStep] = useState(0);
    const [outOfRegionError, setOutOfRegionError] = useState('');
    const [formData, setFormData] = useState<FormData>({
        hasPartner: '',
        hasChildren: '',
        ownsHome: '',
        livesInEnglandWales: '',
        livesInScotlandIreland: '',
        assetsInUK: '',
        ownsBusiness: '',
        partnerNeedsWill: '',
        outOfRegionCountry: '',
        outOfRegionEmail: '',
    });

    const updateData = (data: Partial<FormData>) => {
        setFormData((prev) => ({ ...prev, ...data }));
    };

    const handleOutOfRegionSubmit = () => {
        if (!formData.outOfRegionCountry.trim() || !formData.outOfRegionEmail.trim()) {
            setOutOfRegionError('Please enter both your country and email address.');
            return;
        }

        setOutOfRegionError('');
        router.visit('/');
    };

    const steps: StepConfig[] = [
        {
            image: 'https://online.zenco.com/images/start/start-partner.png',
            question: 'Do you have a partner?',
            subtitle: 'Including separated, divorced or widowed',
            options: [
                {
                    label: 'No',
                    description: 'Including separated, divorced or widowed',
                    action: () => {
                        updateData({ hasPartner: 'No' });
                        setCurrentStep(1);
                    },
                },
                {
                    label: 'Yes',
                    description: 'Including engaged or living with a partner',
                    action: () => {
                        updateData({ hasPartner: 'Yes' });
                        setCurrentStep(1);
                    },
                },
            ],
        },
        {
            image: 'https://online.zenco.com/images/start/start-children.png',
            question: 'Do you have any children?',
            options: [
                {
                    label: 'No',
                    description: 'Including if you only have step children',
                    action: () => {
                        updateData({ hasChildren: 'No' });
                        setCurrentStep(2);
                    },
                },
                {
                    label: 'Yes',
                    action: () => {
                        updateData({ hasChildren: 'Yes' });
                        setCurrentStep(2);
                    },
                },
            ],
        },
        {
            image: 'https://online.zenco.com/images/start/start-home.png',
            question: 'Do you own your home?',
            options: [
                {
                    label: 'No',
                    action: () => {
                        updateData({ ownsHome: 'No' });
                        setCurrentStep(3);
                    },
                },
                {
                    label: 'Yes',
                    description: 'Including with a mortgage or jointly',
                    action: () => {
                        updateData({ ownsHome: 'Yes' });
                        setCurrentStep(3);
                    },
                },
            ],
        },
        {
            image: 'https://online.zenco.com/images/start/start-location.png',
            question: 'Do you live in England or Wales?',
            options: [
                {
                    label: 'No',
                    action: () => {
                        updateData({ livesInEnglandWales: 'No' });
                        setCurrentStep(4);
                    },
                },
                {
                    label: 'Yes',
                    action: () => {
                        updateData({ livesInEnglandWales: 'Yes' });
                        setCurrentStep(5);
                    },
                },
            ],
        },
        {
            image: 'https://online.zenco.com/images/start/start-location.png',
            question: 'Do you live in Scotland or Ireland?',
            options: [
                {
                    label: 'No',
                    action: () => {
                        updateData({ livesInScotlandIreland: 'No' });
                        setCurrentStep(5);
                    },
                },
                {
                    label: 'Yes',
                    action: () => {
                        updateData({ livesInScotlandIreland: 'Yes' });
                        setCurrentStep(6);
                    },
                },
            ],
        },
        formData.livesInScotlandIreland === 'No'
            ? {
                image: 'https://online.zenco.com/images/start/start-globe.png',
                question: "Unfortunately, we're not quite right for each other.",
                variant: 'outOfRegion',
            }
            : null,
        {
            image: 'https://online.zenco.com/images/start/start-assets.png',
            question: 'Is everything you own in the UK?',
            subtitle: '',
            options: [
                {
                    label: 'No',
                    description: 'Including bank accounts, property, stocks and shares.',
                    action: () => {
                        updateData({ assetsInUK: 'No' });
                        setCurrentStep(7);
                    },
                },
                {
                    label: 'Yes',
                    action: () => {
                        updateData({ assetsInUK: 'Yes' });
                        setCurrentStep(7);
                    },
                },
            ],
        },
        {
            image: 'https://online.zenco.com/images/start/start-business.png',
            question: 'Do you own a business?',
            options: [
                {
                    label: 'No',
                    action: () => {
                        updateData({ ownsBusiness: 'No' });
                        setCurrentStep(8);
                    },
                },
                {
                    label: 'Yes',
                    description: 'Including sole trader, partnership, LTD and LLP companies.',
                    action: () => {
                        updateData({ ownsBusiness: 'Yes' });
                        setCurrentStep(8);
                    },
                },
            ],
        },
        {
            image: 'https://online.zenco.com/images/start/start-partner.png',
            question: 'Does your partner need a Will?',
            subtitle: 'Save £38 when you get your wills together. You can change your mind later.',
            options: [
                {
                    label: 'No',
                    description: 'Just get a will for myself for £99',
                    action: () => {
                        updateData({ partnerNeedsWill: 'No' });
                        setCurrentStep(9);
                    },
                },
                {
                    label: 'Yes',
                    description: 'Get wills for both of us for £160',
                    recommended: true,
                    action: () => {
                        updateData({ partnerNeedsWill: 'Yes' });
                        setCurrentStep(9);
                    },
                },
            ],
        },
        {
            image: 'https://online.zenco.com/images/start/start-family.png',
            question: '5 things our phone service can do for you',
            isFinalStep: true,
        },
    ].filter(Boolean) as StepConfig[];

    const currentStepData = steps[currentStep];
    const highlightText = currentStepData.question.startsWith('Do you')
        ? currentStepData.question.replace(/Do you\s*/i, '').replace('?', '').trim()
        : currentStepData.question;

    return (
        <div className="min-h-screen py-8 px-4" style={{ backgroundColor: 'var(--primary-50)' }}>
            <div className="mx-auto container space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold" style={{ color: 'var(--slate-700)' }}>
                            zenco
                        </span>
                        <span className="text-2xl font-light" style={{ color: 'var(--primary-500)' }}>
                            legal
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" style={{ color: 'var(--accent-green)' }} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm font-semibold" style={{ color: 'var(--slate-600)' }}>
                            Trustpilot
                        </span>
                        <div className="flex gap-0.5" style={{ color: 'var(--accent-green)' }}>
                            {[...Array(5)].map((_, index) => (
                                <svg key={index} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mx-auto max-w-2xl space-y-6">
                    <div className=" text-center ">
                        <div className="mb-6 flex justify-center">
                            <div className="flex h-50 w-70 items-center justify-center">
                                <img src={currentStepData.image} alt="Step illustration" className="h-full w-full object-contain" />
                            </div>
                        </div>

                        {!currentStepData.isFinalStep && currentStepData.variant !== 'outOfRegion' ? (
                            <>
                                <h2 className="text-2xl md:text-3xl font-semibold text-slate-800">
                                    {currentStepData.question.startsWith('Do you') ? 'Do you ' : ''}
                                    <span style={{ color: 'primary-500' }}>{highlightText}</span>
                                </h2>
                                {currentStepData.subtitle && (
                                    <p className="mt-3 text-sm text-slate-500">{currentStepData.subtitle}</p>
                                )}
                                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                                    {currentStepData.options?.map((option) => (
                                        <button
                                            key={option.label}
                                            type="button"
                                            onClick={option.action}
                                            className="flex-1 rounded-lg border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary-400"
                                        >
                                            <div className="text-lg font-semibold text-slate-800">{option.label}</div>
                                            {option.description && (
                                                <p className="mt-1 text-sm text-slate-500">{option.description}</p>
                                            )}
                                            {option.recommended && (
                                                <span className="mt-3 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                                                    Recommended
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </>
                        ) : currentStepData.variant === 'outOfRegion' ? (
                            <>
                                <h2 className="text-2xl md:text-3xl font-semibold text-slate-800">{currentStepData.question}</h2>
                                <p className="mt-3 text-sm text-slate-500">
                                    If you'd like to know when we're covering your country please enter your email address and country below.
                                </p>
                                <div className="mt-8 space-y-5 text-left">
                                    <label className="block text-sm font-semibold text-slate-600">
                                        What's the name of your country?
                                        <input
                                            type="text"
                                            value={formData.outOfRegionCountry}
                                            onChange={(event) => updateData({ outOfRegionCountry: event.target.value })}
                                            className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-base text-slate-800 focus:border-primary-400 focus:outline-none"
                                            placeholder="Enter country name"
                                        />
                                    </label>
                                    <label className="block text-sm font-semibold text-slate-600">
                                        What's your email address?
                                        <input
                                            type="email"
                                            value={formData.outOfRegionEmail}
                                            onChange={(event) => updateData({ outOfRegionEmail: event.target.value })}
                                            className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-base text-slate-800 focus:border-primary-400 focus:outline-none"
                                            placeholder="name@example.com"
                                        />
                                    </label>
                                    {outOfRegionError && (
                                        <p className="text-sm font-medium text-rose-600">{outOfRegionError}</p>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={handleOutOfRegionSubmit}
                                    className="mt-8 inline-flex items-center justify-center rounded-lg bg-primary-400 px-10 py-3 text-base font-semibold text-white transition hover:bg-primary-500"
                                >
                                    Done
                                </button>
                            </>
                        ) : (
                            <>
                                <h2 className="text-2xl md:text-3xl font-semibold text-slate-800">
                                    5 things our <span style={{ color: 'var(--primary-500)' }}>phone</span> service can do for you
                                </h2>
                                <div className="mt-6 flex justify-center text-sm text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <svg className="h-5 w-5" style={{ color: 'var(--accent-green)' }} fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <span>Trustpilot</span>
                                        <div className="flex gap-0.5" style={{ color: 'var(--accent-green)' }}>
                                            {[...Array(5)].map((_, index) => (
                                                <svg key={index} className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                        <span className="text-xs text-slate-500">Trustscore 4.8 | 7,341 reviews</span>
                                    </div>
                                </div>
                                <div className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-6 text-left text-sm text-slate-600">
                                    {[
                                        'Protect you and your partner',
                                        'Plan for your business',
                                        'Share out your estate',
                                        'Leave gifts and messages',
                                        "Secure your children’s future",
                                    ].map((item) => (
                                        <div key={item} className="flex items-start gap-3">
                                            <span className="text-lg" style={{ color: 'var(--accent-green)' }}>
                                                ✓
                                            </span>
                                            <p className="text-slate-700">{item}</p>
                                        </div>
                                    ))}
                                </div>
                                <Link
                                    href="/will-writing"
                                    className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full bg-primary-400 px-6 py-4 text-lg font-semibold text-white transition hover:bg-primary-500"
                                >
                                    Continue on the phone
                                    <ArrowRight className="h-5 w-5" aria-hidden="true" />
                                </Link>
                                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                                    Our online service covers everything except specific wishes about your business.{' '}
                                    <a href="#" className="font-semibold text-primary-500 underline">
                                        Get started online
                                    </a>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-6 mt-15 text-sm font-semibold text-slate-600">
                        {currentStep === 0 ? (
                            <Link href="/will-writing" className="inline-flex items-center gap-2 text-primary-500 text-lg hover:text-primary-600">
                                <ArrowLeft className="h-5 w-5" aria-hidden="true" />
                                Back
                            </Link>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
                                className="inline-flex items-center text-lg gap-2 hover:text-slate-800"
                            >
                                <ArrowLeft className="h-5 w-5" aria-hidden="true" />
                                Back
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}