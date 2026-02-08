import { AdminRecentActivity } from '@/components/admin-recent-activity';
import { AdminStatsCards } from '@/components/admin-stats-cards';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { type User } from '@/types';

interface Props {
    user: User;
    totalUsers: number;
}

export default function AdminDashboard({ user, totalUsers }: Props) {
    return (
        <AdminLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Admin Dashboard</CardTitle>
                            <CardDescription>Welcome back, {user.name} - Role: {user.is_admin ? 'Admin' : 'User'}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <AdminStatsCards totalUsers={totalUsers} />
                                <AdminRecentActivity />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
