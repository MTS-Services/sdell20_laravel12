import React, { useEffect, useState, useRef } from 'react';
import { Users, FileText, Clock, User, Heart } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import StepsHeader from '@/components/frontend/will/steps-header';
import { SeoHead } from '@/components/seo-head';
import type {
    MaritalStatus, PersonalInfo, Beneficiary, Executor, Child,
    Guardian, SpecificGift, Pet, AdditionalClause, WillData
} from '@/components/frontend/will/steps/will-types';
import GetStartedStep from '@/components/frontend/will/steps/get-started-step';
import ExecutorsStep from '@/components/frontend/will/steps/executors-step';
import ChildrenStep from '@/components/frontend/will/steps/children-step';
import GuardianStep from '@/components/frontend/will/steps/guardian-step';
import DelayInheritanceStep from '@/components/frontend/will/steps/delay-inheritance-step';
import GiftsStep from '@/components/frontend/will/steps/gifts-step';
import RemainderStep from '@/components/frontend/will/steps/remainder-step';
import TotalFailureClauseStep from '@/components/frontend/will/steps/total-failure-clause-step';
import PaymentStep from '@/components/frontend/will/steps/payment-step';
import PetsStep from '@/components/frontend/will/steps/pets-step';
import AdditionalDetailsStep from '@/components/frontend/will/steps/additional-details-step';
import SigningStep from '@/components/frontend/will/steps/signing-step';
import PrintDownloadStep from '@/components/frontend/will/steps/print-download-step';
import SavingOverlay from '@/components/frontend/will/steps/saving-overlay';
import { TOTAL_INTERNAL_STEPS, WIZARD_STEPS } from '@/components/frontend/will/steps/wizard-constants';
import SpouseStep from '@/components/frontend/will/steps/spouse-step';

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
        <div className={`mb-2 ${selected ? 'text-secondary' : 'text-primary-600'}`}>
            {icon}
        </div>
        <span className={`text-xs font-normal ${selected ? 'text-secondary' : 'text-primary-600'}`}>
            {label}
        </span>
    </button>
);


const LAST_STEP = TOTAL_INTERNAL_STEPS - 1; // 12 — Review & Download

function restoreSessionData(): { restoredData: WillData | null; restoredType: 'Me' | 'Mirror' | null } {
    let restoredData: WillData | null = null;
    let restoredType: 'Me' | 'Mirror' | null = null;
    try {
        const raw = sessionStorage.getItem('will_draft_data');
        if (raw) restoredData = JSON.parse(raw) as WillData;
        const rawType = sessionStorage.getItem('will_draft_type');
        if (rawType === 'Me' || rawType === 'Mirror') restoredType = rawType;
    } catch { /* ignore */ }
    return { restoredData, restoredType };
}

function getInitialState(): { phase: 'landing' | 'wizard'; step: number; restoredData: WillData | null; restoredType: 'Me' | 'Mirror' | null } {
    if (typeof window === 'undefined') return { phase: 'landing', step: 0, restoredData: null, restoredType: null };

    const params = new URLSearchParams(window.location.search);

    // Came back from payment — jump to Final Details (step 10)
    if (params.get('step') === 'payment-complete') {
        const { restoredData, restoredType } = restoreSessionData();
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, '', cleanUrl);
        return { phase: 'wizard', step: 10, restoredData, restoredType };
    }

    // Legacy: came back from old payment flow — jump to Print/Download (last step)
    if (params.get('step') === 'download') {
        const { restoredData, restoredType } = restoreSessionData();
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, '', cleanUrl);
        return { phase: 'wizard', step: LAST_STEP, restoredData, restoredType };
    }

    // Came back from registration — resume at step 1 (Executors)
    if (params.get('resume') === 'will') {
        const { restoredData, restoredType } = restoreSessionData();
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, '', cleanUrl);
        if (restoredData) {
            return { phase: 'wizard', step: 1, restoredData, restoredType };
        }
    }

    return { phase: 'landing', step: 0, restoredData: null, restoredType: null };
}

const WillCreationWizard: React.FC = () => {
    const initialState = getInitialState();
    const page = usePage();
    const auth = (page.props as { auth?: { user?: { id: number } } }).auth;
    const isLoggedIn = Boolean(auth?.user?.id);
    const [phase, setPhase] = useState<'landing' | 'wizard'>(initialState.phase);
    const [currentStep, setCurrentStep] = useState(initialState.step);
    const [isSaving, setIsSaving] = useState(false);
    const [isSpouseStage, setIsSpouseStage] = useState(false);
    const [spouseStageCompleted, setSpouseStageCompleted] = useState(false);
    const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left');
    const [isAnimating, setIsAnimating] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const [willData, setWillData] = useState<WillData>(initialState.restoredData ?? {
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
        spouse: {
            fullName: '',
            executorId: null
        },
        spouseIsExecutor: true,
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
        totalFailureStrategy: 'family',
        totalFailureBeneficiaries: [],
        distributionType: 'percentage' as const,
        specificGifts: [],
        hasPets: false,
        pets: [],
        wantsAdditionalClauses: false,
        additionalClauses: [],
        signingTimeline: 'today',
        signingDate: '',
        signingCity: '',
        signingCountry: 'England'
    });

    const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
        setWillData((prev) => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, [field]: value }
        }));
    };

    const updateSpouseInfo = (fullName: string) => {
        setWillData((prev) => ({
            ...prev,
            spouse: { ...prev.spouse, fullName }
        }));
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

    const createBeneficiary = (type: 'person' | 'charity'): Beneficiary => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        type,
        percentage: 0,
        city: '',
        country: 'England',
        allowAlternate: false,
        alternateName: '',
        alternateCity: '',
        alternateCountry: 'England'
    });

    const addBeneficiary = (type: 'person' | 'charity') => {
        setWillData({
            ...willData,
            beneficiaries: [...willData.beneficiaries, createBeneficiary(type)]
        });
    };

    const addTotalFailureBeneficiary = (type: 'person' | 'charity') => {
        setWillData({
            ...willData,
            totalFailureBeneficiaries: [...willData.totalFailureBeneficiaries, createBeneficiary(type)]
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

    const createPet = (): Pet => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: '',
        description: '',
        fundAmount: '',
        executorAppointCaretaker: true
    });

    const addPet = () => {
        setWillData({
            ...willData,
            pets: [...willData.pets, createPet()]
        });
    };

    const createClause = (): AdditionalClause => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        text: ''
    });

    const addClause = () => {
        setWillData({
            ...willData,
            additionalClauses: [...willData.additionalClauses, createClause()]
        });
    };

    const handleCreateDocument = () => {
        if (willData.personalInfo.maritalStatus) {
            setIsSpouseStage(false);
            setSpouseStageCompleted(false);
            setPhase('wizard');
            setCurrentStep(0);
        }
    };

    const isMarried = willData.personalInfo.maritalStatus === 'married';
    const isCivilPartner = willData.personalInfo.maritalStatus === 'civil-partner';
    const partnerRelationshipLabel = isCivilPartner ? 'Civil Partner' : 'Spouse';
    const partnerQuestionLabel = isCivilPartner ? 'your civil partner' : 'your spouse';
    const shouldShowSpouseStep = isMarried || isCivilPartner;

    const ensureSpouseExecutorPrefill = () => {
        const spouseName = willData.spouse.fullName.trim();
        if (!spouseName) {
            return;
        }

        setWillData((prev) => {
            const [firstName, ...rest] = spouseName.split(' ');
            const fallbackFirst = firstName || prev.executors[0]?.firstName || '';
            const lastName = rest.join(' ');
            const executors = prev.executors.length ? [...prev.executors] : [createExecutor()];
            const primaryExecutor = {
                ...executors[0],
                firstName: fallbackFirst,
                lastName,
                relationship: executors[0].relationship || partnerRelationshipLabel
            };
            executors[0] = primaryExecutor;

            return {
                ...prev,
                executors,
                spouse: {
                    ...prev.spouse,
                    executorId: primaryExecutor.id
                },
                spouseIsExecutor: true
            };
        });
    };

    const handleSpouseExecutorToggle = (value: boolean) => {
        if (value) {
            ensureSpouseExecutorPrefill();
            return;
        }

        setWillData((prev) => {
            const executors = prev.executors.length ? [...prev.executors] : [createExecutor()];
            if (executors.length === 0) {
                executors.push(createExecutor());
            }

            executors[0] = {
                ...executors[0],
                firstName: executors[0].firstName && executors[0].firstName !== prev.spouse.fullName ? executors[0].firstName : '',
                lastName: executors[0].lastName && executors[0].lastName !== prev.spouse.fullName ? executors[0].lastName : '',
                relationship: executors[0].relationship === 'Spouse' || executors[0].relationship === 'Civil Partner' ? '' : executors[0].relationship
            };

            return {
                ...prev,
                executors,
                spouseIsExecutor: false,
                spouse: { ...prev.spouse, executorId: null }
            };
        });
    };

    const animateTransition = (direction: 'left' | 'right', callback: () => void) => {
        setSlideDirection(direction);
        setIsAnimating(true);
        setTimeout(() => {
            callback();
            setIsAnimating(false);
        }, 300);
    };

    const handleSaveAndContinue = () => {
        if (phase !== 'wizard') {
            return;
        }

        const isLastStep = currentStep === TOTAL_INTERNAL_STEPS - 1;

        if (currentStep === 0 && shouldShowSpouseStep) {
            if (!spouseStageCompleted) {
                if (!isSpouseStage) {
                    setIsSpouseStage(true);
                    return;
                }

                if (isSpouseStage && !willData.spouse.fullName.trim()) {
                    return;
                }

                ensureSpouseExecutorPrefill();
                setIsSpouseStage(false);
                setSpouseStageCompleted(true);
            }
        }

        // After Get Started step (step 0), redirect to register if not logged in
        if (currentStep === 0 && !isLoggedIn) {
            // Save will data to sessionStorage so it survives the registration round-trip
            try {
                sessionStorage.setItem('will_draft_data', JSON.stringify(willData));
                sessionStorage.setItem('will_draft_type', shouldShowSpouseStep ? 'Mirror' : 'Me');
            } catch { /* storage full — best effort */ }

            // Set intended URL so Fortify redirects back after registration
            window.location.href = `/register?redirect=${encodeURIComponent('/will-writing/start?resume=will')}`;
            return;
        }

        if (!isLastStep) {
            setIsSaving(true);
            setTimeout(() => {
                setIsSaving(false);
                animateTransition('left', () => {
                    setCurrentStep((prev) => Math.min(prev + 1, TOTAL_INTERNAL_STEPS - 1));
                });
            }, 800);
        }
    };

    const handleBack = () => {
        if (currentStep === 0 && isSpouseStage) {
            setIsSpouseStage(false);
            return;
        }

        if (currentStep > 0) {
            animateTransition('right', () => {
                setCurrentStep(currentStep - 1);
            });
        } else {
            setPhase('landing');
        }
    };

    const handleSkip = () => {
        if (currentStep === 0 && isSpouseStage) {
            setIsSpouseStage(false);
            setSpouseStageCompleted(true);
            return;
        }

        if (currentStep < TOTAL_INTERNAL_STEPS - 1) {
            animateTransition('left', () => {
                setCurrentStep(currentStep + 1);
            });
        }
    };

    // 9 visible nav steps. Executor has 2 sub-steps (1,2). Children has 3 (3,4,5). Remainder has 2 (7,8). Final Details has 2 (10,11).
    // Internal → nav index mapping:
    // 0→0(GetStarted), 1,2→1(Executor), 3,4,5→2(Children), 6→3(Gifts), 7,8→4(Remainder), 9→5(Payment), 10,11→6(FinalDetails), 12→7(Signing), 13→8(Print)
    const getNavIndex = (step: number): number => {
        if (step <= 0) return 0;
        if (step <= 2) return 1;
        if (step <= 5) return 2;
        if (step === 6) return 3;
        if (step <= 8) return 4;
        if (step === 9) return 5;
        if (step <= 11) return 6;
        if (step === 12) return 7;
        return 8;
    };

    const currentNavIndex = getNavIndex(currentStep);

    // Progress: sub-steps within a group advance the bar fractionally
    const getProgressPercent = (step: number): number => {
        if (step === 0) return (1 / WIZARD_STEPS.length) * 100;       // Get Started
        if (step === 1) return (1.33 / WIZARD_STEPS.length) * 100;    // Executor
        if (step === 2) return (1.90 / WIZARD_STEPS.length) * 100;    // Backup Executor
        if (step === 3) return (2.33 / WIZARD_STEPS.length) * 100;    // Children
        if (step === 4) return (2.66 / WIZARD_STEPS.length) * 100;    // Guardian
        if (step === 5) return (2.80 / WIZARD_STEPS.length) * 100;    // Delay Inheritance
        if (step === 6) return (3.50 / WIZARD_STEPS.length) * 100;    // Gifts
        if (step === 7) return (4 / WIZARD_STEPS.length) * 100;       // Remainder of Estate
        if (step === 8) return (4.66 / WIZARD_STEPS.length) * 100;    // Total Failure Clause
        if (step === 9) return (5.50 / WIZARD_STEPS.length) * 100;    // Payment
        if (step === 10) return (6.33 / WIZARD_STEPS.length) * 100;   // Pets
        if (step === 11) return (6.66 / WIZARD_STEPS.length) * 100;   // Additional Details
        if (step === 12) return (7.50 / WIZARD_STEPS.length) * 100;   // Signing
        return (9 / WIZARD_STEPS.length) * 100;                        // Print/Download
    };

    const progressPercent = getProgressPercent(currentStep);
    const isWizardComplete = currentStep === TOTAL_INTERNAL_STEPS - 1;
    const isPaymentStep = currentStep === 9;
    const shouldShowNavActions = phase === 'wizard' && !isWizardComplete && !isPaymentStep;

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
        if (phase === 'wizard' && currentStep === 7 && willData.beneficiaries.length === 0) {
            addBeneficiary('person');
        }
    }, [phase, currentStep, willData.executors.length, willData.wantsAlternateExecutor, willData.alternateExecutors.length, willData.wantsGuardian, willData.guardians.length, willData.beneficiaries.length]);

    const renderWizardStepContent = () => {
        if (currentStep === 0 && shouldShowSpouseStep && isSpouseStage) {
            return (
                <SpouseStep
                    spouseName={willData.spouse.fullName}
                    onChange={updateSpouseInfo}
                    partnerType={isCivilPartner ? 'civil-partner' : 'spouse'}
                />
            );
        }

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
                        showSpouseQuestion={shouldShowSpouseStep && Boolean(willData.spouse.fullName.trim())}
                        spouseName={willData.spouse.fullName}
                        spouseIsExecutor={willData.spouseIsExecutor}
                        partnerLabel={partnerQuestionLabel}
                        onToggleSpouseExecutor={handleSpouseExecutorToggle}
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
                        beneficiaries={willData.beneficiaries}
                        onAddBeneficiary={addBeneficiary}
                        onChangeBeneficiaries={(beneficiaries: Beneficiary[]) => setWillData({ ...willData, beneficiaries })}
                    />
                );
            case 8:
                return (
                    <TotalFailureClauseStep
                        totalFailureStrategy={willData.totalFailureStrategy}
                        totalFailureBeneficiaries={willData.totalFailureBeneficiaries}
                        onChangeStrategy={(value: 'family' | 'alternate') => setWillData({
                            ...willData,
                            totalFailureStrategy: value,
                            totalFailureBeneficiaries: value === 'alternate'
                                ? (willData.totalFailureBeneficiaries.length ? willData.totalFailureBeneficiaries : [createBeneficiary('person')])
                                : []
                        })}
                        onAddBeneficiary={addTotalFailureBeneficiary}
                        onChangeBeneficiaries={(beneficiaries: Beneficiary[]) => setWillData({ ...willData, totalFailureBeneficiaries: beneficiaries })}
                    />
                );
            case 9:
                return (
                    <PaymentStep
                        willType={shouldShowSpouseStep ? 'Mirror' : 'Me'}
                        willData={willData as unknown as Record<string, unknown>}
                        onPaymentComplete={() => {
                            animateTransition('left', () => {
                                setCurrentStep(10);
                            });
                        }}
                    />
                );
            case 10:
                return (
                    <PetsStep
                        hasPets={willData.hasPets}
                        pets={willData.pets}
                        onToggle={(value: boolean) => setWillData({
                            ...willData,
                            hasPets: value,
                            pets: value ? (willData.pets.length ? willData.pets : [createPet()]) : []
                        })}
                        onAddPet={addPet}
                        onChangePets={(pets: Pet[]) => setWillData({ ...willData, pets })}
                    />
                );
            case 11:
                return (
                    <AdditionalDetailsStep
                        wantsClauses={willData.wantsAdditionalClauses}
                        clauses={willData.additionalClauses}
                        onToggle={(value: boolean) => setWillData({
                            ...willData,
                            wantsAdditionalClauses: value,
                            additionalClauses: value ? (willData.additionalClauses.length ? willData.additionalClauses : [createClause()]) : []
                        })}
                        onAddClause={addClause}
                        onChangeClauses={(clauses: AdditionalClause[]) => setWillData({ ...willData, additionalClauses: clauses })}
                    />
                );
            case 12:
                return (
                    <SigningStep
                        signingTimeline={willData.signingTimeline}
                        signingDate={willData.signingDate}
                        signingCity={willData.signingCity}
                        signingCountry={willData.signingCountry}
                        onChangeTimeline={(value) => setWillData({ ...willData, signingTimeline: value })}
                        onChangeDate={(value) => setWillData({ ...willData, signingDate: value })}
                        onChangeCity={(value) => setWillData({ ...willData, signingCity: value })}
                        onChangeCountry={(value) => setWillData({ ...willData, signingCountry: value })}
                    />
                );
            case 13:
                return <PrintDownloadStep
                    data={willData}
                    willType={shouldShowSpouseStep ? 'Mirror' : 'Me'}
                />;
            default:
                return null;
        }
    };

    // ── PHASE 1: LANDING PAGE ──
    if (phase === 'landing') {
        return (
            <>
                <SeoHead
                    fallbackTitle="Will Writing Start"
                    fallbackDescription="Start creating your will online in minutes with our guided step-by-step process."
                    fallbackKeywords="will writing, online will, will start"
                />
                <div className="min-h-screen bg-primary-50 font-sans">
                    <StepsHeader />

                    {/* Dark Header */}
                    <div className="bg-primary px-4 py-14">
                        <div className="max-w-6xl mx-auto text-center">
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-10 leading-tight">
                                Create Your Legally Sound Will Online
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
                    <div className="max-w-3xl mx-auto mt-8 bg-white rounded shadow-sm border border-primary-100 px-10 py-10 md:px-14">
                        <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">
                            Is the Will just for You? Or You and a Partner?
                        </h2>
                        <p className="text-base text-text-muted mb-8">
                            Select the option that best describes your situation
                        </p>

                    <div className="grid md:grid-cols-2 gap-6 mb-10">
                        {/* Single Will Option */}
                        <button
                            type="button"
                            onClick={() => updatePersonalInfo('maritalStatus', 'single')}
                            className={`p-6 rounded-lg border-2 transition-all duration-200 text-left cursor-pointer ${willData.personalInfo.maritalStatus === 'single'
                                ? 'border-secondary bg-primary-50'
                                : 'border-primary-100 bg-white hover:border-primary-200'
                                }`}
                        >
                            <div className="flex items-start gap-4">
                                <User className={`w-12 h-12 shrink-0 ${willData.personalInfo.maritalStatus === 'single' ? 'text-secondary' : 'text-primary-500'
                                    }`} />
                                <div>
                                    <h3 className="text-xl font-semibold text-primary mb-2">Single Will</h3>
                                    <p className="text-sm text-text-muted">
                                        Make a will just for you, whether or not you're in a relationship.
                                    </p>
                                </div>
                            </div>
                        </button>

                        {/* Mirror Wills Option */}
                        <button
                            type="button"
                            onClick={() => updatePersonalInfo('maritalStatus', 'married')}
                            className={`p-6 rounded-lg border-2 transition-all duration-200 text-left cursor-pointer ${willData.personalInfo.maritalStatus === 'married' || willData.personalInfo.maritalStatus === 'civil-partner'
                                ? 'border-secondary bg-primary-50'
                                : 'border-primary-100 bg-white hover:border-primary-200'
                                }`}
                        >
                            <div className="flex items-start gap-4">
                                <Users className={`w-12 h-12 shrink-0 ${willData.personalInfo.maritalStatus === 'married' || willData.personalInfo.maritalStatus === 'civil-partner'
                                    ? 'text-secondary'
                                    : 'text-primary-500'
                                    }`} />
                                <div>
                                    <h3 className="text-xl font-semibold text-primary mb-2">Mirror Wills</h3>
                                    <p className="text-sm text-text-muted">
                                        Make a will with someone who has wishes similar to yours, such as a partner.
                                    </p>
                                </div>
                            </div>
                        </button>
                    </div>

                    {/* Civil Partner Option - shown after Mirror Wills is selected */}
                    {(willData.personalInfo.maritalStatus === 'married' || willData.personalInfo.maritalStatus === 'civil-partner') && (
                        <div className="mb-8 p-4 bg-primary-50 rounded-lg border border-primary-100">
                            <p className="text-sm font-medium text-primary mb-3">What is your relationship status?</p>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => updatePersonalInfo('maritalStatus', 'married')}
                                    className={`flex-1 px-4 py-2 rounded border-2 text-sm font-medium transition-all cursor-pointer ${willData.personalInfo.maritalStatus === 'married'
                                        ? 'border-secondary bg-white text-secondary'
                                        : 'border-primary-100 bg-white text-primary hover:border-primary-200'
                                        }`}
                                >
                                    Married
                                </button>
                                <button
                                    type="button"
                                    onClick={() => updatePersonalInfo('maritalStatus', 'civil-partner')}
                                    className={`flex-1 px-4 py-2 rounded border-2 text-sm font-medium transition-all cursor-pointer ${willData.personalInfo.maritalStatus === 'civil-partner'
                                        ? 'border-secondary bg-white text-secondary'
                                        : 'border-primary-100 bg-white text-primary hover:border-primary-200'
                                        }`}
                                >
                                    Civil Partner
                                </button>
                            </div>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={handleCreateDocument}
                        disabled={!willData.personalInfo.maritalStatus}
                        className={`w-full px-7 py-3.5 rounded-lg text-base font-bold uppercase tracking-wide transition-all duration-200 ${willData.personalInfo.maritalStatus
                            ? 'bg-secondary text-white hover:bg-primary cursor-pointer shadow-md'
                            : 'bg-muted text-muted-foreground cursor-not-allowed'
                            }`}
                    >
                        {willData.personalInfo.maritalStatus === 'single' ? 'Create Single Will' : 'Create Mirror Wills'}
                    </button>
                    </div>
                </div>
            </>
        );
    }

    // ── PHASE 2: WIZARD ──
    return (
        <>
            <SeoHead
                fallbackTitle="Will Writing Start"
                fallbackDescription="Continue creating your will online with our step-by-step process."
                fallbackKeywords="will writing, online will, will start"
            />
            <div className="min-h-screen bg-gray-100 font-sans">
                <StepsHeader />

                {isSaving && <SavingOverlay />}

            {/* Dark Header with Step Navigation */}
            <div className="bg-slate-700">
                <div className="max-w-6xl mx-auto px-4 py-10 lg:py-14">
                    <h1 className="text-lg md:text-xl lg:text-2xl font-semibold text-white uppercase tracking-wider mb-6">
                        Create Your Legally Sound Will Online
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
                                if (navIdx === 3) return 6;
                                if (navIdx === 4) return 7;
                                if (navIdx === 5) return 9;
                                if (navIdx === 6) return 10;
                                if (navIdx === 7) return 12;
                                return 13;
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
                    <div className="relative h-3.5 mt-3 bg-slate-800 rounded-full z-50">
                        <div
                            className="h-full bg-primary-200 rounded-xs transition-all duration-500"
                            style={{ width: `${progressPercent}%` }}
                        />
                        {isWizardComplete && (
                            <div className="absolute -right-3 top-1/2 -translate-y-1/2 ">
                                <img
                                    src="https://www.lawdepot.co.uk/images/slate/shield.png"
                                    alt="Completed"
                                    className="w-6 h-6"
                                />
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* Main Content with step transition animation */}
            <div
                ref={contentRef}
                className={`max-w-5xl mx-auto px-4 py-12 md:px-8 transition-all duration-300 ease-in-out ${isAnimating
                    ? slideDirection === 'left'
                        ? 'opacity-0 translate-x-8'
                        : 'opacity-0 -translate-x-8'
                    : 'opacity-100 translate-x-0'
                    }`}
            >
                {renderWizardStepContent()}

                {/* Action Buttons */}
                {shouldShowNavActions && (
                    <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                        <button
                            type="button"
                            onClick={handleBack}
                            disabled={isSaving}
                            className="w-full rounded border border-slate-300 bg-slate-100 px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-primary-700 transition-colors duration-200 hover:bg-slate-200 cursor-pointer disabled:opacity-50 sm:w-auto"
                        >
                            BACK
                        </button>
                        <button
                            type="button"
                            onClick={handleSaveAndContinue}
                            disabled={isSaving}
                            className="w-full rounded bg-emerald-600 px-8 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition-colors duration-200 hover:bg-emerald-700 cursor-pointer disabled:opacity-50 sm:w-auto"
                        >
                            {isSaving ? 'SAVING...' : 'SAVE AND CONTINUE'}
                        </button>
                        <button
                            type="button"
                            onClick={handleSkip}
                            disabled={isSaving}
                            className="w-full text-sm font-medium text-secondary transition-colors cursor-pointer bg-transparent border-none hover:text-secondary/80 disabled:opacity-50 sm:w-auto"
                        >
                            Skip this step for now
                        </button>
                    </div>
                )}
            </div>
            </div>
        </>
    );
};

export default WillCreationWizard;
