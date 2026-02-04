import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { type User } from '@/types';

interface UserProfileCardsProps {
    user: User;
}

export function UserProfileCards({ user }: UserProfileCardsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Profile</CardTitle>
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-sm">{user.email}</div>
                  
                </CardContent>
            </Card>

          
        </div>
    );
}
