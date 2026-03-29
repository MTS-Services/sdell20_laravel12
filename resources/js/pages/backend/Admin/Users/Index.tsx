import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminLayout from '@/layouts/admin-layout';
import { Eye, LayoutList, Pencil, Plus, Settings, Trash2, Users } from 'lucide-react';

interface UserItem {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
    account_status?: string;
    created_at: string;
    payments_count: number;
    wills_count: number;
    lpas_count: number;
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
    search?: string;
    currentFilter?: string;
}

export default function Index({ users, totalUsers, search = '', currentFilter = 'all' }: Props) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;
    const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
    const [searchValue, setSearchValue] = useState(search);
    const isInitialLoad = useRef(true);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const handleDelete = (userId: number) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            setDeletingUserId(userId);
            router.delete(route('admin.users.destroy', userId), {
                onFinish: () => setDeletingUserId(null),
            });
        }
    };

    useEffect(() => {
        if (isInitialLoad.current) {
            isInitialLoad.current = false;
            return;
        }

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            router.get(
                route('admin.users.index'),
                {
                    search: searchValue || undefined,
                    role: currentFilter && currentFilter !== 'all' ? currentFilter : undefined,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }, 350);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [searchValue, currentFilter]);

    const headerTitle =
        currentFilter === 'admin'
            ? 'Admin Users'
            : currentFilter === 'user'
                ? 'Standard Users'
                : 'All Users';

    const headerSubtitle =
        currentFilter === 'admin'
            ? 'Showing only administrators'
            : currentFilter === 'user'
                ? 'Showing non-admin users'
                : `${totalUsers} registered ${totalUsers === 1 ? 'user' : 'users'}`;

    return (
        <AdminLayout
            pageHeader={{
                title: headerTitle,
                subtitle: headerSubtitle,
                breadcrumbs: [
                    { label: 'Admin Dashboard', href: route('admin.dashboard') },
                    { label: 'Users' },
                ],
            }}
            headerContainerClassName="mx-auto my-8 container"
        >
            <Head title="All Users" />

            <div className="flex flex-1 items-start justify-center px-4 pb-10">
                <div className="w-full container space-y-6">
                    {flash?.success && (
                        <div className="rounded-md bg-green-50 p-4 border border-green-200">
                            <p className="text-sm font-medium text-green-800">{flash.success}</p>
                        </div>
                    )}
                    {flash?.error && (
                        <div className="rounded-md bg-red-50 p-4 border border-red-200">
                            <p className="text-sm font-medium text-red-800">{flash.error}</p>
                        </div>
                    )}
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-end">
                        <div className="flex w-full max-w-80 items-center gap-2">
                            <Input
                                type="search"
                                value={searchValue}
                                onChange={(event) => setSearchValue(event.target.value)}
                                placeholder="Search by name or email"
                                className="flex-1"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Button asChild>
                                <Link href={route('admin.users.create')}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add User
                                </Link>
                            </Button>
                        </div>

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
                                            <TableHead className="w-28 text-center">Status</TableHead>
                                            <TableHead className="w-32">Joined</TableHead>
                                            <TableHead className="w-20 text-center">Payments</TableHead>
                                            <TableHead className="w-16 text-center">Wills</TableHead>
                                            <TableHead className="w-16 text-center">LPAs</TableHead>
                                            <TableHead className="w-24 text-center">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users.data.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={10} className="py-8 text-center text-muted-foreground">
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
                                                    <TableCell className="text-center">
                                                        <Badge
                                                            className={
                                                                u.account_status === 'active'
                                                                    ? 'bg-emerald-50 text-emerald-700'
                                                                    : u.account_status === 'suspended'
                                                                        ? 'bg-red-50 text-red-700'
                                                                        : 'bg-amber-50 text-amber-700'
                                                            }
                                                        >
                                                            {(u.account_status ?? 'unknown').replace(/\b\w/g, (char) => char.toUpperCase())}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-sm text-muted-foreground">
                                                        {new Date(u.created_at).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell className="text-center tabular-nums text-sm font-medium">
                                                        {u.payments_count}
                                                    </TableCell>
                                                    <TableCell className="text-center tabular-nums text-sm font-medium">
                                                        {u.wills_count}
                                                    </TableCell>
                                                    <TableCell className="text-center tabular-nums text-sm font-medium">
                                                        {u.lpas_count}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-9 w-9 p-0 transition-transform duration-300 hover:rotate-180 data-[state=open]:rotate-180"
                                                                    disabled={deletingUserId === u.id}
                                                                >
                                                                    <Settings className="h-4 w-4" />
                                                                    <span className="sr-only">Open user actions</span>
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-44">
                                                                <DropdownMenuItem asChild>
                                                                    <Link
                                                                        href={route('admin.users.details', u.id)}
                                                                        className="cursor-pointer flex items-center gap-2"
                                                                    >
                                                                        <LayoutList className="h-4 w-4" />
                                                                        Details
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem asChild>
                                                                    <Link href={route('admin.users.show', u.id)} className="cursor-pointer flex items-center gap-2">
                                                                        <Eye className="h-4 w-4" />
                                                                        Show
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem asChild>
                                                                    <Link href={route('admin.users.edit', u.id)} className="cursor-pointer flex items-center gap-2">
                                                                        <Pencil className="h-4 w-4" />
                                                                        Edit
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    className="cursor-pointer gap-2 text-black focus:bg-destructive/10 focus:text-destructive"
                                                                    onSelect={(event) => {
                                                                        event.preventDefault();
                                                                        if (deletingUserId === u.id) {
                                                                            return;
                                                                        }
                                                                        handleDelete(u.id);
                                                                    }}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                    <span>{deletingUserId === u.id ? 'Deleting…' : 'Delete'}</span>
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>


                        </CardContent>
                    </Card>
                    {/* Pagination */}
                    {users.links.length > 3 && (
                        <div className="mt-4 flex flex-wrap items-center justify-end gap-1">
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
                </div>
            </div>
        </AdminLayout>
    );
}
