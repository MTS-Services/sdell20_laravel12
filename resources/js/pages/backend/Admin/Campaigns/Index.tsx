import { Head, Link } from '@inertiajs/react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminLayout from '@/layouts/admin-layout';
import { ArrowLeft, CalendarClock, Clock, Plus, Repeat } from 'lucide-react';

interface CampaignItem {
    id: number;
    name: string;
    message: string;
    schedule_type: 'one_time' | 'daily';
    status: string;
    total_numbers: number;
    sent_count: number;
    failed_count: number;
    pending_count: number;
    is_enabled: boolean;
    last_run_at: string | null;
    next_run_at: string | null;
    created_at: string;
}

interface PaginatedCampaigns {
    data: CampaignItem[];
    current_page: number;
    per_page: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    draft: 'outline',
    scheduled: 'secondary',
    running: 'default',
    completed: 'default',
    paused: 'outline',
    failed: 'destructive',
};

export default function Index({ campaigns }: { campaigns: PaginatedCampaigns }) {
    return (
        <AdminLayout
            pageHeader={{
                title: 'SMS Campaigns',
                subtitle: 'Create and manage scheduled bulk SMS campaigns.',
                breadcrumbs: [
                    { label: 'Admin Dashboard', href: route('admin.dashboard') },
                    { label: 'SMS Campaigns' },
                ],
            }}
            headerContainerClassName="mx-auto my-8 container"
        >
            <Head title="SMS Campaigns" />

            <div className="flex flex-1 items-start justify-center px-4 pb-10">
                <div className="w-full container space-y-6">
                    <div className="flex items-center justify-end">
                        <div className="flex gap-2">
                            <Button asChild>
                                <Link href={route('admin.campaigns.create')}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    New Campaign
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <CalendarClock className="h-5 w-5 text-primary" />
                                All Campaigns
                            </CardTitle>
                            <CardDescription>View and manage your scheduled SMS campaigns</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-12">SL</TableHead>
                                            <TableHead>Campaign</TableHead>
                                            <TableHead className="w-24 text-center">Type</TableHead>
                                            <TableHead className="w-24 text-center">Status</TableHead>
                                            <TableHead className="w-16 text-center">Total</TableHead>
                                            <TableHead className="w-16 text-center">Sent</TableHead>
                                            <TableHead className="w-16 text-center">Failed</TableHead>
                                            <TableHead className="w-36">Next Run</TableHead>
                                            <TableHead className="w-36">Last Run</TableHead>
                                            <TableHead className="w-20">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {campaigns.data.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={10} className="py-12 text-center text-muted-foreground">
                                                    No campaigns yet.{' '}
                                                    <Link
                                                        href={route('admin.campaigns.create')}
                                                        className="text-primary hover:underline"
                                                    >
                                                        Create your first campaign
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            campaigns.data.map((campaign, index) => (
                                                <TableRow key={campaign.id}>
                                                    <TableCell className="font-mono text-sm">
                                                        {(campaigns.current_page - 1) * campaigns.per_page + index + 1}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div>
                                                            <p className="font-medium">{campaign.name}</p>
                                                            <p className="max-w-xs truncate text-xs text-muted-foreground" title={campaign.message}>
                                                                {campaign.message}
                                                            </p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Badge variant="outline" className="gap-1">
                                                            {campaign.schedule_type === 'daily' ? (
                                                                <Repeat className="h-3 w-3" />
                                                            ) : (
                                                                <Clock className="h-3 w-3" />
                                                            )}
                                                            {campaign.schedule_type === 'daily' ? 'Daily' : 'One-time'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Badge variant={STATUS_VARIANT[campaign.status] ?? 'outline'}>
                                                            {campaign.status}
                                                        </Badge>
                                                        {!campaign.is_enabled && campaign.status !== 'paused' && (
                                                            <Badge variant="outline" className="ml-1 text-xs">
                                                                disabled
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-center text-sm">{campaign.total_numbers}</TableCell>
                                                    <TableCell className="text-center text-sm text-green-600 dark:text-green-400">
                                                        {campaign.sent_count}
                                                    </TableCell>
                                                    <TableCell className="text-center text-sm text-destructive">
                                                        {campaign.failed_count}
                                                    </TableCell>
                                                    <TableCell className="text-sm text-muted-foreground">
                                                        {campaign.next_run_at ?? '—'}
                                                    </TableCell>
                                                    <TableCell className="text-sm text-muted-foreground">
                                                        {campaign.last_run_at ?? '—'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button variant="outline" size="sm" asChild>
                                                            <Link href={route('admin.campaigns.show', campaign.id)}>
                                                                View
                                                            </Link>
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            {campaigns.links.length > 3 && (
                                <div className="mt-4 flex flex-wrap items-center justify-center gap-1">
                                    {campaigns.links.map((link, i) => (
                                        <Button
                                            key={i}
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
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
