import { Head, useForm } from '@inertiajs/react';

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
        <AdminLayout>
            <Head title="Send Bulk SMS" />

            <div className="mx-auto mt-8 max-w-2xl rounded-lg border bg-card p-6 shadow-sm">
                <h1 className="mb-2 text-xl font-semibold text-foreground">Send Bulk SMS</h1>
                <p className="mb-6 text-sm text-muted-foreground">
                    Upload a CSV file with phone numbers and/or enter a manual number to send SMS in bulk.
                </p>

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
                            One phone number per row in UK E.164 format (e.g., +447XXXXXXXXX). Max 5MB.
                        </p>
                        <InputError message={errors.csv_file} />
                    </div>

                    {/* Manual Phone */}
                    <div className="grid gap-2">
                        <Label htmlFor="manual_phone">Manual Phone Number (optional)</Label>
                        <Input
                            id="manual_phone"
                            type="text"
                            placeholder="+447XXXXXXXXX"
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
