import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import generateWillPdf from '@/components/frontend/will/generate-will-pdf';
import type { WillData } from './will-types';

function getCsrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    if (match) return decodeURIComponent(match[1]);
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta?.getAttribute('content') ?? '';
}

const ReviewItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div>
        <div className="text-xs text-primary-500 font-medium mb-1">{label}</div>
        <div className="text-sm text-primary-800 font-medium">{value || 'Not provided'}</div>
    </div>
);

export interface PrintDownloadStepProps {
    data: WillData;
    willType?: 'Me' | 'Mirror';
}

const PrintDownloadStep: React.FC<PrintDownloadStepProps> = ({ data, willType = 'Me' }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [hasPaid, setHasPaid] = useState(false);
    const [isCheckingPayment, setIsCheckingPayment] = useState(false);
    const [savedWillId, setSavedWillId] = useState<number | null>(() => {
        if (typeof window === 'undefined') {
            return null;
        }

        const stored = window.sessionStorage.getItem('saved_will_id');
        if (!stored) {
            return null;
        }

        const parsed = Number(stored);
        return Number.isNaN(parsed) ? null : parsed;
    });
    const [isSavingWill, setIsSavingWill] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [hasAutoSaved, setHasAutoSaved] = useState(false);
    const page = usePage();
    const auth = (page.props as { auth?: { user?: { id: number } } }).auth;
    const isLoggedIn = Boolean(auth?.user?.id);

    const productType = willType === 'Mirror' ? 'mirror_will' : 'single_will';

    const payload = useMemo(() => ({
        will_type: willType,
        personal_info: data.personalInfo,
        spouse: data.spouse,
        executors: data.executors,
        alternate_executors: data.alternateExecutors,
        children: data.children,
        guardians: data.guardians,
        beneficiaries: data.beneficiaries,
        specific_gifts: data.specificGifts,
        total_failure_beneficiaries: data.totalFailureBeneficiaries,
        pets: data.pets,
        additional_clauses: data.additionalClauses,
        signing_timeline: data.signingTimeline,
        signing_date: data.signingDate || null,
        signing_city: data.signingCity,
        signing_country: data.signingCountry,
        form_data: data,
    }), [data, willType]);

    const saveWillData = useCallback(async () => {
        if (!isLoggedIn) {
            return;
        }

        setIsSavingWill(true);
        setSaveError(null);

        try {
            const response = await fetch('/wills/save-draft', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-XSRF-TOKEN': getCsrfToken(),
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    ...payload,
                    will_id: savedWillId ?? undefined,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save will data');
            }

            const result = await response.json() as {
                data?: { will_id?: number };
            };

            const newId = result?.data?.will_id;
            if (newId) {
                setSavedWillId(newId);
                if (typeof window !== 'undefined') {
                    window.sessionStorage.setItem('saved_will_id', String(newId));
                }
            }
        } catch (error) {
            setSaveError('Unable to save your Will details. Please try again.');
        } finally {
            setIsSavingWill(false);
        }
    }, [isLoggedIn, payload, savedWillId]);

    useEffect(() => {
        if (!isLoggedIn) {
            setHasPaid(false);
            return;
        }

        const checkPaymentStatus = async () => {
            setIsCheckingPayment(true);
            try {
                const response = await fetch('/payment/verify', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-XSRF-TOKEN': getCsrfToken(),
                    },
                    credentials: 'same-origin',
                    body: JSON.stringify({ product: productType }),
                });

                if (response.ok) {
                    const result = await response.json();
                    setHasPaid(result.paid === true);
                }
            } catch {
                setHasPaid(false);
            } finally {
                setIsCheckingPayment(false);
            }
        };

        checkPaymentStatus();
    }, [isLoggedIn, productType]);

    useEffect(() => {
        if (!isLoggedIn || hasAutoSaved) {
            return;
        }

        setHasAutoSaved(true);
        void saveWillData();
    }, [hasAutoSaved, isLoggedIn, saveWillData]);

    const handleRetrySave = () => {
        void saveWillData();
    };

    const handleDownload = useCallback(async () => {
        if (!hasPaid) {
            // Persist will data so it survives the payment round-trip
            try {
                sessionStorage.setItem('will_draft_data', JSON.stringify(data));
                sessionStorage.setItem('will_draft_type', willType);
            } catch { /* storage full — best effort */ }

            // Not paid — redirect to checkout with step=download so we land back here
            const amount = willType === 'Mirror' ? 9999 : 6999;
            const baseUrl = window.location.origin + window.location.pathname;
            const redirectUrl = encodeURIComponent(`${baseUrl}?step=download`);
            window.location.href = `/checkout?amount=${amount}&product=${productType}&redirect_url=${redirectUrl}`;
            return;
        }

        try {
            setIsGenerating(true);
            await Promise.resolve(generateWillPdf(data, { isDraft: false }));
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Failed to generate will PDF', error);
        } finally {
            setIsGenerating(false);
        }
    }, [data, hasPaid, willType, productType]);

    const handlePreview = useCallback(async () => {
        try {
            setIsGenerating(true);
            await Promise.resolve(generateWillPdf(data, { preview: true, isDraft: true }));
        } catch (error) {
            console.error('Failed to preview will PDF', error);
        } finally {
            setIsGenerating(false);
        }
    }, [data]);

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl md:text-3xl font-normal text-primary-700">
                    Review & Download
                </h2>

                <button
                    type="button"
                    onClick={() => window.location.href = '/wills'}
                    className="inline-flex items-center gap-2 px-6 py-2 text-primary-600 rounded font-semibold text-xs uppercase tracking-wide hover:bg-primary-50 transition-colors cursor-pointer"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to Wills
                </button>
            </div>
            {isLoggedIn && (
                <div className="mb-4">
                    {saveError ? (
                        <div className="flex flex-col gap-2 rounded border border-amber-300 bg-amber-50 px-4 py-3 text-xs text-amber-800">
                            <span>{saveError}</span>
                            <button
                                type="button"
                                onClick={handleRetrySave}
                                className="self-start rounded border border-amber-500 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-amber-700 transition hover:bg-amber-100"
                            >
                                Try again
                            </button>
                        </div>
                    ) : (
                        <p className="text-xs font-medium text-primary-500">
                            {isSavingWill ? 'Saving your Will details…' : 'Your Will details are safely saved to your account.'}
                        </p>
                    )}
                </div>
            )}
            <p className="text-sm text-primary-500 mb-8">
                Review your will details below, then print or download your document.
            </p>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-primary-700 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <ReviewItem label="Name" value={`${data.personalInfo.title} ${data.personalInfo.firstName} ${data.personalInfo.middleName} ${data.personalInfo.lastName}`.trim()} />
                    <ReviewItem label="Date of Birth" value={data.personalInfo.dateOfBirth} />
                    <ReviewItem label="Marital Status" value={data.personalInfo.maritalStatus} />
                    <ReviewItem label="Address" value={`${data.personalInfo.address}, ${data.personalInfo.city}, ${data.personalInfo.postcode}`} />
                </div>
            </div>

            {data.executors.length > 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold text-primary-700 mb-4">Executors ({data.executors.length})</h3>
                    <div className="space-y-2">
                        {data.executors.map((executor, index) => (
                            <p key={executor.id} className="text-sm text-primary-600">
                                <strong>{index + 1}.</strong> {executor.title} {executor.firstName} {executor.lastName} — {executor.relationship}
                            </p>
                        ))}
                    </div>
                </div>
            )}

            {data.beneficiaries.length > 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold text-primary-700 mb-4">Beneficiaries ({data.beneficiaries.length})</h3>
                    <div className="space-y-2">
                        {data.beneficiaries.map((b, index) => (
                            <p key={b.id} className="text-sm text-primary-600">
                                <strong>{index + 1}.</strong>{' '}
                                {b.type === 'person' ? `${b.firstName} ${b.lastName}` : b.charityName}
                                {b.percentage ? ` — ${b.percentage}%` : ''}
                            </p>
                        ))}
                    </div>
                </div>
            )}

            <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-6 text-center">
                {isCheckingPayment ? (
                    <p className="text-primary-600 text-sm animate-pulse">Checking payment status...</p>
                ) : hasPaid ? (
                    <>
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            Payment Complete
                        </div>
                        <p className="text-primary-700 text-sm mb-4">
                            Your payment has been verified. Download your final Will document below.
                        </p>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-3">
                            <button
                                type="button"
                                onClick={handlePreview}
                                disabled={isGenerating}
                                className="px-6 py-2 border border-emerald-600 text-accent-green rounded font-semibold text-xs uppercase tracking-wide hover:bg-accent-green/5 transition-colors cursor-pointer"
                            >
                                {isGenerating ? 'LOADING…' : 'PREVIEW PDF'}
                            </button>
                            <button
                                type="button"
                                onClick={handleDownload}
                                disabled={isGenerating}
                                className="px-10 py-3 bg-emerald-600 text-white rounded font-bold text-sm uppercase tracking-wider hover:bg-emerald-700 transition-colors cursor-pointer"
                            >
                                {isGenerating ? 'PREPARING PDF…' : 'DOWNLOAD FINAL WILL'}
                            </button>

                        </div>
                    </>
                ) : (
                    <>
                        <p className="text-primary-700 text-sm mb-4">
                            {isLoggedIn
                                ? 'Purchase your Will to download the final document without the draft watermark.'
                                : 'Sign in and purchase your Will to download the final document.'}
                        </p>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-3">
                            <button
                                type="button"
                                onClick={handlePreview}
                                disabled={isGenerating}
                                className="px-6 py-2 border border-emerald-600 text-accent-green rounded font-semibold text-xs uppercase tracking-wide hover:bg-accent-green/5 transition-colors cursor-pointer"
                            >
                                {isGenerating ? 'LOADING…' : 'PREVIEW DRAFT'}
                            </button>
                            <button
                                type="button"
                                onClick={handleDownload}
                                disabled={isGenerating}
                                className="px-10 py-3 bg-emerald-600 text-white rounded font-bold text-sm uppercase tracking-wider hover:bg-emerald-700 transition-colors cursor-pointer"
                            >
                                {isLoggedIn
                                    ? `PAY & DOWNLOAD (£${willType === 'Mirror' ? '99.99' : '69.99'})`
                                    : 'SIGN IN TO PURCHASE'}
                            </button>
                        </div>
                        <p className="text-xs text-primary-400 mt-3">
                            Draft preview includes a watermark. The final version after payment will not.
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default PrintDownloadStep;
