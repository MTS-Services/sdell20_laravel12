import React from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';

type SeoPageRow = {
    id: number;
    route_name: string;
    page_name: string;
    path?: string | null;
    meta_title?: string | null;
    meta_description?: string | null;
    meta_keywords?: string | null;
};

const count = (val: string) => (val ?? '').trim().length;

export default function AdminSeoEdit({ page }: { page: SeoPageRow }) {
    const { errors } = usePage<{ errors: Record<string, string> }>().props;
    const form = useForm({
        meta_title: page.meta_title ?? '',
        meta_description: page.meta_description ?? '',
        meta_keywords: page.meta_keywords ?? '',
    });

    return (
        <AdminLayout
            pageHeader={{
                title: `SEO: ${page.page_name}`,
                subtitle: page.path ? `Page URL: ${page.path}` : 'Edit SEO metadata',
                breadcrumbs: [
                    { label: 'Admin Dashboard', href: route('admin.dashboard') },
                    { label: 'SEO', href: route('admin.seo.index') },
                    { label: page.page_name },
                ],
            }}
            headerContainerClassName="mx-auto w-full container px-4 my-10"
        >
            <Head title={`SEO - ${page.page_name}`} />

            <div className="mx-auto w-full container space-y-6 px-4 pb-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Meta tags</CardTitle>
                        <CardDescription>Fill what you need. Leave empty to use the site defaults.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="meta_title">Meta title</Label>
                            <Input
                                id="meta_title"
                                value={form.data.meta_title}
                                onChange={(e) => form.setData('meta_title', e.target.value)}
                                placeholder="e.g. Will Writing Online | Fast & Simple UK Wills"
                            />
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>{errors.meta_title ?? ''}</span>
                                <span>{count(form.data.meta_title)} chars</span>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="meta_description">Meta description</Label>
                            <Textarea
                                id="meta_description"
                                value={form.data.meta_description}
                                onChange={(e) => form.setData('meta_description', e.target.value)}
                                placeholder="e.g. Create a legally compliant will online in minutes. Expert checks included."
                                rows={4}
                            />
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>{errors.meta_description ?? ''}</span>
                                <span>{count(form.data.meta_description)} chars</span>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="meta_keywords">Meta keywords</Label>
                            <Textarea
                                id="meta_keywords"
                                value={form.data.meta_keywords}
                                onChange={(e) => form.setData('meta_keywords', e.target.value)}
                                placeholder="e.g. will writing, online will, lasting power of attorney, probate"
                                rows={3}
                            />
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>{errors.meta_keywords ?? ''}</span>
                                <span>{count(form.data.meta_keywords)} chars</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                            <Button variant="outline" asChild>
                                <Link href={route('admin.seo.index')}>Back</Link>
                            </Button>
                            <Button
                                disabled={form.processing}
                                onClick={() => form.put(route('admin.seo.update', page.id))}
                            >
                                {form.processing ? 'Saving…' : 'Save'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}

