import { type FormEvent, useRef, useState } from 'react';

import { Link, useForm, usePage } from '@inertiajs/react';

import AdminLayout from '@/layouts/admin-layout';
import { type SharedData } from '@/types';

interface Campaign {
    id: number;
    name: string;
    message: string;
    total_recipients: number;
    sent_count: number;
    failed_count: number;
    status: string;
    progress_percentage: number;
    created_at: string;
}

interface PaginatedCampaigns {
    data: Campaign[];
    current_page: number;
    last_page: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Props {
    campaigns: PaginatedCampaigns;
}

function CampaignStatusBadge({ status }: { status: string }) {
    const map: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-700',
        processing: 'bg-blue-100 text-blue-700',
        completed: 'bg-green-100 text-green-700',
        failed: 'bg-red-100 text-red-700',
    };

    return <span className={`rounded-full px-2 py-1 text-xs font-medium ${map[status] || 'bg-gray-100 text-gray-600'}`}>{status}</span>;
}

export default function Bulk({ campaigns }: Props) {
    const { props } = usePage<SharedData & { flash?: { success?: string; error?: string } }>();
    const flash = props.flash;

    const [activeTab, setActiveTab] = useState<'csv' | 'manual'>('csv');
    const [csvPreview, setCsvPreview] = useState<string[][] | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const csvForm = useForm<{ campaign_name: string; message: string; csv_file: File | null }>({
        campaign_name: '',
        message: '',
        csv_file: null,
    });

    const manualForm = useForm({
        campaign_name: '',
        message: '',
        phone_numbers: '',
    });

    const handleFile = (file: File | undefined) => {
        if (!file) {
            return;
        }
        csvForm.setData('csv_file', file);

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            const lines = text.split('\n').filter((l) => l.trim());
            setCsvPreview(lines.slice(0, 6).map((l) => l.split(',')));
        };
        reader.readAsText(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file?.name.endsWith('.csv')) {
            handleFile(file);
        }
    };

    const submitCsv = (e: FormEvent) => {
        e.preventDefault();
        csvForm.post(route('admin.twilio.bulk.uploadCsv'), {
            forceFormData: true,
            onSuccess: () => {
                csvForm.reset();
                setCsvPreview(null);
            },
        });
    };

    const submitManual = (e: FormEvent) => {
        e.preventDefault();
        manualForm.post(route('admin.twilio.bulk.manual'), {
            onSuccess: () => manualForm.reset(),
        });
    };

    const countNumbers = () => {
        if (!manualForm.data.phone_numbers.trim()) {
            return 0;
        }
        return manualForm.data.phone_numbers.split(/[\n,]+/).filter((n) => n.trim()).length;
    };

    return (
        <AdminLayout
            pageHeader={{
                title: 'Bulk SMS',
                subtitle: 'Send messages to multiple recipients via CSV upload or manual entry',
                breadcrumbs: [
                    { label: 'Admin Dashboard', href: route('admin.dashboard') },
                    { label: 'Twilio SMS', href: route('admin.twilio.index') },
                    { label: 'Bulk SMS' },
                ],
            }}
        >
            <div className="mx-auto max-w-5xl space-y-8 px-4 py-8">
                {flash?.success && (
                    <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800">{flash.success}</div>
                )}

                {/* Create Campaign Card */}
                <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                    <div className="border-b bg-gray-50 px-6 py-4">
                        <h3 className="text-lg font-semibold">Create New Campaign</h3>
                        <p className="mt-0.5 text-sm text-gray-500">Upload a CSV file or paste numbers manually</p>
                    </div>

                    {/* Sub Tabs */}
                    <div className="border-b px-6">
                        <nav className="flex gap-6">
                            {[
                                { key: 'csv' as const, label: 'Upload CSV' },
                                { key: 'manual' as const, label: 'Manual Entry' },
                            ].map((t) => (
                                <button
                                    key={t.key}
                                    type="button"
                                    onClick={() => setActiveTab(t.key)}
                                    className={`border-b-2 py-3 text-sm font-medium transition-colors ${activeTab === t.key
                                            ? 'border-indigo-600 text-indigo-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="p-6">
                        {/* CSV Upload Form */}
                        {activeTab === 'csv' && (
                            <form onSubmit={submitCsv} className="space-y-5">
                                {/* Download Template */}
                                <div className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-3">
                                    <div>
                                        <p className="text-sm font-medium text-blue-800">Need a template?</p>
                                        <p className="mt-0.5 text-xs text-blue-600">Download our CSV template with required columns</p>
                                    </div>
                                    <a
                                        href={route('admin.twilio.csvTemplate')}
                                        className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
                                    >
                                        Download Template
                                    </a>
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Campaign Name *</label>
                                        <input
                                            type="text"
                                            value={csvForm.data.campaign_name}
                                            onChange={(e) => csvForm.setData('campaign_name', e.target.value)}
                                            placeholder="e.g. Eid Promotion 2026"
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                        />
                                        {csvForm.errors.campaign_name && (
                                            <p className="mt-1 text-xs text-red-500">{csvForm.errors.campaign_name}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Message *</label>
                                    <textarea
                                        rows={4}
                                        value={csvForm.data.message}
                                        onChange={(e) => csvForm.setData('message', e.target.value)}
                                        placeholder="Hi {name}, your special offer is waiting! Use code SAVE20..."
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    />
                                    <div className="mt-1 flex justify-between text-xs text-gray-400">
                                        <span>
                                            Use {'{name}'}, {'{email}'} to personalize with CSV columns
                                        </span>
                                        <span className={csvForm.data.message.length > 160 ? 'text-orange-500' : ''}>
                                            {csvForm.data.message.length}/1600
                                        </span>
                                    </div>
                                    {csvForm.errors.message && <p className="mt-1 text-xs text-red-500">{csvForm.errors.message}</p>}
                                </div>

                                {/* Drag & Drop Zone */}
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        CSV File *
                                    </label>
                                    <div
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            setDragOver(true);
                                        }}
                                        onDragLeave={() => setDragOver(false)}
                                        onDrop={handleDrop}
                                        onClick={() => fileInputRef.current?.click()}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                fileInputRef.current?.click();
                                            }
                                        }}
                                        className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors ${dragOver
                                                ? 'border-indigo-500 bg-indigo-50'
                                                : csvForm.data.csv_file
                                                    ? 'border-green-400 bg-green-50'
                                                    : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
                                            }`}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".csv"
                                            className="hidden"
                                            onChange={(e) => handleFile(e.target.files?.[0])}
                                        />
                                        {csvForm.data.csv_file ? (
                                            <div>
                                                <p className="font-medium text-green-700">{csvForm.data.csv_file.name}</p>
                                                <p className="mt-1 text-sm text-green-600">
                                                    {(csvForm.data.csv_file.size / 1024).toFixed(1)} KB — Click to change
                                                </p>
                                            </div>
                                        ) : (
                                            <div>
                                                <p className="font-medium text-gray-700">Drop your CSV here</p>
                                                <p className="mt-1 text-sm text-gray-500">or click to browse</p>
                                                <p className="mt-3 text-xs text-gray-400">
                                                    Required column: <code className="rounded bg-gray-100 px-1">phone</code>,{' '}
                                                    <code className="rounded bg-gray-100 px-1">phone number</code>, or{' '}
                                                    <code className="rounded bg-gray-100 px-1">mobile</code>
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    {csvForm.errors.csv_file && <p className="mt-1 text-xs text-red-500">{csvForm.errors.csv_file}</p>}
                                </div>

                                {/* CSV Preview Table */}
                                {csvPreview && (
                                    <div>
                                        <p className="mb-2 text-sm font-medium text-gray-700">Preview (first 5 rows):</p>
                                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                                            <table className="w-full text-xs">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        {csvPreview[0]?.map((h, i) => (
                                                            <th key={i} className="px-3 py-2 text-left font-medium text-gray-600">
                                                                {h?.trim()}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {csvPreview.slice(1).map((row, i) => (
                                                        <tr key={i}>
                                                            {row.map((cell, j) => (
                                                                <td key={j} className="px-3 py-2 text-gray-700">
                                                                    {cell?.trim()}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={csvForm.processing || !csvForm.data.csv_file}
                                    className="w-full rounded-lg bg-indigo-600 px-8 py-3 font-medium text-white hover:bg-indigo-700 disabled:opacity-50 md:w-auto"
                                >
                                    {csvForm.processing ? 'Processing...' : 'Launch Campaign'}
                                </button>
                            </form>
                        )}

                        {/* Manual Entry Form */}
                        {activeTab === 'manual' && (
                            <form onSubmit={submitManual} className="space-y-5">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Campaign Name *</label>
                                    <input
                                        type="text"
                                        value={manualForm.data.campaign_name}
                                        onChange={(e) => manualForm.setData('campaign_name', e.target.value)}
                                        placeholder="e.g. Flash Sale Alert"
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    />
                                    {manualForm.errors.campaign_name && (
                                        <p className="mt-1 text-xs text-red-500">{manualForm.errors.campaign_name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Message *</label>
                                    <textarea
                                        rows={4}
                                        value={manualForm.data.message}
                                        onChange={(e) => manualForm.setData('message', e.target.value)}
                                        placeholder="Your message here..."
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    />
                                    <p className="mt-1 text-right text-xs text-gray-400">{manualForm.data.message.length}/1600</p>
                                    {manualForm.errors.message && (
                                        <p className="mt-1 text-xs text-red-500">{manualForm.errors.message}</p>
                                    )}
                                </div>

                                <div>
                                    <div className="mb-1 flex items-center justify-between">
                                        <label className="block text-sm font-medium text-gray-700">Phone Numbers *</label>
                                        <span className="text-xs font-medium text-indigo-600">
                                            {countNumbers()} number{countNumbers() !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                    <textarea
                                        rows={8}
                                        value={manualForm.data.phone_numbers}
                                        onChange={(e) => manualForm.setData('phone_numbers', e.target.value)}
                                        placeholder={'+447911123456\n+8801711123456\n07911123457\n01711123457'}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    />
                                    <p className="mt-1 text-xs text-gray-400">
                                        One number per line, or comma-separated. Supports UK and BD formats.
                                    </p>
                                    {manualForm.errors.phone_numbers && (
                                        <p className="mt-1 text-xs text-red-500">{manualForm.errors.phone_numbers}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={manualForm.processing}
                                    className="w-full rounded-lg bg-indigo-600 px-8 py-3 font-medium text-white hover:bg-indigo-700 disabled:opacity-50 md:w-auto"
                                >
                                    {manualForm.processing ? 'Processing...' : 'Launch Campaign'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Campaigns List */}
                <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                    <div className="border-b bg-gray-50 px-6 py-4">
                        <h3 className="text-lg font-semibold">Campaign History</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-600">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium">Campaign</th>
                                    <th className="px-4 py-3 text-left font-medium">Recipients</th>
                                    <th className="px-4 py-3 text-left font-medium">Sent</th>
                                    <th className="px-4 py-3 text-left font-medium">Failed</th>
                                    <th className="px-4 py-3 text-left font-medium">Progress</th>
                                    <th className="px-4 py-3 text-left font-medium">Status</th>
                                    <th className="px-4 py-3 text-left font-medium">Date</th>
                                    <th className="px-4 py-3 text-left font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {campaigns?.data?.length > 0 ? (
                                    campaigns.data.map((c) => (
                                        <tr key={c.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium">{c.name}</td>
                                            <td className="px-4 py-3">{c.total_recipients}</td>
                                            <td className="px-4 py-3 text-green-600">{c.sent_count}</td>
                                            <td className="px-4 py-3 text-red-600">{c.failed_count}</td>
                                            <td className="w-32 px-4 py-3">
                                                <div className="h-2 w-full rounded-full bg-gray-200">
                                                    <div
                                                        className="h-2 rounded-full bg-indigo-600 transition-all"
                                                        style={{ width: `${c.progress_percentage}%` }}
                                                    />
                                                </div>
                                                <span className="mt-0.5 block text-xs text-gray-500">{c.progress_percentage}%</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <CampaignStatusBadge status={c.status} />
                                            </td>
                                            <td className="px-4 py-3 text-xs text-gray-500">
                                                {new Date(c.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Link
                                                    href={route('admin.twilio.campaign.show', c.id)}
                                                    className="text-xs text-indigo-600 hover:underline"
                                                >
                                                    View Details
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-10 text-center text-gray-400">
                                            No campaigns yet. Create your first bulk campaign above!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
