import { BlogHeroSection } from '@/components/frontend/blog/blog-hero-section';
import BlogSection from '@/components/frontend/blog/blog-section';
import FrontendLayout from '@/layouts/frontend-layout';
import { Head } from '@inertiajs/react';

export default function Blog() {
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
                    <BlogSection />
                </main>
            </FrontendLayout>
        </>
    );
}