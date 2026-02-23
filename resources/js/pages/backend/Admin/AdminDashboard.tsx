import { AdminRecentActivity } from '@/components/admin-recent-activity';
import { AdminStatsCards } from '@/components/admin-stats-cards';
import AdminLayout from '@/layouts/admin-layout';
import { type User } from '@/types';

interface Props {
    user: User;
    totalUsers: number;
}

export default function AdminDashboard({ user, totalUsers }: Props) {
    return (
        <AdminLayout>
            <div className="flex flex-1 items-start justify-center py-10 px-4">
                <div className="w-full container space-y-6">
                    {/* Welcome Header */}
                    <div className="text-center">
                        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                        <p className="mt-1 text-muted-foreground">
                            Welcome back, {user.name} — Role: {user.is_admin ? 'Admin' : 'User'}
                        </p>
                    </div>

                    {/* Stats */}
                    <AdminStatsCards totalUsers={totalUsers} />

                    {/* Recent Activity */}
                    <AdminRecentActivity />
                </div>
            </div>
        </AdminLayout>
    );
}
