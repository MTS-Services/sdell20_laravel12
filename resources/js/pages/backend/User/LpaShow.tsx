import { Link, router } from '@inertiajs/react';
import { ArrowLeft, Check, CreditCard, Lock } from 'lucide-react';

import UserLayout from '@/layouts/user-layout';

interface Lpa {
    id: number;
    document_type: string;
    status: string;
    is_draft: boolean;
    paid_at: string | null;
    amount: string;
    pdf_path: string | null;
    created_at: string;
    donor_details: {
        title?: string;
        firstName?: string;
        lastName?: string;
    };
}

interface Props {
    lpa: Lpa;
    hasPaid: boolean;
    product: string;
    amount: number;
}

export default function LpaShow({ lpa, hasPaid, product, amount }: Props) {
    const documentTypeLabel = lpa.document_type === 'property'
        ? 'Property & Financial Affairs'
        : lpa.document_type === 'both'
            ? 'Health & Welfare + Property & Financial Affairs'
            : 'Health & Welfare';

    const registrarFee = lpa.document_type === 'both' ? 18400 : 9200;
    const amountBeforeVat = amount - registrarFee;
    const baseAmount = amountBeforeVat / 1.2;
    const vatAmount = amountBeforeVat - baseAmount;

    const donorName = [
        lpa.donor_details?.title,
        lpa.donor_details?.firstName,
        lpa.donor_details?.lastName,
    ].filter(Boolean).join(' ') || 'Not specified';

    const thankYouUrl = `${window.location.origin}/lpas/${lpa.id}/thank-you`;

    const handleCompletePayment = (): void => {
        const redirectUrl = encodeURIComponent(thankYouUrl);
        router.visit(`/checkout?amount=${amount}&product=${product}&redirect_url=${redirectUrl}`);
    };

    return (
        <UserLayout>
            <div className="bg-slate-50 py-8 sm:py-10">
                <div className="container mx-auto max-w-3xl px-4 sm:px-6">
                    <button
                        type="button"
                        onClick={() => router.visit('/lpas')}
                        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-800 transition"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to LPAs
                    </button>

                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <div className="border-b border-slate-200 bg-primary-50 px-6 py-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-xl font-semibold text-primary-900">
                                        LPA — {documentTypeLabel}
                                    </h1>
                                    <p className="mt-1 text-sm text-primary-600">Donor: {donorName}</p>
                                </div>
                                <div className={`rounded-full px-3 py-1 text-xs font-semibold ${hasPaid
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-amber-100 text-amber-700'
                                    }`}>
                                    {hasPaid ? 'Paid' : 'Draft'}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {hasPaid ? (
                                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white">
                                            <Check className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-emerald-800">Payment complete</p>
                                            <p className="text-sm text-emerald-600">
                                                Thank you. Our team will be in touch shortly with next steps for your LPA.
                                            </p>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-sm text-emerald-800">
                                        <Link
                                            href={`/lpas/${lpa.id}/thank-you`}
                                            className="font-semibold underline hover:text-emerald-950"
                                        >
                                            View your thank-you &amp; what happens next
                                        </Link>
                                    </p>
                                </div>
                            ) : (
                                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-white">
                                            <Lock className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-amber-800">Draft — payment required</p>
                                            <p className="text-sm text-amber-600">
                                                Your answers are saved and a draft has been prepared. Complete payment to finalise your order; after payment you will see a confirmation page and we will contact you within 24 hours.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-primary-500 font-medium">Document Type</p>
                                    <p className="text-primary-800 font-semibold">{documentTypeLabel}</p>
                                </div>
                                <div>
                                    <p className="text-primary-500 font-medium">Status</p>
                                    <p className="text-primary-800 font-semibold capitalize">{lpa.status}</p>
                                </div>
                                <div>
                                    <p className="text-primary-500 font-medium">Created</p>
                                    <p className="text-primary-800 font-semibold">
                                        {new Date(lpa.created_at).toLocaleDateString('en-GB')}
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                                <h3 className="mb-3 text-sm font-semibold text-primary-900">Price Breakdown</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-primary-600">Base price</span>
                                        <span className="font-medium text-primary-800">£{(baseAmount / 100).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-primary-600">VAT (20%)</span>
                                        <span className="font-medium text-primary-800">£{(vatAmount / 100).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-primary-600">Register fee (OPG)</span>
                                        <span className="font-medium text-primary-800">£{(registrarFee / 100).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between border-t border-slate-300 pt-2 font-semibold">
                                        <span className="text-primary-900">Total</span>
                                        <span className="text-primary-900">£{(amount / 100).toFixed(2)}</span>
                                    </div>
                                </div>
                                <p className="mt-3 text-xs text-primary-500">
                                    The £92 register fee is mandatory for registration with the Office of Public Guardian.{' '}
                                    <a
                                        href="https://www.gov.uk/power-of-attorney/register"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="underline hover:text-primary-700"
                                    >
                                        Learn more
                                    </a>
                                </p>
                            </div>

                            {!hasPaid && (
                                <div className="flex flex-col items-center gap-3 pt-2 sm:flex-row">
                                    <button
                                        type="button"
                                        onClick={handleCompletePayment}
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 sm:w-auto"
                                    >
                                        <CreditCard className="h-4 w-4" />
                                        Pay £{(amount / 100).toFixed(2)} securely
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
