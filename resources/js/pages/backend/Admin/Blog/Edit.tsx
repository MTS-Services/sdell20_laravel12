import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin-layout';
import TiptapEditor from '@/components/tiptap-editor';

interface Props {
    blog: {
        id: number;
        title: string;
        slug: string;
        description: string;
        image: string | null;
    };
}

export default function Edit({ blog }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        title: blog.title,
        slug: blog.slug,
        description: blog.description,
        image: null as File | null,
        remove_image: false,
    });

    const [imagePreview, setImagePreview] = useState<string | null>(
        blog.image ? `/storage/${blog.image}` : null
    );

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        setData('title', title);

        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();

        setData('slug', slug);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            setData('remove_image', false);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setData('image', null);
            setImagePreview(blog.image ? `/storage/${blog.image}` : null);
        }
    };

    const removeImage = () => {
        setData('image', null);
        setData('remove_image', true);
        setImagePreview(null);
        const fileInput = document.getElementById('image') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('blog.update', { slug: blog.slug }), {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout
            pageHeader={{
                title: 'Edit Blog',
                subtitle: 'Update existing blog post',
                breadcrumbs: [
                    { label: 'Admin Dashboard', href: route('admin.dashboard') },
                    { label: 'Blog Management', href: route('blog.index') },
                    { label: 'Edit' },
                ],
            }}
            headerContainerClassName="mx-auto my-8 container px-4"
        >
            <Head title="Edit Blog" />

            <div className="flex flex-1 items-start justify-center px-4 pb-10">
                <div className="w-full max-w-6xl space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Edit Blog Post
                            </CardTitle>
                            <CardDescription>
                                Update the blog post details below.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">

                                {/* Title */}
                                <div>
                                    <Label htmlFor="title">
                                        Title <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={handleTitleChange}
                                        placeholder="Enter blog title"
                                        aria-invalid={!!errors.title}
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-destructive">{errors.title}</p>
                                    )}
                                </div>

                                {/* Hidden slug */}
                                <input type="hidden" name="slug" value={data.slug} />

                                {/* Description */}
                                <div>
                                    <Label htmlFor="description">
                                        Description <span className="text-destructive">*</span>
                                    </Label>
                                    <TiptapEditor
                                        value={data.description}
                                        onChange={(value) => setData('description', value)}
                                        placeholder="Write your blog content here..."
                                        className="w-full"
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-destructive">{errors.description}</p>
                                    )}
                                </div>

                                {/* Image Upload */}
                                <div>
                                    <Label htmlFor="image">Featured Image</Label>
                                    <Input
                                        id="image"
                                        type="file"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                    />
                                    {errors.image && (
                                        <p className="text-sm text-destructive">{errors.image}</p>
                                    )}

                                    {imagePreview && (
                                        <div className="mt-4">
                                            <div className="relative inline-block">
                                                <img
                                                    src={imagePreview}
                                                    alt="Image preview"
                                                    className="h-32 w-32 object-cover rounded-lg border"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                                                    onClick={removeImage}
                                                >
                                                    ×
                                                </Button>
                                            </div>
                                            <p className="mt-2 text-sm text-muted-foreground">
                                                {blog.image && !data.image
                                                    ? 'Current image. Click × to remove or upload new image to replace.'
                                                    : 'New image selected. Click × to remove.'}
                                            </p>
                                        </div>
                                    )}

                                    {!imagePreview && !blog.image && (
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            No image uploaded. Upload an image to add one.
                                        </p>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex justify-end space-x-4">
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Saving...' : 'Update Blog'}
                                    </Button>
                                    <Button type="button" variant="outline" asChild>
                                        <Link href={route('blog.index')}>
                                            Cancel
                                        </Link>
                                    </Button>
                                </div>

                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}