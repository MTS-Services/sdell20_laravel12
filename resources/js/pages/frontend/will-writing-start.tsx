import React, { useEffect, useState } from 'react';
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
    city: string;
    country: string;
}

interface Child {
    id: string;
    fullName: string;
    isMinor: boolean;
}

interface Guardian {
    id: string;
    fullName: string;
    city: string;
    country: string;
}

interface SpecificGift {
    id: string;
    giftType: 'individual' | 'charity';
    description: string;
    recipientName: string;
    city: string;
    country: string;
    allowAlternate: boolean;
    alternateRecipientName: string;
    alternateCity: string;
    alternateCountry: string;
}

interface WillData {
    personalInfo: PersonalInfo;
    hasChildren: boolean;
    children: Child[];
    wantsGuardian: boolean;
    guardians: Guardian[];
    wantsDelayInheritance: boolean;
    inheritanceAge: string;
    wantsSpecificGifts: boolean;
    executors: Executor[];
    wantsAlternateExecutor: boolean;
    alternateExecutors: Executor[];
    beneficiaries: Beneficiary[];
    distributionType: 'percentage' | 'specific' | 'residuary';
    specificGifts: SpecificGift[];
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
        children: [],
        wantsGuardian: false,
        guardians: [],
        wantsDelayInheritance: false,
        inheritanceAge: '18',
        wantsSpecificGifts: false,
        executors: [],
        wantsAlternateExecutor: false,
        alternateExecutors: [],
        beneficiaries: [],
        distributionType: 'percentage' as const,
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

    interface ChildrenStepProps {
        hasChildren: boolean;
        childRecords: Child[];
        onChangeField: (field: 'hasChildren', value: boolean) => void;
        onAddChild: () => void;
        onChangeChildren: (children: Child[]) => void;
    }

    const CHILDREN_FAQ = [
        { question: 'Should I list step-children?', answer: 'Yes. Any child or dependent you want covered by your will should be listed so the document can reference them explicitly.' },
        { question: 'When is a child considered dependent?', answer: 'Anyone under 18, or anyone financially dependent on you regardless of age, should be marked as a minor/dependent.' }
    ];

    const ChildrenStep: React.FC<ChildrenStepProps> = ({ hasChildren, childRecords, onChangeField, onAddChild, onChangeChildren }) => {
        const [faqTooltip, setFaqTooltip] = useState<{ text: string; top: number } | null>(null);

        const updateChild = (index: number, fields: Partial<Child>) => {
            const updated = [...childRecords];
            updated[index] = { ...updated[index], ...fields };
            onChangeChildren(updated);
        };

        const removeChild = (index: number) => {
            onChangeChildren(childRecords.filter((_, i) => i !== index));
        };

        const handleHasChildrenToggle = (value: boolean) => {
            onChangeField('hasChildren', value);
            if (value) {
                if (childRecords.length === 0) {
                    onAddChild();
                }
            } else {
                onChangeChildren([]);
            }
        };

        return (
            <div>
                <h2 className="text-2xl md:text-3xl font-normal text-slate-900 mb-4">Children</h2>
                <p className="text-sm md:text-base text-secondary mb-8">Do you have any living children?</p>

                <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => handleHasChildrenToggle(true)}
                                className={`px-8 py-2.5 rounded border-2 text-sm font-semibold uppercase tracking-wide transition-all cursor-pointer ${hasChildren ? 'border-secondary bg-secondary/5 text-secondary' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
                            >
                                YES
                            </button>
                            <button
                                type="button"
                                onClick={() => handleHasChildrenToggle(false)}
                                className={`px-8 py-2.5 rounded border-2 text-sm font-semibold uppercase tracking-wide transition-all cursor-pointer ${!hasChildren ? 'border-secondary bg-secondary/5 text-secondary' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
                            >
                                NO
                            </button>
                        </div>

                        {hasChildren && (
                            <>
                                {childRecords.map((child, index) => (
                                    <div key={child.id} className="rounded border border-slate-200 bg-white shadow-lg p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <p className="text-base font-semibold text-secondary">Child</p>
                                            {childRecords.length > 1 && (
                                                <button type="button" onClick={() => removeChild(index)} className="text-rose-500 text-xs font-semibold uppercase tracking-wide hover:text-rose-600">
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                        <div className="space-y-5">
                                            <div>
                                                <label className="block text-sm text-secondary mb-1">Full Name:</label>
                                                <input
                                                    type="text"
                                                    value={child.fullName}
                                                    onChange={(e) => updateChild(index, { fullName: e.target.value })}
                                                    className="w-full border-b border-slate-300 bg-transparent py-2 text-base text-slate-800 placeholder-slate-400 focus:border-secondary focus:outline-none transition-colors"
                                                    placeholder="e.g. William Timothy Smith"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm md:text-base text-slate-600 mb-3">Is this child either a minor or a dependant?</p>
                                                <div className="flex gap-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => updateChild(index, { isMinor: true })}
                                                        className={`px-8 py-2.5 rounded border-2 text-sm font-semibold uppercase tracking-wide transition-all cursor-pointer ${child.isMinor ? 'border-secondary bg-secondary/5 text-secondary' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
                                                    >
                                                        YES
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => updateChild(index, { isMinor: false })}
                                                        className={`px-8 py-2.5 rounded border-2 text-sm font-semibold uppercase tracking-wide transition-all cursor-pointer ${!child.isMinor ? 'border-secondary bg-secondary/5 text-secondary' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
                                                    >
                                                        NO
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={onAddChild}
                                    className="text-secondary text-sm font-semibold hover:underline"
                                >
                                    + Add another child
                                </button>
                            </>
                        )}
                    </div>

                    <aside className="rounded border border-slate-200 bg-white shadow-sm p-6 h-fit">
                        <h3 className="text-base font-semibold text-slate-700 mb-4">Frequently Asked Questions</h3>
                        <div className="relative" onMouseLeave={() => setFaqTooltip(null)}>
                            <ul className="space-y-3 text-sm text-slate-600">
                                {CHILDREN_FAQ.map((item) => (
                                    <li key={item.question} className="border-b text-left border-slate-100 pb-3 last:border-b-0 last:pb-0">
                                        <button
                                            type="button"
                                            onMouseEnter={(e) => {
                                                const offsetTop = e.currentTarget.parentElement?.offsetTop ?? 0;
                                                setFaqTooltip({ text: item.answer, top: offsetTop });
                                            }}
                                            className="font-medium text-secondary hover:underline"
                                        >
                                            {item.question}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            {faqTooltip && (
                                <div
                                    className="absolute left-[calc(100%+1rem)] w-64 rounded-lg border border-slate-200 bg-white p-4 text-xs text-slate-600 shadow-lg"
                                    style={{ top: faqTooltip.top }}
                                >
                                    <div className="absolute -left-2 top-4 h-0 w-0 border-y-8 border-y-transparent border-r-8 border-r-slate-200" />
                                    <div className="absolute -left-3.5 top-4 h-0 w-0 border-y-7 border-y-transparent border-r-7 border-r-white" />
                                    {faqTooltip.text}
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        );
    };

    const addAlternateExecutor = () => {
        const newExecutor: Executor = {
            id: Date.now().toString(),
            title: '',
            firstName: '',
            lastName: '',
            relationship: '',
            address: '',
            dateOfBirth: '',
            city: '',
            country: 'England'
        };
        setWillData({
            ...willData,
            alternateExecutors: [...willData.alternateExecutors, newExecutor]
        });
    };

    const createExecutor = (): Executor => ({
        id: Date.now().toString(),
        title: '',
        firstName: '',
        lastName: '',
        relationship: '',
        address: '',
        dateOfBirth: '',
        city: '',
        country: 'England'
    });

    const addExecutor = () => {
        const newExecutor = createExecutor();
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

    const addChild = () => {
        const newChild: Child = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            fullName: '',
            isMinor: false
        };
        setWillData({
            ...willData,
            children: [...willData.children, newChild]
        });
    };

    const addGuardian = () => {
        const newGuardian: Guardian = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            fullName: '',
            city: '',
            country: 'England'
        };
        setWillData({
            ...willData,
            guardians: [...willData.guardians, newGuardian]
        });
    };

    const createSpecificGift = (): SpecificGift => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        giftType: 'individual',
        description: '',
        recipientName: '',
        city: '',
        country: 'England',
        allowAlternate: false,
        alternateRecipientName: '',
        alternateCity: '',
        alternateCountry: 'England'
    });

    const addSpecificGift = () => {
        const newGift = createSpecificGift();
        setWillData({
            ...willData,
            specificGifts: [...willData.specificGifts, newGift]
        });
    };

    const handleCreateDocument = () => {
        if (willData.personalInfo.maritalStatus) {
            setPhase('wizard');
            setCurrentStep(0);
        }
    };

    // Total internal steps: 0=GetStarted, 1=Executor, 2=BackupExecutor, 3=Children, 4=Guardian, 5=DelayInheritance, 6=Gifts, 7=Remainder, 8=FinalDetails, 9=Signing, 10=PrintDownload
    const TOTAL_INTERNAL_STEPS = 11;

    const handleSaveAndContinue = () => {
        if (currentStep < TOTAL_INTERNAL_STEPS - 1) {
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
        if (currentStep < TOTAL_INTERNAL_STEPS - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    // 8 visible nav steps. Executor has 2 internal sub-steps (1,2). Children has 3 internal sub-steps (3,4,5).
    // Internal → nav index mapping:
    // 0→0(GetStarted), 1,2→1(Executor), 3,4,5→2(Children), 6→3(Gifts), 7→4(Remainder), 8→5(FinalDetails), 9→6(Signing), 10→7(Print)
    const getNavIndex = (step: number): number => {
        if (step <= 0) return 0;
        if (step <= 2) return 1;
        if (step <= 5) return 2;
        return step - 3;
    };

    const currentNavIndex = getNavIndex(currentStep);

    // Progress: sub-steps within a group advance the bar fractionally
    const getProgressPercent = (step: number): number => {
        if (step === 0) return (1 / WIZARD_STEPS.length) * 100;
        if (step === 1) return (1.33 / WIZARD_STEPS.length) * 100;
        if (step === 2) return (2 / WIZARD_STEPS.length) * 100;
        if (step === 3) return (2.33 / WIZARD_STEPS.length) * 100;
        if (step === 4) return (2.66 / WIZARD_STEPS.length) * 100;
        if (step === 5) return (3 / WIZARD_STEPS.length) * 100;
        const navIdx = step - 3;
        return ((navIdx + 1) / WIZARD_STEPS.length) * 100;
    };

    const progressPercent = getProgressPercent(currentStep);

    useEffect(() => {
        if (phase === 'wizard' && currentStep === 1 && willData.executors.length === 0) {
            addExecutor();
        }
        if (phase === 'wizard' && currentStep === 2 && willData.wantsAlternateExecutor && willData.alternateExecutors.length === 0) {
            addAlternateExecutor();
        }
        if (phase === 'wizard' && currentStep === 4 && willData.wantsGuardian && willData.guardians.length === 0) {
            addGuardian();
        }
    }, [phase, currentStep, willData.executors.length, willData.wantsAlternateExecutor, willData.alternateExecutors.length, willData.wantsGuardian, willData.guardians.length]);

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
                        wantsAlternateExecutor={willData.wantsAlternateExecutor}
                        alternateExecutors={willData.alternateExecutors}
                        onAddExecutor={addExecutor}
                        onChangeExecutors={(executors: Executor[]) => setWillData({ ...willData, executors })}
                        onToggleAlternate={(value: boolean) => setWillData({
                            ...willData,
                            wantsAlternateExecutor: value,
                            alternateExecutors: value ? (willData.alternateExecutors.length ? willData.alternateExecutors : [createExecutor()]) : []
                        })}
                        onAddAlternate={addAlternateExecutor}
                        onChangeAlternates={(alternateExecutors: Executor[]) => setWillData({ ...willData, alternateExecutors })}
                        showBackupSection={false}
                    />
                );
            case 2:
                return (
                    <ExecutorsStep
                        executors={willData.executors}
                        wantsAlternateExecutor={willData.wantsAlternateExecutor}
                        alternateExecutors={willData.alternateExecutors}
                        onAddExecutor={addExecutor}
                        onChangeExecutors={(executors: Executor[]) => setWillData({ ...willData, executors })}
                        onToggleAlternate={(value: boolean) => setWillData({
                            ...willData,
                            wantsAlternateExecutor: value,
                            alternateExecutors: value ? (willData.alternateExecutors.length ? willData.alternateExecutors : [createExecutor()]) : []
                        })}
                        onAddAlternate={addAlternateExecutor}
                        onChangeAlternates={(alternateExecutors: Executor[]) => setWillData({ ...willData, alternateExecutors })}
                        showBackupSection={true}
                    />
                );
            case 3:
                return (
                    <ChildrenStep
                        hasChildren={willData.hasChildren}
                        childRecords={willData.children}
                        onChangeField={(field, value) => setWillData({ ...willData, [field]: value })}
                        onAddChild={addChild}
                        onChangeChildren={(children) => setWillData({ ...willData, children })}
                    />
                );
            case 4:
                return (
                    <GuardianStep
                        wantsGuardian={willData.wantsGuardian}
                        guardians={willData.guardians}
                        onToggleGuardian={(value: boolean) => setWillData({
                            ...willData,
                            wantsGuardian: value,
                            guardians: value ? (willData.guardians.length ? willData.guardians : []) : []
                        })}
                        onAddGuardian={addGuardian}
                        onChangeGuardians={(guardians: Guardian[]) => setWillData({ ...willData, guardians })}
                    />
                );
            case 5:
                return (
                    <DelayInheritanceStep
                        wantsDelay={willData.wantsDelayInheritance}
                        inheritanceAge={willData.inheritanceAge}
                        onToggleDelay={(value: boolean) => setWillData({ ...willData, wantsDelayInheritance: value })}
                        onChangeAge={(age: string) => setWillData({ ...willData, inheritanceAge: age })}
                    />
                );
            case 6:
                return (
                    <GiftsStep
                        wantsGifts={willData.wantsSpecificGifts}
                        gifts={willData.specificGifts}
                        onToggle={(value) => setWillData({
                            ...willData,
                            wantsSpecificGifts: value,
                            specificGifts: value ? (willData.specificGifts.length ? willData.specificGifts : [createSpecificGift()]) : []
                        })}
                        onAddGift={addSpecificGift}
                        onChangeGifts={(gifts) => setWillData({ ...willData, specificGifts: gifts })}
                    />
                );
            case 7:
                return (
                    <RemainderStep
                        distributionType={willData.distributionType}
                        beneficiaries={willData.beneficiaries}
                        onChangeType={(type) => setWillData({ ...willData, distributionType: type })}
                        onAddBeneficiary={addBeneficiary}
                        onChangeBeneficiaries={(beneficiaries) => setWillData({ ...willData, beneficiaries })}
                    />
                );
            case 8:
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
            case 9:
                return <SigningStep />;
            case 10:
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

                    {/* Step Tabs - Show all steps but highlight current logical step */}
                    <div className="flex flex-wrap gap-2.5">
                        {WIZARD_STEPS.map((step, index) => {
                            const isActive = index === currentNavIndex;
                            const isCompleted = index < currentNavIndex;

                            const navToInternal = (navIdx: number): number => {
                                if (navIdx === 0) return 0;
                                if (navIdx === 1) return 1;
                                if (navIdx === 2) return 3;
                                return navIdx + 3;
                            };

                            return (
                                <button
                                    key={step.key}
                                    type="button"
                                    onClick={() => {
                                        if (isCompleted) {
                                            setCurrentStep(navToInternal(index));
                                        }
                                    }}
                                    className={`px-3 py-2 text-sm md:text-base lg:text-lg font-normal transition-colors duration-200 ${isActive
                                        ? 'text-white cursor-default'
                                        : isCompleted
                                            ? 'text-white/80 hover:text-white cursor-pointer'
                                            : 'text-white/60 hover:text-white/80 cursor-pointer'
                                        }`}
                                >
                                    {step.title}
                                </button>
                            );
                        })}
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
    wantsAlternateExecutor: boolean;
    alternateExecutors: Executor[];
    onAddExecutor: () => void;
    onChangeExecutors: (executors: Executor[]) => void;
    onToggleAlternate: (value: boolean) => void;
    onAddAlternate: () => void;
    onChangeAlternates: (executors: Executor[]) => void;
    showBackupSection: boolean;
}

const FAQ_ITEMS = [
    {
        question: 'Who cannot be my executor?',
        answer: 'You cannot choose a minor or someone who has been convicted of a serious offence. Some jurisdictions also restrict executors who live outside of the country.'
    },
    {
        question: 'What does an executor do?',
        answer: 'Executors gather assets, pay debts and taxes, then distribute the remaining estate exactly as set out in your will.'
    },
    {
        question: 'Do executors work together?',
        answer: 'If you appoint more than one executor they share legal responsibility and should make key decisions jointly.'
    }
];

const ExecutorsStep: React.FC<ExecutorsStepProps> = ({ executors, wantsAlternateExecutor, alternateExecutors, onAddExecutor, onChangeExecutors, onToggleAlternate, onAddAlternate, onChangeAlternates, showBackupSection }) => {
    const [faqTooltip, setFaqTooltip] = useState<{ text: string; top: number } | null>(null);

    const setExecutorFields = (index: number, fields: Partial<Executor>, isAlternate: boolean = false) => {
        const updated = [...(isAlternate ? alternateExecutors : executors)];
        updated[index] = { ...updated[index], ...fields };
        if (isAlternate) {
            onChangeAlternates(updated);
        } else {
            onChangeExecutors(updated);
        }
    };

    const handleFullNameChange = (index: number, value: string, isAlternate: boolean = false) => {
        const trimmed = value.trim();
        if (!trimmed) {
            setExecutorFields(index, { firstName: '', lastName: '' }, isAlternate);
            return;
        }

        const parts = trimmed.split(/\s+/);
        const firstName = parts.shift() ?? '';
        const lastName = parts.join(' ');
        setExecutorFields(index, { firstName, lastName }, isAlternate);
    };

    const removeExecutor = (index: number, isAlternate: boolean = false) => {
        if (isAlternate) {
            onChangeAlternates(alternateExecutors.filter((_, i) => i !== index));
        } else {
            onChangeExecutors(executors.filter((_, i) => i !== index));
        }
    };

    return (
        <div>
            {!showBackupSection && (
                <>
                    <h2 className="text-2xl md:text-3xl font-normal text-slate-900 mb-4">
                        Choose an Executor/Personal Representative
                    </h2>
                    <p className="text-sm md:text-base text-slate-600 mb-10">
                        Executors are responsible for carrying out the instructions in your will. Add trusted individuals below.
                    </p>
                </>
            )}

            {showBackupSection && (
                <>
                    <h2 className="text-2xl md:text-3xl font-normal text-slate-900 mb-4">
                        Backup Executor/Personal Representative
                    </h2>
                    <p className="text-sm md:text-base text-slate-600 mb-6">
                        Do you want to name an alternative in case your original executor is unavailable?
                    </p>
                </>
            )}

            <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                <div className="space-y-6">
                    {!showBackupSection && (
                        <>
                            {executors.map((executor, index) => {
                                const orderLabels = ['First', 'Second', 'Third', 'Fourth'];
                                const cardTitle = orderLabels[index] ? `${orderLabels[index]} Executor Details` : `Executor ${index + 1} Details`;

                                return (
                                    <div key={executor.id} className="rounded border border-slate-200 bg-white shadow-lg p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <p className="text-base font-semibold text-slate-700">{cardTitle}</p>
                                            {executors.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeExecutor(index)}
                                                    className="text-rose-500 text-xs font-semibold uppercase tracking-wide hover:text-rose-600"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>

                                        <div className="space-y-5">
                                            <div>
                                                <label className="block text-sm text-secondary mb-1">Full Name:</label>
                                                <input
                                                    type="text"
                                                    value={`${executor.firstName}${executor.lastName ? ` ${executor.lastName}` : ''}`}
                                                    onChange={(e) => handleFullNameChange(index, e.target.value)}
                                                    className="w-full border-b border-slate-300 bg-transparent py-2 text-base text-slate-800 placeholder-slate-400 focus:border-secondary focus:outline-none transition-colors"
                                                    placeholder="e.g. William Timothy Smith"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-secondary mb-1">City/Town:</label>
                                                <input
                                                    type="text"
                                                    value={executor.city}
                                                    onChange={(e) => setExecutorFields(index, { city: e.target.value })}
                                                    className="w-full border-b border-slate-300 bg-transparent py-2 text-base text-slate-800 placeholder-slate-400 focus:border-secondary focus:outline-none transition-colors"
                                                    placeholder="e.g. London"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-secondary mb-1">Country:</label>
                                                <select
                                                    value={executor.country}
                                                    onChange={(e) => setExecutorFields(index, { country: e.target.value })}
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
                            })}

                            <button
                                type="button"
                                onClick={onAddExecutor}
                                className="w-full py-4 border-2 border-dashed border-secondary/60 rounded-lg text-secondary text-sm font-semibold tracking-wide hover:bg-secondary/5 transition-colors"
                            >
                                + Add Another Executor
                            </button>
                        </>
                    )}

                    {showBackupSection && (
                        <>
                            <div className="flex gap-4 mb-8">
                                {['yes', 'no'].map((option) => (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => onToggleAlternate(option === 'yes')}
                                        className={`px-8 py-2.5 rounded border-2 text-sm font-semibold uppercase tracking-wide transition-all ${(option === 'yes' && wantsAlternateExecutor) || (option === 'no' && !wantsAlternateExecutor)
                                            ? 'border-secondary bg-secondary/5 text-secondary'
                                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                            }`}
                                    >
                                        {option.toUpperCase()}
                                    </button>
                                ))}
                            </div>

                            {wantsAlternateExecutor &&
                                alternateExecutors.map((executor, index) => (
                                    <div key={executor.id} className="rounded border border-slate-200 bg-white shadow-lg p-6 mb-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <p className="text-base font-semibold text-slate-700">Alternate Executor {index + 1}</p>
                                            {alternateExecutors.length > 1 && (
                                                <button type="button" onClick={() => removeExecutor(index, true)} className="text-rose-500 text-xs font-semibold uppercase tracking-wide hover:text-rose-600">
                                                    Remove
                                                </button>
                                            )}
                                        </div>

                                        <div className="space-y-5">
                                            <div>
                                                <label className="block text-sm text-secondary mb-1">Name:</label>
                                                <input
                                                    type="text"
                                                    value={`${executor.firstName}${executor.lastName ? ` ${executor.lastName}` : ''}`}
                                                    onChange={(e) => handleFullNameChange(index, e.target.value, true)}
                                                    className="w-full border-b border-slate-300 bg-transparent py-2 text-base text-slate-800 placeholder-slate-400 focus:border-secondary focus:outline-none transition-colors"
                                                    placeholder="e.g. William Timothy Smith"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-secondary mb-1">City/Town:</label>
                                                <input
                                                    type="text"
                                                    value={executor.city}
                                                    onChange={(e) => setExecutorFields(index, { city: e.target.value }, true)}
                                                    className="w-full border-b border-slate-300 bg-transparent py-2 text-base text-slate-800 placeholder-slate-400 focus:border-secondary focus:outline-none transition-colors"
                                                    placeholder="e.g. London"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-secondary mb-1">Country:</label>
                                                <select
                                                    value={executor.country}
                                                    onChange={(e) => setExecutorFields(index, { country: e.target.value }, true)}
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
                                ))}

                            {wantsAlternateExecutor && (
                                <button
                                    type="button"
                                    onClick={onAddAlternate}
                                    className="text-secondary text-sm font-semibold hover:underline"
                                >
                                    + Add another alternate executor
                                </button>
                            )}
                        </>
                    )}
                </div>

                <aside className="rounded border border-slate-200 bg-white shadow-sm p-6 h-fit">
                    <h3 className="text-base font-semibold text-slate-700 mb-4">Frequently Asked Questions</h3>
                    <div className="relative" onMouseLeave={() => setFaqTooltip(null)}>
                        <ul className="space-y-3 text-sm text-slate-600">
                            {FAQ_ITEMS.map((item) => (
                                <li key={item.question} className="border-b text-left border-slate-100 pb-3 last:border-b-0 last:pb-0">
                                    <button
                                        type="button"
                                        onMouseEnter={(e) => {
                                            const offsetTop = e.currentTarget.parentElement?.offsetTop ?? 0;
                                            setFaqTooltip({ text: item.answer, top: offsetTop });
                                        }}
                                        className="font-medium text-secondary hover:underline"
                                    >
                                        {item.question}
                                    </button>
                                </li>
                            ))}
                        </ul>
                        {faqTooltip && (
                            <div
                                className="absolute left-[calc(100%+1rem)] w-64 rounded-lg border border-slate-200 bg-white p-4 text-xs text-slate-600 shadow-lg"
                                style={{ top: faqTooltip.top }}
                            >
                                <div className="absolute -left-2 top-4 h-0 w-0 border-y-8 border-y-transparent border-r-8 border-r-slate-200" />
                                <div className="absolute -left-3.5 top-4 h-0 w-0 border-y-7 border-y-transparent border-r-7 border-r-white" />
                                {faqTooltip.text}
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
};

interface GuardianStepProps {
    wantsGuardian: boolean;
    guardians: Guardian[];
    onToggleGuardian: (value: boolean) => void;
    onAddGuardian: () => void;
    onChangeGuardians: (guardians: Guardian[]) => void;
}

const GUARDIAN_FAQ = [
    { question: 'Who can be a guardian?', answer: 'Any responsible adult over 18 who is willing to take on the role. It is best to discuss this with them before naming them.' },
    { question: 'What is a guardian?', answer: 'A guardian is someone you appoint to look after your minor or dependent children if you pass away.' }
];

const GuardianStep: React.FC<GuardianStepProps> = ({ wantsGuardian, guardians, onToggleGuardian, onAddGuardian, onChangeGuardians }) => {
    const [faqTooltip, setFaqTooltip] = useState<{ text: string; top: number } | null>(null);

    const updateGuardian = (index: number, fields: Partial<Guardian>) => {
        const updated = [...guardians];
        updated[index] = { ...updated[index], ...fields };
        onChangeGuardians(updated);
    };

    const removeGuardian = (index: number) => {
        onChangeGuardians(guardians.filter((_, i) => i !== index));
    };

    return (
        <div>
            <h2 className="text-2xl md:text-3xl font-normal text-slate-900 mb-4">Appoint a Guardian</h2>
            <p className="text-sm md:text-base text-secondary mb-8">Do you want to appoint a guardian for your minor or dependent child?</p>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => onToggleGuardian(true)}
                            className={`px-8 py-2.5 rounded border-2 text-sm font-semibold uppercase tracking-wide transition-all cursor-pointer ${wantsGuardian ? 'border-secondary bg-secondary/5 text-secondary' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
                        >
                            YES
                        </button>
                        <button
                            type="button"
                            onClick={() => onToggleGuardian(false)}
                            className={`px-8 py-2.5 rounded border-2 text-sm font-semibold uppercase tracking-wide transition-all cursor-pointer ${!wantsGuardian ? 'border-secondary bg-secondary/5 text-secondary' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
                        >
                            NO
                        </button>
                    </div>

                    {wantsGuardian && (
                        <>
                            {guardians.map((guardian, index) => (
                                <div key={guardian.id} className="rounded border border-slate-200 bg-white shadow-lg p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <p className="text-base font-semibold text-slate-700">Guardian Details</p>
                                        {guardians.length > 1 && (
                                            <button type="button" onClick={() => removeGuardian(index)} className="text-rose-500 text-xs font-semibold uppercase tracking-wide hover:text-rose-600">
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-sm text-secondary mb-1">Full Name:</label>
                                            <input
                                                type="text"
                                                value={guardian.fullName}
                                                onChange={(e) => updateGuardian(index, { fullName: e.target.value })}
                                                className="w-full border-b border-slate-300 bg-transparent py-2 text-base text-slate-800 placeholder-slate-400 focus:border-secondary focus:outline-none transition-colors"
                                                placeholder="e.g. William Timothy Smith"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-secondary mb-1">City/Town:</label>
                                            <input
                                                type="text"
                                                value={guardian.city}
                                                onChange={(e) => updateGuardian(index, { city: e.target.value })}
                                                className="w-full border-b border-slate-300 bg-transparent py-2 text-base text-slate-800 placeholder-slate-400 focus:border-secondary focus:outline-none transition-colors"
                                                placeholder="e.g. London"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-secondary mb-1">Country:</label>
                                            <select
                                                value={guardian.country}
                                                onChange={(e) => updateGuardian(index, { country: e.target.value })}
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
                            ))}

                            <button
                                type="button"
                                onClick={onAddGuardian}
                                className="text-secondary text-sm font-semibold hover:underline"
                            >
                                + Add another guardian
                            </button>
                        </>
                    )}
                </div>

                <aside className="rounded border border-slate-200 bg-white shadow-sm p-6 h-fit">
                    <h3 className="text-base font-semibold text-slate-700 mb-4">Frequently Asked Questions</h3>
                    <div className="relative" onMouseLeave={() => setFaqTooltip(null)}>
                        <ul className="space-y-3 text-sm text-slate-600">
                            {GUARDIAN_FAQ.map((item) => (
                                <li key={item.question} className="border-b text-left border-slate-100 pb-3 last:border-b-0 last:pb-0">
                                    <button
                                        type="button"
                                        onMouseEnter={(e) => {
                                            const offsetTop = e.currentTarget.parentElement?.offsetTop ?? 0;
                                            setFaqTooltip({ text: item.answer, top: offsetTop });
                                        }}
                                        className="font-medium text-secondary hover:underline"
                                    >
                                        {item.question}
                                    </button>
                                </li>
                            ))}
                        </ul>
                        {faqTooltip && (
                            <div
                                className="absolute left-[calc(100%+1rem)] w-64 rounded-lg border border-slate-200 bg-white p-4 text-xs text-slate-600 shadow-lg"
                                style={{ top: faqTooltip.top }}
                            >
                                <div className="absolute -left-2 top-4 h-0 w-0 border-y-8 border-y-transparent border-r-8 border-r-slate-200" />
                                <div className="absolute -left-3.5 top-4 h-0 w-0 border-y-7 border-y-transparent border-r-7 border-r-white" />
                                {faqTooltip.text}
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
};

interface DelayInheritanceStepProps {
    wantsDelay: boolean;
    inheritanceAge: string;
    onToggleDelay: (value: boolean) => void;
    onChangeAge: (age: string) => void;
}

const DELAY_INHERITANCE_FAQ = [
    { question: 'How will the property be held?', answer: 'If you delay inheritance, the assets will be held in trust by your executors or guardians until the child reaches the specified age.' }
];

const DelayInheritanceStep: React.FC<DelayInheritanceStepProps> = ({ wantsDelay, inheritanceAge, onToggleDelay, onChangeAge }) => {
    const [faqTooltip, setFaqTooltip] = useState<{ text: string; top: number } | null>(null);

    return (
        <div>
            <h2 className="text-2xl md:text-3xl font-normal text-slate-900 mb-4">Delay Inheritance</h2>
            <p className="text-sm md:text-base text-secondary mb-8">Do you want your minor beneficiaries to wait until a certain age before they receive their inheritance?</p>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => onToggleDelay(true)}
                            className={`px-8 py-2.5 rounded border-2 text-sm font-semibold uppercase tracking-wide transition-all cursor-pointer ${wantsDelay ? 'border-secondary bg-secondary/5 text-secondary' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
                        >
                            YES
                        </button>
                        <button
                            type="button"
                            onClick={() => onToggleDelay(false)}
                            className={`px-8 py-2.5 rounded border-2 text-sm font-semibold uppercase tracking-wide transition-all cursor-pointer ${!wantsDelay ? 'border-secondary bg-secondary/5 text-secondary' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
                        >
                            NO
                        </button>
                    </div>

                    {wantsDelay && (
                        <div>
                            <label className="block text-sm text-secondary mb-1">Receive inheritance at age:</label>
                            <select
                                value={inheritanceAge}
                                onChange={(e) => onChangeAge(e.target.value)}
                                className="w-full max-w-xs border-b border-slate-300 bg-transparent py-2 text-base text-slate-800 focus:border-secondary focus:outline-none transition-colors cursor-pointer"
                            >
                                {Array.from({ length: 8 }, (_, i) => String(18 + i)).map((age) => (
                                    <option key={age} value={age}>{age}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                <aside className="rounded border border-slate-200 bg-white shadow-sm p-6 h-fit">
                    <h3 className="text-base font-semibold text-slate-700 mb-4">Frequently Asked Questions</h3>
                    <div className="relative" onMouseLeave={() => setFaqTooltip(null)}>
                        <ul className="space-y-3 text-sm text-slate-600">
                            {DELAY_INHERITANCE_FAQ.map((item) => (
                                <li key={item.question} className="border-b text-left border-slate-100 pb-3 last:border-b-0 last:pb-0">
                                    <button
                                        type="button"
                                        onMouseEnter={(e) => {
                                            const offsetTop = e.currentTarget.parentElement?.offsetTop ?? 0;
                                            setFaqTooltip({ text: item.answer, top: offsetTop });
                                        }}
                                        className="font-medium text-secondary hover:underline"
                                    >
                                        {item.question}
                                    </button>
                                </li>
                            ))}
                        </ul>
                        {faqTooltip && (
                            <div
                                className="absolute left-[calc(100%+1rem)] w-64 rounded-lg border border-slate-200 bg-white p-4 text-xs text-slate-600 shadow-lg"
                                style={{ top: faqTooltip.top }}
                            >
                                <div className="absolute -left-2 top-4 h-0 w-0 border-y-8 border-y-transparent border-r-8 border-r-slate-200" />
                                <div className="absolute -left-3.5 top-4 h-0 w-0 border-y-7 border-y-transparent border-r-7 border-r-white" />
                                {faqTooltip.text}
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
};

interface GiftsStepProps {
    wantsGifts: boolean;
    gifts: SpecificGift[];
    onToggle: (value: boolean) => void;
    onAddGift: () => void;
    onChangeGifts: (gifts: SpecificGift[]) => void;
}

const GIFT_FAQ = [
    { question: 'Is there anything I cannot give away?', answer: 'Certain jointly owned assets or property held in trust may have restrictions. If in doubt, list the item but speak to a solicitor.' },
    { question: 'Should I add sentimental items?', answer: 'Yes. Listing keepsakes ensures they reach the right person and avoids confusion later.' }
];

const GiftsStep: React.FC<GiftsStepProps> = ({ wantsGifts, gifts, onToggle, onAddGift, onChangeGifts }) => {
    const [faqTooltip, setFaqTooltip] = useState<{ text: string; top: number } | null>(null);

    const updateGift = (index: number, fields: Partial<SpecificGift>) => {
        const updated = [...gifts];
        updated[index] = { ...updated[index], ...fields };
        onChangeGifts(updated);
    };

    const removeGift = (index: number) => {
        onChangeGifts(gifts.filter((_, i) => i !== index));
    };

    return (
        <div>
            <h2 className="text-2xl md:text-3xl font-normal text-slate-900 mb-4">Gifts</h2>
            <p className="text-sm md:text-base text-secondary mb-8">Do you want to leave any specific gifts in your will?</p>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => onToggle(true)}
                            className={`px-8 py-2.5 rounded border-2 text-sm font-semibold uppercase tracking-wide transition-all cursor-pointer ${wantsGifts ? 'border-secondary bg-secondary/5 text-secondary' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
                        >
                            YES
                        </button>
                        <button
                            type="button"
                            onClick={() => onToggle(false)}
                            className={`px-8 py-2.5 rounded border-2 text-sm font-semibold uppercase tracking-wide transition-all cursor-pointer ${!wantsGifts ? 'border-secondary bg-secondary/5 text-secondary' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
                        >
                            NO
                        </button>
                    </div>

                    {wantsGifts && (
                        <>
                            {gifts.map((gift, index) => (
                                <div key={gift.id} className="rounded border border-slate-200 bg-white shadow-lg p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <p className="text-base font-semibold text-secondary">{index === 0 ? 'First Gift' : `Gift ${index + 1}`}</p>
                                        {gifts.length > 1 && (
                                            <button type="button" onClick={() => removeGift(index)} className="text-rose-500 text-xs font-semibold uppercase tracking-wide hover:text-rose-600">
                                                Remove
                                            </button>
                                        )}
                                    </div>

                                    <div className="space-y-5">
                                        <div className="flex gap-3">
                                            {(['individual', 'charity'] as const).map((type) => (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    onClick={() => updateGift(index, { giftType: type })}
                                                    className={`flex-1 px-4 py-2 border-2 text-sm font-semibold uppercase tracking-wide transition-all ${gift.giftType === type
                                                        ? 'border-secondary text-secondary bg-secondary/5'
                                                        : 'border-slate-200 text-slate-600 bg-white hover:border-slate-300'}`}
                                                >
                                                    {type === 'individual' ? 'Individual' : 'Charity or organisation'}
                                                </button>
                                            ))}
                                        </div>

                                        <div>
                                            <label className="block text-sm text-secondary mb-1">Gift Description:</label>
                                            <input
                                                type="text"
                                                value={gift.description}
                                                onChange={(e) => updateGift(index, { description: e.target.value })}
                                                className="w-full border-b border-slate-300 bg-transparent py-2 text-base text-slate-800 placeholder-slate-400 focus:border-secondary focus:outline-none transition-colors"
                                                placeholder="e.g. My set of golf clubs"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm text-secondary mb-1">Full Name of Recipient:</label>
                                            <input
                                                type="text"
                                                value={gift.recipientName}
                                                onChange={(e) => updateGift(index, { recipientName: e.target.value })}
                                                className="w-full border-b border-slate-300 bg-transparent py-2 text-base text-slate-800 placeholder-slate-400 focus:border-secondary focus:outline-none transition-colors"
                                                placeholder="e.g. William Timothy Smith"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm text-secondary mb-1">City/Town:</label>
                                                <input
                                                    type="text"
                                                    value={gift.city}
                                                    onChange={(e) => updateGift(index, { city: e.target.value })}
                                                    className="w-full border-b border-slate-300 bg-transparent py-2 text-base text-slate-800 placeholder-slate-400 focus:border-secondary focus:outline-none transition-colors"
                                                    placeholder="e.g. London"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-secondary mb-1">Country:</label>
                                                <select
                                                    value={gift.country}
                                                    onChange={(e) => updateGift(index, { country: e.target.value })}
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

                                        <div className="flex items-center gap-2">
                                            <input
                                                id={`alternate-${gift.id}`}
                                                type="checkbox"
                                                checked={gift.allowAlternate}
                                                onChange={(e) => updateGift(index, { allowAlternate: e.target.checked })}
                                                className="h-4 w-4 border border-slate-300 rounded"
                                            />
                                            <label htmlFor={`alternate-${gift.id}`} className="text-sm text-slate-600">
                                                List an alternate choice for this gift
                                            </label>
                                        </div>

                                        {gift.allowAlternate && (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm text-secondary mb-1">Full Name of Alternate Recipient:</label>
                                                    <input
                                                        type="text"
                                                        value={gift.alternateRecipientName}
                                                        onChange={(e) => updateGift(index, { alternateRecipientName: e.target.value })}
                                                        className="w-full border-b border-slate-300 bg-transparent py-2 text-base text-slate-800 placeholder-slate-400 focus:border-secondary focus:outline-none transition-colors"
                                                        placeholder="e.g. Sarah Doe"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm text-secondary mb-1">City/Town:</label>
                                                        <input
                                                            type="text"
                                                            value={gift.alternateCity}
                                                            onChange={(e) => updateGift(index, { alternateCity: e.target.value })}
                                                            className="w-full border-b border-slate-300 bg-transparent py-2 text-base text-slate-800 placeholder-slate-400 focus:border-secondary focus:outline-none transition-colors"
                                                            placeholder="e.g. London"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm text-secondary mb-1">Country:</label>
                                                        <select
                                                            value={gift.alternateCountry}
                                                            onChange={(e) => updateGift(index, { alternateCountry: e.target.value })}
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
                                        )}
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={onAddGift}
                                className="text-secondary text-sm font-semibold hover:underline"
                            >
                                + Add another gift
                            </button>
                        </>
                    )}
                </div>

                <aside className="rounded border border-slate-200 bg-white shadow-sm p-6 h-fit">
                    <h3 className="text-base font-semibold text-slate-700 mb-4">Frequently Asked Questions</h3>
                    <div className="relative" onMouseLeave={() => setFaqTooltip(null)}>
                        <ul className="space-y-3 text-sm text-slate-600">
                            {GIFT_FAQ.map((item) => (
                                <li key={item.question} className="border-b text-left border-slate-100 pb-3 last:border-b-0 last:pb-0">
                                    <button
                                        type="button"
                                        onMouseEnter={(e) => {
                                            const offsetTop = e.currentTarget.parentElement?.offsetTop ?? 0;
                                            setFaqTooltip({ text: item.answer, top: offsetTop });
                                        }}
                                        className="font-medium text-secondary hover:underline"
                                    >
                                        {item.question}
                                    </button>
                                </li>
                            ))}
                        </ul>
                        {faqTooltip && (
                            <div
                                className="absolute left-[calc(100%+1rem)] w-64 rounded-lg border border-slate-200 bg-white p-4 text-xs text-slate-600 shadow-lg"
                                style={{ top: faqTooltip.top }}
                            >
                                <div className="absolute -left-2 top-4 h-0 w-0 border-y-8 border-y-transparent border-r-8 border-r-slate-200" />
                                <div className="absolute -left-3.5 top-4 h-0 w-0 border-y-7 border-y-transparent border-r-7 border-r-white" />
                                {faqTooltip.text}
                            </div>
                        )}
                    </div>
                </aside>
            </div>
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