import { Link } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, Clock, Mail, Phone } from 'lucide-react';

import UserLayout from '@/layouts/user-layout';

type Lpa = {
    id: number;
    document_type: string;
    paid_at: string | null;
    donor_details?: {
        title?: string;
        firstName?: string;
        lastName?: string;
    };
};

type Props = {
    lpa: Lpa;
    supportEmail: string;
};

export default function LpaThankYou({ lpa, supportEmail }: Props) {
    const documentTypeLabel = lpa.document_type === 'property'
        ? 'Property & Financial Affairs'
        : lpa.document_type === 'both'
            ? 'Health & Welfare + Property & Financial Affairs'
            : 'Health & Welfare';

    const donorName = [
        lpa.donor_details?.title,
        lpa.donor_details?.firstName,
        lpa.donor_details?.lastName,
    ].filter(Boolean).join(' ') || 'your LPA';

    return (
        <UserLayout>
            <div className="bg-slate-50 py-10 sm:py-14">
                <div className="container mx-auto max-w-2xl px-4 sm:px-6">
                    <div className="mb-8 flex justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                            <CheckCircle2 className="h-9 w-9" strokeWidth={1.75} />
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
                        <h1 className="text-center text-2xl font-bold text-primary-900 sm:text-3xl">
                            Thank you — your payment was successful
                        </h1>
                        <p className="mt-3 text-center text-sm text-primary-600 sm:text-base">
                            {documentTypeLabel} for <span className="font-semibold text-primary-800">{donorName}</span>
                        </p>

                        <div className="mt-8 rounded-xl border border-primary-100 bg-primary-50/80 p-5 sm:p-6">
                            <div className="flex gap-3">
                                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" aria-hidden />
                                <div>
                                    <p className="font-semibold text-primary-900">We will contact you within 24 hours</p>
                                    <p className="mt-1 text-sm text-primary-700 leading-relaxed">
                                        Our team will review your submission on the next working day (Monday–Friday, excluding UK bank holidays).
                                        If we need any clarification on your answers or supporting details, we will reach out using the email address on your account.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <ul className="mt-8 space-y-4 text-sm text-primary-800">
                            <li className="flex gap-3">
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" aria-hidden />
                                <span>
                                    <strong className="text-primary-900">Confirmation email:</strong> you should already have received a summary of your LPA answers and payment details at your registered email. Please check your spam or promotions folder if you do not see it.
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" aria-hidden />
                                <span>
                                    <strong className="text-primary-900">Office of the Public Guardian (OPG):</strong> registration with the OPG is a separate official step. We will guide you on signing, witnessing, and sending your LPA for registration when we contact you.
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" aria-hidden />
                                <span>
                                    <strong className="text-primary-900">Need anything sooner?</strong> Reply to your confirmation email or use the contact options below and quote your LPA reference if you have one.
                                </span>
                            </li>
                        </ul>

                        {lpa.paid_at && (
                            <p className="mt-6 text-center text-xs text-primary-500">
                                Payment recorded on{' '}
                                {new Date(lpa.paid_at).toLocaleString('en-GB', {
                                    dateStyle: 'medium',
                                    timeStyle: 'short',
                                })}
                            </p>
                        )}

                        <div className="mt-10 flex flex-col gap-3 border-t border-slate-100 pt-8 sm:flex-row sm:justify-center">
                            <Link
                                href="/lpas"
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-primary-300 bg-white px-6 py-2.5 text-sm font-semibold text-primary-700 transition hover:bg-primary-50"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to my LPAs
                            </Link>
                            <Link
                                href="/dashboard/user"
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
                            >
                                Go to dashboard
                            </Link>
                        </div>

                        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 border-t border-slate-100 pt-8 text-xs text-primary-600">
                            <span className="inline-flex items-center gap-2">
                                <Mail className="h-4 w-4 text-primary-500" aria-hidden />
                                <a href={`mailto:${supportEmail}`} className="font-medium underline hover:text-primary-800">
                                    {supportEmail}
                                </a>
                            </span>
                            <span className="inline-flex items-center gap-2">
                                <Phone className="h-4 w-4 text-primary-500" aria-hidden />
                                <span>UK helpline: 0300 456 0300 (OPG — registration fees &amp; guidance)</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
