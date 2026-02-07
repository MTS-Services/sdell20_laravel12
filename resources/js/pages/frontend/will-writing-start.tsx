import React, { useState } from 'react';
import { Link } from '@inertiajs/react';

type FormData = {
    hasPartner: string;
    hasChildren: string;
    ownsHome: string;
    assetsInUK: string;
    ownsBusiness: string;
    partnerNeedsWill: string;
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
};

export default function WillQuestionnaire() {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<FormData>({
        hasPartner: '',
        hasChildren: '',
        ownsHome: '',
        assetsInUK: '',
        ownsBusiness: '',
        partnerNeedsWill: '',
    });

    const updateData = (data: Partial<FormData>) => {
        setFormData((prev) => ({ ...prev, ...data }));
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
                        updateData({ assetsInUK: 'No' });
                        setCurrentStep(4);
                    },
                },
                {
                    label: 'Yes',
                    action: () => {
                        updateData({ assetsInUK: 'Yes' });
                        setCurrentStep(4);
                    },
                },
            ],
        },
        {
            image: 'https://online.zenco.com/images/start/start-assets.png',
            question: 'Is everything you own in the UK?',
            subtitle: '',
            options: [
                {
                    label: 'No',
                    description: 'Including bank accounts, property, stocks and shares.',
                    action: () => {
                        updateData({ ownsBusiness: 'No' });
                        setCurrentStep(5);
                    },
                },
                {
                    label: 'Yes',
                    action: () => {
                        updateData({ ownsBusiness: 'Yes' });
                        setCurrentStep(5);
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
                        setCurrentStep(6);
                    },
                },
                {
                    label: 'Yes',
                    description: 'Including sole trader, partnership, LTD and LLP companies.',
                    action: () => {
                        updateData({ ownsBusiness: 'Yes' });
                        setCurrentStep(6);
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
                        setCurrentStep(7);
                    },
                },
                {
                    label: 'Yes',
                    description: 'Get wills for both of us for £160',
                    recommended: true,
                    action: () => {
                        updateData({ partnerNeedsWill: 'Yes' });
                        setCurrentStep(7);
                    },
                },
            ],
        },
        {
            image: 'https://online.zenco.com/images/start/start-family.png',
            question: '5 things our phone service can do for you',
            isFinalStep: true,
        },
    ];

    const currentStepData = steps[currentStep];
    const highlightText = currentStepData.question.startsWith('Do you')
        ? currentStepData.question.replace(/Do you\s*/i, '').replace('?', '').trim()
        : currentStepData.question;

    return (
        <div className="min-h-screen bg-primary-50 py-8 px-4">
            <div className="mx-auto container space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between ">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-slate-700">zenco</span>
                        <span className="text-2xl font-light text-cyan-500">legal</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm font-semibold">Trustpilot</span>
                        <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                    </div>
                </div>
                <div className='max-w-2xl mx-auto'>
                    {/* Main Content */}
                    <div className="rounded-3xl text-center ">
                        {/* Illustration */}
                        <div className="mb-6 flex justify-center">
                            <div className="flex h-70 w-70 items-center justify-center ">
                                <img
                                    src={currentStepData.image}
                                    alt="Step illustration"
                                    className="h-full w-full object-contain"
                                />
                            </div>
                        </div>

                        {!currentStepData.isFinalStep ? (
                            <>
                                {/* Question */}
                                <h2 className="text-2xl md:text-3xl font-normal text-gray-800 mb-3">
                                    {currentStepData.question.startsWith('Do you') ? 'Do you ' : ''}
                                    <span className="text-cyan-500">{highlightText}</span>
                                </h2>

                                {currentStepData.subtitle && (
                                    <p className="text-gray-600 text-sm mb-8">{currentStepData.subtitle}</p>
                                )}

                                {/* Options */}
                                <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch max-w-2xl mx-auto mb-8">
                                    {currentStepData.options?.map((option, index) => (
                                        <button
                                            key={index}
                                            onClick={option.action}
                                            className="flex-1 bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-cyan-400 hover:shadow-md transition-all relative"
                                        >
                                            <div className="text-xl font-semibold text-gray-800 mb-2">
                                                {option.label}
                                            </div>
                                            {option.description && (
                                                <div className="text-sm text-gray-600">
                                                    {option.description}
                                                </div>
                                            )}
                                            {option.recommended && (
                                                <div className="absolute top-4 right-4">
                                                    <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                                        Recommended
                                                    </span>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <>
                                <h2 className="text-2xl md:text-3xl font-normal text-gray-800 mb-3">
                                    5 things our <span className="text-cyan-500">phone</span> service can do for you
                                </h2>

                                <div className="flex justify-center mb-8">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <span className="text-sm font-semibold">Trustpilot</span>
                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <svg key={i} className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                        <span className="text-xs text-gray-600">Trustscore 4.8 | 7,341 reviews</span>
                                    </div>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-lg p-6 text-left max-w-xl mx-auto mb-6">
                                    <div className="space-y-4">
                                        {[
                                            {
                                                title: 'Protect you and your partner',
                                                description: 'Make sure both of your wishes are documented and protected.',
                                            },
                                            {
                                                title: 'Plan for your business',
                                                description: 'Set out what you want to happen to any businesses you own.',
                                            },
                                            {
                                                title: 'Share out your estate',
                                                description: 'Divide everything up between friends, family and even charities.',
                                            },
                                            {
                                                title: 'Leave gifts and messages',
                                                description: 'Give your loved ones something to remember you by.',
                                            },
                                            {
                                                title: "Secure your children's future",
                                                description: "Appoint guardians if they're under 18 and make sure everyone gets a fair share.",
                                            },
                                        ].map((item, index) => (
                                            <div key={index} className="flex gap-3">
                                                <div className="shrink-0">
                                                    <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-800 text-sm">{item.title}</h4>
                                                    <p className="text-sm text-gray-600">{item.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button className="w-full bg-cyan-400 hover:bg-cyan-500 text-white font-semibold py-4 px-8 rounded-lg transition-colors mb-6">
                                    Continue on the phone →
                                </button>

                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700">
                                    Our online service covers everything except specific wishes about your business.{' '}
                                    <a href="#" className="text-cyan-500 underline">
                                        Get started online
                                    </a>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center justify-start gap-6 text-sm font-semibold">
                        {currentStep > 0 && (
                            <button
                                onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
                                className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700"
                            >
                                <span>←</span>
                                Previous question
                            </button>
                        )}
                        <Link
                            href="/will-writing"
                            className="inline-flex items-center gap-2 text-[#0a96c2] hover:text-[#087ea2]"
                        >
                            <span>←</span>
                            Back to will writing
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}