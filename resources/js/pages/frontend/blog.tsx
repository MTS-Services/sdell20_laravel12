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

interface BlogCategory {
    category: string;
    blogs: Blog[];
}

interface Props {
    blogsByCategory: BlogCategory[];
}

export default function Blog({ blogsByCategory }: Props) {
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
                    {blogsByCategory.map((categoryData, index) => (
                        <BlogSection 
                            key={index} 
                            blogs={categoryData.blogs} 
                            categoryTitle={categoryData.category}
                        />
                    ))}
                </main>
            </FrontendLayout>
        </>
    );
}