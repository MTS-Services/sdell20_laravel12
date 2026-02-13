import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import UserLayout from '@/layouts/user-layout';
import { type User } from '@/types';

type Props = {
    user: User;
};

const lpaSteps = [
    { key: 'who', title: 'Who', description: 'Who is the Lasting Power of Attorney for?' },
    { key: 'documents', title: 'Which Documents', description: 'Which documents do you need?' },
    { key: 'donor', title: 'The Donor', description: 'Who is the donor?' },
    { key: 'attorneys', title: 'Attorneys', description: 'Choose attorneys' },
    { key: 'decisions', title: 'Health and Finance Decisions', description: 'Health & finance decisions' },
    { key: 'notify', title: 'People To Notify', description: 'People to notify' },
    { key: 'application', title: 'Application Information', description: 'Application information' },
    { key: 'certificate', title: 'Certificate Provider', description: 'Certification provider' },
    { key: 'fees', title: 'OPG Fees', description: 'Office of the Public Guardian fee' },
];

export default function LpaCreate({ user }: Props) {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedWhoOption, setSelectedWhoOption] = useState<string>('Me');
    const [isEditingWho, setIsEditingWho] = useState(false);
    const dropdownRef = useRef<HTMLSpanElement | null>(null);

    const whoOptions = useMemo(() => ['Me', 'Mirror'], []);

    const getSelectionCopy = (): string => {
        if (selectedWhoOption === 'Mirror') {
            return 'mirror';
        }

        return 'yourself only';
    };

    const handleWhoSelection = (option: string): void => {
        setSelectedWhoOption(option);
        setIsEditingWho(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!isEditingWho) {
                return;
            }

            if (dropdownRef.current && event.target instanceof Node && !dropdownRef.current.contains(event.target)) {
                setIsEditingWho(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isEditingWho]);

    const handleStepChange = (direction: 'next' | 'prev') => {
        if (direction === 'next' && currentStep === 0 && !selectedWhoOption) {
            return;
        }

        setCurrentStep((prev) => {
            if (direction === 'next') {
                return Math.min(prev + 1, lpaSteps.length - 1);
            }

            return Math.max(prev - 1, 0);
        });
    };

    return (
        <UserLayout>
            <div className="bg-slate-50 py-10 sm:pb-12">
                <div className="container mx-auto">
                    <div className="space-y-6">
                        {/* Updated Stepper Design */}
                        <div className=" pb-6 ">
                            <div className="relative">
                                {/* Connecting Line */}
                                <div className="absolute inset-x-0 top-3.5 mx-auto h-0.5 bg-slate-200" style={{ width: 'calc(100% - 80px)', left: '12px' }} aria-hidden="true" />

                                {/* Steps */}
                                <div className="relative flex items-start justify-between">
                                    {lpaSteps.map((step, index) => {
                                        const isActive = currentStep === index;
                                        const isCompleted = currentStep > index;

                                        return (
                                            <div key={step.key} className="flex flex-col items-center text-center" style={{ minWidth: '80px' }}>
                                                {/* Circle Indicator */}
                                                <div
                                                    className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 bg-white transition-all duration-200 ${isActive
                                                        ? 'border-primary-500 shadow-md'
                                                        : isCompleted
                                                            ? 'border-primary-400'
                                                            : 'border-slate-300'
                                                        }`}
                                                >
                                                    <span
                                                        className={`h-3 w-3 rounded-full transition-all duration-200 ${isActive
                                                            ? 'bg-primary-500'
                                                            : isCompleted
                                                                ? 'bg-primary-400'
                                                                : 'bg-transparent'
                                                            }`}
                                                    />
                                                </div>

                                                {/* Step Title */}
                                                <p
                                                    className={`mt-3 text-xs font-medium transition-colors duration-200 ${isActive
                                                        ? 'text-primary-600'
                                                        : isCompleted
                                                            ? 'text-slate-600'
                                                            : 'text-slate-400'
                                                        }`}
                                                >
                                                    {step.title}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="space-y-4 rounded-2xl p-6 pl-12 text-slate-800">
                            <div className="space-y-4 text-left">
                                <h2 className="text-2xl font-semibold text-slate-900">
                                    Who is the <span className="text-primary-500">Lasting Power of Attorney</span> for?
                                </h2>
                                <p className="text-base text-slate-700">
                                    You have chosen to make documents for <span className="font-semibold text-primary-500">{getSelectionCopy()}.</span>
                                </p>
                                <div className="space-y-2 text-base text-slate-700">
                                    <p className="flex flex-wrap items-center gap-2">
                                        <span>If you have made a mistake and need these documents for someone else then</span>
                                        <span ref={dropdownRef} className="relative inline-flex">
                                            <button
                                                type="button"
                                                className="font-semibold text-primary-500 underline decoration-2 underline-offset-2 transition hover:text-primary-600"
                                                onClick={() => setIsEditingWho((prev) => !prev)}
                                                aria-haspopup="true"
                                                aria-expanded={isEditingWho}
                                            >
                                                click here to change who these documents are for
                                            </button>
                                            <div
                                                className={`absolute left-0 top-full z-10 mt-2 w-56 rounded-xl border border-slate-200 bg-white shadow-xl ring-1 ring-slate-100 transition duration-200 ease-out ${isEditingWho ? 'pointer-events-auto scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0'
                                                    }`}
                                            >
                                                {whoOptions.map((option) => (
                                                    <button
                                                        key={option}
                                                        type="button"
                                                        onClick={() => handleWhoSelection(option)}
                                                        className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition first:rounded-t-xl last:rounded-b-xl hover:bg-primary-50 ${selectedWhoOption === option ? 'text-primary-600' : 'text-slate-700'
                                                            }`}
                                                    >
                                                        <span>{option === 'Mirror' ? 'Mirror' : 'Me'}</span>
                                                        {selectedWhoOption === option && <span className="text-primary-500">•</span>}
                                                    </button>
                                                ))}
                                            </div>
                                        </span>
                                    </p>
                                </div>
                                <p className="text-base text-slate-700">Click the continue button to continue making Lasting Power of Attorney documents for yourself.</p>
                            </div>

                            {(
                                <p className="text-sm text-slate-500">Need to change your answer later? You can always revisit this step.</p>
                            )}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                type="button"
                                className="inline-flex items-center gap-2 rounded-full border border-primary-500 px-5 py-2 text-sm font-semibold text-primary-600 transition hover:bg-primary-500 hover:text-white disabled:pointer-events-none disabled:opacity-50"
                                onClick={() => handleStepChange('prev')}
                                disabled={currentStep === 0}
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back
                            </button>
                            <button
                                type="button"
                                className="inline-flex items-center gap-2 rounded-full bg-primary-500 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition hover:bg-primary-600 disabled:pointer-events-none disabled:opacity-50"
                                onClick={() => handleStepChange('next')}
                                disabled={currentStep === lpaSteps.length - 1 || (currentStep === 0 && !selectedWhoOption)}
                            >
                                Continue
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}