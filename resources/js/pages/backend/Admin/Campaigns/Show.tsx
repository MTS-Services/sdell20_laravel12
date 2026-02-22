import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminLayout from '@/layouts/admin-layout';
import {
    ArrowLeft,
    CalendarClock,
    Clock,
    Download,
    Pause,
    Play,
    RefreshCw,
    Repeat,
    Trash2,
} from 'lucide-react';

interface CampaignData {
    id: number;
    name: string;
    message: string;
    sender_id: string | null;
    schedule_type: 'one_time' | 'daily';
    scheduled_at: string | null;
    daily_time: string | null;
    timezone: string;
    status: string;
    total_numbers: number;
    sent_count: number;
    failed_count: number;
    pending_count: number;
    csv_filename: string | null;
    is_enabled: boolean;
    last_run_at: string | null;
    next_run_at: string | null;
    created_at: string;
}

interface LogItem {
    id: number;
    phone_number: string;
    status: string;
    error_reason: string | null;
    provider_message_id: string | null;
    sent_at: string | null;
}

interface FailedLog {
    phone_number: string;
    error_reason: string | null;
}

interface PaginatedLogs {
    data: LogItem[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number | null;
    to: number | null;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Props {
    campaign: CampaignData;
    failedLogs: FailedLog[];
    logs: PaginatedLogs;
}

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    draft: 'outline',
    scheduled: 'secondary',
    running: 'default',
    completed: 'default',
    paused: 'outline',
    failed: 'destructive',
    pending: 'outline',
    queued: 'secondary',
    sent: 'default',
};

export default function Show({ campaign, failedLogs, logs }: Props) {
    const [showScheduleEdit, setShowScheduleEdit] = useState(false);

    const scheduleForm = useForm({
        scheduled_at: '',
        daily_time: campaign.daily_time ?? '',
    });

    function refresh() {
        router.reload();
    }

    function toggleCampaign() {
        router.patch(route('admin.campaigns.toggle', campaign.id), {}, {
            preserveScroll: true,
        });
    }

    function deleteCampaign() {
        if (!confirm(`Are you sure you want to delete "${campaign.name}"? This will permanently remove the campaign and all its send logs.`)) {
            return;
        }
        router.delete(route('admin.campaigns.destroy', campaign.id));
    }

    function updateSchedule(e: React.FormEvent) {
        e.preventDefault();
        scheduleForm.patch(route('admin.campaigns.update-schedule', campaign.id), {
            preserveScroll: true,
            onSuccess: () => setShowScheduleEdit(false),
        });
    }

    return (
        <AdminLayout>
            <Head title={`Campaign: ${campaign.name}`} />

            <div className="flex flex-1 items-start justify-center py-10 px-4">
                <div className="w-full max-w-6xl space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{campaign.name}</h1>
                            <p className="mt-1 text-muted-foreground">
                                Campaign #{campaign.id} &middot; Created {campaign.created_at}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            {(campaign.status === 'running' || campaign.status === 'scheduled') && (
                                <Button variant="outline" size="sm" onClick={refresh}>
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Refresh
                                </Button>
                            )}
                            <Button variant="destructive" size="sm" onClick={deleteCampaign}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </Button>
                            <Button asChild variant="outline">
                                <Link href={route('admin.campaigns.index')}>
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    All Campaigns
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Campaign Info & Stats */}
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Campaign Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <CalendarClock className="h-5 w-5 text-primary" />
                                    Campaign Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Status</span>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={STATUS_VARIANT[campaign.status] ?? 'outline'}>
                                            {campaign.status}
                                        </Badge>
                                        {!campaign.is_enabled && campaign.status !== 'paused' && (
                                            <Badge variant="outline" className="text-xs">disabled</Badge>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Schedule Type</span>
                                    <Badge variant="outline" className="gap-1">
                                        {campaign.schedule_type === 'daily' ? (
                                            <Repeat className="h-3 w-3" />
                                        ) : (
                                            <Clock className="h-3 w-3" />
                                        )}
                                        {campaign.schedule_type === 'daily' ? 'Daily Recurring' : 'One-Time'}
                                    </Badge>
                                </div>
                                {campaign.schedule_type === 'one_time' && campaign.scheduled_at && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Scheduled At</span>
                                        <span className="text-sm font-medium">{campaign.scheduled_at}</span>
                                    </div>
                                )}
                                {campaign.schedule_type === 'daily' && campaign.daily_time && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Daily Time</span>
                                        <span className="text-sm font-medium">{campaign.daily_time} ({campaign.timezone})</span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Sender ID</span>
                                    <span className="font-mono text-sm">{campaign.sender_id ?? 'Default'}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">CSV Source</span>
                                    <span className="text-sm">{campaign.csv_filename ?? 'N/A'}</span>
                                </div>
                                {campaign.last_run_at && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Last Run</span>
                                        <span className="text-sm">{campaign.last_run_at}</span>
                                    </div>
                                )}
                                {campaign.next_run_at && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Next Run</span>
                                        <span className="text-sm font-medium text-primary">{campaign.next_run_at}</span>
                                    </div>
                                )}

                                <div className="rounded-md border bg-muted/50 p-3">
                                    <p className="text-xs font-medium text-muted-foreground">Message</p>
                                    <p className="mt-1 text-sm">{campaign.message}</p>
                                </div>

                                {/* Toggle Enable/Disable */}
                                <div className="flex gap-2 pt-2">
                                    <Button
                                        variant={campaign.is_enabled ? 'outline' : 'default'}
                                        size="sm"
                                        onClick={toggleCampaign}
                                        className="flex-1"
                                    >
                                        {campaign.is_enabled ? (
                                            <>
                                                <Pause className="mr-2 h-4 w-4" />
                                                Pause Campaign
                                            </>
                                        ) : (
                                            <>
                                                <Play className="mr-2 h-4 w-4" />
                                                Enable Campaign
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowScheduleEdit(!showScheduleEdit)}
                                    >
                                        <Clock className="mr-2 h-4 w-4" />
                                        Edit Schedule
                                    </Button>
                                </div>

                                {/* Schedule Edit Form */}
                                {showScheduleEdit && (
                                    <form onSubmit={updateSchedule} className="space-y-3 rounded-md border p-3">
                                        {campaign.schedule_type === 'one_time' ? (
                                            <div className="grid gap-2">
                                                <Label htmlFor="edit_scheduled_at">New Date & Time</Label>
                                                <Input
                                                    id="edit_scheduled_at"
                                                    type="datetime-local"
                                                    value={scheduleForm.data.scheduled_at}
                                                    onChange={(e) => scheduleForm.setData('scheduled_at', e.target.value)}
                                                />
                                                <InputError message={scheduleForm.errors.scheduled_at} />
                                            </div>
                                        ) : (
                                            <div className="grid gap-2">
                                                <Label htmlFor="edit_daily_time">New Daily Time</Label>
                                                <Input
                                                    id="edit_daily_time"
                                                    type="time"
                                                    value={scheduleForm.data.daily_time}
                                                    onChange={(e) => scheduleForm.setData('daily_time', e.target.value)}
                                                />
                                                <InputError message={scheduleForm.errors.daily_time} />
                                            </div>
                                        )}
                                        <div className="flex gap-2">
                                            <Button type="submit" size="sm" disabled={scheduleForm.processing}>
                                                {scheduleForm.processing ? 'Updating...' : 'Update Schedule'}
                                            </Button>
                                            <Button type="button" variant="ghost" size="sm" onClick={() => setShowScheduleEdit(false)}>
                                                Cancel
                                            </Button>
                                        </div>
                                    </form>
                                )}
                            </CardContent>
                        </Card>

                        {/* Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Delivery Stats</CardTitle>
                                <CardDescription>Sending progress for this campaign</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="rounded-md border p-4 text-center">
                                        <p className="text-3xl font-bold text-foreground">{campaign.total_numbers}</p>
                                        <p className="text-xs text-muted-foreground">Total Numbers</p>
                                    </div>
                                    <div className="rounded-md border p-4 text-center">
                                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                                            {campaign.sent_count}
                                        </p>
                                        <p className="text-xs text-muted-foreground">Sent</p>
                                    </div>
                                    <div className="rounded-md border p-4 text-center">
                                        <p className="text-3xl font-bold text-destructive">{campaign.failed_count}</p>
                                        <p className="text-xs text-muted-foreground">Failed</p>
                                    </div>
                                    <div className="rounded-md border p-4 text-center">
                                        <p className="text-3xl font-bold text-muted-foreground">{campaign.pending_count}</p>
                                        <p className="text-xs text-muted-foreground">Pending</p>
                                    </div>
                                </div>

                                {/* Progress bar */}
                                {campaign.total_numbers > 0 && (
                                    <div className="mt-4">
                                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                            <span>Progress</span>
                                            <span>
                                                {Math.round(((campaign.sent_count + campaign.failed_count) / campaign.total_numbers) * 100)}%
                                            </span>
                                        </div>
                                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                                            <div
                                                className="h-full rounded-full bg-primary transition-all"
                                                style={{
                                                    width: `${((campaign.sent_count + campaign.failed_count) / campaign.total_numbers) * 100}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Failed Numbers Summary */}
                    {failedLogs.length > 0 && (
                        <Card className="border-destructive/30">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg text-destructive">
                                        Failed Numbers ({failedLogs.length})
                                    </CardTitle>
                                    <Button variant="outline" size="sm" asChild>
                                        <a href={route('admin.campaigns.download-failed', campaign.id)}>
                                            <Download className="mr-2 h-4 w-4" />
                                            Download CSV
                                        </a>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="max-h-48 overflow-y-auto rounded-md border">
                                    {failedLogs.map((log, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-start justify-between border-b px-3 py-2 last:border-0"
                                        >
                                            <span className="font-mono text-sm">{log.phone_number}</span>
                                            <span className="ml-4 text-xs text-destructive">
                                                {log.error_reason ?? 'Unknown error'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* All Logs Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Send Logs</CardTitle>
                            <CardDescription>
                                Per-number delivery status for this campaign
                                {logs.total > 0 && (
                                    <span className="ml-1">
                                        — showing {logs.from}–{logs.to} of {logs.total}
                                    </span>
                                )}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-12">SL</TableHead>
                                            <TableHead>Phone</TableHead>
                                            <TableHead className="w-24 text-center">Status</TableHead>
                                            <TableHead>Provider ID</TableHead>
                                            <TableHead>Error</TableHead>
                                            <TableHead className="w-36">Sent At</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {logs.data.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                                                    No send logs yet. Campaign hasn't been executed.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            logs.data.map((log, index) => (
                                                <TableRow key={log.id}>
                                                    <TableCell className="font-mono text-sm">
                                                        {(logs.from ?? 0) + index}
                                                    </TableCell>
                                                    <TableCell className="font-mono text-sm">{log.phone_number}</TableCell>
                                                    <TableCell className="text-center">
                                                        <Badge variant={STATUS_VARIANT[log.status] ?? 'outline'}>
                                                            {log.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="max-w-32 truncate font-mono text-xs">
                                                        {log.provider_message_id ?? '—'}
                                                    </TableCell>
                                                    <TableCell
                                                        className="max-w-xs truncate text-xs text-destructive"
                                                        title={log.error_reason ?? ''}
                                                    >
                                                        {log.error_reason ?? '—'}
                                                    </TableCell>
                                                    <TableCell className="text-sm">{log.sent_at ?? '—'}</TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            {logs.links.length > 3 && (
                                <div className="mt-4 flex flex-wrap items-center justify-center gap-1">
                                    {logs.links.map((link, i) => (
                                        <Button
                                            key={i}
                                            variant={link.active ? 'default' : 'outline'}
                                            size="sm"
                                            disabled={!link.url}
                                            asChild={!!link.url}
                                        >
                                            {link.url ? (
                                                <Link
                                                    href={link.url}
                                                    preserveScroll
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ) : (
                                                <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                            )}
                                        </Button>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
