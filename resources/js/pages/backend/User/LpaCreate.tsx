import { type ReactElement, useEffect, useMemo, useRef, useState } from 'react';
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
    { key: 'fees', title: 'OPG Fees', description: 'Office of the Public Guardian fee' }
];

const documentOptions = [
    {
        value: 'property',
        title: 'Property & Finance LPA',
        description: 'Manage money, property, and financial decisions.'
    },
    {
        value: 'health',
        title: 'Health & Welfare LPA',
        description: 'Make decisions about health, care, and living arrangements.'
    }
];

const donorTitleOptions = ['Mr', 'Mrs', 'Miss', 'Ms', 'Mx', 'Dr'];

export default function LpaCreate({ user }: Props) {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedWhoOption, setSelectedWhoOption] = useState<'Me' | 'Mirror'>('Me');
    const [isEditingWho, setIsEditingWho] = useState(false);
    const [selectedDocumentOption, setSelectedDocumentOption] = useState<string | null>(null);
    const [donorDetails, setDonorDetails] = useState({
        title: 'Mrs',
        firstName: 'Samson',
        middleNames: 'Jameson Giles',
        lastName: 'Lopez',
        preferredName: 'Mallory Colon',
        otherNames: '',
        birthDay: '28',
        birthMonth: '04',
        birthYear: '2002'
    });
    const [contactDetails, setContactDetails] = useState({
        addressLine1: 'bashundhara',
        addressLine2: 'jomonah',
        town: 'dhaka',
        county: '',
        country: 'Bangladesh',
        postcode: '1362',
        mobile: '01581088986',
        landline: '',
        email: 'vudud@mailinator.com'
    });
    const [showOtherNames, setShowOtherNames] = useState(false);
    const dropdownRef = useRef<HTMLSpanElement | null>(null);

    const getSelectionCopy = (): string => {
        return selectedWhoOption === 'Mirror' ? 'mirror' : 'yourself only';
    };

    const canAdvanceFromStep = (stepIndex: number): boolean => {
        switch (stepIndex) {
            case 0:
                return Boolean(selectedWhoOption);
            case 1:
                return Boolean(selectedDocumentOption);
            default:
                return true;
        }
    };

    const handleWhoSelection = (option: 'Me' | 'Mirror'): void => {
        setSelectedWhoOption(option);
        setIsEditingWho(false);
    };

    const handleDonorChange = (field: keyof typeof donorDetails, value: string): void => {
        setDonorDetails((prev) => ({ ...prev, [field]: value }));
    };

    const handleContactChange = (field: keyof typeof contactDetails, value: string): void => {
        setContactDetails((prev) => ({ ...prev, [field]: value }));
    };

    const handleStepChange = (direction: 'next' | 'prev') => {
        if (direction === 'next' && !canAdvanceFromStep(currentStep)) {
            return;
        }

        setCurrentStep((prev) => {
            if (direction === 'next') {
                return Math.min(prev + 1, lpaSteps.length - 1);
            }

            return Math.max(prev - 1, 0);
        });
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

    const renderStepContent = (): ReactElement => {
        if (currentStep === 0) {
            return (
                <div className="space-y-4 rounded-2xl bg-white p-6 pl-12 text-slate-800 shadow-sm">
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
                                        {['Me', 'Mirror'].map((option) => (
                                            <button
                                                key={option}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedWhoOption(option as 'Me' | 'Mirror');
                                                    setIsEditingWho(false);
                                                }}
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

                    <p className="text-sm text-slate-500">Need to change your answer later? You can always revisit this step.</p>
                </div>
            );
        }

        if (currentStep === 3) {
            return (
                <div className="space-y-8 rounded-2xl max-w-4xl bg-white p-8 text-slate-800 shadow-sm">
                    <div className="text-left">
                        <h2 className="text-3xl font-semibold text-slate-900">
                            Your <span className="text-primary-500">contact details</span>
                        </h2>
                        <div className="mt-2 h-px w-full bg-primary-100" />
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-slate-900">What's your address?</h3>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-600">Address Line 1</label>
                                    <input
                                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-primary-400 focus:outline-none"
                                        value={contactDetails.addressLine1}
                                        onChange={(event) => handleContactChange('addressLine1', event.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-600">Address Line 2</label>
                                    <input
                                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-primary-400 focus:outline-none"
                                        value={contactDetails.addressLine2}
                                        onChange={(event) => handleContactChange('addressLine2', event.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-600">Town</label>
                                    <input
                                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-primary-400 focus:outline-none"
                                        value={contactDetails.town}
                                        onChange={(event) => handleContactChange('town', event.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-600">County</label>
                                    <input
                                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-primary-400 focus:outline-none"
                                        value={contactDetails.county}
                                        onChange={(event) => handleContactChange('county', event.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-600">Country</label>
                                    <div className="rounded-md border border-slate-200 bg-white px-3 py-2">
                                        <select
                                            className="w-full border-none bg-transparent text-sm text-slate-800 focus:outline-none"
                                            value={contactDetails.country}
                                            onChange={(event) => handleContactChange('country', event.target.value)}
                                        >
                                            {['Bangladesh', 'United Kingdom', 'United States', 'Canada'].map((country) => (
                                                <option key={country} value={country}>
                                                    {country}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-600">Postcode</label>
                                    <input
                                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-primary-400 focus:outline-none"
                                        value={contactDetails.postcode}
                                        onChange={(event) => handleContactChange('postcode', event.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-slate-900">Contact Number</h3>
                            <div className="mt-4 grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-600">What's your mobile number?</label>
                                    <input
                                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-primary-400 focus:outline-none"
                                        value={contactDetails.mobile}
                                        onChange={(event) => handleContactChange('mobile', event.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-600">What's your landline number?</label>
                                    <input
                                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-primary-400 focus:outline-none"
                                        value={contactDetails.landline}
                                        onChange={(event) => handleContactChange('landline', event.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-slate-900">What's your email address?</h3>
                            <div className="mt-3">
                                <input
                                    className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-primary-400 focus:outline-none"
                                    value={contactDetails.email}
                                    onChange={(event) => handleContactChange('email', event.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        if (currentStep === 1) {
            const selectedDocument = selectedDocumentOption ? documentOptions.find((opt) => opt.value === selectedDocumentOption) : null;

            return (
                <div className="space-y-5 px-6 text-slate-800 ">
                    <div className="space-y-3 text-left max-w-3xl">
                        <h2 className="text-2xl font-semibold text-slate-900 mb-8">
                            Which <span className="text-primary-500">Lasting Power of Attorney</span> documents do you need?
                        </h2>
                        <p className="text-base text-slate-600">
                            You need to choose which type of documents you want for yourself – select Health &amp; Welfare for health decisions, Property &amp; Finance for
                            financial decisions, or choose both to stay fully protected.
                        </p>
                        <div className="flex items-start gap-3 rounded-xl bg-primary-50/70 px-4 py-3 text-sm text-primary-700">
                            <span className="mt-0.5 text-lg">💡</span>
                            <p className="font-medium">
                                We strongly recommend taking both documents for peace of mind and the best protection.
                            </p>
                        </div>
                        <p className="text-lg font-semibold text-slate-900">
                            Which documents do <span className="text-primary-500">you</span> need?
                        </p>
                    </div>
                    <div className="overflow-hidden rounded-md text-center max-w-3xl border border-slate-200">
                        {documentOptions.map((option, index) => {
                            const isSelected = selectedDocumentOption === option.value;

                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setSelectedDocumentOption(option.value)}
                                    className={`flex w-full items-center justify-center gap-2 px-6 py-4 text-center text-base font-semibold transition ${isSelected ? 'bg-primary-600 text-white' : 'bg-white text-slate-800 hover:bg-slate-50'
                                        } ${index !== documentOptions.length - 1 ? 'border-b border-slate-200' : ''}`}
                                >
                                    {option.title}
                                </button>
                            );
                        })}
                    </div>
                    {selectedDocument && (
                        <p className="text-base text-primary-600">
                            You have chosen the <span className="font-semibold">{selectedDocument.title}</span>. Click Continue to review the donor details next.
                        </p>
                    )}
                </div>
            );
        }

        if (currentStep === 2) {
            return (
                <div className="space-y-8 rounded-2xl bg-white p-8 text-slate-800 shadow-sm">
                    <div className="space-y-2 text-left">
                        <h2 className="text-3xl font-semibold text-slate-900">
                            About <span className="text-primary-500">You</span> (The Donor)
                        </h2>
                        <p className="text-base text-slate-600">
                            The “Donor” is the person appointing others to make decisions on their behalf and must be:
                        </p>
                        <ul className="space-y-2 text-sm text-slate-700">
                            <li className="flex items-start gap-2">
                                <span className="text-primary-500">✔</span>
                                <span>Aged 18 or over.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary-500">✔</span>
                                <span>Have mental capacity to make decisions at the time their Lasting Power of Attorney is made.</span>
                            </li>
                        </ul>
                        <p className="text-sm text-slate-600">
                            The Donor is the only one who can make decisions about their LPA and the people it should involve.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 border-b border-primary-100 pb-2">
                                <h3 className="text-xl font-semibold text-slate-900">Full legal name</h3>
                            </div>
                            <div className="grid gap-4 md:grid-cols-4">
                                <div className="md:col-span-1">
                                    <label className="mb-2 block text-sm font-medium text-slate-600">Title</label>
                                    <div className="rounded-md border border-slate-200 bg-white px-3 py-2">
                                        <select
                                            className="w-full border-none bg-transparent text-sm text-slate-800 focus:outline-none"
                                            value={donorDetails.title}
                                            onChange={(event) => handleDonorChange('title', event.target.value)}
                                        >
                                            {donorTitleOptions.map((title) => (
                                                <option key={title} value={title}>
                                                    {title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="md:col-span-1">
                                    <label className="mb-2 block text-sm font-medium text-slate-600">First name</label>
                                    <input
                                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-primary-400 focus:outline-none"
                                        value={donorDetails.firstName}
                                        onChange={(event) => handleDonorChange('firstName', event.target.value)}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm font-medium text-slate-600">Last name</label>
                                    <input
                                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-primary-400 focus:outline-none"
                                        value={donorDetails.lastName}
                                        onChange={(event) => handleDonorChange('lastName', event.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-600">Middle names (if any)</label>
                                    <input
                                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-primary-400 focus:outline-none"
                                        value={donorDetails.middleNames}
                                        onChange={(event) => handleDonorChange('middleNames', event.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-600">Preferred name (optional)</label>
                                    <input
                                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-primary-400 focus:outline-none"
                                        value={donorDetails.preferredName}
                                        onChange={(event) => handleDonorChange('preferredName', event.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <button
                                    type="button"
                                    className="text-sm font-semibold text-primary-600 underline"
                                    onClick={() => setShowOtherNames((prev) => !prev)}
                                >
                                    Known by any other names? Click here
                                </button>
                                {showOtherNames && (
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-600">Other names (optional)</label>
                                        <input
                                            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-primary-400 focus:outline-none"
                                            value={donorDetails.otherNames}
                                            onChange={(event) => handleDonorChange('otherNames', event.target.value)}
                                            placeholder="Add any other names you have been known by"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-2 border-b border-primary-100 pb-2">
                                <h3 className="text-xl font-semibold text-slate-900">Date of birth</h3>
                            </div>
                            <div className="grid gap-4 md:grid-cols-3">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-600">Day</label>
                                    <input
                                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-primary-400 focus:outline-none"
                                        value={donorDetails.birthDay}
                                        onChange={(event) => handleDonorChange('birthDay', event.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-600">Month</label>
                                    <input
                                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-primary-400 focus:outline-none"
                                        value={donorDetails.birthMonth}
                                        onChange={(event) => handleDonorChange('birthMonth', event.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-600">Year</label>
                                    <input
                                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-primary-400 focus:outline-none"
                                        value={donorDetails.birthYear}
                                        onChange={(event) => handleDonorChange('birthYear', event.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        const nextStep = lpaSteps[currentStep];
        return (
            <div className="rounded-2xl bg-white p-8 text-slate-700 shadow-sm">
                <p className="text-lg font-semibold text-slate-900">{nextStep?.title ?? 'Upcoming Step'}</p>
                <p className="mt-2 text-sm text-slate-500">This part of the journey will be completed in the next iteration.</p>
            </div>
        );
    };

    return (
        <UserLayout>
            <div className="bg-slate-50 py-10 sm:pb-12">
                <div className="container mx-auto">
                    <div className="space-y-6">
                        {/* Updated Stepper Design */}
                        <div className="pb-6">
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
                                                    className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 bg-white transition-all duration-200 ${isActive ? 'border-primary-500 shadow-md' : isCompleted ? 'border-primary-400' : 'border-slate-300'
                                                        }`}
                                                >
                                                    <span
                                                        className={`h-3 w-3 rounded-full transition-all duration-200 ${isActive ? 'bg-primary-500' : isCompleted ? 'bg-primary-400' : 'bg-transparent'
                                                            }`}
                                                    />
                                                </div>

                                                {/* Step Title */}
                                                <p
                                                    className={`mt-3 text-xs font-medium transition-colors duration-200 ${isActive ? 'text-primary-600' : isCompleted ? 'text-slate-600' : 'text-slate-400'
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
                        {renderStepContent()}

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
                                disabled={currentStep === lpaSteps.length - 1 || !canAdvanceFromStep(currentStep)}
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