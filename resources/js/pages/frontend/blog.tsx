import { BlogHeroSection } from '@/components/frontend/blog/blog-hero-section';
import BlogSection from '@/components/frontend/blog/blog-section';
import FrontendLayout from '@/layouts/frontend-layout';
import { Head } from '@inertiajs/react';

interface Blog {
    id: number;
    title: string;
    slug: string;
    description: string;
    image?: string | null;
    created_at: string;
}

interface Pagination {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    has_more_pages: boolean;
}

interface BlogCategory {
    category: string;
    blogs: Blog[];
    per_page: number;
    total: number;
}

interface Props {
    blogData: BlogCategory[];
}

export default function Blog({ blogData }: Props) {
    return (
        <>
            <Head>
                <title>Blog</title>
                <meta name="title" content="Blog" />
                <meta name="description" content="Blog" />
                <meta name="keywords" content="Blog" />
            </Head>
            <FrontendLayout>
                <main className="bg-white">
                    <BlogHeroSection />

                    <div className="container mx-auto px-6 py-6">
                        <div className="flex items-center justify-between">
                            <h1 className="font-ubuntu text-3xl font-bold text-gray-900">
                                Blog
                            </h1>
                            <p className="font-ubuntu text-sm text-gray-600">
                                Total{' '}
                                {blogData.reduce(
                                    (acc: number, cat: any) =>
                                        acc + cat.blogs.length,
                                    0,
                                )}{' '}
                                blogs
                            </p>
                        </div>
                    </div>
                    {blogData.map((categoryData, index) => (
                        <BlogSection
                            key={index}
                            blogs={categoryData.blogs}
                            categoryTitle={categoryData.category}
                            perPage={categoryData.per_page}
                            total={categoryData.total}
                        />
                    ))}
                </main>
            </FrontendLayout>
        </>
    );
}
