import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';
import { ArrowLeft, CalendarClock, Clock, Repeat, Upload } from 'lucide-react';

interface Props {
    senderId: string;
    timezone: string;
}

export default function Create({ senderId, timezone }: Props) {
    const { data, setData, post, processing, errors } = useForm<{
        name: string;
        csv_file: File | null;
        message: string;
        schedule_type: 'one_time' | 'daily';
        scheduled_at: string;
        daily_time: string;
    }>({
        name: '',
        csv_file: null,
        message: '',
        schedule_type: 'one_time',
        scheduled_at: '',
        daily_time: '',
    });

    const [csvFileName, setCsvFileName] = useState<string>('');

    const charCount = data.message.length;
    const segments = charCount === 0 ? 0 : Math.ceil(charCount / 160);

    function handleCsvChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] ?? null;
        setData('csv_file', file);
        setCsvFileName(file?.name ?? '');
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(route('admin.campaigns.store'), {
            forceFormData: true,
        });
    }

    return (
        <AdminLayout
            pageHeader={{
                title: 'Create Campaign',
                subtitle: 'Schedule a targeted SMS blast with automated delivery.',
                breadcrumbs: [
                    { label: 'Admin Dashboard', href: route('admin.dashboard') },
                    { label: 'SMS Campaigns', href: route('admin.campaigns.index') },
                    { label: 'Create Campaign' },
                ],
            }}
            headerContainerClassName="mx-auto my-8 container "
        >
            <Head title="Create SMS Campaign" />

            <div className="flex flex-1 items-start justify-center px-4 pb-10">
                <div className="w-full max-w-4xl space-y-6">
                    <div className="flex items-center justify-end">
                        <Button asChild variant="outline">
                            <Link href={route('admin.campaigns.index')}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Link>
                        </Button>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        {/* Campaign Name */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <CalendarClock className="h-5 w-5 text-primary" />
                                    Campaign Details
                                </CardTitle>
                                <CardDescription>Basic information about this campaign</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Campaign Name (optional)</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="e.g., Morning Promo, Weekly Update"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Give your campaign a memorable name for easy tracking.
                                    </p>
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="csv_file">Phone Numbers (CSV)</Label>
                                    <div className="flex items-center gap-2">
                                        <label
                                            htmlFor="csv_file"
                                            className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed px-4 py-3 text-sm text-muted-foreground transition hover:border-primary hover:text-primary"
                                        >
                                            <Upload className="h-4 w-4" />
                                            {csvFileName || 'Click to upload CSV file'}
                                        </label>
                                        <Input
                                            id="csv_file"
                                            type="file"
                                            accept=".csv,.txt"
                                            className="hidden"
                                            onChange={handleCsvChange}
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        One phone number per row in UK E.164 format (e.g., +447XXXXXXXXX). Max 5MB. Duplicates will be removed.
                                    </p>
                                    <InputError message={errors.csv_file} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="message">SMS Message</Label>
                                    <Textarea
                                        id="message"
                                        rows={5}
                                        placeholder="Type your SMS message here..."
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        {charCount} chars &middot; ~{segments} segment(s) (GSM-7 est.) &middot; Max 1600 chars
                                    </p>
                                    <InputError message={errors.message} />
                                </div>

                                <div className="rounded-md border bg-muted/50 p-3">
                                    <p className="text-sm">
                                        <span className="font-medium">Sender ID:</span>{' '}
                                        <span className="font-mono text-primary">{senderId}</span>
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-medium">Timezone:</span>{' '}
                                        <span className="text-muted-foreground">{timezone}</span>
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Schedule Configuration */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Clock className="h-5 w-5 text-primary" />
                                    Schedule Configuration
                                </CardTitle>
                                <CardDescription>Choose when to send this campaign</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Schedule Type Selector */}
                                <div className="grid gap-2">
                                    <Label>Schedule Type</Label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setData('schedule_type', 'one_time')}
                                            className={`flex items-center gap-3 rounded-lg border-2 p-4 text-left transition ${data.schedule_type === 'one_time'
                                                ? 'border-primary bg-primary/5'
                                                : 'border-muted hover:border-muted-foreground/30'
                                                }`}
                                        >
                                            <Clock className={`h-5 w-5 ${data.schedule_type === 'one_time' ? 'text-primary' : 'text-muted-foreground'}`} />
                                            <div>
                                                <p className="font-medium">One-Time</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Send once at a specific date & time
                                                </p>
                                            </div>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setData('schedule_type', 'daily')}
                                            className={`flex items-center gap-3 rounded-lg border-2 p-4 text-left transition ${data.schedule_type === 'daily'
                                                ? 'border-primary bg-primary/5'
                                                : 'border-muted hover:border-muted-foreground/30'
                                                }`}
                                        >
                                            <Repeat className={`h-5 w-5 ${data.schedule_type === 'daily' ? 'text-primary' : 'text-muted-foreground'}`} />
                                            <div>
                                                <p className="font-medium">Daily Recurring</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Send every day at a fixed time
                                                </p>
                                            </div>
                                        </button>
                                    </div>
                                    <InputError message={errors.schedule_type} />
                                </div>

                                {/* One-Time Schedule */}
                                {data.schedule_type === 'one_time' && (
                                    <div className="grid gap-2">
                                        <Label htmlFor="scheduled_at">Scheduled Date & Time</Label>
                                        <Input
                                            id="scheduled_at"
                                            type="datetime-local"
                                            value={data.scheduled_at}
                                            onChange={(e) => setData('scheduled_at', e.target.value)}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            The campaign will send exactly at this time ({timezone}).
                                        </p>
                                        <InputError message={errors.scheduled_at} />
                                    </div>
                                )}

                                {/* Daily Recurring Schedule */}
                                {data.schedule_type === 'daily' && (
                                    <div className="grid gap-2">
                                        <Label htmlFor="daily_time">Daily Send Time</Label>
                                        <Input
                                            id="daily_time"
                                            type="time"
                                            value={data.daily_time}
                                            onChange={(e) => setData('daily_time', e.target.value)}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            The campaign will send every day at this time ({timezone}). You can pause/resume anytime.
                                        </p>
                                        <InputError message={errors.daily_time} />
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Submit */}
                        <div className="flex flex-wrap items-center justify-end gap-3">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Creating Campaign...' : 'Create & Schedule Campaign'}
                            </Button>
                            <Button type="button" variant="outline" asChild>
                                <Link href={route('admin.campaigns.index')}>Cancel</Link>
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
