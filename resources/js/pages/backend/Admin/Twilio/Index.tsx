import { type FormEvent, useState } from 'react';

import { Link, useForm, usePage } from '@inertiajs/react';

import AdminLayout from '@/layouts/admin-layout';
import { type SharedData } from '@/types';

interface SmsLogEntry {
    id: number;
    to: string;
    from: string | null;
    message: string;
    status: string;
    type: string;
    twilio_sid: string | null;
    created_at: string;
}

interface Props {
    recentLogs: SmsLogEntry[];
}

function StatusBadge({ status }: { status: string }) {
    const map: Record<string, string> = {
        sent: 'bg-green-100 text-green-700',
        failed: 'bg-red-100 text-red-700',
        pending: 'bg-yellow-100 text-yellow-700',
        received: 'bg-blue-100 text-blue-700',
        processing: 'bg-purple-100 text-purple-700',
    };

    return <span className={`rounded-full px-2 py-1 text-xs font-medium ${map[status] || 'bg-gray-100 text-gray-600'}`}>{status}</span>;
}

export default function TwilioIndex({ recentLogs }: Props) {
    const { props } = usePage<SharedData & { flash?: { success?: string; error?: string } }>();
    const flash = props.flash;

    const [activeTab, setActiveTab] = useState<'sms' | 'logs'>('sms');

    const smsForm = useForm({ phone: '', message: '' });

    const sendSms = (e: FormEvent) => {
        e.preventDefault();
        smsForm.post(route('admin.twilio.sendSms'), {
            onSuccess: () => smsForm.reset(),
        });
    };

    const tabs = [
        { key: 'sms' as const, label: 'Send SMS' },
        { key: 'logs' as const, label: 'SMS Logs' },
    ];

    return (
        <AdminLayout
            pageHeader={{
                title: 'Twilio SMS',
                subtitle: 'Send single SMS and manage messaging',
                breadcrumbs: [{ label: 'Admin Dashboard', href: route('admin.dashboard') }, { label: 'Twilio SMS' }],
            }}
        >
            <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
                {/* Quick Actions */}
                <div className="flex justify-end">
                    <Link
                        href={route('admin.twilio.bulk.index')}
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
                    >
                        Bulk SMS
                    </Link>
                </div>

                {flash?.success && (
                    <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800">
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800">{flash.error}</div>
                )}

                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="flex gap-6">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => setActiveTab(tab.key)}
                                className={`border-b-2 py-3 text-sm font-medium transition-colors ${activeTab === tab.key
                                        ? 'border-indigo-600 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Send SMS Tab */}
                {activeTab === 'sms' && (
                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <h3 className="mb-1 text-lg font-semibold">Send Custom SMS</h3>
                        <p className="mb-5 text-sm text-gray-500">Send a custom message to any UK or Bangladesh number</p>
                        <form onSubmit={sendSms} className="max-w-md space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Recipient Phone Number</label>
                                <input
                                    type="text"
                                    value={smsForm.data.phone}
                                    onChange={(e) => smsForm.setData('phone', e.target.value)}
                                    placeholder="+447911123456 or +8801711123456"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                />
                                {smsForm.errors.phone && <p className="mt-1 text-xs text-red-500">{smsForm.errors.phone}</p>}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Message</label>
                                <textarea
                                    rows={4}
                                    value={smsForm.data.message}
                                    onChange={(e) => smsForm.setData('message', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    placeholder="Type your message here..."
                                />
                                <div className="mt-1 flex justify-between text-xs text-gray-400">
                                    <span>Max 1600 characters</span>
                                    <span className={smsForm.data.message.length > 160 ? 'text-orange-500' : ''}>
                                        {smsForm.data.message.length}/1600
                                        {smsForm.data.message.length > 160 && ' (multiple SMS)'}
                                    </span>
                                </div>
                                {smsForm.errors.message && <p className="mt-1 text-xs text-red-500">{smsForm.errors.message}</p>}
                            </div>
                            <button
                                type="submit"
                                disabled={smsForm.processing}
                                className="w-full rounded-lg bg-blue-600 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                {smsForm.processing ? 'Sending...' : 'Send SMS'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Logs Tab */}
                {activeTab === 'logs' && (
                    <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                        <div className="border-b px-6 py-4">
                            <h3 className="text-lg font-semibold">Recent SMS Logs</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-gray-600">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-medium">To</th>
                                        <th className="px-4 py-3 text-left font-medium">Message</th>
                                        <th className="px-4 py-3 text-left font-medium">Type</th>
                                        <th className="px-4 py-3 text-left font-medium">Status</th>
                                        <th className="px-4 py-3 text-left font-medium">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {recentLogs?.length > 0 ? (
                                        recentLogs.map((log) => (
                                            <tr key={log.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 font-mono text-xs">{log.to}</td>
                                                <td className="max-w-xs truncate px-4 py-3">{log.message}</td>
                                                <td className="px-4 py-3">
                                                    <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                                                        {log.type}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <StatusBadge status={log.status} />
                                                </td>
                                                <td className="px-4 py-3 text-xs text-gray-500">
                                                    {new Date(log.created_at).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                                                No SMS logs yet
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
