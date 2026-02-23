import { Link } from '@inertiajs/react';

import { AdminRecentActivity } from '@/components/admin-recent-activity';
import { AdminStatsCards } from '@/components/admin-stats-cards';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';
import { type User } from '@/types';

interface Props {
    user: User;
    totalUsers: number;
}

export default function AdminDashboard({ user, totalUsers }: Props) {
    return (
        <AdminLayout
            pageHeader={{
                title: `Good morning, ${user.name?.split(' ')[0] ?? 'Admin'}!`,
                subtitle: "Here's what's happening this morning",
                breadcrumbs: [{ label: 'Admin Dashboard' }],
            }}
            headerContainerClassName="mx-auto w-full container px-4 pt-10"
        >
            <div className="mx-auto w-full container space-y-6 px-4 pb-10">
                <AdminStatsCards totalUsers={totalUsers} />

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm uppercase tracking-[0.4em] text-primary-500">User Management</p>
                                <h2 className="text-xl font-semibold text-slate-900">Directories</h2>
                            </div>
                            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary-600">Live</span>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Jump directly into admin or user directories.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-3">
                            <Button variant="outline" asChild>
                                <Link href={route('admin.users.index', { role: 'admin' })}>Admins</Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href={route('admin.users.index', { role: 'user' })}>Users</Link>
                            </Button>
                        </div>
                    </div>

                    <AdminRecentActivity />
                </div>
            </div>
        </AdminLayout>
    );
}
