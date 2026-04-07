import React from 'react';
import { useForm, usePage } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';

export default function AdminSettingsIndex({ sitemapUrl }: { sitemapUrl: string }) {
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;
    const form = useForm({});

    return (
        <AdminLayout
            pageHeader={{
                title: 'Settings',
                subtitle: 'Manage admin-level settings',
                breadcrumbs: [{ label: 'Admin Dashboard', href: route('admin.dashboard') }, { label: 'Settings' }],
            }}
            headerContainerClassName="mx-auto w-full container px-4 my-10"
        >
            <div className="mx-auto w-full container space-y-6 px-4 pb-10">
                {flash?.success ? (
                    <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800">{flash.success}</div>
                ) : null}
                {flash?.error ? (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800">{flash.error}</div>
                ) : null}

                <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.5em] text-muted-foreground/80">Sitemap</p>
                            <h2 className="mt-2 text-xl font-semibold text-slate-900">Generate sitemap.xml</h2>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Generates <a className="underline" href={sitemapUrl} target="_blank" rel="noreferrer">{sitemapUrl}</a>.
                            </p>
                        </div>

                        <Button
                            disabled={form.processing}
                            onClick={() => form.post(route('admin.settings.sitemap.generate'))}
                        >
                            {form.processing ? 'Generating…' : 'Generate sitemap'}
                        </Button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

