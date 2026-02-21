import { Head, Link, router } from '@inertiajs/react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminLayout from '@/layouts/admin-layout';

interface ScheduledSmsItem {
    id: number;
    to_phone: string;
    message: string;
    scheduled_at: string;
    status: string;
    attempts: number;
    last_error: string | null;
    sent_at: string | null;
}

interface PaginatedMessages {
    data: ScheduledSmsItem[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    pending: 'outline',
    processing: 'secondary',
    sent: 'default',
    delivered: 'default',
    failed: 'destructive',
    cancelled: 'secondary',
};

export default function Index({ messages }: { messages: PaginatedMessages }) {
    function cancel(id: number) {
        if (confirm('Cancel this scheduled SMS?')) {
            router.delete(route('sms.destroy', id));
        }
    }

    return (
        <AdminLayout>
            <Head title="Scheduled SMS" />

            <div className="mx-auto mt-8 max-w-6xl px-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-foreground">Scheduled Messages</h1>
                    <Button asChild>
                        <Link href={route('sms.create')}>+ New SMS</Link>
                    </Button>
                </div>

                <div className="rounded-lg border bg-card shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>To</TableHead>
                                <TableHead>Message</TableHead>
                                <TableHead>Scheduled</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Sent At</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {messages.data.map((sms) => (
                                <TableRow key={sms.id}>
                                    <TableCell className="font-mono text-sm">{sms.to_phone}</TableCell>
                                    <TableCell className="max-w-xs truncate text-sm" title={sms.message}>
                                        {sms.message}
                                    </TableCell>
                                    <TableCell className="text-sm">{sms.scheduled_at}</TableCell>
                                    <TableCell>
                                        <Badge variant={STATUS_VARIANT[sms.status] ?? 'outline'}>
                                            {sms.status}
                                        </Badge>
                                        {sms.last_error && (
                                            <p className="mt-1 text-xs text-destructive" title={sms.last_error}>
                                                ⚠ Error
                                            </p>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-sm">{sms.sent_at ?? '—'}</TableCell>
                                    <TableCell>
                                        {sms.status === 'pending' && (
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => cancel(sms.id)}
                                            >
                                                Cancel
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {messages.data.length === 0 && (
                        <div className="px-4 py-12 text-center">
                            <p className="text-muted-foreground">No scheduled messages yet.</p>
                            <Link
                                href={route('sms.create')}
                                className="text-primary hover:underline"
                            >
                                Schedule your first SMS
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
