import { Head, Link, usePage } from '@inertiajs/react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminLayout from '@/layouts/admin-layout';
import { type SharedData } from '@/types';

interface BulkSendItem {
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

interface PaginatedSends {
    data: BulkSendItem[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    pending: 'outline',
    processing: 'secondary',
    completed: 'default',
    failed: 'destructive',
};

export default function Index({ sends }: { sends: PaginatedSends }) {
    const { props } = usePage<SharedData>();
    const firstName = props.auth?.user?.name?.split(' ')[0] ?? 'Admin';

    return (
        <AdminLayout
            pageHeader={{
                title: `Good morning, ${firstName}!`,
                subtitle: "Here's what's happening this morning",
                breadcrumbs: [
                    { label: 'Admin Dashboard', href: route('admin.dashboard') },
                    { label: 'Bulk SMS Sends' },
                ],
            }}
            headerContainerClassName="mx-auto my-8 container"
        >
            <Head title="Bulk SMS Sends" />

            <div className="mx-auto container space-y-6 px-4 pb-10">
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <h1 className="text-2xl font-semibold text-foreground">Bulk SMS Sends</h1>
                    <Button asChild>
                        <Link href={route('admin.bulk-sms.create')}>+ New Bulk SMS</Link>
                    </Button>
                </div>

                <div className="rounded-lg border bg-card shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Message</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Sent</TableHead>
                                <TableHead>Failed</TableHead>
                                <TableHead>Pending</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Source</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sends.data.map((send) => (
                                <TableRow key={send.id}>
                                    <TableCell className="font-mono text-sm">#{send.id}</TableCell>
                                    <TableCell className="max-w-xs truncate text-sm" title={send.message}>
                                        {send.message}
                                    </TableCell>
                                    <TableCell className="text-sm">{send.total_numbers}</TableCell>
                                    <TableCell className="text-sm text-green-600 dark:text-green-400">
                                        {send.sent_count}
                                    </TableCell>
                                    <TableCell className="text-sm text-destructive">{send.failed_count}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{send.pending_count}</TableCell>
                                    <TableCell>
                                        <Badge variant={STATUS_VARIANT[send.status] ?? 'outline'}>{send.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        {send.csv_filename ? send.csv_filename : 'Manual'}
                                    </TableCell>
                                    <TableCell className="text-sm">{send.created_at}</TableCell>
                                    <TableCell>
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={route('admin.bulk-sms.show', send.id)}>View</Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {sends.data.length === 0 && (
                        <div className="px-4 py-12 text-center">
                            <p className="text-muted-foreground">No bulk SMS sends yet.</p>
                            <Link href={route('admin.bulk-sms.create')} className="text-primary hover:underline">
                                Send your first bulk SMS
                            </Link>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {sends.links.length > 3 && (
                    <div className="mt-4 flex justify-center gap-1">
                        {sends.links.map((link, idx) => (
                            <Button
                                key={idx}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                asChild={!!link.url}
                            >
                                {link.url ? (
                                    <Link href={link.url} dangerouslySetInnerHTML={{ __html: link.label }} />
                                ) : (
                                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                )}
                            </Button>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
