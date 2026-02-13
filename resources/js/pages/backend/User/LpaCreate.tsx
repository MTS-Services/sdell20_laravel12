import { useState } from 'react';
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

    const handleStepChange = (direction: 'next' | 'prev') => {
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
                                                    className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 bg-white transition-all duration-200 ${
                                                        isActive
                                                            ? 'border-primary-500 shadow-md'
                                                            : isCompleted
                                                                ? 'border-primary-400'
                                                                : 'border-slate-300'
                                                    }`}
                                                >
                                                    <span
                                                        className={`h-3 w-3 rounded-full transition-all duration-200 ${
                                                            isActive
                                                                ? 'bg-primary-500'
                                                                : isCompleted
                                                                    ? 'bg-primary-400'
                                                                    : 'bg-transparent'
                                                        }`}
                                                    />
                                                </div>
                                                
                                                {/* Step Title */}
                                                <p 
                                                    className={`mt-3 text-xs font-medium transition-colors duration-200 ${
                                                        isActive 
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
                        <div className="space-y-4 rounded-2xl bg-primary-50/70 p-6 text-slate-800">
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary-500">Current step</p>
                            <h2 className="text-2xl font-semibold text-slate-900">{lpaSteps[currentStep].description}</h2>
                            <p className="text-sm text-slate-600">
                                Follow the guided prompts to complete each section. You can go back at any point before submitting to the
                                Office of the Public Guardian.
                            </p>
                            <div className="rounded-xl border border-primary-100 bg-white/80 p-4 text-sm text-slate-700">
                                <p>
                                    You've chosen to make these documents for <span className="font-semibold text-primary-600">yourself</span>.
                                    If that's incorrect you can go back and change this selection before you proceed.
                                </p>
                                <p className="mt-3">
                                    Ensure you have key details handy, like your attorneys' contact information and any special instructions you
                                    want to record.
                                </p>
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
                                disabled={currentStep === lpaSteps.length - 1}
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