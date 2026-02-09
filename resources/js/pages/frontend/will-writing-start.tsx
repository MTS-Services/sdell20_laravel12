import React, { useState } from 'react';
import { Users, FileText, Clock, User, Heart } from 'lucide-react';
import StepsHeader from '@/components/frontend/will/steps-header';

type MaritalStatus = 'single' | 'married' | 'civil-partner' | '';

interface PersonalInfo {
    title: string;
    firstName: string;
    middleName: string;
    lastName: string;
    dateOfBirth: string;
    maritalStatus: MaritalStatus;
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

const WIZARD_STEPS = [
    { key: 'get-started', title: 'Get Started' },
    { key: 'executor', title: 'Executor' },
    { key: 'children', title: 'Children' },
    { key: 'gifts', title: 'Gifts' },
    { key: 'remainder', title: 'Remainder' },
    { key: 'final-details', title: 'Final Details' },
    { key: 'signing', title: 'Signing' },
    { key: 'print-download', title: 'Print/Download' },
];

const MaritalStatusCard: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: MaritalStatus;
    selected: boolean;
    onSelect: (value: MaritalStatus) => void;
}> = ({ icon, label, value, selected, onSelect }) => (
    <button
        type="button"
        onClick={() => onSelect(value)}
        className={`flex flex-col items-center justify-center w-28 h-28 rounded border-2 transition-all duration-200 cursor-pointer ${selected
            ? 'border-secondary bg-white'
            : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
    >
        <div className={`mb-2 ${selected ? 'text-secondary' : 'text-slate-600'}`}>
            {icon}
        </div>
        <span className={`text-xs font-normal ${selected ? 'text-secondary' : 'text-slate-600'}`}>
            {label}
        </span>
    </button>
);

const WillCreationWizard: React.FC = () => {
    const [phase, setPhase] = useState<'landing' | 'wizard'>('landing');
    const [currentStep, setCurrentStep] = useState(0);
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

    const handleCreateDocument = () => {
        if (willData.personalInfo.maritalStatus) {
            setPhase('wizard');
            setCurrentStep(0);
        }
    };

    const handleSaveAndContinue = () => {
        if (currentStep < WIZARD_STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        } else {
            setPhase('landing');
        }
    };

    const handleSkip = () => {
        if (currentStep < WIZARD_STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const progressPercent = ((currentStep + 1) / WIZARD_STEPS.length) * 100;

    const renderWizardStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <GetStartedStep
                        personalInfo={willData.personalInfo}
                        onChange={updatePersonalInfo}
                    />
                );
            case 1:
                return (
                    <ExecutorsStep
                        executors={willData.executors}
                        onAdd={addExecutor}
                        onChange={(executors) => setWillData({ ...willData, executors })}
                    />
                );
            case 2:
                return (
                    <ChildrenStep
                        hasChildren={willData.hasChildren}
                        childrenUnder18={willData.childrenUnder18}
                        guardians={willData.guardians}
                        onChangeField={(field, value) => setWillData({ ...willData, [field]: value })}
                        onAddGuardian={addGuardian}
                        onChangeGuardians={(guardians) => setWillData({ ...willData, guardians })}
                    />
                );
            case 3:
                return (
                    <GiftsStep
                        gifts={willData.specificGifts}
                        onChange={(gifts) => setWillData({ ...willData, specificGifts: gifts })}
                    />
                );
            case 4:
                return (
                    <RemainderStep
                        distributionType={willData.distributionType}
                        beneficiaries={willData.beneficiaries}
                        onChangeType={(type) => setWillData({ ...willData, distributionType: type })}
                        onAddBeneficiary={addBeneficiary}
                        onChangeBeneficiaries={(beneficiaries) => setWillData({ ...willData, beneficiaries })}
                    />
                );
            case 5:
                return (
                    <FinalDetailsStep
                        data={willData.personalInfo}
                        funeralWishes={willData.funeralWishes}
                        burialPreference={willData.burialPreference}
                        additionalWishes={willData.additionalWishes}
                        onChange={updatePersonalInfo}
                        onChangeWishes={(field, value) => setWillData({ ...willData, [field]: value })}
                    />
                );
            case 6:
                return <SigningStep />;
            case 7:
                return <PrintDownloadStep data={willData} />;
            default:
                return null;
        }
    };

    // ── PHASE 1: LANDING PAGE ──
    if (phase === 'landing') {
        return (
            <div className="min-h-screen bg-primary-50 font-sans">
                <StepsHeader />

                {/* Dark Header */}
                <div className="bg-slate-700 px-4 py-14">
                    <div className="max-w-5xl mx-auto text-center">
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-10 leading-tight">
                            Free Last Will and Testament
                        </h1>
                        <div className="flex flex-wrap justify-center gap-12 md:gap-20">
                            <div className="flex items-center gap-3 text-white">
                                <FileText className="w-14 h-14 text-white/70 shrink-0" />
                                <span className="text-sm  md:text-base lg:text-lg leading-snug text-left">Answer a few simple<br />questions</span>
                            </div>
                            <div className="flex items-center gap-3 text-white">
                                <FileText className="w-14 h-14 text-white/70 shrink-0" />
                                <span className="text-sm  md:text-base lg:text-lg leading-snug text-left">Print and download<br />instantly</span>
                            </div>
                            <div className="flex items-center gap-3 text-white">
                                <Clock className="w-14 h-14 text-white/70 shrink-0" />
                                <span className="text-sm  md:text-base lg:text-lg leading-snug text-left">It takes just 5<br />minutes</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="max-w-3xl mx-auto mt-8 bg-card rounded shadow-sm border border-border px-10 py-10 md:px-14">
                    <h2 className="text-2xl md:text-3xl font-semibold text-slate-700 mb-8">
                        What is your marital status?
                    </h2>

                    <div className="flex flex-wrap gap-5 mb-10">
                        <MaritalStatusCard
                            icon={<User className="w-10 h-10" />}
                            label="Single"
                            value="single"
                            selected={willData.personalInfo.maritalStatus === 'single'}
                            onSelect={(v) => updatePersonalInfo('maritalStatus', v)}
                        />
                        <MaritalStatusCard
                            icon={<Users className="w-10 h-10" />}
                            label="Married"
                            value="married"
                            selected={willData.personalInfo.maritalStatus === 'married'}
                            onSelect={(v) => updatePersonalInfo('maritalStatus', v)}
                        />
                        <MaritalStatusCard
                            icon={<Heart className="w-10 h-10" />}
                            label="Civil Partner"
                            value="civil-partner"
                            selected={willData.personalInfo.maritalStatus === 'civil-partner'}
                            onSelect={(v) => updatePersonalInfo('maritalStatus', v)}
                        />
                    </div>

                    <button
                        type="button"
                        onClick={handleCreateDocument}
                        disabled={!willData.personalInfo.maritalStatus}
                        className={`px-7 py-2.5 rounded text-sm font-bold uppercase tracking-wide transition-all duration-200 ${willData.personalInfo.maritalStatus
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer'
                            : 'bg-muted text-muted-foreground cursor-not-allowed'
                            }`}
                    >
                        CREATE MY DOCUMENT
                    </button>
                </div>
            </div>
        );
    }

    // ── PHASE 2: WIZARD ──
    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            <StepsHeader />

            {/* Dark Header with Step Navigation */}
            <div className="bg-slate-700">
                <div className="max-w-5xl mx-auto px-4 py-10 lg:py-14">
                    <h1 className="text-lg md:text-xl lg:text-2xl font-semibold text-white uppercase tracking-wider mb-6">
                        FREE LAST WILL AND TESTAMENT
                    </h1>

                    {/* Step Tabs */}
                    <div className="flex flex-wrap gap-2.5">
                        {WIZARD_STEPS.map((step, index) => (
                            <button
                                key={step.key}
                                type="button"
                                onClick={() => setCurrentStep(index)}
                                className={`px-3 py-2 text-sm md:text-base lg:text-lg font-normal transition-colors duration-200 cursor-pointer ${index === currentStep
                                    ? 'text-white'
                                    : 'text-white/60 hover:text-white/80'
                                    }`}
                            >
                                {step.title}
                            </button>
                        ))}
                    </div>
                    {/* Progress Bar */}
                    <div className="h-3.5 mt-3 bg-slate-800">
                        <div
                            className="h-full bg-primary-200 transition-all duration-500"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>

            </div>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto px-4 py-12 md:px-8">
                {renderWizardStepContent()}

                {/* Action Buttons */}
                <div className="mt-10 flex items-center gap-4">
                    <button
                        type="button"
                        onClick={handleBack}
                        className="px-6 py-2.5 rounded border border-slate-300 bg-slate-100 text-slate-700 text-sm font-semibold uppercase tracking-wide hover:bg-slate-200 transition-colors duration-200 cursor-pointer"
                    >
                        BACK
                    </button>
                    <button
                        type="button"
                        onClick={handleSaveAndContinue}
                        className="px-8 py-2.5 bg-emerald-600 text-white rounded font-bold text-sm uppercase tracking-wide hover:bg-emerald-700 transition-colors duration-200 cursor-pointer"
                    >
                        SAVE AND CONTINUE
                    </button>
                    <button
                        type="button"
                        onClick={handleSkip}
                        className="text-secondary text-sm font-medium hover:text-secondary/80 transition-colors cursor-pointer bg-transparent border-none"
                    >
                        Skip this step for now
                    </button>
                </div>
            </div>
        </div>
    );
};

// ── WIZARD STEP COMPONENTS ──

const INPUT_CLASS = 'w-full px-4 py-3 text-base border border-border rounded focus:border-secondary focus:outline-none transition-colors bg-white';
const LABEL_CLASS = 'block text-sm font-medium text-slate-600 mb-2';

const GetStartedStep: React.FC<{
    personalInfo: PersonalInfo;
    onChange: (field: keyof PersonalInfo, value: string) => void;
}> = ({ personalInfo, onChange }) => (
    <div>
        <h2 className="text-2xl md:text-3xl font-normal text-slate-900 mb-8">
            Your Details
        </h2>
        <p className="text-sm md:text-base lg:text-lg text-slate-800 mb-8">
            Who is this Last Will being created for?
        </p>

        <div className="space-y-6 max-w-md">
            <div>
                <label className="block text-sm md:text-base text-secondary mb-1">Full Name:</label>
                <input
                    type="text"
                    value={`${personalInfo.firstName}${personalInfo.middleName ? ' ' + personalInfo.middleName : ''}${personalInfo.lastName ? ' ' + personalInfo.lastName : ''}`}
                    onChange={(e) => {
                        const parts = e.target.value.split(' ');
                        onChange('firstName', parts[0] || '');
                        onChange('middleName', parts.length > 2 ? parts.slice(1, -1).join(' ') : '');
                        onChange('lastName', parts.length > 1 ? parts[parts.length - 1] : '');
                    }}
                    className="w-full border-b border-slate-300 bg-transparent py-2 text-base text-slate-800 placeholder-slate-400 focus:border-secondary focus:outline-none transition-colors"
                    placeholder="e.g. William Timothy Smith"
                />
            </div>

            <div>
                <label className="block text-sm md:text-base text-secondary mb-1">City/Town:</label>
                <input
                    type="text"
                    value={personalInfo.city}
                    onChange={(e) => onChange('city', e.target.value)}
                    className="w-full border-b border-slate-300 bg-transparent py-2 text-base text-slate-800 placeholder-slate-400 focus:border-secondary focus:outline-none transition-colors"
                    placeholder="e.g. London"
                />
            </div>

            <div>
                <label className="block text-sm md:text-base text-secondary mb-1">Country:</label>
                <select
                    value={personalInfo.country}
                    onChange={(e) => onChange('country', e.target.value)}
                    className="w-full border-b border-slate-300 bg-transparent py-2 text-base text-slate-800 focus:border-secondary focus:outline-none transition-colors cursor-pointer"
                >
                    <option value="England">England</option>
                    <option value="Wales">Wales</option>
                    <option value="Scotland">Scotland</option>
                    <option value="Northern Ireland">Northern Ireland</option>
                    <option value="United Kingdom">United Kingdom</option>
                </select>
            </div>
        </div>
    </div>
);

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
            <h2 className="text-2xl md:text-3xl font-normal text-slate-700 mb-4">
                Appoint Your Executors
            </h2>
            <p className="text-sm text-slate-500 mb-8">
                Executors are responsible for carrying out the instructions in your will.
            </p>

            {executors.map((executor, index) => (
                <div key={executor.id} className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-base font-semibold text-slate-700">
                            Executor {index + 1}
                        </h3>
                        {executors.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeExecutor(index)}
                                className="text-red-500 text-sm hover:text-red-700 cursor-pointer"
                            >
                                Remove
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className={LABEL_CLASS}>First Name *</label>
                            <input type="text" value={executor.firstName} onChange={(e) => updateExecutor(index, 'firstName', e.target.value)} className={INPUT_CLASS} />
                        </div>
                        <div>
                            <label className={LABEL_CLASS}>Last Name *</label>
                            <input type="text" value={executor.lastName} onChange={(e) => updateExecutor(index, 'lastName', e.target.value)} className={INPUT_CLASS} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={LABEL_CLASS}>Relationship *</label>
                            <input type="text" value={executor.relationship} onChange={(e) => updateExecutor(index, 'relationship', e.target.value)} className={INPUT_CLASS} placeholder="e.g., Spouse, Friend" />
                        </div>
                        <div>
                            <label className={LABEL_CLASS}>Address *</label>
                            <input type="text" value={executor.address} onChange={(e) => updateExecutor(index, 'address', e.target.value)} className={INPUT_CLASS} placeholder="Full address" />
                        </div>
                    </div>
                </div>
            ))}

            <button
                type="button"
                onClick={onAdd}
                className="w-full py-3 border-2 border-dashed border-secondary/60 rounded-lg text-secondary text-sm font-medium hover:bg-secondary/5 transition-colors cursor-pointer"
            >
                + Add Executor
            </button>
        </div>
    );
};

interface ChildrenStepProps {
    hasChildren: boolean;
    childrenUnder18: boolean;
    guardians: Guardian[];
    onChangeField: (field: string, value: boolean) => void;
    onAddGuardian: () => void;
    onChangeGuardians: (guardians: Guardian[]) => void;
}

const ChildrenStep: React.FC<ChildrenStepProps> = ({
    hasChildren,
    childrenUnder18,
    guardians,
    onChangeField,
    onAddGuardian,
    onChangeGuardians
}) => {
    const updateGuardian = (index: number, field: keyof Guardian, value: string) => {
        const updated = [...guardians];
        updated[index] = { ...updated[index], [field]: value };
        onChangeGuardians(updated);
    };

    const removeGuardian = (index: number) => {
        onChangeGuardians(guardians.filter((_, i) => i !== index));
    };

    return (
        <div>
            <h2 className="text-2xl md:text-3xl font-normal text-slate-700 mb-8">
                Do you have any children?
            </h2>

            <div className="flex gap-4 mb-8">
                <button
                    type="button"
                    onClick={() => onChangeField('hasChildren', true)}
                    className={`px-8 py-3 rounded border-2 text-sm font-medium transition-all cursor-pointer ${hasChildren ? 'border-secondary bg-secondary/5 text-secondary' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                        }`}
                >
                    Yes
                </button>
                <button
                    type="button"
                    onClick={() => { onChangeField('hasChildren', false); onChangeField('childrenUnder18', false); }}
                    className={`px-8 py-3 rounded border-2 text-sm font-medium transition-all cursor-pointer ${!hasChildren ? 'border-secondary bg-secondary/5 text-secondary' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                        }`}
                >
                    No
                </button>
            </div>

            {hasChildren && (
                <>
                    <h3 className="text-xl font-normal text-slate-700 mb-4">
                        Are any of your children under 18?
                    </h3>
                    <div className="flex gap-4 mb-8">
                        <button
                            type="button"
                            onClick={() => onChangeField('childrenUnder18', true)}
                            className={`px-8 py-3 rounded border-2 text-sm font-medium transition-all cursor-pointer ${childrenUnder18 ? 'border-secondary bg-secondary/5 text-secondary' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                }`}
                        >
                            Yes
                        </button>
                        <button
                            type="button"
                            onClick={() => onChangeField('childrenUnder18', false)}
                            className={`px-8 py-3 rounded border-2 text-sm font-medium transition-all cursor-pointer ${!childrenUnder18 ? 'border-secondary bg-secondary/5 text-secondary' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                }`}
                        >
                            No
                        </button>
                    </div>

                    {childrenUnder18 && (
                        <div>
                            <h3 className="text-xl font-normal text-slate-700 mb-4">
                                Appoint Guardians
                            </h3>
                            <p className="text-sm text-slate-500 mb-6">
                                Choose trusted individuals to care for your children.
                            </p>

                            {guardians.map((guardian, index) => (
                                <div key={guardian.id} className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-base font-semibold text-slate-700">Guardian {index + 1}</h4>
                                        {guardians.length > 1 && (
                                            <button type="button" onClick={() => removeGuardian(index)} className="text-red-500 text-sm hover:text-red-700 cursor-pointer">Remove</button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className={LABEL_CLASS}>First Name *</label>
                                            <input type="text" value={guardian.firstName} onChange={(e) => updateGuardian(index, 'firstName', e.target.value)} className={INPUT_CLASS} />
                                        </div>
                                        <div>
                                            <label className={LABEL_CLASS}>Last Name *</label>
                                            <input type="text" value={guardian.lastName} onChange={(e) => updateGuardian(index, 'lastName', e.target.value)} className={INPUT_CLASS} />
                                        </div>
                                        <div>
                                            <label className={LABEL_CLASS}>Relationship *</label>
                                            <input type="text" value={guardian.relationship} onChange={(e) => updateGuardian(index, 'relationship', e.target.value)} className={INPUT_CLASS} />
                                        </div>
                                        <div>
                                            <label className={LABEL_CLASS}>Address *</label>
                                            <input type="text" value={guardian.address} onChange={(e) => updateGuardian(index, 'address', e.target.value)} className={INPUT_CLASS} />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={onAddGuardian}
                                className="w-full py-3 border-2 border-dashed border-secondary/60 rounded-lg text-secondary text-sm font-medium hover:bg-secondary/5 transition-colors cursor-pointer"
                            >
                                + Add Guardian
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

interface GiftsStepProps {
    gifts: Array<{ item: string; recipient: string }>;
    onChange: (gifts: Array<{ item: string; recipient: string }>) => void;
}

const GiftsStep: React.FC<GiftsStepProps> = ({ gifts, onChange }) => {
    const addGift = () => onChange([...gifts, { item: '', recipient: '' }]);

    const updateGift = (index: number, field: 'item' | 'recipient', value: string) => {
        const updated = [...gifts];
        updated[index] = { ...updated[index], [field]: value };
        onChange(updated);
    };

    const removeGift = (index: number) => onChange(gifts.filter((_, i) => i !== index));

    return (
        <div>
            <h2 className="text-2xl md:text-3xl font-normal text-slate-700 mb-4">
                Specific Gifts
            </h2>
            <p className="text-sm text-slate-500 mb-8">
                Leave particular items or amounts of money to specific people or organisations.
            </p>

            {gifts.map((gift, index) => (
                <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-base font-semibold text-slate-700">Gift {index + 1}</h3>
                        <button type="button" onClick={() => removeGift(index)} className="text-red-500 text-sm hover:text-red-700 cursor-pointer">Remove</button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={LABEL_CLASS}>Item or Amount *</label>
                            <input type="text" value={gift.item} onChange={(e) => updateGift(index, 'item', e.target.value)} className={INPUT_CLASS} placeholder="e.g., My gold watch, £10,000" />
                        </div>
                        <div>
                            <label className={LABEL_CLASS}>Recipient *</label>
                            <input type="text" value={gift.recipient} onChange={(e) => updateGift(index, 'recipient', e.target.value)} className={INPUT_CLASS} placeholder="Full name" />
                        </div>
                    </div>
                </div>
            ))}

            <button
                type="button"
                onClick={addGift}
                className="w-full py-3 border-2 border-dashed border-secondary/60 rounded-lg text-secondary text-sm font-medium hover:bg-secondary/5 transition-colors cursor-pointer"
            >
                + Add Specific Gift
            </button>
        </div>
    );
};

interface RemainderStepProps {
    distributionType: 'percentage' | 'specific' | 'residuary';
    beneficiaries: Beneficiary[];
    onChangeType: (type: 'percentage' | 'specific' | 'residuary') => void;
    onAddBeneficiary: (type: 'person' | 'charity') => void;
    onChangeBeneficiaries: (beneficiaries: Beneficiary[]) => void;
}

const RemainderStep: React.FC<RemainderStepProps> = ({
    distributionType,
    beneficiaries,
    onChangeType,
    onAddBeneficiary,
    onChangeBeneficiaries
}) => {
    const updateBeneficiary = (index: number, field: keyof Beneficiary, value: string | number) => {
        const updated = [...beneficiaries];
        updated[index] = { ...updated[index], [field]: value };
        onChangeBeneficiaries(updated);
    };

    const removeBeneficiary = (index: number) => {
        onChangeBeneficiaries(beneficiaries.filter((_, i) => i !== index));
    };

    return (
        <div>
            <h2 className="text-2xl md:text-3xl font-normal text-slate-700 mb-4">
                How should the remainder of your estate be distributed?
            </h2>
            <p className="text-sm text-slate-500 mb-8">
                Choose how you'd like your estate to be distributed among your beneficiaries.
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
                {(['percentage', 'specific', 'residuary'] as const).map((type) => (
                    <button
                        key={type}
                        type="button"
                        onClick={() => onChangeType(type)}
                        className={`px-6 py-3 rounded border-2 text-sm font-medium transition-all cursor-pointer capitalize ${distributionType === type
                            ? 'border-secondary bg-secondary/5 text-secondary'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                            }`}
                    >
                        {type === 'percentage' ? 'By Percentage' : type === 'specific' ? 'Specific Amounts' : 'Equal Shares'}
                    </button>
                ))}
            </div>

            {beneficiaries.map((beneficiary, index) => (
                <div key={beneficiary.id} className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-base font-semibold text-slate-700">
                            Beneficiary {index + 1} ({beneficiary.type === 'person' ? 'Individual' : 'Charity'})
                        </h3>
                        <button type="button" onClick={() => removeBeneficiary(index)} className="text-red-500 text-sm hover:text-red-700 cursor-pointer">Remove</button>
                    </div>
                    {beneficiary.type === 'person' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className={LABEL_CLASS}>First Name *</label>
                                <input type="text" value={beneficiary.firstName || ''} onChange={(e) => updateBeneficiary(index, 'firstName', e.target.value)} className={INPUT_CLASS} />
                            </div>
                            <div>
                                <label className={LABEL_CLASS}>Last Name *</label>
                                <input type="text" value={beneficiary.lastName || ''} onChange={(e) => updateBeneficiary(index, 'lastName', e.target.value)} className={INPUT_CLASS} />
                            </div>
                            <div>
                                <label className={LABEL_CLASS}>Relationship *</label>
                                <input type="text" value={beneficiary.relationship || ''} onChange={(e) => updateBeneficiary(index, 'relationship', e.target.value)} className={INPUT_CLASS} />
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={LABEL_CLASS}>Charity Name *</label>
                                <input type="text" value={beneficiary.charityName || ''} onChange={(e) => updateBeneficiary(index, 'charityName', e.target.value)} className={INPUT_CLASS} />
                            </div>
                            <div>
                                <label className={LABEL_CLASS}>Charity Number *</label>
                                <input type="text" value={beneficiary.charityNumber || ''} onChange={(e) => updateBeneficiary(index, 'charityNumber', e.target.value)} className={INPUT_CLASS} />
                            </div>
                        </div>
                    )}
                    {distributionType === 'percentage' && (
                        <div className="mt-4 w-32">
                            <label className={LABEL_CLASS}>Percentage</label>
                            <input type="number" min="0" max="100" value={beneficiary.percentage || 0} onChange={(e) => updateBeneficiary(index, 'percentage', Number(e.target.value))} className={INPUT_CLASS + ' text-center'} />
                        </div>
                    )}
                </div>
            ))}

            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={() => onAddBeneficiary('person')}
                    className="flex-1 py-3 border-2 border-dashed border-secondary/60 rounded-lg text-secondary text-sm font-medium hover:bg-secondary/5 transition-colors cursor-pointer"
                >
                    + Add Person
                </button>
                <button
                    type="button"
                    onClick={() => onAddBeneficiary('charity')}
                    className="flex-1 py-3 border-2 border-dashed border-gray-400 rounded-lg text-slate-600 text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                >
                    + Add Charity
                </button>
            </div>
        </div>
    );
};

interface FinalDetailsStepProps {
    data: PersonalInfo;
    funeralWishes: string;
    burialPreference: string;
    additionalWishes: string;
    onChange: (field: keyof PersonalInfo, value: string) => void;
    onChangeWishes: (field: string, value: string) => void;
}

const FinalDetailsStep: React.FC<FinalDetailsStepProps> = ({
    data,
    funeralWishes,
    burialPreference,
    additionalWishes,
    onChange,
    onChangeWishes
}) => (
    <div>
        <h2 className="text-2xl md:text-3xl font-normal text-slate-700 mb-4">
            Final Details
        </h2>
        <p className="text-sm text-slate-500 mb-8">
            Please provide your personal details and any final wishes.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
                <label className={LABEL_CLASS}>Title</label>
                <select value={data.title} onChange={(e) => onChange('title', e.target.value)} className={INPUT_CLASS}>
                    <option value="">Select...</option>
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Miss">Miss</option>
                    <option value="Ms">Ms</option>
                    <option value="Dr">Dr</option>
                </select>
            </div>
            <div>
                <label className={LABEL_CLASS}>First Name *</label>
                <input type="text" value={data.firstName} onChange={(e) => onChange('firstName', e.target.value)} className={INPUT_CLASS} />
            </div>
            <div>
                <label className={LABEL_CLASS}>Middle Name(s)</label>
                <input type="text" value={data.middleName} onChange={(e) => onChange('middleName', e.target.value)} className={INPUT_CLASS} />
            </div>
            <div>
                <label className={LABEL_CLASS}>Last Name *</label>
                <input type="text" value={data.lastName} onChange={(e) => onChange('lastName', e.target.value)} className={INPUT_CLASS} />
            </div>
            <div>
                <label className={LABEL_CLASS}>Date of Birth *</label>
                <input type="date" value={data.dateOfBirth} onChange={(e) => onChange('dateOfBirth', e.target.value)} className={INPUT_CLASS} />
            </div>
            <div>
                <label className={LABEL_CLASS}>Address *</label>
                <input type="text" value={data.address} onChange={(e) => onChange('address', e.target.value)} className={INPUT_CLASS} />
            </div>
            <div>
                <label className={LABEL_CLASS}>City/Town *</label>
                <input type="text" value={data.city} onChange={(e) => onChange('city', e.target.value)} className={INPUT_CLASS} />
            </div>
            <div>
                <label className={LABEL_CLASS}>Postcode *</label>
                <input type="text" value={data.postcode} onChange={(e) => onChange('postcode', e.target.value)} className={INPUT_CLASS} />
            </div>
        </div>

        <div className="mb-6">
            <label className={LABEL_CLASS}>Burial or Cremation Preference</label>
            <div className="flex flex-wrap gap-3">
                {['Burial', 'Cremation', 'Donate to Science', 'No Preference'].map((option) => (
                    <button
                        key={option}
                        type="button"
                        onClick={() => onChangeWishes('burialPreference', option)}
                        className={`px-5 py-2 rounded border-2 text-sm font-medium transition-all cursor-pointer ${burialPreference === option
                            ? 'border-secondary bg-secondary/5 text-secondary'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                            }`}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>

        <div className="mb-6">
            <label className={LABEL_CLASS}>Funeral Wishes</label>
            <textarea
                value={funeralWishes}
                onChange={(e) => onChangeWishes('funeralWishes', e.target.value)}
                className={INPUT_CLASS + ' min-h-24 resize-y'}
                placeholder="Any preferences for your funeral service..."
            />
        </div>

        <div>
            <label className={LABEL_CLASS}>Additional Wishes</label>
            <textarea
                value={additionalWishes}
                onChange={(e) => onChangeWishes('additionalWishes', e.target.value)}
                className={INPUT_CLASS + ' min-h-24 resize-y'}
                placeholder="Any other wishes or instructions..."
            />
        </div>
    </div>
);

const SigningStep: React.FC = () => (
    <div>
        <h2 className="text-2xl md:text-3xl font-normal text-slate-700 mb-4">
            Signing Your Will
        </h2>
        <p className="text-sm text-slate-500 mb-8">
            Important information about how to properly sign and witness your will.
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4">
            <div className="flex items-start gap-3">
                <span className="w-6 h-6 bg-secondary text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
                <p className="text-sm text-slate-700">Sign your will in the presence of <strong>two witnesses</strong> who are both present at the same time.</p>
            </div>
            <div className="flex items-start gap-3">
                <span className="w-6 h-6 bg-secondary text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
                <p className="text-sm text-slate-700">Witnesses must be over 18 and <strong>cannot be beneficiaries</strong> or their spouses/civil partners.</p>
            </div>
            <div className="flex items-start gap-3">
                <span className="w-6 h-6 bg-secondary text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
                <p className="text-sm text-slate-700">Both witnesses must then sign the will in your presence.</p>
            </div>
            <div className="flex items-start gap-3">
                <span className="w-6 h-6 bg-secondary text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">4</span>
                <p className="text-sm text-slate-700">Store your signed will in a safe place and let your executor know where it is.</p>
            </div>
        </div>
    </div>
);

interface PrintDownloadStepProps {
    data: WillData;
}

const PrintDownloadStep: React.FC<PrintDownloadStepProps> = ({ data }) => (
    <div>
        <h2 className="text-2xl md:text-3xl font-normal text-slate-700 mb-4">
            Review & Download
        </h2>
        <p className="text-sm text-slate-500 mb-8">
            Review your will details below, then print or download your document.
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-slate-700 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <ReviewItem label="Name" value={`${data.personalInfo.title} ${data.personalInfo.firstName} ${data.personalInfo.middleName} ${data.personalInfo.lastName}`.trim()} />
                <ReviewItem label="Date of Birth" value={data.personalInfo.dateOfBirth} />
                <ReviewItem label="Marital Status" value={data.personalInfo.maritalStatus} />
                <ReviewItem label="Address" value={`${data.personalInfo.address}, ${data.personalInfo.city}, ${data.personalInfo.postcode}`} />
            </div>
        </div>

        {data.executors.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-slate-700 mb-4">Executors ({data.executors.length})</h3>
                <div className="space-y-2">
                    {data.executors.map((executor, index) => (
                        <p key={executor.id} className="text-sm text-slate-600">
                            <strong>{index + 1}.</strong> {executor.title} {executor.firstName} {executor.lastName} — {executor.relationship}
                        </p>
                    ))}
                </div>
            </div>
        )}

        {data.beneficiaries.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-slate-700 mb-4">Beneficiaries ({data.beneficiaries.length})</h3>
                <div className="space-y-2">
                    {data.beneficiaries.map((b, index) => (
                        <p key={b.id} className="text-sm text-slate-600">
                            <strong>{index + 1}.</strong>{' '}
                            {b.type === 'person' ? `${b.firstName} ${b.lastName}` : b.charityName}
                            {b.percentage ? ` — ${b.percentage}%` : ''}
                        </p>
                    ))}
                </div>
            </div>
        )}

        <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-6 text-center">
            <p className="text-slate-700 text-sm mb-4">
                Once you're satisfied, download your will and sign it with two witnesses.
            </p>
            <button
                type="button"
                className="px-10 py-3 bg-accent-green text-white rounded font-bold text-sm uppercase tracking-wider hover:bg-emerald-600 transition-colors cursor-pointer"
            >
                DOWNLOAD WILL DOCUMENT
            </button>
        </div>
    </div>
);

const ReviewItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div>
        <div className="text-xs text-slate-500 font-medium mb-1">{label}</div>
        <div className="text-sm text-slate-800 font-medium">{value || 'Not provided'}</div>
    </div>
);

export default WillCreationWizard;