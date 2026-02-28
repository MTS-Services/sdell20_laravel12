import { useEffect, useState } from 'react';

import { Link, usePage } from '@inertiajs/react';
import axios from 'axios';

import AdminLayout from '@/layouts/admin-layout';
import { type SharedData } from '@/types';

interface SmsLogEntry {
    id: number;
    to: string;
    message: string;
    status: string;
    twilio_sid: string | null;
    error_message: string | null;
    created_at: string;
}

interface PaginatedLogs {
    data: SmsLogEntry[];
    from: number;
    to: number;
    total: number;
    current_page: number;
    last_page: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface CampaignData {
    id: number;
    name: string;
    message: string;
    status: string;
    total_recipients: number;
    sent_count: number;
    failed_count: number;
    progress_percentage: number;
    started_at: string;
    completed_at: string | null;
}

interface Props {
    campaign: CampaignData;
    logs: PaginatedLogs;
}

function StatusBadge({ status }: { status: string }) {
    const map: Record<string, string> = {
        sent: 'bg-green-100 text-green-700',
        failed: 'bg-red-100 text-red-700',
        pending: 'bg-yellow-100 text-yellow-700',
    };

    return <span className={`rounded-full px-2 py-1 text-xs font-medium ${map[status] || 'bg-gray-100 text-gray-600'}`}>{status}</span>;
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

export default function CampaignDetail({ campaign, logs }: Props) {
    const { props } = usePage<SharedData & { flash?: { success?: string; error?: string } }>();
    const flash = props.flash;

    const [liveStats, setLiveStats] = useState({
        status: campaign.status,
        total_recipients: campaign.total_recipients,
        sent_count: campaign.sent_count,
        failed_count: campaign.failed_count,
        progress_percentage: campaign.progress_percentage,
    });

    useEffect(() => {
        if (liveStats.status !== 'processing') {
            return;
        }

        const interval = setInterval(async () => {
            try {
                const { data } = await axios.get(route('admin.twilio.campaign.status', campaign.id));
                setLiveStats(data);
                if (data.status !== 'processing') {
                    clearInterval(interval);
                }
            } catch {
                clearInterval(interval);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [liveStats.status, campaign.id]);

    const successRate =
        liveStats.total_recipients > 0 ? Math.round((liveStats.sent_count / liveStats.total_recipients) * 100) : 0;

    return (
        <AdminLayout
            pageHeader={{
                title: campaign.name,
                subtitle: `Campaign #${campaign.id}`,
                breadcrumbs: [
                    { label: 'Admin Dashboard', href: route('admin.dashboard') },
                    { label: 'Twilio SMS', href: route('admin.twilio.index') },
                    { label: 'Bulk SMS', href: route('admin.twilio.bulk.index') },
                    { label: campaign.name },
                ],
            }}
        >
            <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
                {flash?.success && (
                    <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800">{flash.success}</div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {[
                        { label: 'Total', value: liveStats.total_recipients, color: 'text-gray-800' },
                        { label: 'Sent', value: liveStats.sent_count, color: 'text-green-600' },
                        { label: 'Failed', value: liveStats.failed_count, color: 'text-red-600' },
                        { label: 'Success Rate', value: `${successRate}%`, color: 'text-indigo-600' },
                    ].map((stat) => (
                        <div key={stat.label} className="rounded-xl bg-white p-5 text-center shadow-sm">
                            <p className="text-sm text-gray-500">{stat.label}</p>
                            <p className={`mt-1 text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Progress Bar */}
                <div className="rounded-xl bg-white p-5 shadow-sm">
                    <div className="mb-2 flex justify-between text-sm text-gray-600">
                        <span>Campaign Progress</span>
                        <span>{liveStats.progress_percentage}% complete</span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-gray-200">
                        <div
                            className="h-3 rounded-full bg-indigo-600 transition-all duration-500"
                            style={{ width: `${liveStats.progress_percentage}%` }}
                        />
                    </div>
                    <div className="mt-1.5 flex justify-between text-xs text-gray-400">
                        <span>Message: &quot;{campaign.message.substring(0, 60)}...&quot;</span>
                        <span>Started: {new Date(campaign.started_at).toLocaleString()}</span>
                    </div>
                </div>

                {/* Logs Table */}
                <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b bg-gray-50 px-6 py-4">
                        <h3 className="text-lg font-semibold">Message Log</h3>
                        <span className="text-sm text-gray-500">
                            Showing {logs.from}&ndash;{logs.to} of {logs.total}
                        </span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-600">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium">Phone</th>
                                    <th className="px-4 py-3 text-left font-medium">Message</th>
                                    <th className="px-4 py-3 text-left font-medium">Status</th>
                                    <th className="px-4 py-3 text-left font-medium">Twilio SID</th>
                                    <th className="px-4 py-3 text-left font-medium">Error</th>
                                    <th className="px-4 py-3 text-left font-medium">Sent At</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {logs.data.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-mono text-xs">{log.to}</td>
                                        <td className="max-w-xs truncate px-4 py-3 text-xs">{log.message}</td>
                                        <td className="px-4 py-3">
                                            <StatusBadge status={log.status} />
                                        </td>
                                        <td className="px-4 py-3 font-mono text-xs text-gray-400">
                                            {log.twilio_sid ? `${log.twilio_sid.substring(0, 20)}...` : '-'}
                                        </td>
                                        <td className="max-w-xs truncate px-4 py-3 text-xs text-red-500">
                                            {log.error_message || '-'}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-gray-500">{new Date(log.created_at).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {logs.last_page > 1 && (
                        <div className="flex gap-2 border-t px-6 py-4">
                            {logs.links.map((link, i) =>
                                link.url ? (
                                    <Link
                                        key={i}
                                        href={link.url}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`rounded border px-3 py-1 text-sm ${link.active
                                                ? 'border-indigo-600 bg-indigo-600 text-white'
                                                : 'border-gray-300 hover:bg-gray-50'
                                            }`}
                                    />
                                ) : (
                                    <span
                                        key={i}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className="rounded border border-gray-200 px-3 py-1 text-sm text-gray-400"
                                    />
                                ),
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
