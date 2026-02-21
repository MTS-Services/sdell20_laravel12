import { Head, useForm } from '@inertiajs/react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'SMS', href: route('sms.index') },
    { title: 'Schedule SMS', href: route('sms.create') },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        to_phone: '',
        message: '',
        scheduled_at: '',
    });

    const charCount = data.message.length;
    const segments = charCount === 0 ? 0 : Math.ceil(charCount / 160);

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(route('sms.store'));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Schedule SMS" />

            <div className="mx-auto mt-8 max-w-xl rounded-lg border bg-card p-6 shadow-sm">
                <h1 className="mb-6 text-xl font-semibold text-foreground">Schedule an SMS</h1>

                <form onSubmit={submit} className="space-y-5">
                    <div className="grid gap-2">
                        <Label htmlFor="to_phone">Phone Number (E.164 format)</Label>
                        <Input
                            id="to_phone"
                            type="text"
                            placeholder="+8801XXXXXXXXX"
                            value={data.to_phone}
                            onChange={(e) => setData('to_phone', e.target.value)}
                        />
                        <InputError message={errors.to_phone} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                            id="message"
                            rows={4}
                            value={data.message}
                            onChange={(e) => setData('message', e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                            {charCount} chars &middot; ~{segments} segment(s) (GSM-7 est.)
                        </p>
                        <InputError message={errors.message} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="scheduled_at">Schedule Time (Asia/Dhaka)</Label>
                        <Input
                            id="scheduled_at"
                            type="datetime-local"
                            value={data.scheduled_at}
                            onChange={(e) => setData('scheduled_at', e.target.value)}
                        />
                        <InputError message={errors.scheduled_at} />
                    </div>

                    <Button type="submit" disabled={processing} className="w-full">
                        {processing ? 'Scheduling...' : 'Schedule SMS'}
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
