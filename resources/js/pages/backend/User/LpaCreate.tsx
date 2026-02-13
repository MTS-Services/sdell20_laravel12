import { useMemo, useState } from 'react';
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
    const [selectedWhoOption, setSelectedWhoOption] = useState<string | null>(null);

    const whoOptions = useMemo(() => ['Me', 'Mirror'], []);

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
                        <div className="space-y-4 p-6 pl-15 text-slate-800">
                            <div className="flex flex-col items-start gap-6 text-left ">
                                <img
                                    src="https://online.zenco.com/images/family1.png"
                                    alt="Family illustration"
                                    className="h-32 w-auto"
                                />
                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary-500">Step {currentStep + 1}</p>
                                    <h2 className="mt-3 text-2xl font-semibold text-slate-900">Who are the Lasting Power of Attorney documents for?</h2>
                                    <p className="mt-2 text-sm text-slate-600">Please tell us if these documents are for you or someone else.</p>
                                </div>
                                <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
                                    {whoOptions.map((option) => (
                                        <button
                                            key={option}
                                            type="button"
                                            onClick={() => setSelectedWhoOption(option)}
                                            className={`rounded-xl border px-6 py-4 text-base font-semibold shadow-sm transition hover:-translate-y-0.5 hover:shadow-md  hover:bg-primary-600 hover:text-white  ${selectedWhoOption === option
                                                ? 'border-primary-400 bg-primary-50 text-primary-700'
                                                : 'border-slate-200 bg-white text-slate-700 hover:border-primary-200'
                                                }`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>
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