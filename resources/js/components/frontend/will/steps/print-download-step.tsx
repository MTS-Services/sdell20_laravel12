import React from 'react';
import type { WillData } from './will-types';

const ReviewItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div>
        <div className="text-xs text-slate-500 font-medium mb-1">{label}</div>
        <div className="text-sm text-slate-800 font-medium">{value || 'Not provided'}</div>
    </div>
);

export interface PrintDownloadStepProps {
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

export default PrintDownloadStep;
