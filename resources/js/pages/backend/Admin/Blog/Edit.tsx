import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

import TiptapEditor from '@/components/tiptap-editor';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin-layout';

interface Props {
    blog: {
        id: number;
        title: string;
        slug: string;
        description: string;
        image: string | null;
        status: number;
        meta_title: string | null;
        meta_description: string | null;
        meta_keywords: string | null;
        category_id: number | null;
    };
    categories: Array<{ id: number; title: string }>;
}

export default function Edit({ blog, categories }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        title: blog.title,
        slug: blog.slug,
        description: blog.description,
        image: null as File | null,
        status: blog.status,
        meta_title: blog.meta_title || '',
        meta_description: blog.meta_description || '',
        meta_keywords: blog.meta_keywords || '',
        category_id: blog.category_id as number | null,
        remove_image: false,
    });

    const [imagePreview, setImagePreview] = useState<string | null>(
        blog.image ? `/storage/${blog.image}` : null
    );

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

    // Handle meta title change
    const handleMetaTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData('meta_title', e.target.value);
    };

    // Handle meta keywords change
    const handleMetaKeywordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData('meta_keywords', e.target.value);
    };

    // Handle meta description change
    const handleMetaDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData('meta_description', e.target.value);
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

        // Validate required fields before submission
        if (!data.title.trim()) {
            alert('Title is required');
            return;
        }
        if (!data.slug.trim()) {
            alert('Slug is required');
            return;
        }
        if (!data.description.trim()) {
            alert('Description is required');
            return;
        }

        // Update form data with trimmed values before submission
        setData('title', data.title.trim());
        setData('slug', data.slug.trim());
        setData('description', data.description.trim());
        setData('meta_title', data.meta_title.trim());
        setData('meta_description', data.meta_description.trim());
        setData('meta_keywords', data.meta_keywords.trim());

        // Submit form directly - Inertia will handle FormData properly
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

            <div className="flex flex-1 items-start justify-center px-6 pb-10">
                <div className="w-full max-w-7xl space-y-8">
                    <Card className="shadow-sm border-0">
                        <CardHeader className="pb-6">
                            <CardTitle className="text-xl font-semibold text-gray-900">
                                Edit Blog Post
                            </CardTitle>
                            <CardDescription className="text-gray-600">
                                Update the blog post details below.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <form onSubmit={submit} className="space-y-8">
                                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                                            Title{' '}
                                            <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="title"
                                            value={data.title}
                                            onChange={handleTitleChange}
                                            placeholder="Enter blog title"
                                            aria-invalid={!!errors.title}
                                            className="h-11"
                                        />
                                        {errors.title && (
                                            <p className="text-sm text-red-500 mt-1">
                                                {errors.title}
                                            </p>
                                        )}
                                    </div>

                                    {/* Hidden slug field - auto-generated from title */}
                                    <div className="space-y-2">
                                        <Label htmlFor="slug" className="text-sm font-medium text-gray-700">
                                            Slug{' '}
                                            <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="slug"
                                            value={data.slug}
                                            // onChange={handleSlugChange}
                                            placeholder="Enter blog slug"
                                            aria-invalid={!!errors.slug}
                                            className="h-11"
                                        />
                                        {errors.slug && (
                                            <p className="text-sm text-red-500 mt-1">
                                                {errors.slug}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="meta_title" className="text-sm font-medium text-gray-700">
                                            Meta Title
                                        </Label>
                                        <Input
                                            id="meta_title"
                                            value={data.meta_title}
                                            onChange={handleMetaTitleChange}
                                            placeholder="Enter meta title"
                                            aria-invalid={!!errors.meta_title}
                                            className="h-11"
                                        />
                                        {errors.meta_title && (
                                            <p className="text-sm text-red-500 mt-1">
                                                {errors.meta_title}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="meta_keywords" className="text-sm font-medium text-gray-700">
                                            Meta Keywords
                                        </Label>
                                        <Input
                                            id="meta_keywords"
                                            value={data.meta_keywords}
                                            onChange={handleMetaKeywordsChange}
                                            placeholder="Enter meta keywords"
                                            aria-invalid={!!errors.meta_keywords}
                                            className="h-11"
                                        />
                                        {errors.meta_keywords && (
                                            <p className="text-sm text-red-500 mt-1">
                                                {errors.meta_keywords}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                                            Status{' '}
                                            <span className="text-red-500">*</span>
                                        </Label>
                                        <select
                                            id="status"
                                            value={data.status}
                                            onChange={(e) =>
                                                setData(
                                                    'status',
                                                    parseInt(e.target.value),
                                                )
                                            }
                                            className="w-full h-11 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <option value={1}>Published</option>
                                            <option value={0}>
                                                Unpublished
                                            </option>
                                        </select>
                                        {errors.status && (
                                            <p className="text-sm text-red-500 mt-1">
                                                {errors.status}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="category_id" className="text-sm font-medium text-gray-700">
                                            Category
                                        </Label>
                                        <select
                                            id="category_id"
                                            value={data.category_id || ''}
                                            onChange={(e) =>
                                                setData(
                                                    'category_id',
                                                    e.target.value
                                                        ? parseInt(
                                                              e.target.value,
                                                          )
                                                        : null,
                                                )
                                            }
                                            className="w-full h-11 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <option value="">
                                                Select category (optional)
                                            </option>
                                            {categories.map((category) => (
                                                <option
                                                    key={category.id}
                                                    value={category.id}
                                                >
                                                    {category.title}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.category_id && (
                                            <p className="text-sm text-red-500 mt-1">
                                                {errors.category_id}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="image" className="text-sm font-medium text-gray-700">
                                            Featured Image
                                        </Label>
                                        <Input
                                            id="image"
                                            type="file"
                                            onChange={handleImageChange}
                                            accept="image/*"
                                            className="h-11"
                                        />
                                        {errors.image && (
                                            <p className="text-sm text-red-500 mt-1">
                                                {errors.image}
                                            </p>
                                        )}

                                        {/* Image Preview */}
                                        {imagePreview && (
                                            <div className="mt-4">
                                                <div className="relative inline-block">
                                                    <img
                                                        src={imagePreview}
                                                        alt="Image preview"
                                                        className="h-32 w-32 rounded-lg border-2 border-gray-200 object-cover"
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
                                                <p className="mt-2 text-sm text-gray-600">
                                                    {blog.image && !data.image
                                                        ? 'Current image. Click × to remove or upload new image to replace.'
                                                        : 'New image selected. Click × to remove.'}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                                            Description{' '}
                                            <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="border border-gray-300 rounded-lg overflow-hidden">
                                            <TiptapEditor
                                                value={data.description}
                                                onChange={(value) =>
                                                    setData('description', value)
                                                }
                                                placeholder="Write your blog content here..."
                                                className="w-full"
                                            />
                                        </div>
                                        {errors.description && (
                                            <p className="text-sm text-red-500 mt-1">
                                                {errors.description}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="meta_description" className="text-sm font-medium text-gray-700">
                                        Meta Description
                                    </Label>
                                    <Input
                                        id="meta_description"
                                        value={data.meta_description}
                                        onChange={handleMetaDescriptionChange}
                                        placeholder="Enter meta description"
                                        aria-invalid={!!errors.meta_description}
                                        className="h-11"
                                    />
                                    {errors.meta_description && (
                                        <p className="text-sm text-red-500 mt-1">
                                            {errors.meta_description}
                                        </p>
                                    )}
                                </div>

                                <div className="flex justify-end space-x-4 pt-6">
                                    <Button type="submit" disabled={processing} className="h-11 px-6 cursor-pointer">
                                        {processing
                                            ? 'Saving...'
                                            : 'Update Blog'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        asChild
                                        className="h-11 px-6 cursor-pointer"
                                    >
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