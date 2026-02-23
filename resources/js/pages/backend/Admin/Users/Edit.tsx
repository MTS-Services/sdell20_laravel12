import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin-layout';
import { ArrowLeft, UserCog } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
    created_at: string;
}

interface Props {
    user: User;
}

export default function Edit({ user }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
        is_admin: user.is_admin,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('admin.users.update', user.id));
    };

    return (
        <AdminLayout
            pageHeader={{
                title: 'Edit User',
                subtitle: `Update information for ${user.name}`,
                breadcrumbs: [
                    { label: 'Admin Dashboard', href: route('admin.dashboard') },
                    { label: 'Users', href: route('admin.users.index') },
                    { label: 'Edit' },
                ],
            }}
            headerContainerClassName="mx-auto my-8 container px-4"
        >
            <Head title={`Edit User - ${user.name}`} />

            <div className="flex flex-1 items-start justify-center px-4 pb-10">
                <div className="w-full max-w-2xl space-y-6">
                    <div className="flex items-center justify-start">
                        <Button asChild variant="outline">
                            <Link href={route('admin.users.index')}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Users
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <UserCog className="h-5 w-5 text-primary" />
                                User Information
                            </CardTitle>
                            <CardDescription>Update the user's details</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">
                                        Name <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Enter full name"
                                        aria-invalid={!!errors.name}
                                        autoFocus
                                    />
                                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">
                                        Email <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="user@example.com"
                                        aria-invalid={!!errors.email}
                                    />
                                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                                </div>

                                <div className="rounded-md border border-muted bg-muted/30 p-4">
                                    <p className="mb-4 text-sm font-medium">Change Password</p>
                                    <p className="mb-4 text-xs text-muted-foreground">
                                        Leave password fields empty to keep the current password
                                    </p>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="password">New Password</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                placeholder="Enter new password (optional)"
                                                aria-invalid={!!errors.password}
                                            />
                                            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="password_confirmation">Confirm New Password</Label>
                                            <Input
                                                id="password_confirmation"
                                                type="password"
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                placeholder="Confirm new password"
                                                aria-invalid={!!errors.password_confirmation}
                                            />
                                            {errors.password_confirmation && (
                                                <p className="text-sm text-destructive">{errors.password_confirmation}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_admin"
                                        checked={data.is_admin}
                                        onCheckedChange={(checked) => setData('is_admin', checked === true)}
                                    />
                                    <Label htmlFor="is_admin" className="cursor-pointer font-normal">
                                        Grant administrator privileges
                                    </Label>
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-4">
                                    <Button type="button" variant="outline" asChild>
                                        <Link href={route('admin.users.index')}>Cancel</Link>
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Updating...' : 'Update User'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
