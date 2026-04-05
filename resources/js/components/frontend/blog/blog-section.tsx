import BlogCard from "@/components/ui/blog-card";

interface Blog {
    id: number;
    title: string;
    slug: string;
    description: string;
    image?: string | null;
    created_at: string;
}

interface BlogSectionProps {
    blogs: Blog[];
    categoryTitle?: string;
}

export default function BlogSection({ blogs, categoryTitle }: BlogSectionProps) {
    return (
        <section className="container mx-auto px-6 pb-18 md:pb-14 lg:pb-20">
            <div className="mb-10">
                <h2 className="text-3xl font-semibold text-primary-600">
                   {categoryTitle || 'Online Power of Attorney Blogs'}
                </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
                {blogs.map((blog) => (
                    <BlogCard key={blog.id} blog={blog} />
                ))}
            </div>
        </section>
    );
}
