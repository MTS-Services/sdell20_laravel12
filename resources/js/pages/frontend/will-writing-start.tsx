import React, { useState } from 'react';

// Type definitions
interface PersonalInfo {
    title: string;
    firstName: string;
    middleName: string;
    lastName: string;
    dateOfBirth: string;
    maritalStatus: string;
    address: string;
    city: string;
    postcode: string;
    country: string;
}

interface Beneficiary {
    id: string;
    type: 'person' | 'charity';
    title?: string;
    firstName?: string;
    lastName?: string;
    relationship?: string;
    charityName?: string;
    charityNumber?: string;
    percentage?: number;
    specificGift?: string;
}

interface Executor {
    id: string;
    title: string;
    firstName: string;
    lastName: string;
    relationship: string;
    address: string;
    dateOfBirth: string;
}

interface Guardian {
    id: string;
    title: string;
    firstName: string;
    lastName: string;
    relationship: string;
    address: string;
}

interface WillData {
    personalInfo: PersonalInfo;
    hasChildren: boolean;
    childrenUnder18: boolean;
    guardians: Guardian[];
    executors: Executor[];
    beneficiaries: Beneficiary[];
    distributionType: 'percentage' | 'specific' | 'residuary';
    specificGifts: Array<{ item: string; recipient: string }>;
    funeralWishes: string;
    burialPreference: string;
    additionalWishes: string;
}

const WillCreationWizard: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [willData, setWillData] = useState<WillData>({
        personalInfo: {
            title: '',
            firstName: '',
            middleName: '',
            lastName: '',
            dateOfBirth: '',
            maritalStatus: '',
            address: '',
            city: '',
            postcode: '',
            country: 'United Kingdom'
        },
        hasChildren: false,
        childrenUnder18: false,
        guardians: [],
        executors: [],
        beneficiaries: [],
        distributionType: 'percentage',
        specificGifts: [],
        funeralWishes: '',
        burialPreference: '',
        additionalWishes: ''
    });

    const steps = [
        { number: 1, title: 'Getting Started', description: 'Basic information' },
        { number: 2, title: 'Personal Details', description: 'Your information' },
        { number: 3, title: 'Family Status', description: 'Children and dependents' },
        { number: 4, title: 'Guardians', description: 'For minor children' },
        { number: 5, title: 'Executors', description: 'Will administrators' },
        { number: 6, title: 'Beneficiaries', description: 'Who inherits' },
        { number: 7, title: 'Distribution', description: 'How to distribute' },
        { number: 8, title: 'Specific Gifts', description: 'Particular items' },
        { number: 9, title: 'Funeral Wishes', description: 'Final arrangements' },
        { number: 10, title: 'Review', description: 'Confirm details' }
    ];

    const handleNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
        setWillData({
            ...willData,
            personalInfo: { ...willData.personalInfo, [field]: value }
        });
    };

    const addExecutor = () => {
        const newExecutor: Executor = {
            id: Date.now().toString(),
            title: '',
            firstName: '',
            lastName: '',
            relationship: '',
            address: '',
            dateOfBirth: ''
        };
        setWillData({
            ...willData,
            executors: [...willData.executors, newExecutor]
        });
    };

    const addBeneficiary = (type: 'person' | 'charity') => {
        const newBeneficiary: Beneficiary = {
            id: Date.now().toString(),
            type,
            percentage: 0
        };
        setWillData({
            ...willData,
            beneficiaries: [...willData.beneficiaries, newBeneficiary]
        });
    };

    const addGuardian = () => {
        const newGuardian: Guardian = {
            id: Date.now().toString(),
            title: '',
            firstName: '',
            lastName: '',
            relationship: '',
            address: ''
        };
        setWillData({
            ...willData,
            guardians: [...willData.guardians, newGuardian]
        });
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <GettingStartedStep />;
            case 2:
                return (
                    <PersonalDetailsStep
                        data={willData.personalInfo}
                        onChange={updatePersonalInfo}
                    />
                );
            case 3:
                return (
                    <FamilyStatusStep
                        hasChildren={willData.hasChildren}
                        childrenUnder18={willData.childrenUnder18}
                        onChange={(field, value) => setWillData({ ...willData, [field]: value })}
                    />
                );
            case 4:
                return willData.childrenUnder18 ? (
                    <GuardiansStep
                        guardians={willData.guardians}
                        onAdd={addGuardian}
                        onChange={(guardians) => setWillData({ ...willData, guardians })}
                    />
                ) : null;
            case 5:
                return (
                    <ExecutorsStep
                        executors={willData.executors}
                        onAdd={addExecutor}
                        onChange={(executors) => setWillData({ ...willData, executors })}
                    />
                );
            case 6:
                return (
                    <BeneficiariesStep
                        beneficiaries={willData.beneficiaries}
                        onAdd={addBeneficiary}
                        onChange={(beneficiaries) => setWillData({ ...willData, beneficiaries })}
                    />
                );
            case 7:
                return (
                    <DistributionStep
                        distributionType={willData.distributionType}
                        beneficiaries={willData.beneficiaries}
                        onChange={(type) => setWillData({ ...willData, distributionType: type })}
                    />
                );
            case 8:
                return (
                    <SpecificGiftsStep
                        gifts={willData.specificGifts}
                        onChange={(gifts) => setWillData({ ...willData, specificGifts: gifts })}
                    />
                );
            case 9:
                return (
                    <FuneralWishesStep
                        funeralWishes={willData.funeralWishes}
                        burialPreference={willData.burialPreference}
                        additionalWishes={willData.additionalWishes}
                        onChange={(field, value) => setWillData({ ...willData, [field]: value })}
                    />
                );
            case 10:
                return <ReviewStep data={willData} />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-background p-8 font-serif text-(--text-primary)">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-12 text-center">
                <h1 className="text-5xl md:text-6xl font-bold text-primary-700 mb-2 tracking-tight">
                    Create Your Last Will & Testament
                </h1>
                <p className="text-lg max-w-2xl mx-auto text-(--text-secondary)">
                    Protect your loved ones and ensure your wishes are honoured
                </p>
            </div>

            {/* Progress Bar */}
            <div className="max-w-7xl mx-auto mb-8 bg-card rounded-xl p-6 border border-border shadow-(--shadow-card)">
                <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold text-sm tracking-wider text-primary-500">
                        STEP {currentStep} OF {steps.length}
                    </span>
                    <span className="text-sm text-(--text-muted)">
                        {Math.round((currentStep / steps.length) * 100)}% Complete
                    </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                        className="h-full bg-linear-to-r from-primary-500 to-secondary transition-all duration-300 shadow-lg shadow-[rgba(0,84,124,0.25)]"
                        style={{ width: `${(currentStep / steps.length) * 100}%` }}
                    />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-2 mt-6">
                    {steps.map((step) => (
                        <div
                            key={step.number}
                            className={`transition-opacity duration-300 ${step.number === currentStep ? 'opacity-100' : 'opacity-50'
                                }`}
                        >
                            <div className={`text-xs font-semibold ${step.number <= currentStep ? 'text-primary-600' : 'text-(--text-muted)'
                                }`}>
                                {step.title}
                            </div>
                            <div className="text-[10px] text-(--text-muted)">
                                {step.description}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content Card */}
            <div className="max-w-7xl mx-auto bg-card rounded-2xl p-8 md:p-12 shadow-(--shadow-card) border border-border">
                {renderStep()}
            </div>

            {/* Navigation Buttons */}
            <div className="max-w-7xl mx-auto mt-8 flex justify-between gap-4">
                <button
                    onClick={handleBack}
                    disabled={currentStep === 1}
                    className={`px-10 py-4 text-base font-semibold rounded-lg border-2 transition-all duration-300 ${currentStep === 1
                        ? 'border-border text-(--text-muted) bg-muted cursor-not-allowed'
                        : 'border-primary-200 text-primary-700 bg-card hover:bg-muted/60 cursor-pointer'
                        }`}
                >
                    ← Previous
                </button>

                <button
                    onClick={handleNext}
                    disabled={currentStep === steps.length}
                    className={`px-10 py-4 text-base font-semibold rounded-lg transition-all duration-300 ${currentStep === steps.length
                        ? 'bg-muted text-(--text-muted) cursor-not-allowed'
                        : 'bg-linear-to-r from-primary-500 via-primary-400 to-secondary text-primary-foreground hover:-translate-y-0.5 shadow-lg shadow-(--shadow-card) hover:shadow-(--shadow-card) cursor-pointer'
                        }`}
                >
                    {currentStep === steps.length ? 'Complete' : 'Continue →'}
                </button>
            </div>
        </div>
    );
};

// Step Components
const GettingStartedStep: React.FC = () => (
    <div>
        <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Welcome to Your Will Creation Journey
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-8">
            Creating a will is one of the most important steps you can take to protect your loved ones
            and ensure your wishes are respected. This guided process will help you create a legally
            valid Last Will and Testament for the United Kingdom.
        </p>

        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-300 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
                What You'll Need
            </h3>
            <ul className="space-y-3">
                {[
                    'Your full legal name and address',
                    'Names and details of executors (people who will administer your will)',
                    'Names and details of beneficiaries (people who will inherit)',
                    'Details of any specific gifts you wish to make',
                    'Guardian details if you have children under 18',
                    'Your funeral and burial preferences (optional)'
                ].map((item, index) => (
                    <li key={index} className="flex items-start border-b border-slate-200 pb-3 last:border-0 last:pb-0">
                        <span className="text-yellow-600 mr-3 font-bold text-xl flex-shrink-0">✓</span>
                        <span className="text-slate-700">{item}</span>
                    </li>
                ))}
            </ul>
        </div>

        <div className="bg-slate-100 border-l-4 border-slate-900 rounded p-6">
            <p className="text-slate-700 text-sm leading-relaxed">
                <strong className="text-slate-900">Important:</strong> This process will take approximately
                15-20 minutes to complete. You can save your progress at any time and return later to finish.
                All information provided will be kept confidential and secure.
            </p>
        </div>
    </div>
);

interface PersonalDetailsStepProps {
    data: PersonalInfo;
    onChange: (field: keyof PersonalInfo, value: string) => void;
}

const PersonalDetailsStep: React.FC<PersonalDetailsStepProps> = ({ data, onChange }) => (
    <div>
        <h2 className="text-4xl font-bold text-slate-900 mb-2">
            Your Personal Details
        </h2>
        <p className="text-base text-slate-600 mb-8">
            Please provide your full legal name as it appears on official documents
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wider">
                    Title *
                </label>
                <select
                    value={data.title}
                    onChange={(e) => onChange('title', e.target.value)}
                    className="w-full px-4 py-3 text-base border-2 border-slate-200 rounded-lg focus:border-amber-400 focus:outline-none transition-colors"
                >
                    <option value="">Select...</option>
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Miss">Miss</option>
                    <option value="Ms">Ms</option>
                    <option value="Dr">Dr</option>
                    <option value="Rev">Rev</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wider">
                    First Name *
                </label>
                <input
                    type="text"
                    value={data.firstName}
                    onChange={(e) => onChange('firstName', e.target.value)}
                    className="w-full px-4 py-3 text-base border-2 border-slate-200 rounded-lg focus:border-amber-400 focus:outline-none transition-colors"
                    placeholder="Enter first name"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wider">
                    Middle Name(s)
                </label>
                <input
                    type="text"
                    value={data.middleName}
                    onChange={(e) => onChange('middleName', e.target.value)}
                    className="w-full px-4 py-3 text-base border-2 border-slate-200 rounded-lg focus:border-amber-400 focus:outline-none transition-colors"
                    placeholder="Optional"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wider">
                    Last Name *
                </label>
                <input
                    type="text"
                    value={data.lastName}
                    onChange={(e) => onChange('lastName', e.target.value)}
                    className="w-full px-4 py-3 text-base border-2 border-slate-200 rounded-lg focus:border-amber-400 focus:outline-none transition-colors"
                    placeholder="Enter last name"
                />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wider">
                    Date of Birth *
                </label>
                <input
                    type="date"
                    value={data.dateOfBirth}
                    onChange={(e) => onChange('dateOfBirth', e.target.value)}
                    className="w-full px-4 py-3 text-base border-2 border-slate-200 rounded-lg focus:border-amber-400 focus:outline-none transition-colors"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wider">
                    Marital Status *
                </label>
                <select
                    value={data.maritalStatus}
                    onChange={(e) => onChange('maritalStatus', e.target.value)}
                    className="w-full px-4 py-3 text-base border-2 border-slate-200 rounded-lg focus:border-amber-400 focus:outline-none transition-colors"
                >
                    <option value="">Select...</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="civil-partnership">Civil Partnership</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                </select>
            </div>
        </div>

        <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wider">
                Full Address *
            </label>
            <input
                type="text"
                value={data.address}
                onChange={(e) => onChange('address', e.target.value)}
                className="w-full px-4 py-3 text-base border-2 border-slate-200 rounded-lg focus:border-amber-400 focus:outline-none transition-colors"
                placeholder="Street address, building number"
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wider">
                    City/Town *
                </label>
                <input
                    type="text"
                    value={data.city}
                    onChange={(e) => onChange('city', e.target.value)}
                    className="w-full px-4 py-3 text-base border-2 border-slate-200 rounded-lg focus:border-amber-400 focus:outline-none transition-colors"
                    placeholder="Enter city"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wider">
                    Postcode *
                </label>
                <input
                    type="text"
                    value={data.postcode}
                    onChange={(e) => onChange('postcode', e.target.value)}
                    className="w-full px-4 py-3 text-base border-2 border-slate-200 rounded-lg focus:border-amber-400 focus:outline-none transition-colors"
                    placeholder="AB12 3CD"
                />
            </div>
        </div>
    </div>
);

interface FamilyStatusStepProps {
    hasChildren: boolean;
    childrenUnder18: boolean;
    onChange: (field: string, value: boolean) => void;
}

const FamilyStatusStep: React.FC<FamilyStatusStepProps> = ({
    hasChildren,
    childrenUnder18,
    onChange
}) => (
    <div>
        <h2 className="text-4xl font-bold text-slate-900 mb-2">
            Family Information
        </h2>
        <p className="text-base text-slate-600 mb-8">
            Tell us about your family situation to help us customize your will
        </p>

        <div className="bg-slate-50 rounded-xl p-8 mb-8">
            <label className="block text-xl font-semibold text-slate-900 mb-6">
                Do you have any children? *
            </label>

            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={() => onChange('hasChildren', true)}
                    className={`flex-1 p-6 rounded-lg border-2 transition-all duration-300 text-base font-semibold ${hasChildren
                        ? 'border-yellow-500 bg-amber-50 text-slate-900'
                        : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'
                        }`}
                >
                    Yes, I have children
                </button>

                <button
                    onClick={() => {
                        onChange('hasChildren', false);
                        onChange('childrenUnder18', false);
                    }}
                    className={`flex-1 p-6 rounded-lg border-2 transition-all duration-300 text-base font-semibold ${!hasChildren
                        ? 'border-yellow-500 bg-amber-50 text-slate-900'
                        : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'
                        }`}
                >
                    No, I don't have children
                </button>
            </div>
        </div>

        {hasChildren && (
            <div className="bg-slate-50 rounded-xl p-8 animate-fadeIn">
                <label className="block text-xl font-semibold text-slate-900 mb-6">
                    Do you have any children under the age of 18? *
                </label>

                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={() => onChange('childrenUnder18', true)}
                        className={`flex-1 p-6 rounded-lg border-2 transition-all duration-300 text-base font-semibold ${childrenUnder18
                            ? 'border-yellow-500 bg-amber-50 text-slate-900'
                            : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'
                            }`}
                    >
                        Yes
                    </button>

                    <button
                        onClick={() => onChange('childrenUnder18', false)}
                        className={`flex-1 p-6 rounded-lg border-2 transition-all duration-300 text-base font-semibold ${!childrenUnder18
                            ? 'border-yellow-500 bg-amber-50 text-slate-900'
                            : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'
                            }`}
                    >
                        No
                    </button>
                </div>

                {childrenUnder18 && (
                    <div className="mt-6 p-4 bg-amber-50 border-l-4 border-yellow-500 rounded">
                        <p className="text-slate-700 text-sm">
                            You'll need to appoint guardians in the next step to care for your children
                            if something happens to you.
                        </p>
                    </div>
                )}
            </div>
        )}
    </div>
);

interface GuardiansStepProps {
    guardians: Guardian[];
    onAdd: () => void;
    onChange: (guardians: Guardian[]) => void;
}

const GuardiansStep: React.FC<GuardiansStepProps> = ({ guardians, onAdd, onChange }) => {
    const updateGuardian = (index: number, field: keyof Guardian, value: string) => {
        const updated = [...guardians];
        updated[index] = { ...updated[index], [field]: value };
        onChange(updated);
    };

    const removeGuardian = (index: number) => {
        onChange(guardians.filter((_, i) => i !== index));
    };

    return (
        <div>
            <h2 className="text-4xl font-bold text-slate-900 mb-2">
                Appoint Guardians
            </h2>
            <p className="text-base text-slate-600 mb-8">
                Choose trusted individuals to care for your children if you pass away before they turn 18
            </p>

            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-300 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                    Important Information About Guardians
                </h3>
                <ul className="space-y-2 text-slate-700 leading-relaxed pl-6 list-disc">
                    <li>Guardians should be over 18 years old</li>
                    <li>Consider appointing alternate guardians in case your first choice is unable to serve</li>
                    <li>It's wise to discuss this responsibility with the person beforehand</li>
                    <li>You can appoint a couple as joint guardians</li>
                </ul>
            </div>

            {guardians.map((guardian, index) => (
                <div key={guardian.id} className="bg-slate-50 rounded-xl p-8 mb-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold text-slate-900">
                            Guardian {index + 1} {index === 0 ? '(Primary)' : '(Alternate)'}
                        </h3>
                        {guardians.length > 1 && (
                            <button
                                onClick={() => removeGuardian(index)}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
                            >
                                Remove
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wider">
                                Title *
                            </label>
                            <select
                                value={guardian.title}
                                onChange={(e) => updateGuardian(index, 'title', e.target.value)}
                                className="w-full px-4 py-3 text-base border-2 border-slate-200 rounded-lg focus:border-amber-400 focus:outline-none transition-colors"
                            >
                                <option value="">Select...</option>
                                <option value="Mr">Mr</option>
                                <option value="Mrs">Mrs</option>
                                <option value="Miss">Miss</option>
                                <option value="Ms">Ms</option>
                                <option value="Dr">Dr</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wider">
                                First Name *
                            </label>
                            <input
                                type="text"
                                value={guardian.firstName}
                                onChange={(e) => updateGuardian(index, 'firstName', e.target.value)}
                                className="w-full px-4 py-3 text-base border-2 border-slate-200 rounded-lg focus:border-amber-400 focus:outline-none transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wider">
                                Last Name *
                            </label>
                            <input
                                type="text"
                                value={guardian.lastName}
                                onChange={(e) => updateGuardian(index, 'lastName', e.target.value)}
                                className="w-full px-4 py-3 text-base border-2 border-slate-200 rounded-lg focus:border-amber-400 focus:outline-none transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wider">
                                Relationship *
                            </label>
                            <input
                                type="text"
                                value={guardian.relationship}
                                onChange={(e) => updateGuardian(index, 'relationship', e.target.value)}
                                className="w-full px-4 py-3 text-base border-2 border-slate-200 rounded-lg focus:border-amber-400 focus:outline-none transition-colors"
                                placeholder="e.g., Brother, Sister, Friend"
                            />
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="block text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wider">
                            Address *
                        </label>
                        <input
                            type="text"
                            value={guardian.address}
                            onChange={(e) => updateGuardian(index, 'address', e.target.value)}
                            className="w-full px-4 py-3 text-base border-2 border-slate-200 rounded-lg focus:border-amber-400 focus:outline-none transition-colors"
                            placeholder="Full address"
                        />
                    </div>
                </div>
            ))}

            <button
                onClick={onAdd}
                className="w-full py-5 bg-transparent border-2 border-dashed border-yellow-500 rounded-lg text-yellow-600 text-base font-semibold hover:bg-yellow-50 transition-all duration-300"
            >
                + Add Another Guardian
            </button>
        </div>
    );
};

interface ExecutorsStepProps {
    executors: Executor[];
    onAdd: () => void;
    onChange: (executors: Executor[]) => void;
}

const ExecutorsStep: React.FC<ExecutorsStepProps> = ({ executors, onAdd, onChange }) => {
    const updateExecutor = (index: number, field: keyof Executor, value: string) => {
        const updated = [...executors];
        updated[index] = { ...updated[index], [field]: value };
        onChange(updated);
    };

    const removeExecutor = (index: number) => {
        onChange(executors.filter((_, i) => i !== index));
    };

    return (
        <div>
            <h2 className="text-4xl font-bold text-slate-900 mb-2">
                Appoint Your Executors
            </h2>
            <p className="text-base text-slate-600 mb-8">
                Executors are responsible for carrying out the instructions in your will
            </p>

            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-300 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                    What Do Executors Do?
                </h3>
                <p className="text-slate-700 leading-relaxed mb-4">
                    Executors handle the legal and financial matters of your estate, including:
                </p>
                <ul className="space-y-2 text-slate-700 leading-relaxed pl-6 list-disc">
                    <li>Applying for probate</li>
                    <li>Collecting and valuing assets</li>
                    <li>Paying debts and taxes</li>
                    <li>Distributing the estate to beneficiaries</li>
                </ul>
            </div>

            {executors.map((executor, index) => (
                <div key={executor.id} className="bg-slate-50 rounded-xl p-8 mb-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold text-slate-900">
                            Executor {index + 1} {index === 0 ? '(Primary)' : '(Alternate)'}
                        </h3>
                        {executors.length > 1 && (
                            <button
                                onClick={() => removeExecutor(index)}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
                            >
                                Remove
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wider">
                                Title *
                            </label>
                            <select
                                value={executor.title}
                                onChange={(e) => updateExecutor(index, 'title', e.target.value)}
                                className="w-full px-4 py-3 text-base border-2 border-slate-200 rounded-lg focus:border-amber-400 focus:outline-none transition-colors"
                            >
                                <option value="">Select...</option>
                                <option value="Mr">Mr</option>
                                <option value="Mrs">Mrs</option>
                                <option value="Miss">Miss</option>
                                <option value="Ms">Ms</option>
                                <option value="Dr">Dr</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wider">
                                First Name *
                            </label>
                            <input
                                type="text"
                                value={executor.firstName}
                                onChange={(e) => updateExecutor(index, 'firstName', e.target.value)}
                                className="w-full px-4 py-3 text-base border-2 border-slate-200 rounded-lg focus:border-amber-400 focus:outline-none transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wider">
                                Last Name *
                            </label>
                            <input
                                type="text"
                                value={executor.lastName}
                                onChange={(e) => updateExecutor(index, 'lastName', e.target.value)}
                                className="w-full px-4 py-3 text-base border-2 border-slate-200 rounded-lg focus:border-amber-400 focus:outline-none transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wider">
                                Relationship *
                            </label>
                            <input
                                type="text"
                                value={executor.relationship}
                                onChange={(e) => updateExecutor(index, 'relationship', e.target.value)}
                                className="w-full px-4 py-3 text-base border-2 border-slate-200 rounded-lg focus:border-amber-400 focus:outline-none transition-colors"
                                placeholder="e.g., Spouse, Son, Friend"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wider">
                                Address *
                            </label>
                            <input
                                type="text"
                                value={executor.address}
                                onChange={(e) => updateExecutor(index, 'address', e.target.value)}
                                className="w-full px-4 py-3 text-base border-2 border-slate-200 rounded-lg focus:border-amber-400 focus:outline-none transition-colors"
                                placeholder="Full address"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wider">
                                Date of Birth *
                            </label>
                            <input
                                type="date"
                                value={executor.dateOfBirth}
                                onChange={(e) => updateExecutor(index, 'dateOfBirth', e.target.value)}
                                className="w-full px-4 py-3 text-base border-2 border-slate-200 rounded-lg focus:border-amber-400 focus:outline-none transition-colors"
                            />
                        </div>
                    </div>
                </div>
            ))}

            <button
                onClick={onAdd}
                className="w-full py-5 bg-transparent border-2 border-dashed border-yellow-500 rounded-lg text-yellow-600 text-base font-semibold hover:bg-yellow-50 transition-all duration-300"
            >
                + Add Another Executor
            </button>

            <div className="mt-8 p-4 bg-slate-100 border-l-4 border-slate-900 rounded">
                <p className="text-slate-700 text-sm">
                    <strong>Tip:</strong> It's recommended to appoint at least one alternate executor
                    in case your primary executor is unable or unwilling to serve.
                </p>
            </div>
        </div>
    );
};

interface BeneficiariesStepProps {
    beneficiaries: Beneficiary[];
    onAdd: (type: 'person' | 'charity') => void;
    onChange: (beneficiaries: Beneficiary[]) => void;
}

const BeneficiariesStep: React.FC<BeneficiariesStepProps> = ({
    beneficiaries,
    onAdd,
    onChange
}) => {
    const updateBeneficiary = (index: number, field: keyof Beneficiary, value: any) => {
        const updated = [...beneficiaries];
        updated[index] = { ...updated[index], [field]: value };
        onChange(updated);
    };

    const removeBeneficiary = (index: number) => {
        onChange(beneficiaries.filter((_, i) => i !== index));
    };

    return (
        <div>
            <h2 className="text-4xl font-bold text-slate-900 mb-2">
                Choose Your Beneficiaries
            </h2>
            <p className="text-base text-slate-600 mb-8">
                Beneficiaries are the people or organizations who will inherit from your estate
            </p>

            {beneficiaries.map((beneficiary, index) => (
                <div key={beneficiary.id} className="bg-slate-50 rounded-xl p-8 mb-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold text-slate-900">
                            Beneficiary {index + 1} - {beneficiary.type === 'person' ? 'Individual' : 'Charity'}
                        </h3>
                        <button
                            onClick={() => removeBeneficiary(index)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
                        >
                            Remove
                        </button>
                    </div>

                    {beneficiary.type === 'person' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wider">
                                    Title *
                                </label>
                                <select
                                    value={beneficiary.title || ''}
                                    onChange={(e) => updateBeneficiary(index, 'title', e.target.value)}
                                    className="w-full px-4 py-3 text-base border-2 border-slate-200 rounded-lg focus:border-amber-400 focus:outline-none transition-colors"
                                >
                                    <option value="">Select...</option>
                                    <option value="Mr">Mr</option>
                                    <option value="Mrs">Mrs</option>
                                    <option value="Miss">Miss</option>
                                    <option value="Ms">Ms</option>
                                    <option value="Dr">Dr</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wider">
                                    First Name *
                                </label>
                                <input
                                    type="text"
                                    value={beneficiary.firstName || ''}
                                    onChange={(e) => updateBeneficiary(index, 'firstName', e.target.value)}
                                    className="w-full px-4 py-3 text-base border-2 border-slate-200 rounded-lg focus:border-amber-400 focus:outline-none transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wider">
                                    Last Name *
                                </label>
                                <input
                                    type="text"
                                    value={beneficiary.lastName || ''}
                                    onChange={(e) => updateBeneficiary(index, 'lastName', e.target.value)}
                                    className="w-full px-4 py-3 text-base border-2 border-slate-200 rounded-lg focus:border-amber-400 focus:outline-none transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wider">
                                    Relationship *
                                </label>
                                <input
                                    type="text"
                                    value={beneficiary.relationship || ''}
                                    onChange={(e) => updateBeneficiary(index, 'relationship', e.target.value)}
                                    className="w-full px-4 py-3 text-base border-2 border-slate-200 rounded-lg focus:border-amber-400 focus:outline-none transition-colors"
                                    placeholder="e.g., Daughter, Son, Friend"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wider">
                                    Charity Name *
                                </label>
                                <input
                                    type="text"
                                    value={beneficiary.charityName || ''}
                                    onChange={(e) => updateBeneficiary(index, 'charityName', e.target.value)}
                                    className="w-full px-4 py-3 text-base border-2 border-slate-200 rounded-lg focus:border-amber-400 focus:outline-none transition-colors"
                                    placeholder="Full charity name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wider">
                                    Charity Number *
                                </label>
                                <input
                                    type="text"
                                    value={beneficiary.charityNumber || ''}
                                    onChange={(e) => updateBeneficiary(index, 'charityNumber', e.target.value)}
                                    className="w-full px-4 py-3 text-base border-2 border-slate-200 rounded-lg focus:border-amber-400 focus:outline-none transition-colors"
                                    placeholder="UK charity number"
                                />
                            </div>
                        </div>
                    )}
                </div>
            ))}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                    onClick={() => onAdd('person')}
                    className="py-5 bg-transparent border-2 border-dashed border-yellow-500 rounded-lg text-yellow-600 text-base font-semibold hover:bg-yellow-50 transition-all duration-300"
                >
                    + Add Person
                </button>

                <button
                    onClick={() => onAdd('charity')}
                    className="py-5 bg-transparent border-2 border-dashed border-slate-900 rounded-lg text-slate-900 text-base font-semibold hover:bg-slate-100 transition-all duration-300"
                >
                    + Add Charity
                </button>
            </div>
        </div>
    );
};

interface DistributionStepProps {
    distributionType: 'percentage' | 'specific' | 'residuary';
    beneficiaries: Beneficiary[];
    onChange: (type: 'percentage' | 'specific' | 'residuary') => void;
}

const DistributionStep: React.FC<DistributionStepProps> = ({
    distributionType,
    beneficiaries,
    onChange
}) => (
    <div>
        <h2 className="text-4xl font-bold text-slate-900 mb-2">
            How to Distribute Your Estate
        </h2>
        <p className="text-base text-slate-600 mb-8">
            Choose how you'd like your estate to be distributed among your beneficiaries
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <button
                onClick={() => onChange('percentage')}
                className={`p-8 rounded-xl border-2 transition-all duration-300 text-left ${distributionType === 'percentage'
                    ? 'border-yellow-500 bg-amber-50'
                    : 'border-slate-300 bg-white hover:border-slate-400'
                    }`}
            >
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    Percentage Distribution
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                    Divide your estate by percentages (e.g., 50% to spouse, 25% to each child)
                </p>
            </button>

            <button
                onClick={() => onChange('specific')}
                className={`p-8 rounded-xl border-2 transition-all duration-300 text-left ${distributionType === 'specific'
                    ? 'border-yellow-500 bg-amber-50'
                    : 'border-slate-300 bg-white hover:border-slate-400'
                    }`}
            >
                <div className="text-4xl mb-4">🎁</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    Specific Gifts
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                    Leave specific items or amounts to named beneficiaries (e.g., jewelry, £10,000)
                </p>
            </button>

            <button
                onClick={() => onChange('residuary')}
                className={`p-8 rounded-xl border-2 transition-all duration-300 text-left ${distributionType === 'residuary'
                    ? 'border-yellow-500 bg-amber-50'
                    : 'border-slate-300 bg-white hover:border-slate-400'
                    }`}
            >
                <div className="text-4xl mb-4">💼</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    Residuary Estate
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                    Everything left after debts and specific gifts goes to named beneficiaries
                </p>
            </button>
        </div>

        {distributionType === 'percentage' && beneficiaries.length > 0 && (
            <div className="bg-slate-50 rounded-xl p-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-6">
                    Assign Percentages
                </h3>
                <div className="space-y-4">
                    {beneficiaries.map((beneficiary) => (
                        <div
                            key={beneficiary.id}
                            className="flex justify-between items-center p-4 bg-white rounded-lg"
                        >
                            <span className="text-slate-700 font-medium">
                                {beneficiary.type === 'person'
                                    ? `${beneficiary.firstName} ${beneficiary.lastName}`
                                    : beneficiary.charityName}
                            </span>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={beneficiary.percentage || 0}
                                    className="w-20 px-3 py-2 border-2 border-slate-200 rounded-lg text-center text-base focus:border-amber-400 focus:outline-none"
                                />
                                <span className="text-slate-600 font-semibold">%</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-6 p-4 bg-white rounded-lg flex justify-between items-center border-t-2 border-yellow-500">
                    <span className="text-slate-900 font-bold text-lg">
                        Total
                    </span>
                    <span className="text-yellow-600 font-bold text-2xl">
                        {beneficiaries.reduce((sum, b) => sum + (b.percentage || 0), 0)}%
                    </span>
                </div>
            </div>
        )}
    </div>
);

interface SpecificGiftsStepProps {
    gifts: Array<{ item: string; recipient: string }>;
    onChange: (gifts: Array<{ item: string; recipient: string }>) => void;
}

const SpecificGiftsStep: React.FC<SpecificGiftsStepProps> = ({ gifts, onChange }) => {
    const addGift = () => {
        onChange([...gifts, { item: '', recipient: '' }]);
    };

    const updateGift = (index: number, field: 'item' | 'recipient', value: string) => {
        const updated = [...gifts];
        updated[index] = { ...updated[index], [field]: value };
        onChange(updated);
    };

    const removeGift = (index: number) => {
        onChange(gifts.filter((_, i) => i !== index));
    };

    return (
        <div>
            <h2 className="text-4xl font-bold text-slate-900 mb-2">
                Specific Gifts (Optional)
            </h2>
            <p className="text-base text-slate-600 mb-8">
                Leave particular items or amounts of money to specific people or organizations
            </p>

            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-300 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                    Examples of Specific Gifts
                </h3>
                <ul className="space-y-2 text-slate-700 leading-relaxed pl-6 list-disc">
                    <li>My engagement ring to my daughter Sarah</li>
                    <li>£5,000 to my nephew James for his education</li>
                    <li>My vintage car collection to my brother Michael</li>
                    <li>My shares in ABC Company to my business partner</li>
                </ul>
            </div>

            {gifts.map((gift, index) => (
                <div key={index} className="bg-slate-50 rounded-xl p-8 mb-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold text-slate-900">
                            Gift {index + 1}
                        </h3>
                        <button
                            onClick={() => removeGift(index)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
                        >
                            Remove
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wider">
                                Item or Amount *
                            </label>
                            <input
                                type="text"
                                value={gift.item}
                                onChange={(e) => updateGift(index, 'item', e.target.value)}
                                className="w-full px-4 py-3 text-base border-2 border-slate-200 rounded-lg focus:border-amber-400 focus:outline-none transition-colors"
                                placeholder="e.g., My gold watch, £10,000, My property at..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wider">
                                Recipient *
                            </label>
                            <input
                                type="text"
                                value={gift.recipient}
                                onChange={(e) => updateGift(index, 'recipient', e.target.value)}
                                className="w-full px-4 py-3 text-base border-2 border-slate-200 rounded-lg focus:border-amber-400 focus:outline-none transition-colors"
                                placeholder="Full name"
                            />
                        </div>
                    </div>
                </div>
            ))}

            <button
                onClick={addGift}
                className="w-full py-5 bg-transparent border-2 border-dashed border-yellow-500 rounded-lg text-yellow-600 text-base font-semibold hover:bg-yellow-50 transition-all duration-300"
            >
                + Add Specific Gift
            </button>

            <div className="mt-8 p-4 bg-slate-100 border-l-4 border-slate-900 rounded">
                <p className="text-slate-700 text-sm">
                    <strong>Note:</strong> If you don't wish to leave any specific gifts, you can skip
                    this step. Your entire estate will be distributed according to your chosen distribution method.
                </p>
            </div>
        </div>
    );
};

interface FuneralWishesStepProps {
    funeralWishes: string;
    burialPreference: string;
    additionalWishes: string;
    onChange: (field: string, value: string) => void;
}

const FuneralWishesStep: React.FC<FuneralWishesStepProps> = ({
    funeralWishes,
    burialPreference,
    additionalWishes,
    onChange
}) => (
    <div>
        <h2 className="text-4xl font-bold text-slate-900 mb-2">
            Funeral and Burial Wishes
        </h2>
        <p className="text-base text-slate-600 mb-8">
            Share your preferences for funeral arrangements (optional but helpful for your loved ones)
        </p>

        <div className="mb-8">
            <label className="block text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider">
                Burial or Cremation Preference
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {['Burial', 'Cremation', 'Donate to Science', 'No Preference'].map((option) => (
                    <button
                        key={option}
                        onClick={() => onChange('burialPreference', option)}
                        className={`p-5 rounded-lg border-2 transition-all duration-300 text-base font-semibold ${burialPreference === option
                            ? 'border-yellow-500 bg-amber-50 text-slate-900'
                            : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'
                            }`}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>

        <div className="mb-8">
            <label className="block text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wider">
                Funeral Service Preferences
            </label>
            <textarea
                value={funeralWishes}
                onChange={(e) => onChange('funeralWishes', e.target.value)}
                className="w-full px-4 py-3 text-base border-2 border-slate-200 rounded-lg focus:border-amber-400 focus:outline-none transition-colors min-h-[120px] resize-y"
                placeholder="e.g., I would like a small, intimate ceremony with close family and friends. I prefer hymns X, Y, and Z to be played..."
            />
        </div>

        <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wider">
                Additional Wishes
            </label>
            <textarea
                value={additionalWishes}
                onChange={(e) => onChange('additionalWishes', e.target.value)}
                className="w-full px-4 py-3 text-base border-2 border-slate-200 rounded-lg focus:border-amber-400 focus:outline-none transition-colors min-h-[120px] resize-y"
                placeholder="Any other wishes or instructions you'd like to include (location preferences, charitable donations in lieu of flowers, etc.)"
            />
        </div>

        <div className="mt-8 p-4 bg-slate-100 border-l-4 border-slate-900 rounded">
            <p className="text-slate-700 text-sm">
                <strong>Privacy Note:</strong> These wishes are included in your will and will become
                public record after probate. Avoid including highly personal or sensitive information.
            </p>
        </div>
    </div>
);

interface ReviewStepProps {
    data: WillData;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ data }) => (
    <div>
        <h2 className="text-4xl font-bold text-slate-900 mb-2">
            Review Your Will
        </h2>
        <p className="text-base text-slate-600 mb-8">
            Please review all the information you've provided before finalizing your will
        </p>

        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-300 rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-semibold text-slate-900 mb-6">
                Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <ReviewItem
                    label="Name"
                    value={`${data.personalInfo.title} ${data.personalInfo.firstName} ${data.personalInfo.middleName} ${data.personalInfo.lastName}`}
                />
                <ReviewItem label="Date of Birth" value={data.personalInfo.dateOfBirth} />
                <ReviewItem label="Marital Status" value={data.personalInfo.maritalStatus} />
                <ReviewItem
                    label="Address"
                    value={`${data.personalInfo.address}, ${data.personalInfo.city}, ${data.personalInfo.postcode}`}
                />
            </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-semibold text-slate-900 mb-6">
                Executors ({data.executors.length})
            </h3>
            <div className="space-y-3">
                {data.executors.map((executor, index) => (
                    <div key={executor.id} className="p-4 bg-white rounded-lg">
                        <strong>{index + 1}.</strong> {executor.title} {executor.firstName} {executor.lastName} - {executor.relationship}
                    </div>
                ))}
            </div>
        </div>

        {data.guardians.length > 0 && (
            <div className="bg-slate-50 rounded-xl p-8 mb-8">
                <h3 className="text-2xl font-semibold text-slate-900 mb-6">
                    Guardians ({data.guardians.length})
                </h3>
                <div className="space-y-3">
                    {data.guardians.map((guardian, index) => (
                        <div key={guardian.id} className="p-4 bg-white rounded-lg">
                            <strong>{index + 1}.</strong> {guardian.title} {guardian.firstName} {guardian.lastName} - {guardian.relationship}
                        </div>
                    ))}
                </div>
            </div>
        )}

        <div className="bg-slate-50 rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-semibold text-slate-900 mb-6">
                Beneficiaries ({data.beneficiaries.length})
            </h3>
            <div className="space-y-3">
                {data.beneficiaries.map((beneficiary, index) => (
                    <div key={beneficiary.id} className="p-4 bg-white rounded-lg flex justify-between items-center">
                        <span>
                            <strong>{index + 1}.</strong>{' '}
                            {beneficiary.type === 'person'
                                ? `${beneficiary.firstName} ${beneficiary.lastName} - ${beneficiary.relationship}`
                                : `${beneficiary.charityName} (${beneficiary.charityNumber})`}
                        </span>
                        {beneficiary.percentage && (
                            <span className="px-3 py-1 bg-yellow-500 text-white rounded-full text-sm font-semibold">
                                {beneficiary.percentage}%
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>

        <div className="bg-amber-50 border-2 border-yellow-500 rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Next Steps
            </h3>
            <p className="text-slate-700 leading-relaxed mb-6">
                Once you're satisfied with the information, you can generate your will document.
                Remember to sign it in the presence of two witnesses who are not beneficiaries.
            </p>
            <button className="px-12 py-4 bg-gradient-to-r from-amber-300 to-yellow-500 text-slate-900 rounded-lg text-lg font-bold shadow-lg shadow-amber-500/40 hover:-translate-y-0.5 hover:shadow-amber-500/60 transition-all duration-300">
                Generate Will Document
            </button>
        </div>
    </div>
);

const ReviewItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div>
        <div className="text-xs text-slate-500 font-semibold mb-1 uppercase tracking-wider">
            {label}
        </div>
        <div className="text-base text-slate-800 font-medium">
            {value || 'Not provided'}
        </div>
    </div>
);

export default WillCreationWizard;