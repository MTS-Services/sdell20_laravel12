import { Head, Link, router } from '@inertiajs/react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminLayout from '@/layouts/admin-layout';

interface BulkSend {
    id: number;
    message: string;
    total_numbers: number;
    sent_count: number;
    failed_count: number;
    pending_count: number;
    status: string;
    csv_filename: string | null;
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

interface Props {
    bulkSend: BulkSend;
    failedLogs: FailedLog[];
    logs: LogItem[];
}

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    pending: 'outline',
    queued: 'secondary',
    sent: 'default',
    failed: 'destructive',
    processing: 'secondary',
    completed: 'default',
};

export default function Show({ bulkSend, failedLogs, logs }: Props) {
    function refresh() {
        router.reload();
    }

    return (
        <AdminLayout
            pageHeader={{
                title: `Bulk SMS #${bulkSend.id}`,
                subtitle: 'Review delivery stats and individual send logs.',
                breadcrumbs: [
                    { label: 'Admin Dashboard', href: route('admin.dashboard') },
                    { label: 'Bulk SMS Sends', href: route('admin.bulk-sms.index') },
                    { label: `Bulk SMS #${bulkSend.id}` },
                ],
            }}
            headerContainerClassName="mx-auto my-8 container px-4"
        >
            <Head title={`Bulk SMS #${bulkSend.id}`} />


            <div className="mx-auto container px-4 pb-10">

                <div className="my-4 ml-auto flex w-fit justify-end">
                    <Button variant="outline" asChild>
                        <Link href={route('admin.bulk-sms.index')}>&larr; Back to Bulk SMS</Link>
                    </Button>
                </div>
                {/* Summary Card */}
                <div className="mb-6 rounded-lg border bg-card p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h1 className="text-2xl font-semibold text-foreground">
                            Bulk SMS #{bulkSend.id}
                        </h1>
                        <div className="flex items-center gap-3">
                            <Badge variant={STATUS_VARIANT[bulkSend.status] ?? 'outline'}>
                                {bulkSend.status}
                            </Badge>
                            {(bulkSend.status === 'processing' || bulkSend.status === 'pending') && (
                                <Button variant="outline" size="sm" onClick={refresh}>
                                    Refresh
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="mb-4 rounded-md bg-muted/50 p-4">
                        <p className="text-sm font-medium text-muted-foreground">Message</p>
                        <p className="mt-1 text-foreground">{bulkSend.message}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                        <div className="rounded-md border p-3 text-center">
                            <p className="text-2xl font-bold text-foreground">{bulkSend.total_numbers}</p>
                            <p className="text-xs text-muted-foreground">Total</p>
                        </div>
                        <div className="rounded-md border p-3 text-center">
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {bulkSend.sent_count}
                            </p>
                            <p className="text-xs text-muted-foreground">Sent</p>
                        </div>
                        <div className="rounded-md border p-3 text-center">
                            <p className="text-2xl font-bold text-destructive">{bulkSend.failed_count}</p>
                            <p className="text-xs text-muted-foreground">Failed</p>
                        </div>
                        <div className="rounded-md border p-3 text-center">
                            <p className="text-2xl font-bold text-muted-foreground">{bulkSend.pending_count}</p>
                            <p className="text-xs text-muted-foreground">Pending</p>
                        </div>
                        <div className="rounded-md border p-3 text-center">
                            <p className="text-sm font-medium text-foreground">
                                {bulkSend.csv_filename ?? 'Manual'}
                            </p>
                            <p className="text-xs text-muted-foreground">Source</p>
                        </div>
                    </div>

                    <p className="mt-3 text-xs text-muted-foreground">Created: {bulkSend.created_at}</p>
                </div>

                {/* Failed Numbers Summary */}
                {failedLogs.length > 0 && (
                    <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                        <h2 className="mb-2 text-lg font-semibold text-destructive">
                            Failed Numbers ({failedLogs.length})
                        </h2>
                        <div className="max-h-48 overflow-y-auto">
                            {failedLogs.map((log, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-start justify-between border-b border-destructive/10 py-2 last:border-0"
                                >
                                    <span className="font-mono text-sm">{log.phone_number}</span>
                                    <span className="ml-4 text-xs text-destructive">{log.error_reason ?? 'Unknown error'}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* All Logs Table */}
                <div className="rounded-lg border bg-card shadow-sm">
                    <div className="border-b p-4">
                        <h2 className="text-lg font-semibold text-foreground">Send Logs</h2>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Phone</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Provider ID</TableHead>
                                <TableHead>Error</TableHead>
                                <TableHead>Sent At</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell className="font-mono text-sm">{log.phone_number}</TableCell>
                                    <TableCell>
                                        <Badge variant={STATUS_VARIANT[log.status] ?? 'outline'}>{log.status}</Badge>
                                    </TableCell>
                                    <TableCell className="max-w-37.5 truncate font-mono text-xs">
                                        {log.provider_message_id ?? '—'}
                                    </TableCell>
                                    <TableCell className="max-w-xs truncate text-xs text-destructive" title={log.error_reason ?? ''}>
                                        {log.error_reason ?? '—'}
                                    </TableCell>
                                    <TableCell className="text-sm">{log.sent_at ?? '—'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {logs.length === 0 && (
                        <div className="px-4 py-12 text-center">
                            <p className="text-muted-foreground">No send logs yet.</p>
                        </div>
                    )}
                </div>

            </div>
        </AdminLayout>
    );
}
