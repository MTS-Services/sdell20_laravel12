import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin-layout';
import TiptapEditor from '@/components/tiptap-editor';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        slug: '',
        description: '',
        image: null,
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Auto-generate slug from title
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        setData('title', title);
        
        // Generate slug from title
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single
            .trim(); // Remove leading/trailing spaces
        
        setData('slug', slug);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setData('image', null);
            setImagePreview(null);
        }
    };

    const removeImage = () => {
        setData('image', null);
        setImagePreview(null);
        const fileInput = document.getElementById('image') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('slug', data.slug);
        formData.append('description', data.description);
        
        if (data.image) {
            formData.append('image', data.image);
        }

        post(route('blog.store'), {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout
            pageHeader={{
                title: 'Create New Blog',
                subtitle: 'Add a new blog post to the system',
                breadcrumbs: [
                    { label: 'Admin Dashboard', href: route('admin.dashboard') },
                    { label: 'Blog Management', href: route('blog.index') },
                    { label: 'Create' },
                ],
            }}
            headerContainerClassName="mx-auto my-8 container px-4"
        >
            <Head title="Create New Blog" />

            <div className="flex flex-1 items-start justify-center px-4 pb-10">
                <div className="w-full max-w-6xl space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Create New Blog Post
                            </CardTitle>
                            <CardDescription>
                                Fill in the form below to create a new blog post.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">
                                <div className="space-y-4">
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

                                    {/* Hidden slug field - auto-generated from title */}
                                    <input type="hidden" name="slug" value={data.slug} />
                                </div>

                                <div className="space-y-4">
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
                                </div>

                                <div>
                                    <Label htmlFor="image">
                                            Featured Image
                                        </Label>
                                        <Input
                                            id="image"
                                            type="file"
                                            onChange={handleImageChange}
                                            accept="image/*"
                                        />
                                        {errors.image && (
                                            <p className="text-sm text-destructive">{errors.image}</p>
                                        )}
                                        
                                        {/* Image Preview */}
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
                                                    Image selected. Click × to remove.
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                <div className="flex justify-end space-x-4">
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Saving...' : 'Create Blog'}
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