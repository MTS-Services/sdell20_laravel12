import { type ReactElement, useEffect, useRef, useState } from 'react';
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

const TOTAL_FORM_STEPS = 12;

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
    const [showAttorneyModal, setShowAttorneyModal] = useState(false);
    const [attorneys, setAttorneys] = useState<Array<{
        id: string;
        title: string;
        firstName: string;
        lastName: string;
        middleNames: string;
        postcode: string;
        addressLine1: string;
        addressLine2: string;
        town: string;
        county: string;
        birthDay: string;
        birthMonth: string;
        birthYear: string;
        email: string;
    }>>([]);
    const [currentAttorney, setCurrentAttorney] = useState({
        title: 'Mr',
        firstName: '',
        lastName: '',
        middleNames: '',
        postcode: '',
        addressLine1: '',
        addressLine2: '',
        town: '',
        county: '',
        birthDay: '',
        birthMonth: '',
        birthYear: '',
        email: ''
    });
    const [isManualAddress, setIsManualAddress] = useState(false);

    // New states for the additional attorney steps
    const [canViewDocuments, setCanViewDocuments] = useState<'yes' | 'no' | null>(null);
    const [wantReplacementAttorneys, setWantReplacementAttorneys] = useState<'yes' | 'no' | null>(null);
    const [showReplacementAttorneyModal, setShowReplacementAttorneyModal] = useState(false);
    const [replacementAttorneys, setReplacementAttorneys] = useState<Array<{
        id: string;
        title: string;
        firstName: string;
        lastName: string;
        middleNames: string;
        postcode: string;
        addressLine1: string;
        addressLine2: string;
        town: string;
        county: string;
        birthDay: string;
        birthMonth: string;
        birthYear: string;
        email: string;
    }>>([]);
    const [currentReplacementAttorney, setCurrentReplacementAttorney] = useState({
        title: 'Mr',
        firstName: '',
        lastName: '',
        middleNames: '',
        postcode: '',
        addressLine1: '',
        addressLine2: '',
        town: '',
        county: '',
        birthDay: '',
        birthMonth: '',
        birthYear: '',
        email: ''
    });
    const [isManualReplacementAddress, setIsManualReplacementAddress] = useState(false);

    // States for new steps
    const [notifyPeople, setNotifyPeople] = useState<'yes' | 'no' | null>(null);
    const [lifeSustainingTreatment, setLifeSustainingTreatment] = useState<'yes' | 'no' | null>(null);
    const [applicant, setApplicant] = useState<string>('');
    const [documentRecipient, setDocumentRecipient] = useState<string>('');
    const [certificateChoice, setCertificateChoice] = useState<'yes' | 'no' | null>(null);

    const dropdownRef = useRef<HTMLSpanElement | null>(null);
    const modalRef = useRef<HTMLDivElement | null>(null);
    const replacementModalRef = useRef<HTMLDivElement | null>(null);

    const getSelectionCopy = (): string => {
        return selectedWhoOption === 'Mirror' ? 'mirror' : 'yourself only';
    };

    const canAdvanceFromStep = (stepIndex: number): boolean => {
        switch (stepIndex) {
            case 0:
                return Boolean(selectedWhoOption);
            case 1:
                return Boolean(selectedDocumentOption);
            case 4:
                return attorneys.length > 0;
            case 5:
                return Boolean(canViewDocuments);
            case 6:
                return Boolean(wantReplacementAttorneys);
            case 7:
                return Boolean(lifeSustainingTreatment);
            case 8:
                return Boolean(notifyPeople);
            case 9:
                return Boolean(applicant);
            case 10:
                return Boolean(documentRecipient);
            case 11:
                return Boolean(certificateChoice);
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

    const handleAttorneyChange = (field: keyof typeof currentAttorney, value: string): void => {
        setCurrentAttorney((prev) => ({ ...prev, [field]: value }));
    };

    const handleReplacementAttorneyChange = (field: keyof typeof currentReplacementAttorney, value: string): void => {
        setCurrentReplacementAttorney((prev) => ({ ...prev, [field]: value }));
    };

    const handleAddAttorney = (): void => {
        setShowAttorneyModal(true);
    };

    const handleAddReplacementAttorney = (): void => {
        setShowReplacementAttorneyModal(true);
    };

    const handleSaveAttorney = (): void => {
        const newAttorney = {
            ...currentAttorney,
            id: Date.now().toString()
        };
        setAttorneys((prev) => [...prev, newAttorney]);
        setCurrentAttorney({
            title: 'Mr',
            firstName: '',
            lastName: '',
            middleNames: '',
            postcode: '',
            addressLine1: '',
            addressLine2: '',
            town: '',
            county: '',
            birthDay: '',
            birthMonth: '',
            birthYear: '',
            email: ''
        });
        setIsManualAddress(false);
        setShowAttorneyModal(false);
    };

    const handleSaveReplacementAttorney = (): void => {
        const newAttorney = {
            ...currentReplacementAttorney,
            id: Date.now().toString()
        };
        setReplacementAttorneys((prev) => [...prev, newAttorney]);
        setCurrentReplacementAttorney({
            title: 'Mr',
            firstName: '',
            lastName: '',
            middleNames: '',
            postcode: '',
            addressLine1: '',
            addressLine2: '',
            town: '',
            county: '',
            birthDay: '',
            birthMonth: '',
            birthYear: '',
            email: ''
        });
        setIsManualReplacementAddress(false);
        setShowReplacementAttorneyModal(false);
    };

    const handleCloseAttorneyModal = (): void => {
        setShowAttorneyModal(false);
        setIsManualAddress(false);
    };

    const handleCloseReplacementAttorneyModal = (): void => {
        setShowReplacementAttorneyModal(false);
        setIsManualReplacementAddress(false);
    };

    const handleStepChange = (direction: 'next' | 'prev') => {
        if (direction === 'next' && !canAdvanceFromStep(currentStep)) {
            return;
        }

        setCurrentStep((prev) => {
            if (direction === 'next') {
                return Math.min(prev + 1, TOTAL_FORM_STEPS - 1);
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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!showAttorneyModal) {
                return;
            }

            if (modalRef.current && event.target instanceof Node && !modalRef.current.contains(event.target)) {
                handleCloseAttorneyModal();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showAttorneyModal]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!showReplacementAttorneyModal) {
                return;
            }

            if (replacementModalRef.current && event.target instanceof Node && !replacementModalRef.current.contains(event.target)) {
                handleCloseReplacementAttorneyModal();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showReplacementAttorneyModal]);

    const renderStepContent = (): ReactElement => {
        if (currentStep === 0) {
            return (
                <div className="space-y-4 rounded-2xl bg-white p-6 pl-12 text-primary-800 shadow-sm">
                    <div className="space-y-4 text-left">
                        <h2 className="text-2xl font-semibold text-primary-900">
                            Who is the <span className="text-primary-500">Lasting Power of Attorney</span> for?
                        </h2>
                        <p className="text-base text-primary-700">
                            You have chosen to make documents for <span className="font-semibold text-primary-500">{getSelectionCopy()}.</span>
                        </p>
                        <div className="space-y-2 text-base text-primary-700">
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
                                                className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition first:rounded-t-xl last:rounded-b-xl hover:bg-primary-50 ${selectedWhoOption === option ? 'text-primary-600' : 'text-primary-700'
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
                        <p className="text-base text-primary-700">Click the continue button to continue making Lasting Power of Attorney documents for yourself.</p>
                    </div>

                    <p className="text-sm text-primary-500">Need to change your answer later? You can always revisit this step.</p>
                </div>
            );
        }



        if (currentStep === 1) {
            const selectedDocument = selectedDocumentOption ? documentOptions.find((opt) => opt.value === selectedDocumentOption) : null;

            return (
                <div className="space-y-5 px-6 text-primary-800 ">
                    <div className="space-y-3 text-left max-w-3xl">
                        <h2 className="text-2xl font-semibold text-primary-900 mb-8">
                            Which <span className="text-primary-500">Lasting Power of Attorney</span> documents do you need?
                        </h2>
                        <p className="text-base text-primary-600">
                            You need to choose which type of documents you want for yourself – select Health &amp; Welfare for health decisions, Property &amp; Finance for
                            financial decisions, or choose both to stay fully protected.
                        </p>
                        <div className="flex items-start gap-3 rounded-xl bg-primary-50/70 px-4 py-3 text-sm text-primary-700">
                            <span className="mt-0.5 text-lg">💡</span>
                            <p className="font-medium">
                                We strongly recommend taking both documents for peace of mind and the best protection.
                            </p>
                        </div>
                        <p className="text-lg font-semibold text-primary-900">
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
                                    className={`flex w-full items-center justify-center gap-2 px-6 py-4 text-center text-base font-semibold transition ${isSelected ? 'bg-primary-600 text-white' : 'bg-white text-primary-800 hover:bg-slate-50'
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
                <div className="space-y-8 rounded-2xl bg-white p-8 text-primary-800 shadow-sm">
                    <div className="space-y-2 text-left">
                        <h2 className="text-3xl font-semibold text-primary-900">
                            About <span className="text-primary-500">You</span> (The Donor)
                        </h2>
                        <p className="text-base text-primary-600">
                            The "Donor" is the person appointing others to make decisions on their behalf and must be:
                        </p>
                        <ul className="space-y-2 text-sm text-primary-700">
                            <li className="flex items-start gap-2">
                                <span className="text-primary-500">✔</span>
                                <span>Aged 18 or over.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary-500">✔</span>
                                <span>Have mental capacity to make decisions at the time their Lasting Power of Attorney is made.</span>
                            </li>
                        </ul>
                        <p className="text-sm text-primary-600">
                            The Donor is the only one who can make decisions about their LPA and the people it should involve.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 border-b border-primary-100 pb-2">
                                <h3 className="text-xl font-semibold text-primary-900">Full legal name</h3>
                            </div>
                            <div className="grid gap-4 md:grid-cols-4">
                                <div className="md:col-span-1">
                                    <label className="mb-2 block text-sm font-medium text-primary-600">Title</label>
                                    <div className="rounded-md border border-slate-200 bg-white px-3 py-2">
                                        <select
                                            className="w-full border-none bg-transparent text-sm text-primary-800 focus:outline-none"
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
                                    <label className="mb-2 block text-sm font-medium text-primary-600">First name</label>
                                    <input
                                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-primary-800 focus:border-primary-400 focus:outline-none"
                                        value={donorDetails.firstName}
                                        onChange={(event) => handleDonorChange('firstName', event.target.value)}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm font-medium text-primary-600">Last name</label>
                                    <input
                                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-primary-800 focus:border-primary-400 focus:outline-none"
                                        value={donorDetails.lastName}
                                        onChange={(event) => handleDonorChange('lastName', event.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-primary-600">Middle names (if any)</label>
                                    <input
                                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-primary-800 focus:border-primary-400 focus:outline-none"
                                        value={donorDetails.middleNames}
                                        onChange={(event) => handleDonorChange('middleNames', event.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-primary-600">Preferred name (optional)</label>
                                    <input
                                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-primary-800 focus:border-primary-400 focus:outline-none"
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
                                        <label className="mb-2 block text-sm font-medium text-primary-600">Other names (optional)</label>
                                        <input
                                            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-primary-800 focus:border-primary-400 focus:outline-none"
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
                                <h3 className="text-xl font-semibold text-primary-900">Date of birth</h3>
                            </div>
                            <div className="grid gap-4 md:grid-cols-3">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-primary-600">Day</label>
                                    <input
                                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-primary-800 focus:border-primary-400 focus:outline-none"
                                        value={donorDetails.birthDay}
                                        onChange={(event) => handleDonorChange('birthDay', event.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-primary-600">Month</label>
                                    <input
                                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-primary-800 focus:border-primary-400 focus:outline-none"
                                        value={donorDetails.birthMonth}
                                        onChange={(event) => handleDonorChange('birthMonth', event.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-primary-600">Year</label>
                                    <input
                                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-primary-800 focus:border-primary-400 focus:outline-none"
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
        if (currentStep === 3) {
            return (
                <div className="space-y-8 rounded-2xl max-w-4xl bg-white p-8 text-primary-800 shadow-sm">
                    <div className="text-left">
                        <h2 className="text-3xl font-semibold text-center text-primary-900">
                            Your <span className="text-primary-500">contact details</span>
                        </h2>
                        <p className="text-center text-sm text-primary-500 mt-2">Complete the donor information</p>
                        <div className="mt-2 h-px w-full bg-primary-100" />
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-primary-900">What's your address?</h3>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-primary-600">Address Line 1</label>
                                    <input
                                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-primary-800 focus:border-primary-400 focus:outline-none"
                                        value={contactDetails.addressLine1}
                                        onChange={(event) => handleContactChange('addressLine1', event.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-primary-600">Address Line 2</label>
                                    <input
                                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-primary-800 focus:border-primary-400 focus:outline-none"
                                        value={contactDetails.addressLine2}
                                        onChange={(event) => handleContactChange('addressLine2', event.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-primary-600">Town</label>
                                    <input
                                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-primary-800 focus:border-primary-400 focus:outline-none"
                                        value={contactDetails.town}
                                        onChange={(event) => handleContactChange('town', event.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-primary-600">County</label>
                                    <input
                                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-primary-800 focus:border-primary-400 focus:outline-none"
                                        value={contactDetails.county}
                                        onChange={(event) => handleContactChange('county', event.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-primary-600">Country</label>
                                    <div className="rounded-md border border-slate-200 bg-white px-3 py-2">
                                        <select
                                            className="w-full border-none bg-transparent text-sm text-primary-800 focus:outline-none"
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
                                    <label className="mb-2 block text-sm font-medium text-primary-600">Postcode</label>
                                    <input
                                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-primary-800 focus:border-primary-400 focus:outline-none"
                                        value={contactDetails.postcode}
                                        onChange={(event) => handleContactChange('postcode', event.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-primary-900">Contact Number</h3>
                            <div className="mt-4 grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-primary-600">What's your mobile number?</label>
                                    <input
                                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-primary-800 focus:border-primary-400 focus:outline-none"
                                        value={contactDetails.mobile}
                                        onChange={(event) => handleContactChange('mobile', event.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-primary-600">What's your landline number?</label>
                                    <input
                                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-primary-800 focus:border-primary-400 focus:outline-none"
                                        value={contactDetails.landline}
                                        onChange={(event) => handleContactChange('landline', event.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-primary-900">What's your email address?</h3>
                            <div className="mt-3">
                                <input
                                    className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-primary-800 focus:border-primary-400 focus:outline-none"
                                    value={contactDetails.email}
                                    onChange={(event) => handleContactChange('email', event.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        if (currentStep === 4) {
            return (
                <>
                    <div className="grid gap-8 lg:grid-cols-6">
                        {/* Main Content */}
                        <div className="lg:col-span-3 space-y-6">
                            <div className="rounded-2xl bg-white p-8 text-primary-800 shadow-sm">
                                <h2 className="text-3xl font-semibold text-primary-900 mb-4">Attorneys</h2>

                                <p className="text-primary-700 mb-6">
                                    Attorneys are people a donor appoints to make decisions on their behalf, you need to choose at least one Attorney.
                                </p>

                                <button
                                    type="button"
                                    onClick={handleAddAttorney}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-slate-300 bg-white px-6 py-4 text-primary-700 font-medium transition hover:border-primary-400 hover:bg-slate-50"
                                >
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                    Add new attorney
                                </button>

                                {attorneys.length === 0 ? (
                                    <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center text-sm text-primary-500">
                                        You haven't added any attorneys yet. Click "Add new attorney" to start.
                                    </div>
                                ) : (
                                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                                        {attorneys.map((attorney) => (
                                            <div key={attorney.id} className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                                                <p className="text-base font-semibold text-primary-900">
                                                    {attorney.title} {attorney.firstName} {attorney.middleNames} {attorney.lastName}
                                                </p>
                                                <p className="mt-1 text-sm text-primary-600">
                                                    Born: {attorney.birthDay || '--'}/{attorney.birthMonth || '--'}/{attorney.birthYear || '----'}
                                                </p>
                                                {(attorney.addressLine1 || attorney.postcode) && (
                                                    <div className="mt-3 text-sm text-primary-600">
                                                        <p>{attorney.addressLine1}</p>
                                                        {attorney.addressLine2 && <p>{attorney.addressLine2}</p>}
                                                        <p>
                                                            {[attorney.town, attorney.county, attorney.postcode].filter(Boolean).join(', ')}
                                                        </p>
                                                    </div>
                                                )}
                                                {attorney.email && <p className="mt-3 text-sm text-primary-600">Email: {attorney.email}</p>}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-2">
                            <div className="rounded-2xl bg-white p-6 shadow-sm sticky top-6">
                                <h3 className="text-xl font-semibold text-primary-900 mb-4">Who can be an Attorney?</h3>
                                <p className="text-sm text-primary-700 mb-4">The Attorney must be meet the following requirements:</p>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3">
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600 flex-shrink-0 mt-0.5">
                                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </span>
                                        <span className="text-sm text-primary-700">Aged 18 or over.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600 flex-shrink-0 mt-0.5">
                                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </span>
                                        <span className="text-sm text-primary-700">Have mental capacity to make decisions.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-600 flex-shrink-0 mt-0.5">
                                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </span>
                                        <span className="text-sm text-primary-700">Must not be bankrupt, or subject to a debt relief order.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Attorney Modal */}
                    {showAttorneyModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                            <div
                                ref={modalRef}
                                className="relative flex h-[90vh] w-full max-w-2xl max-h-[90vh] flex-col overflow-y-auto rounded-xl bg-white shadow-2xl"
                            >
                                <button
                                    type="button"
                                    onClick={handleCloseAttorneyModal}
                                    className="absolute right-4 top-4 rounded-full p-1.5 text-white transition hover:bg-white/10"
                                    aria-label="Close"
                                >
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                                {/* Modal Header */}
                                <div className="border-b border-slate-200 bg-primary-600 px-6 py-4 pr-12">
                                    <h3 className="text-xl font-semibold text-white">Add attorney</h3>
                                </div>

                                {/* Modal Body */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                    {/* Full Legal Name */}
                                    <div className="space-y-4">
                                        <h4 className="text-lg font-semibold text-primary-900">Full legal name</h4>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-primary-600">Title</label>
                                            <div className="rounded-md border border-slate-300 bg-white px-3 py-2">
                                                <select
                                                    className="w-full border-none bg-transparent text-sm text-primary-800 focus:outline-none"
                                                    value={currentAttorney.title}
                                                    onChange={(e) => handleAttorneyChange('title', e.target.value)}
                                                >
                                                    {donorTitleOptions.map((title) => (
                                                        <option key={title} value={title}>
                                                            {title}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-primary-600">First Name</label>
                                                <input
                                                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-primary-800 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
                                                    value={currentAttorney.firstName}
                                                    onChange={(e) => handleAttorneyChange('firstName', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-primary-600">Last Name</label>
                                                <input
                                                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-primary-800 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
                                                    value={currentAttorney.lastName}
                                                    onChange={(e) => handleAttorneyChange('lastName', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-primary-600">Middle names (if any)</label>
                                            <input
                                                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-primary-800 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
                                                value={currentAttorney.middleNames}
                                                onChange={(e) => handleAttorneyChange('middleNames', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div className="space-y-4">
                                        <h4 className="text-lg font-semibold text-primary-900">What's their address?</h4>

                                        {!isManualAddress ? (
                                            <>
                                                <div>
                                                    <label className="mb-2 block text-sm text-primary-600">Enter postcode to search for address</label>
                                                    <div className="flex gap-3">
                                                        <input
                                                            className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm text-primary-800 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
                                                            value={currentAttorney.postcode}
                                                            onChange={(e) => handleAttorneyChange('postcode', e.target.value)}
                                                            placeholder="Enter postcode"
                                                        />
                                                        <button
                                                            type="button"
                                                            className="rounded-md bg-primary-500 px-6 py-2 text-sm font-semibold text-white transition hover:bg-primary-600"
                                                        >
                                                            Search
                                                        </button>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsManualAddress(true)}
                                                    className="text-sm font-medium text-primary-500 hover:text-primary-600 transition"
                                                >
                                                    Enter address manually
                                                </button>
                                            </>
                                        ) : (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="mb-2 block text-sm font-medium text-primary-600">Address Line 1</label>
                                                    <input
                                                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-primary-800 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
                                                        value={currentAttorney.addressLine1}
                                                        onChange={(e) => handleAttorneyChange('addressLine1', e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="mb-2 block text-sm font-medium text-primary-600">Address Line 2</label>
                                                    <input
                                                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-primary-800 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
                                                        value={currentAttorney.addressLine2}
                                                        onChange={(e) => handleAttorneyChange('addressLine2', e.target.value)}
                                                    />
                                                </div>
                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <div>
                                                        <label className="mb-2 block text-sm font-medium text-primary-600">Town</label>
                                                        <input
                                                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-primary-800 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
                                                            value={currentAttorney.town}
                                                            onChange={(e) => handleAttorneyChange('town', e.target.value)}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="mb-2 block text-sm font-medium text-primary-600">County</label>
                                                        <input
                                                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-primary-800 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
                                                            value={currentAttorney.county}
                                                            onChange={(e) => handleAttorneyChange('county', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="mb-2 block text-sm font-medium text-primary-600">Postcode</label>
                                                    <input
                                                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-primary-800 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
                                                        value={currentAttorney.postcode}
                                                        onChange={(e) => handleAttorneyChange('postcode', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Date of Birth */}
                                    <div className="space-y-4">
                                        <h4 className="text-lg font-semibold text-primary-900">What's their date of birth</h4>
                                        <div className="grid gap-4 grid-cols-3">
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-primary-600">Day</label>
                                                <input
                                                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-primary-800 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
                                                    value={currentAttorney.birthDay}
                                                    onChange={(e) => handleAttorneyChange('birthDay', e.target.value)}
                                                    placeholder="DD"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-primary-600">Month</label>
                                                <input
                                                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-primary-800 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
                                                    value={currentAttorney.birthMonth}
                                                    onChange={(e) => handleAttorneyChange('birthMonth', e.target.value)}
                                                    placeholder="MM"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-primary-600">Year</label>
                                                <input
                                                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-primary-800 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
                                                    value={currentAttorney.birthYear}
                                                    onChange={(e) => handleAttorneyChange('birthYear', e.target.value)}
                                                    placeholder="YYYY"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-4">
                                        <h4 className="text-lg font-semibold text-primary-900">What's their email address? (optional)</h4>
                                        <input
                                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-primary-800 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
                                            type="email"
                                            value={currentAttorney.email}
                                            onChange={(e) => handleAttorneyChange('email', e.target.value)}
                                            placeholder="email@example.com"
                                        />
                                    </div>

                                    {/* Save Button */}
                                    <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
                                        <button
                                            type="button"
                                            onClick={handleSaveAttorney}
                                            className="w-full rounded-md bg-primary-500 px-6 py-3 text-base font-semibold text-white transition hover:bg-primary-600"
                                        >
                                            Save and continue
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            );
        }

        // Step 5: Can attorneys view your legal documents?
        if (currentStep === 5) {
            return (
                <div className="max-w-4xl space-y-6">
                    <div className="rounded-2xl bg-white p-8 text-primary-800 shadow-sm">
                        <h2 className="text-2xl font-semibold text-primary-900 mb-6">
                            Can attorneys <span className="text-cyan-500">view your legal documents?</span>
                        </h2>

                        <p className="text-base text-primary-700 mb-8">
                            Are you happy for your Attorneys to view your legal documents if you lose mental capacity?
                        </p>

                        <div className="space-y-3">
                            <button
                                type="button"
                                onClick={() => setCanViewDocuments('yes')}
                                className={`w-full rounded-md px-6 py-4 text-base font-semibold transition ${canViewDocuments === 'yes'
                                    ? 'bg-slate-700 text-white'
                                    : 'bg-white text-primary-800 border border-slate-300 hover:bg-slate-50'
                                    }`}
                            >
                                Yes - give the attorneys authority
                            </button>
                            <button
                                type="button"
                                onClick={() => setCanViewDocuments('no')}
                                className={`w-full rounded-md px-6 py-4 text-base font-semibold transition ${canViewDocuments === 'no'
                                    ? 'bg-slate-700 text-white'
                                    : 'bg-white text-primary-800 border border-slate-300 hover:bg-slate-50'
                                    }`}
                            >
                                No - do not give the attorneys authority
                            </button>
                        </div>
                    </div>

                    <div className="rounded-xl bg-cyan-50/70 border border-cyan-200 p-4">
                        <button
                            type="button"
                            className="flex w-full items-center justify-between text-left"
                        >
                            <span className="text-base font-semibold text-cyan-700">NEED HELP?</span>
                            <svg className="h-5 w-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>
                </div>
            );
        }

        // Step 6: Replacement Attorneys
        if (currentStep === 6) {
            return (
                <>
                    <div className="grid gap-8 lg:grid-cols-6">
                        {/* Main Content */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="rounded-2xl bg-white p-8 text-primary-800 shadow-sm">
                                <h2 className="text-2xl font-semibold text-primary-900 mb-4">
                                    Replacement <span className="text-cyan-500">Attorneys</span>
                                </h2>

                                <p className="text-primary-700 mb-4">
                                    One or more replacement attorneys can be appointed, this is optional.
                                </p>

                                <p className="text-primary-700 mb-6">
                                    Replacement attorneys are people a donor appoints to make decisions on their behalf if one of their attorneys
                                    can no longer make decisions on their behalf.
                                </p>

                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-primary-900 mb-4">Do you want any replacement attorneys?</h3>
                                    <div className="space-y-3">
                                        <button
                                            type="button"
                                            onClick={() => setWantReplacementAttorneys('no')}
                                            className={`w-full rounded-md px-6 py-4 text-base font-semibold transition ${wantReplacementAttorneys === 'no'
                                                ? 'bg-slate-700 text-white'
                                                : 'bg-white text-primary-800 border border-slate-300 hover:bg-slate-50'
                                                }`}
                                        >
                                            No
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setWantReplacementAttorneys('yes')}
                                            className={`w-full rounded-md px-6 py-4 text-base font-semibold transition ${wantReplacementAttorneys === 'yes'
                                                ? 'bg-slate-700 text-white'
                                                : 'bg-white text-primary-800 border border-slate-300 hover:bg-slate-50'
                                                }`}
                                        >
                                            Yes
                                        </button>
                                    </div>
                                </div>

                                {wantReplacementAttorneys === 'yes' && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={handleAddReplacementAttorney}
                                            className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-slate-300 bg-white px-6 py-4 text-primary-700 font-medium transition hover:border-primary-400 hover:bg-slate-50 mb-6"
                                        >
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                            </svg>
                                            Add replacement attorney
                                        </button>

                                        {replacementAttorneys.length > 0 && (
                                            <div className="grid gap-4 md:grid-cols-2">
                                                {replacementAttorneys.map((attorney) => (
                                                    <div key={attorney.id} className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                                                        <p className="text-base font-semibold text-primary-900">
                                                            {attorney.title} {attorney.firstName} {attorney.middleNames} {attorney.lastName}
                                                        </p>
                                                        <p className="mt-1 text-sm text-primary-600">
                                                            Born: {attorney.birthDay || '--'}/{attorney.birthMonth || '--'}/{attorney.birthYear || '----'}
                                                        </p>
                                                        {(attorney.addressLine1 || attorney.postcode) && (
                                                            <div className="mt-3 text-sm text-primary-600">
                                                                <p>{attorney.addressLine1}</p>
                                                                {attorney.addressLine2 && <p>{attorney.addressLine2}</p>}
                                                                <p>
                                                                    {[attorney.town, attorney.county, attorney.postcode].filter(Boolean).join(', ')}
                                                                </p>
                                                            </div>
                                                        )}
                                                        {attorney.email && <p className="mt-3 text-sm text-primary-600">Email: {attorney.email}</p>}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-2">
                            <div className="rounded-2xl bg-white p-6 shadow-sm sticky top-6">
                                <h3 className="text-xl font-semibold text-primary-900 mb-4">Who can be a Replacement Attorney?</h3>
                                <p className="text-sm text-primary-700 mb-4">The replacement attorney must be meet the following requirements:</p>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3">
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600 flex-shrink-0 mt-0.5">
                                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </span>
                                        <span className="text-sm text-primary-700">Aged <span className="font-semibold">18 or over</span>.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600 flex-shrink-0 mt-0.5">
                                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </span>
                                        <span className="text-sm text-primary-700">Have <span className="font-semibold">mental capacity</span> to make decisions.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-600 flex-shrink-0 mt-0.5">
                                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </span>
                                        <span className="text-sm text-primary-700">Must not be <span className="font-semibold">bankrupt</span>, or subject to a debt relief order.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-600 flex-shrink-0 mt-0.5">
                                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </span>
                                        <span className="text-sm text-primary-700">Must not already be assigned as an <span className="font-semibold">Attorney</span></span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Replacement Attorney Modal */}
                    {showReplacementAttorneyModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                            <div
                                ref={replacementModalRef}
                                className="relative flex h-[90vh] w-full max-w-2xl max-h-[90vh] flex-col overflow-y-auto rounded-xl bg-white shadow-2xl"
                            >
                                <button
                                    type="button"
                                    onClick={handleCloseReplacementAttorneyModal}
                                    className="absolute right-4 top-4 rounded-full p-1.5 text-white transition hover:bg-white/10"
                                    aria-label="Close"
                                >
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                                {/* Modal Header */}
                                <div className="border-b border-slate-200 bg-primary-600 px-6 py-4 pr-12">
                                    <h3 className="text-xl font-semibold text-white">Add replacement attorney</h3>
                                </div>

                                {/* Modal Body */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                    {/* Full Legal Name */}
                                    <div className="space-y-4">
                                        <h4 className="text-lg font-semibold text-primary-900">Full legal name</h4>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-primary-600">Title</label>
                                            <div className="rounded-md border border-slate-300 bg-white px-3 py-2">
                                                <select
                                                    className="w-full border-none bg-transparent text-sm text-primary-800 focus:outline-none"
                                                    value={currentReplacementAttorney.title}
                                                    onChange={(e) => handleReplacementAttorneyChange('title', e.target.value)}
                                                >
                                                    {donorTitleOptions.map((title) => (
                                                        <option key={title} value={title}>
                                                            {title}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-primary-600">First Name</label>
                                                <input
                                                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-primary-800 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
                                                    value={currentReplacementAttorney.firstName}
                                                    onChange={(e) => handleReplacementAttorneyChange('firstName', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-primary-600">Last Name</label>
                                                <input
                                                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-primary-800 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
                                                    value={currentReplacementAttorney.lastName}
                                                    onChange={(e) => handleReplacementAttorneyChange('lastName', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-primary-600">Middle names (if any)</label>
                                            <input
                                                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-primary-800 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
                                                value={currentReplacementAttorney.middleNames}
                                                onChange={(e) => handleReplacementAttorneyChange('middleNames', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div className="space-y-4">
                                        <h4 className="text-lg font-semibold text-primary-900">What's their address?</h4>

                                        {!isManualReplacementAddress ? (
                                            <>
                                                <div>
                                                    <label className="mb-2 block text-sm text-primary-600">Enter postcode to search for address</label>
                                                    <div className="flex gap-3">
                                                        <input
                                                            className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm text-primary-800 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
                                                            value={currentReplacementAttorney.postcode}
                                                            onChange={(e) => handleReplacementAttorneyChange('postcode', e.target.value)}
                                                            placeholder="Enter postcode"
                                                        />
                                                        <button
                                                            type="button"
                                                            className="rounded-md bg-primary-500 px-6 py-2 text-sm font-semibold text-white transition hover:bg-primary-600"
                                                        >
                                                            Search
                                                        </button>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsManualReplacementAddress(true)}
                                                    className="text-sm font-medium text-primary-500 hover:text-primary-600 transition"
                                                >
                                                    Enter address manually
                                                </button>
                                            </>
                                        ) : (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="mb-2 block text-sm font-medium text-primary-600">Address Line 1</label>
                                                    <input
                                                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-primary-800 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
                                                        value={currentReplacementAttorney.addressLine1}
                                                        onChange={(e) => handleReplacementAttorneyChange('addressLine1', e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="mb-2 block text-sm font-medium text-primary-600">Address Line 2</label>
                                                    <input
                                                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-primary-800 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
                                                        value={currentReplacementAttorney.addressLine2}
                                                        onChange={(e) => handleReplacementAttorneyChange('addressLine2', e.target.value)}
                                                    />
                                                </div>
                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <div>
                                                        <label className="mb-2 block text-sm font-medium text-primary-600">Town</label>
                                                        <input
                                                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-primary-800 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
                                                            value={currentReplacementAttorney.town}
                                                            onChange={(e) => handleReplacementAttorneyChange('town', e.target.value)}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="mb-2 block text-sm font-medium text-primary-600">County</label>
                                                        <input
                                                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-primary-800 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
                                                            value={currentReplacementAttorney.county}
                                                            onChange={(e) => handleReplacementAttorneyChange('county', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="mb-2 block text-sm font-medium text-primary-600">Postcode</label>
                                                    <input
                                                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-primary-800 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
                                                        value={currentReplacementAttorney.postcode}
                                                        onChange={(e) => handleReplacementAttorneyChange('postcode', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Date of Birth */}
                                    <div className="space-y-4">
                                        <h4 className="text-lg font-semibold text-primary-900">What's their date of birth</h4>
                                        <div className="grid gap-4 grid-cols-3">
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-primary-600">Day</label>
                                                <input
                                                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-primary-800 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
                                                    value={currentReplacementAttorney.birthDay}
                                                    onChange={(e) => handleReplacementAttorneyChange('birthDay', e.target.value)}
                                                    placeholder="DD"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-primary-600">Month</label>
                                                <input
                                                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-primary-800 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
                                                    value={currentReplacementAttorney.birthMonth}
                                                    onChange={(e) => handleReplacementAttorneyChange('birthMonth', e.target.value)}
                                                    placeholder="MM"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-primary-600">Year</label>
                                                <input
                                                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-primary-800 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
                                                    value={currentReplacementAttorney.birthYear}
                                                    onChange={(e) => handleReplacementAttorneyChange('birthYear', e.target.value)}
                                                    placeholder="YYYY"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-4">
                                        <h4 className="text-lg font-semibold text-primary-900">What's their email address? (optional)</h4>
                                        <input
                                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-primary-800 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
                                            type="email"
                                            value={currentReplacementAttorney.email}
                                            onChange={(e) => handleReplacementAttorneyChange('email', e.target.value)}
                                            placeholder="email@example.com"
                                        />
                                    </div>

                                    {/* Save Button */}
                                    <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
                                        <button
                                            type="button"
                                            onClick={handleSaveReplacementAttorney}
                                            className="w-full rounded-md bg-primary-500 px-6 py-3 text-base font-semibold text-white transition hover:bg-primary-600"
                                        >
                                            Save and continue
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            );
        }



        // Step 7: Life-sustaining Treatment
        if (currentStep === 7) {
            return (
                <div className="max-w-4xl space-y-6">
                    <div className="rounded-2xl bg-white p-8 text-primary-800 shadow-sm">
                        <h2 className="text-3xl font-semibold text-center text-primary-900 mb-8">
                            Life-sustaining <span className="text-cyan-500">Treatment</span>
                        </h2>

                        <div className="space-y-6 text-base text-primary-900 mb-8">
                            <p>
                                <span className="text-cyan-500">You</span> must choose what you want to happen if you needed medical help to keep you alive and you no longer had mental capacity.
                            </p>

                            <p>
                                If you choose YES and <span className="text-cyan-500">you</span> ever needed life-sustaining treatment but can't make decisions, the attorneys can speak to doctors on your behalf as if they were <span className="text-cyan-500">you</span>.
                            </p>

                            <p>
                                If you choose NO doctors will make decisions about life-sustaining treatment for <span className="text-cyan-500">you</span>.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-primary-900">
                                Do you want the attorneys to make decisions about life-sustaining treatment?
                            </h3>
                            <div className="overflow-hidden rounded-md border border-slate-200">
                                <button
                                    type="button"
                                    onClick={() => setLifeSustainingTreatment('yes')}
                                    className={`w-full px-6 py-4 text-base font-medium transition ${lifeSustainingTreatment === 'yes'
                                        ? 'bg-slate-600 text-white'
                                        : 'bg-white text-primary-800 hover:bg-slate-50'
                                        }`}
                                >
                                    Yes - give the attorneys authority
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setLifeSustainingTreatment('no')}
                                    className={`w-full border-t border-slate-200 px-6 py-4 text-base font-medium transition ${lifeSustainingTreatment === 'no'
                                        ? 'bg-slate-600 text-white'
                                        : 'bg-white text-primary-800 hover:bg-slate-50'
                                        }`}
                                >
                                    No - do not give the attorneys authority
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        // Step 8: People To Notify
        if (currentStep === 8) {
            return (
                <div className="max-w-4xl space-y-6">
                    <div className="rounded-2xl bg-white p-8 text-primary-800 shadow-sm">
                        <h2 className="text-2xl font-semibold text-primary-900 mb-6">
                            People to <span className="text-cyan-500">notify</span>
                        </h2>

                        <div className="space-y-4 text-primary-700">
                            <p className="text-base">
                                You can let people know that you're going to register this document. They can raise any concerns they have about the Lasting Powers of Attorney – for example, if there was any pressure or fraud in making it.
                            </p>

                            <p className="text-base">
                                When the document is registered, the person applying to register must send a notice to each 'person to notify'.
                            </p>

                            <p className="text-base font-semibold">
                                You can't put any of the attorneys or replacement attorneys here.
                            </p>

                            <p className="text-base">
                                People to notify can object to the document, but only for certain reasons, after that they are no longer involved in the Lasting Powers of Attorney.
                            </p>

                            <p className="text-base">
                                Choose people who care about your best interests and who would be willing to speak up if they were concerned.
                            </p>

                            <p className="text-base text-cyan-500">
                                Most people choose 'No' and do not enter anyone here.
                            </p>
                        </div>

                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-primary-900 mb-4">Are there any people to notify?</h3>
                            <div className="space-y-3">
                                <button
                                    type="button"
                                    onClick={() => setNotifyPeople('no')}
                                    className={`w-full rounded-md px-6 py-4 text-base font-semibold transition ${notifyPeople === 'no'
                                        ? 'bg-slate-700 text-white'
                                        : 'bg-white text-primary-800 border border-slate-300 hover:bg-slate-50'
                                        }`}
                                >
                                    No, there are no people to notify
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setNotifyPeople('yes')}
                                    className={`w-full rounded-md px-6 py-4 text-base font-semibold transition ${notifyPeople === 'yes'
                                        ? 'bg-slate-700 text-white'
                                        : 'bg-white text-primary-800 border border-slate-300 hover:bg-slate-50'
                                        }`}
                                >
                                    Yes, there are people to notify
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        // Step 9: Application Information - Who is applying to register
        if (currentStep === 9) {
            const selectedAttorney = applicant === 'attorneys' && attorneys.length > 0 ? attorneys[0] : null;
            const selectedDonor = donorDetails;

            return (
                <div className="max-w-4xl space-y-6">
                    <div className="rounded-2xl bg-white p-8 text-primary-800 shadow-sm">
                        <h2 className="text-2xl font-semibold text-primary-900 mb-6">
                            Who is <span className="text-cyan-500">applying to register?</span>
                        </h2>

                        <div className="space-y-4 text-primary-700 mb-8">
                            <p className="text-base">
                                This document can't be used until it is registered by the Office of the Public Guardian (OPG).
                            </p>

                            <p className="text-base">
                                Only the donor (<span className="text-cyan-500">You</span>) or one of the attorneys can apply to register this document.
                            </p>

                            <p className="text-base">
                                Select from the option below whether the donor (<span className="text-cyan-500">You</span>) is registering or one of the attorneys.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-primary-900">Who is applying to register?</h3>
                            <div className="rounded-md border border-slate-300 bg-white">
                                <select
                                    className="w-full border-none bg-transparent px-4 py-3 text-base text-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-400"
                                    value={applicant}
                                    onChange={(e) => setApplicant(e.target.value)}
                                >
                                    <option value="">Choose from this list...</option>
                                    <option value="donor">Donor</option>
                                    <option value="attorneys">Attorneys</option>
                                </select>
                            </div>

                            {applicant === 'attorneys' && attorneys.length === 1 && selectedAttorney && (
                                <div className="space-y-3">
                                    <p className="text-sm text-primary-600">You only have one attorney, they have been automatically selected.</p>
                                    <div className="flex items-center gap-4 rounded-lg bg-slate-400 p-4 text-white">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/30">
                                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold">
                                                {selectedAttorney.title} {selectedAttorney.firstName} {selectedAttorney.middleNames} {selectedAttorney.lastName}
                                            </p>
                                            <p className="text-sm">{selectedAttorney.email}</p>
                                        </div>
                                        <div className="flex h-6 w-6 items-center justify-center rounded border-2 border-white bg-white">
                                            <svg className="h-4 w-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {applicant === 'donor' && (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-4 rounded-lg bg-slate-400 p-4 text-white">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/30">
                                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold">
                                                {selectedDonor.title} {selectedDonor.firstName} {selectedDonor.middleNames} {selectedDonor.lastName}
                                            </p>
                                            <p className="text-sm">{contactDetails.email}</p>
                                        </div>
                                        <div className="flex h-6 w-6 items-center justify-center rounded border-2 border-white bg-white">
                                            <svg className="h-4 w-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        // Step 10: Application Information - Who should receive the document
        if (currentStep === 10) {
            const selectedAttorney = documentRecipient === 'attorney' && attorneys.length > 0 ? attorneys[0] : null;
            const selectedDonor = donorDetails;
            return (
                <div className="max-w-4xl space-y-6">
                    <div className="rounded-2xl bg-white p-8 text-primary-800 shadow-sm">
                        <h2 className="text-2xl font-semibold text-primary-900 mb-6">
                            Who should <span className="text-cyan-500">receive the document?</span>
                        </h2>

                        <div className="space-y-6">
                            <p className="text-base text-primary-700">
                                Once this document is registered with the Office of the Public Guardian (OPG) it will be sent to the person listed below.
                            </p>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-primary-900">Where should the registered document be sent?</h3>
                                <div className="rounded-md border border-slate-300 bg-white">
                                    <select
                                        className="w-full border-none bg-transparent px-4 py-3 text-base text-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-400"
                                        value={documentRecipient}
                                        onChange={(e) => setDocumentRecipient(e.target.value)}
                                    >
                                        <option value="">Choose from this list...</option>
                                        <option value="attorney">Attorney</option>
                                        <option value="donor">Donor</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                {documentRecipient && (
                                    <p className="text-sm text-cyan-500">Select the person who should receive the document</p>
                                )}
                            </div>

                            {documentRecipient === 'attorney' && selectedAttorney && (
                                <div className="space-y-3">
                                    <p className="text-sm text-primary-600">You only have one attorney, they will receive the registered document.</p>
                                    <div className="flex items-center gap-4 rounded-lg bg-slate-400 p-4 text-white">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/30">
                                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold">
                                                {selectedAttorney.title} {selectedAttorney.firstName} {selectedAttorney.middleNames} {selectedAttorney.lastName}
                                            </p>
                                            <p className="text-sm">{selectedAttorney.email}</p>
                                        </div>
                                        <div className="flex h-6 w-6 items-center justify-center rounded border-2 border-white bg-white">
                                            <svg className="h-4 w-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {documentRecipient === 'donor' && (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-4 rounded-lg bg-slate-400 p-4 text-white">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/30">
                                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold">
                                                {selectedDonor.title} {selectedDonor.firstName} {selectedDonor.middleNames} {selectedDonor.lastName}
                                            </p>
                                            <p className="text-sm">{contactDetails.email}</p>
                                        </div>
                                        <div className="flex h-6 w-6 items-center justify-center rounded border-2 border-white bg-white">
                                            <svg className="h-4 w-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {documentRecipient === 'other' && (
                                <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-primary-600">
                                    You'll be able to provide the recipient's details in the following step.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        // Step 11: Certificate Provider
        if (currentStep === 11) {
            return (
                <div className="max-w-4xl space-y-8 rounded-2xl bg-white p-8 text-primary-800 shadow-sm">
                    <div className="text-center space-y-3">
                        <h2 className="text-3xl font-semibold text-primary-900">
                            The <span className="text-primary-500">Certificate Provider</span>
                        </h2>
                        <div className="mx-auto h-px w-full bg-slate-200" />
                    </div>

                    <p className="text-base text-primary-700">
                        This person signs to confirm they have discussed the Lasting Power of Attorney with the Donor and that they are fully aware of what they are doing.
                    </p>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-primary-900">Do you want to choose your certificate provider now?</h3>
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_30px_rgba(15,23,42,0.08)]">
                            {[
                                { value: 'no', label: 'No, I will add them when I sign the documents' },
                                { value: 'yes', label: 'Yes, I know the details now' }
                            ].map((option, index) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setCertificateChoice(option.value as 'yes' | 'no')}
                                    className={`w-full px-8 py-5 text-left text-base font-semibold transition ${certificateChoice === option.value
                                        ? 'bg-slate-800 text-white'
                                        : index === 0
                                            ? 'bg-slate-900 text-white hover:bg-slate-800'
                                            : 'bg-white text-primary-800 hover:bg-slate-50'
                                        } ${index === 0 ? 'border-b border-slate-200/70' : ''}`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            );
        }

        const nextStep = lpaSteps[currentStep];
        return (
            <div className="rounded-2xl bg-white p-8 text-primary-700 shadow-sm">
                <p className="text-lg font-semibold text-primary-900">{nextStep?.title ?? 'Upcoming Step'}</p>
                <p className="mt-2 text-sm text-primary-500">This part of the journey will be completed in the next iteration.</p>
            </div>
        );
    };

    // Helper function to map currentStep to display step for the progress indicator
    const getDisplayStep = (currentStepIndex: number): number => {
        // Steps 2 and 3 both map to step 2 in the visual progress ("The Donor")
        if (currentStepIndex === 3) {
            return 2;
        }

        // Steps 5 and 6 are both part of "Attorneys" in the visual progress
        if (currentStepIndex === 5 || currentStepIndex === 6) {
            return 3;
        }

        // Steps between donor and attorneys (contact details) map back one position
        if (currentStepIndex > 3 && currentStepIndex < 5) {
            return currentStepIndex - 1;
        }

        // Life-sustaining treatment maps to "Health and Finance Decisions"
        if (currentStepIndex === 7) {
            return 4;
        }

        // People to notify maps to its own step
        if (currentStepIndex === 8) {
            return 5;
        }

        // Both application sub-steps (who applies, who receives) map to the single Application step
        if (currentStepIndex === 9 || currentStepIndex === 10) {
            return 6;
        }

        // Certificate provider maps to the certificate step
        if (currentStepIndex === 11) {
            return 7;
        }

        // Anything beyond application should advance naturally with an offset of -3
        if (currentStepIndex > 6) {
            return currentStepIndex - 3;
        }

        return currentStepIndex;
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
                                        // Map currentStep to display step
                                        const displayStep = getDisplayStep(currentStep);

                                        const isActive = displayStep === index;
                                        const isCompleted = displayStep > index;

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
                                                    className={`mt-3 text-xs font-medium transition-colors duration-200 ${isActive ? 'text-primary-600' : isCompleted ? 'text-primary-600' : 'text-primary-400'
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
                                disabled={!canAdvanceFromStep(currentStep)}
                            >
                                {(currentStep === 5 || currentStep === 6 || currentStep === 7 || currentStep === 8 || currentStep === 9 || currentStep === 10 || currentStep === 11) ? 'Save and continue' : 'Continue'}
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}