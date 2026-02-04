import { type User } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import UserLayout from '@/layouts/user-layout';
import { UserProfileCards } from '@/components/user-profile-cards';
import { UserQuickActions } from '@/components/user-quick-actions';

interface Props {
    user: User;
}

export default function UserDashboard({ user }: Props) {
    return (
        <UserLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Welcome back, {user.name}!</CardTitle>
                            <CardDescription>This is your personal dashboard - Role: {user.is_admin ? 'Admin' : 'User'}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <UserProfileCards user={user} />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </UserLayout>
    );
}
