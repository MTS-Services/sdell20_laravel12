import { type User } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthHeader } from '@/layouts/partials/auth/header';

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
                            <CardDescription>This is your personal dashboard</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {/* Add your dashboard widgets here */}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
