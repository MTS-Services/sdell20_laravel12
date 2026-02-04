import { useForm } from '@inertiajs/react';
import { type User } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AuthHeader } from '@/layouts/partials/auth/header';
import { AdminHeader } from '@/layouts/partials/admin/header';

interface Props {
    user: User;
}

export default function EditProfile({ user }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: user.name,
        email: user.email,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('profile.update'));
    };

    return (
        <div className="min-h-screen bg-background">
            {user.is_admin ? <AdminHeader /> : <AuthHeader />}
            <main className="container mx-auto px-4 py-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Profile</CardTitle>
                        <CardDescription>Update your profile information</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500">{errors.name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500">{errors.email}</p>
                                )}
                            </div>

                            <Button type="submit" disabled={processing}>
                                Save Changes
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
