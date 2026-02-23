import { Head, Link, useForm } from '@inertiajs/react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm<{
        csv_file: File | null;
        manual_phone: string;
        message: string;
    }>({
        csv_file: null,
        manual_phone: '',
        message: '',
    });

    const charCount = data.message.length;
    const segments = charCount === 0 ? 0 : Math.ceil(charCount / 160);

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(route('admin.bulk-sms.store'), {
            forceFormData: true,
        });
    }

    return (
        <AdminLayout
            pageHeader={{
                title: 'Send Bulk SMS',
                subtitle: 'Upload contacts and craft your broadcast message.',
                breadcrumbs: [
                    { label: 'Admin Dashboard', href: route('admin.dashboard') },
                    { label: 'Bulk SMS Sends', href: route('admin.bulk-sms.index') },
                    { label: 'Send Bulk SMS' },
                ],
            }}
            headerContainerClassName="mx-auto my-8 container px-4"
        >
            <Head title="Send Bulk SMS" />

                <div className="mb-4 flex justify-end mx-auto max-w-4xl">
                    <Button variant="outline" asChild>
                        <Link href={route('admin.bulk-sms.index')}>&larr; Back to Bulk SMS</Link>
                    </Button>
                </div>
            <div className="mx-auto max-w-4xl rounded-lg border bg-card p-6 shadow-sm">

                <form onSubmit={submit} className="space-y-5">
                    {/* CSV Upload */}
                    <div className="grid gap-2">
                        <Label htmlFor="csv_file">CSV File (phone numbers)</Label>
                        <Input
                            id="csv_file"
                            type="file"
                            accept=".csv,.txt"
                            onChange={(e) => setData('csv_file', e.target.files?.[0] ?? null)}
                        />
                        <p className="text-xs text-muted-foreground">
                            One phone number per row in UK or Bangladesh E.164 format (e.g., +447XXXXXXXXX or +8801XXXXXXXXX). Max 5MB.
                        </p>
                        <InputError message={errors.csv_file} />
                    </div>

                    {/* Manual Phone */}
                    <div className="grid gap-2">
                        <Label htmlFor="manual_phone">Manual Phone Number (optional)</Label>
                        <Input
                            id="manual_phone"
                            type="text"
                            placeholder="+447XXXXXXXXX or +8801XXXXXXXXX"
                            value={data.manual_phone}
                            onChange={(e) => setData('manual_phone', e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                            Add a single number in addition to or instead of a CSV file.
                        </p>
                        <InputError message={errors.manual_phone} />
                    </div>

                    {/* Message */}
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

                    <Button type="submit" disabled={processing} className="w-full">
                        {processing ? 'Sending...' : 'Send SMS'}
                    </Button>
                </form>
            </div>
        </AdminLayout>
    );
}
