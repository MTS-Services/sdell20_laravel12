import { AdminRecentActivity } from '@/components/admin-recent-activity';
import { AdminStatsCards } from '@/components/admin-stats-cards';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { type User } from '@/types';
import { Link } from '@inertiajs/react';
import { ClipboardList, LayoutDashboard, List, MessageSquare, Plus, Send, UserCircle, Users } from 'lucide-react';

interface Props {
    user: User;
    totalUsers: number;
}

export default function AdminDashboard({ user, totalUsers }: Props) {
    return (
        <AdminLayout>
            <div className="flex flex-1 items-start justify-center py-10 px-4">
                <div className="w-full max-w-5xl space-y-6">
                    {/* Welcome Header */}
                    <div className="text-center">
                        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                        <p className="mt-1 text-muted-foreground">
                            Welcome back, {user.name} — Role: {user.is_admin ? 'Admin' : 'User'}
                        </p>
                    </div>

                    {/* Stats */}
                    <AdminStatsCards totalUsers={totalUsers} />

                    {/* Quick Actions Grid */}
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Bulk SMS */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <MessageSquare className="h-5 w-5 text-primary" />
                                    Bulk SMS
                                </CardTitle>
                                <CardDescription>Send and manage bulk SMS campaigns</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-wrap gap-3">
                                <Button asChild>
                                    <Link href={route('admin.bulk-sms.create')}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Send Bulk SMS
                                    </Link>
                                </Button>
                                <Button asChild variant="outline">
                                    <Link href={route('admin.bulk-sms.index')}>
                                        <List className="mr-2 h-4 w-4" />
                                        Bulk SMS History
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Scheduled SMS */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Send className="h-5 w-5 text-primary" />
                                    Scheduled SMS
                                </CardTitle>
                                <CardDescription>Schedule and view individual messages</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-wrap gap-3">
                                <Button asChild>
                                    <Link href={route('sms.create')}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Schedule SMS
                                    </Link>
                                </Button>
                                <Button asChild variant="outline">
                                    <Link href={route('sms.index')}>
                                        <ClipboardList className="mr-2 h-4 w-4" />
                                        Scheduled SMS List
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Activity */}
                    <AdminRecentActivity />
                </div>
            </div>
        </AdminLayout>
    );
}
