import { Head, Link } from '@inertiajs/react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminLayout from '@/layouts/admin-layout';
import { ArrowLeft, Users } from 'lucide-react';

interface UserItem {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
    created_at: string;
}

interface PaginatedUsers {
    data: UserItem[];
    current_page: number;
    per_page: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Props {
    users: PaginatedUsers;
    totalUsers: number;
}

export default function Index({ users, totalUsers }: Props) {
    return (
        <AdminLayout>
            <Head title="All Users" />

            <div className="flex flex-1 items-start justify-center py-10 px-4">
                <div className="w-full max-w-5xl space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">All Users</h1>
                            <p className="mt-1 text-muted-foreground">
                                {totalUsers} registered {totalUsers === 1 ? 'user' : 'users'}
                            </p>
                        </div>
                        <Button asChild variant="outline">
                            <Link href={route('admin.dashboard')}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Dashboard
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Users className="h-5 w-5 text-primary" />
                                User List
                            </CardTitle>
                            <CardDescription>All registered users in the system</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-16">SL</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead className="w-24 text-center">Role</TableHead>
                                            <TableHead className="w-32">Joined</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users.data.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                                                    No users found.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            users.data.map((u, index) => (
                                                <TableRow key={u.id}>
                                                    <TableCell className="font-mono text-sm">{(users.current_page - 1) * users.per_page + index + 1}</TableCell>
                                                    <TableCell className="font-medium">{u.name}</TableCell>
                                                    <TableCell className="text-muted-foreground">{u.email}</TableCell>
                                                    <TableCell className="text-center">
                                                        <Badge variant={u.is_admin ? 'default' : 'outline'}>
                                                            {u.is_admin ? 'Admin' : 'User'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-sm text-muted-foreground">
                                                        {new Date(u.created_at).toLocaleDateString()}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            {users.links.length > 3 && (
                                <div className="mt-4 flex flex-wrap items-center justify-center gap-1">
                                    {users.links.map((link, i) => (
                                        <Button
                                            key={i}
                                            variant={link.active ? 'default' : 'outline'}
                                            size="sm"
                                            disabled={!link.url}
                                            asChild={!!link.url}
                                        >
                                            {link.url ? (
                                                <Link href={link.url} dangerouslySetInnerHTML={{ __html: link.label }} />
                                            ) : (
                                                <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                            )}
                                        </Button>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
