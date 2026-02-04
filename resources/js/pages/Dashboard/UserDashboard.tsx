import { type User } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthHeader } from '@/layouts/partials/auth/header';
import { Bell, Link, Settings, UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
    user: User;
}

export default function UserDashboard({ user }: Props) {
    return (
        <div className="min-h-screen bg-background">
            <AuthHeader />
            <main className="container mx-auto px-4 py-8">
                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Welcome back, {user.name}!</CardTitle>
                            <CardDescription>This is your personal dashboard - Role: {user.role_label || 'User'}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">Profile</CardTitle>
                                            <UserIcon className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-sm">{user.email}</div>
                                            <Link href="/profile" className="mt-4 block">
                                                <Button variant="outline" size="sm">Update Profile</Button>
                                            </Link>
                                        </CardContent>
                                    </Card>


                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
                                            <Bell className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-sm text-muted-foreground">No new notifications</div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Quick Actions</CardTitle>
                                        <CardDescription>Frequently used features and settings</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                            <Link href="/profile">
                                                <Button variant="outline" className="w-full justify-start">
                                                    <UserIcon className="mr-2 h-4 w-4" />
                                                    Profile Settings
                                                </Button>
                                            </Link>
                                            <Link href="/settings">
                                                <Button variant="outline" className="w-full justify-start">
                                                    <Settings className="mr-2 h-4 w-4" />
                                                    Account Settings
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
