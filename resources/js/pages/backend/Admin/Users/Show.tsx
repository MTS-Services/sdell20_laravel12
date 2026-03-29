import { Head, Link } from '@inertiajs/react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { ArrowLeft, ClipboardCopy, Eye, LayoutList } from 'lucide-react';

interface UserResource {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
    created_at?: string | null;
    updated_at?: string | null;
}

interface Props {
    user: UserResource;
}

export default function Show({ user }: Props) {
    const meta = [
        { label: 'User ID', value: `#${user.id}` },
        { label: 'Email', value: user.email },
        { label: 'Role', value: user.is_admin ? 'Administrator' : 'User' },
        { label: 'Created at', value: user.created_at ? new Date(user.created_at).toLocaleString() : '—' },
        { label: 'Last Updated', value: user.updated_at ? new Date(user.updated_at).toLocaleString() : '—' },
    ];

    return (
        <AdminLayout
            pageHeader={{
                title: 'User Overview',
                subtitle: 'Quick read-only snapshot',
                breadcrumbs: [
                    { label: 'Admin Dashboard', href: route('admin.dashboard') },
                    { label: 'Users', href: route('admin.users.index') },
                    { label: user.name },
                ],
            }}
            headerContainerClassName="mx-auto my-8 container px-4"
        >
            <Head title={`User • ${user.name}`} />

            <div className="flex flex-1 items-start justify-center px-4 pb-10">
                <div className="w-full max-w-3xl space-y-6">
                    <div className="flex items-center justify-between gap-3">
                        <Button asChild variant="outline">
                            <Link href={route('admin.users.index')}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to list
                            </Link>
                        </Button>
                        <div className="flex flex-wrap items-center gap-2">
                            <Button asChild variant="outline">
                                <Link href={route('admin.users.details', user.id)}>
                                    <LayoutList className="mr-2 h-4 w-4" />
                                    Activity details
                                </Link>
                            </Button>
                            <Button asChild variant="secondary">
                                <Link href={route('admin.users.edit', user.id)}>
                                    <ClipboardCopy className="mr-2 h-4 w-4" />
                                    Edit User
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Eye className="h-5 w-5 text-primary" />
                                {user.name}
                                <Badge variant={user.is_admin ? 'default' : 'outline'}>{user.is_admin ? 'Admin' : 'User'}</Badge>
                            </CardTitle>
                            <CardDescription>ID #{user.id}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <dl className="grid gap-6 md:grid-cols-2">
                                {meta.map((item) => (
                                    <div key={item.label} className="rounded-xl border bg-muted/30 p-4">
                                        <dt className="text-xs uppercase tracking-wider text-muted-foreground">{item.label}</dt>
                                        <dd className="mt-1 text-base font-semibold text-foreground break-all">{item.value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
