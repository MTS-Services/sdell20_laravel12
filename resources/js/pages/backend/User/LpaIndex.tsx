import React, { JSX, useEffect, useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { ArrowRight, FileText, Plus, RefreshCcw } from 'lucide-react';

import UserLayout from '@/layouts/user-layout';

interface Lpa {
    id: number;
    document_type: 'property' | 'health' | 'both';
    status: string;
    is_draft: boolean;
    paid_at: string | null;
    amount: string | number;
    created_at: string;
    donor_details?: {
        title?: string;
        firstName?: string;
        lastName?: string;
    };
}

type Props = {
    lpas: Lpa[];
};

const documentTypeLabels: Record<Lpa['document_type'], string> = {
    property: 'Property & Financial Affairs',
    health: 'Health & Welfare',
    both: 'Health & Welfare + Property & Financial Affairs',
};

export default function LpaIndex({ lpas }: Props): JSX.Element {
    const [selectedLpaId, setSelectedLpaId] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 15;
    const totalPages = Math.ceil(lpas.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const visibleLpas = totalPages > 1 ? lpas.slice(startIndex, endIndex) : lpas;

    useEffect(() => {
        if (totalPages > 0 && currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    const handlePageChange = (page: number): void => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            setSelectedLpaId(null);
        }
    };

    const handleViewToggle = (lpaId: number): void => {
        setSelectedLpaId((current) => (current === lpaId ? null : lpaId));
    };

    return (
        <UserLayout>
            <div className="bg-slate-50 px-4 py-6 sm:px-6 sm:py-10">
                <div className="container mx-auto max-w-6xl">
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-primary-500">Your LPAs</p>
                            <h1 className="text-2xl font-bold text-primary-900">Manage Lasting Power of Attorney Documents</h1>
                            <p className="text-sm text-primary-600">Review drafts, complete payments, and download finalized documents.</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => router.visit('/lpas')}
                                className="inline-flex items-center gap-2 rounded-full border border-primary-200 px-4 py-2 text-sm font-semibold text-primary-600 transition hover:bg-primary-50"
                            >
                                <RefreshCcw className="h-4 w-4" />
                                Refresh
                            </button>
                            <Link
                                href="/lpas/create"
                                className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition hover:bg-primary-700"
                            >
                                <Plus className="h-4 w-4" />
                                Start New LPA
                            </Link>
                        </div>
                    </div>

                    {lpas.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-primary-200 bg-white p-10 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-primary-200 bg-primary-50 text-primary-500">
                                <FileText className="h-7 w-7" />
                            </div>
                            <h2 className="text-xl font-semibold text-primary-900">No LPAs yet</h2>
                            <p className="mx-auto mt-2 max-w-md text-sm text-primary-600">
                                Start your Lasting Power of Attorney journey in minutes. Create a draft, preview the PDF, and complete payment when you are ready.
                            </p>
                            <Link
                                href="/lpas/create"
                                className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition hover:bg-primary-700"
                            >
                                <Plus className="h-4 w-4" />
                                Create your first LPA
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {visibleLpas.map((lpa) => {
                                const donorName = [
                                    lpa.donor_details?.title,
                                    lpa.donor_details?.firstName,
                                    lpa.donor_details?.lastName,
                                ]
                                    .filter(Boolean)
                                    .join(' ') || 'Donor not specified';

                                const amount = typeof lpa.amount === 'string' ? Number(lpa.amount) : lpa.amount;
                                const isSelected = selectedLpaId === lpa.id;

                                return (
                                    <div key={lpa.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-primary-100 hover:shadow-md">
                                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                            <div>
                                                <p className="text-sm font-semibold uppercase tracking-wide text-primary-500">{documentTypeLabels[lpa.document_type]}</p>
                                                <h3 className="text-xl font-bold text-primary-900">Donor: {donorName}</h3>
                                                <p className="text-sm text-primary-600">Created: {new Date(lpa.created_at).toLocaleDateString('en-GB')}</p>
                                            </div>
                                            <div className="flex flex-wrap gap-3">
                                                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${lpa.is_draft
                                                    ? 'bg-amber-100 text-amber-700'
                                                    : 'bg-emerald-100 text-emerald-700'
                                                    }`}
                                                >
                                                    {lpa.is_draft ? 'Draft' : 'Paid'}
                                                </span>
                                                <span className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
                                                    £{amount ? amount.toFixed(2) : '0.00'}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleViewToggle(lpa.id)}
                                                    className="inline-flex items-center gap-1 rounded-full border border-primary-200 px-4 py-2 text-xs font-semibold text-primary-600 transition hover:bg-primary-50"
                                                >
                                                    {isSelected ? 'Hide details' : 'View details'}
                                                    <ArrowRight className={`h-3.5 w-3.5 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => router.visit(`/lpas/${lpa.id}`)}
                                                    className="inline-flex items-center gap-1 rounded-full bg-primary-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-primary-500/30 transition hover:bg-primary-700"
                                                >
                                                    Open LPA
                                                </button>
                                            </div>
                                        </div>

                                        {isSelected && (
                                            <div className="mt-4 grid gap-4 border-t border-slate-100 pt-4 md:grid-cols-3">
                                                <div>
                                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Document Type</p>
                                                    <p className="text-sm font-semibold text-primary-900">{documentTypeLabels[lpa.document_type]}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Status</p>
                                                    <p className="text-sm font-semibold text-primary-900">{lpa.status}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Payment</p>
                                                    <p className="text-sm font-semibold text-primary-900">{lpa.is_draft ? 'Pending payment' : `Paid on ${lpa.paid_at ? new Date(lpa.paid_at).toLocaleDateString('en-GB') : ''}`}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                            {totalPages > 1 && (
                                <div className="flex flex-col items-center gap-3 rounded-full bg-white/60 px-4 py-3 text-sm text-primary-600 sm:flex-row sm:justify-between">
                                    <p className="text-xs font-semibold uppercase tracking-wide">Page {currentPage} of {totalPages}</p>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="inline-flex items-center rounded-full border border-primary-200 px-3 py-1 text-xs font-semibold transition disabled:opacity-40"
                                        >
                                            Previous
                                        </button>
                                        {Array.from({ length: totalPages }).map((_, index) => {
                                            const page = index + 1;

                                            if (totalPages > 5) {
                                                const isEdge = page === 1 || page === totalPages;
                                                const isNearCurrent = Math.abs(page - currentPage) <= 1;

                                                if (!isEdge && !isNearCurrent) {
                                                    if (page === 2 || page === totalPages - 1) {
                                                        return <span key={page} className="px-2 text-xs">…</span>;
                                                    }

                                                    return null;
                                                }
                                            }

                                            return (
                                                <button
                                                    key={page}
                                                    type="button"
                                                    onClick={() => handlePageChange(page)}
                                                    className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${currentPage === page
                                                        ? 'bg-primary-600 text-white'
                                                        : 'border border-primary-200 text-primary-600'
                                                        }`}
                                                >
                                                    {page}
                                                </button>
                                            );
                                        })}
                                        <button
                                            type="button"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="inline-flex items-center rounded-full border border-primary-200 px-3 py-1 text-xs font-semibold transition disabled:opacity-40"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </UserLayout>
    );
}
