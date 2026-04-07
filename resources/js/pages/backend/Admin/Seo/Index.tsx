import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminLayout from '@/layouts/admin-layout';
import { Pencil } from 'lucide-react';

type SeoPageRow = {
    id: number;
    route_name: string;
    page_name: string;
    path?: string | null;
    meta_title?: string | null;
    meta_description?: string | null;
    meta_keywords?: string | null;
};

export default function AdminSeoIndex({ pages }: { pages: SeoPageRow[] }) {
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;

    return (
        <AdminLayout
            pageHeader={{
                title: 'SEO',
                subtitle: 'Edit meta title, description and keywords',
                breadcrumbs: [{ label: 'Admin Dashboard', href: route('admin.dashboard') }, { label: 'SEO' }],
            }}
            headerContainerClassName="mx-auto w-full container px-4 my-10"
        >
            <Head title="SEO" />

            <div className="mx-auto w-full container space-y-6 px-4 pb-10">
                {flash?.success ? (
                    <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800">{flash.success}</div>
                ) : null}
                {flash?.error ? (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800">{flash.error}</div>
                ) : null}

                <Card>
                    <CardHeader>
                        <CardTitle>Public pages</CardTitle>
                        <CardDescription>Pick a page and update its SEO metadata.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Page</TableHead>
                                        <TableHead>URL</TableHead>
                                        <TableHead>Meta title</TableHead>
                                        <TableHead className="w-24 text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pages.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                                                No pages found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        pages.map((p) => (
                                            <TableRow key={p.id}>
                                                <TableCell className="font-medium">{p.page_name}</TableCell>
                                                <TableCell className="font-mono text-xs text-muted-foreground">{p.path ?? '—'}</TableCell>
                                                <TableCell className="max-w-[420px] truncate text-sm text-muted-foreground">
                                                    {p.meta_title || '—'}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="outline" size="sm" asChild>
                                                        <Link href={route('admin.seo.edit', p.id)}>
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}

