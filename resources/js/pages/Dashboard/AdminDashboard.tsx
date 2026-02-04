import { type User } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminHeader } from '@/layouts/partials/admin/header';
import { Users } from 'lucide-react';

interface Props {
    user: User;
    totalUsers: number;
}

export default function AdminDashboard({ user, totalUsers }: Props) {
    return (
        <div className="min-h-screen bg-background">
            <AdminHeader />
            <main className="container mx-auto px-4 py-8">
                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Admin Dashboard</CardTitle>
                            <CardDescription>Welcome back, {user.name}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">{totalUsers}</div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
