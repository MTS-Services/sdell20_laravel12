import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserProfileCards } from '@/components/user-profile-cards';
import UserLayout from '@/layouts/user-layout';
import { type User } from '@/types';

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
                            <CardDescription>This is your personal dashboard : {user.is_admin ? 'Admin' : 'User'}</CardDescription>
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
