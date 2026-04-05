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
import { Eye, FileText, Pencil, Plus, Settings, Trash2 } from 'lucide-react';

interface BlogItem {
    id: number;
    title: string;
    slug: string;
    description: string;
    image: string | null;
    created_at: string;
    status: boolean;
}

interface PaginatedBlogs {
    data: BlogItem[];
    current_page: number;
    per_page: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Props {
    blogs: PaginatedBlogs;
    totalBlogs: number;
    search?: string;
}

export default function Index({ blogs, totalBlogs, search = '' }: Props) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;
    const [deletingBlogId, setDeletingBlogId] = useState<string | null>(null);
    const [searchValue, setSearchValue] = useState(search);
    const isInitialLoad = useRef(true);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const handleDelete = (blogSlug: string) => {
        if (window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
            setDeletingBlogId(blogSlug);
            router.delete(route('blog.delete', blogSlug), {
                onFinish: () => setDeletingBlogId(null),
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
                route('blog.index'),
                {
                    search: searchValue || undefined,
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
    }, [searchValue]);

    return (
        <AdminLayout
            pageHeader={{
                title: 'Blog Management',
                subtitle: `${totalBlogs} published ${totalBlogs === 1 ? 'post' : 'posts'}`,
                breadcrumbs: [
                    { label: 'Admin Dashboard', href: route('admin.dashboard') },
                    { label: 'Blog Management' },
                ],
            }}
            headerContainerClassName="mx-auto my-8 container"
        >
            <Head title="Blog Management" />

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
                                placeholder="Search by title or slug"
                                className="flex-1"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Button asChild>
                                <Link href={route('blog.create')}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Blog
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <FileText className="h-5 w-5 text-primary" />
                                Blog List
                            </CardTitle>
                            <CardDescription>All blog posts in the system</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-16">SL</TableHead>
                                            <TableHead>Title</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="w-32">Created</TableHead>
                                            <TableHead className="w-24 text-center">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {blogs.data.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                                                    No blog posts found.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            blogs.data.map((blog, index) => (
                                                <TableRow key={blog.id}>
                                                    <TableCell className="font-mono text-sm">
                                                        {(blogs.current_page - 1) * blogs.per_page + index + 1}
                                                    </TableCell>
                                                    <TableCell className="font-medium max-w-xs truncate">
                                                        {blog.title}
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground text-sm">
                                                        {blog.description.replace(/<[^>]*>/g, '').split(' ').slice(0, 8).join(' ')}{blog.description.replace(/<[^>]*>/g, '').split(' ').length > 8 ? '...' : ''}
                                                    </TableCell>
                                                    <TableCell className="text-start">
                                                        {blog.status ? (
                                                            <Badge className="bg-green-50 text-green-700 border-green-200">
                                                                Published
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline" className="text-gray-600 border-gray-300">
                                                                Unpublished
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-sm text-muted-foreground">
                                                        {new Date(blog.created_at).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-9 w-9 p-0 transition-transform duration-300 hover:rotate-180 data-[state=open]:rotate-180"
                                                                    disabled={deletingBlogId === blog.slug}
                                                                >
                                                                    <Settings className="h-4 w-4" />
                                                                    <span className="sr-only">Open blog actions</span>
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-44">
                                                                <DropdownMenuItem asChild>
                                                                    <Link
                                                                        href={route('blog.edit', blog.slug)}
                                                                        className="cursor-pointer flex items-center gap-2"
                                                                    >
                                                                        <Pencil className="h-4 w-4" />
                                                                        Edit
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    className="cursor-pointer gap-2 text-red-600 focus:bg-red-50"
                                                                    onSelect={(event) => {
                                                                        event.preventDefault();
                                                                        if (deletingBlogId === blog.slug) return;
                                                                        handleDelete(blog.slug);
                                                                    }}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                    <span>{deletingBlogId === blog.slug ? 'Deleting…' : 'Delete'}</span>
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
                    {blogs.links.length > 3 && (
                        <div className="mt-4 flex flex-wrap items-center justify-end gap-1">
                            {blogs.links.map((link, i) => (
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