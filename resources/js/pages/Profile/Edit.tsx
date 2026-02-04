import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { useState } from 'react';
import { type User } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserHeader } from '@/layouts/partials/user/header';
import { AdminHeader } from '@/layouts/partials/admin/header';
import { useInitials } from '@/hooks/use-initials';
import { Camera } from 'lucide-react';

interface Props {
    user: User;
}

export default function EditProfile({ user }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        avatar: null as File | null,
    });
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const getInitials = useInitials();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('avatar', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('profile.update'), {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Profile updated successfully!');
                setPreviewUrl(null);
            },
            onError: () => {
                toast.error('Failed to update profile. Please try again.');
            },
        });
    };

    return (
        <div className="min-h-screen bg-background">
            {user.is_admin ? <AdminHeader /> : <UserHeader />}
            <main className="container mx-auto px-4 py-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Profile</CardTitle>
                        <CardDescription>Update your profile information</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="flex flex-col items-center gap-4">
                                <div className="relative">
                                    <Avatar className="h-24 w-24">
                                        <AvatarImage
                                            src={previewUrl || user.avatar_url || user.avatar}
                                            alt={user.name}
                                        />
                                        <AvatarFallback className="bg-violet-600 text-white text-2xl">
                                            {getInitials(user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <Label
                                        htmlFor="avatar"
                                        className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-violet-600 text-white hover:bg-violet-700 transition-colors"
                                    >
                                        <Camera className="h-4 w-4" />
                                    </Label>
                                    <Input
                                        id="avatar"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-medium">Profile Picture</p>
                                    <p className="text-xs text-muted-foreground">Click the camera icon to upload</p>
                                </div>
                                {errors.avatar && (
                                    <p className="text-sm text-red-500">{errors.avatar}</p>
                                )}
                            </div>

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
